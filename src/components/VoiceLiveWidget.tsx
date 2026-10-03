import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, PhoneOff, AlertCircle, Volume2, Sprout } from 'lucide-react';
import { FarmProfile, Plan, NextQuestion } from '../types';

interface VoiceLiveWidgetProps {
  isActive: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: FarmProfile) => void;
  onPlanUpdated?: (plan: Plan) => void;
  onNextQuestionUpdated?: (nextQ: NextQuestion | null) => void;
}

// Cached AudioContext instances to prevent resource leaks
const audioContextCache: Record<number, AudioContext> = {};

const getCachedAudioContext = (sampleRate?: number): AudioContext => {
  const key = sampleRate || 0;
  if (!audioContextCache[key]) {
    const options = sampleRate ? { sampleRate } : undefined;
    audioContextCache[key] = new (window.AudioContext || (window as any).webkitAudioContext)(options);
  }
  const context = audioContextCache[key];
  if (context.state === 'suspended') {
    context.resume().catch((err) => console.warn('[AudioContext] Failed to resume:', err));
  }
  return context;
};

// ─── PCM Player Class ────────────────────────────────────────────────────────
class PCMPlayer {
  public audioContext: AudioContext | null = null;
  public nextPlayTime: number = 0;
  private sampleRate: number;
  private activeSources: AudioBufferSourceNode[] = [];

  constructor(sampleRate: number = 24000) {
    this.sampleRate = sampleRate;
  }

  public init() {
    this.audioContext = getCachedAudioContext(this.sampleRate);
    this.nextPlayTime = this.audioContext.currentTime;
    this.activeSources = [];
  }

  public playChunk(base64Data: string) {
    if (!this.audioContext) return;
    try {
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, this.sampleRate);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      const currentTime = this.audioContext.currentTime;
      if (this.nextPlayTime < currentTime) {
        this.nextPlayTime = currentTime;
      }
      source.start(this.nextPlayTime);
      this.nextPlayTime += audioBuffer.duration;

      this.activeSources.push(source);
      source.onended = () => {
        this.activeSources = this.activeSources.filter((s) => s !== source);
      };
    } catch (err) {
      console.error('[PCMPlayer] Failed to play chunk:', err);
    }
  }

  public clear() {
    this.activeSources.forEach((src) => {
      try {
        src.stop();
      } catch (_) {}
    });
    this.activeSources = [];
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
  }
}

export const VoiceLiveWidget: React.FC<VoiceLiveWidgetProps> = ({
  isActive,
  onClose,
  onProfileUpdated,
  onPlanUpdated,
  onNextQuestionUpdated,
}) => {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'processing' | 'error'>('connecting');
  const [errorMsg, setErrorMsg] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<PCMPlayer | null>(null);
  const recorderRef = useRef<{
    stream: MediaStream;
    audioContext: AudioContext;
    processor: ScriptProcessorNode;
    stop: () => void;
  } | null>(null);

  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (recorderRef.current) {
      const audioTrack = recorderRef.current.stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
      }
    }
  }, [isMuted]);

  useEffect(() => {
    if (!isActive) {
      cleanUp();
      return;
    }

    startVoiceSession();

    return () => {
      cleanUp();
    };
  }, [isActive]);

  const cleanUp = () => {
    console.log('[VoiceLiveWidget] Cleaning up audio and WebSocket connections...');
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.clear();
      playerRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close(1000, 'User closed call');
      } catch (_) {}
      wsRef.current = null;
    }
  };

  const startVoiceSession = async () => {
    try {
      setStatus('connecting');
      setErrorMsg('');
      setTranscript([]);

      const sessionId = localStorage.getItem('kisan_ai_session_id') || '';
      if (!sessionId) {
        setErrorMsg('Session shuru nahi hua hai. Kripya page refresh karein.');
        setStatus('error');
        return;
      }

      const wsUrlBase = import.meta.env.VITE_WS_URL || window.location.origin.replace(/^http/, 'ws');
      const wsUrl = `${wsUrlBase.replace(/^http/, 'ws')}/api/voice/gemini-stream?sessionId=${sessionId}`;

      const player = new PCMPlayer(24000);
      player.init();
      playerRef.current = player;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      let recordingActive = true;

      const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });

        const audioContext = getCachedAudioContext(16000);
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(2048, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          if (!recordingActive || ws.readyState !== WebSocket.OPEN || isMutedRef.current) return;

          const inputData = e.inputBuffer.getChannelData(0);
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          const base64Chunk = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
          ws.send(
            JSON.stringify({
              realtimeInput: {
                audio: {
                  mimeType: 'audio/pcm;rate=16000',
                  data: base64Chunk,
                },
              },
            })
          );
        };

        recorderRef.current = {
          stream,
          audioContext,
          processor,
          stop: () => {
            recordingActive = false;
            try {
              processor.disconnect();
            } catch (_) {}
            try {
              source.disconnect();
            } catch (_) {}
            try {
              stream.getTracks().forEach((t) => t.stop());
            } catch (_) {}
          },
        };
      };

      ws.onopen = async () => {
        console.log('[VoiceLiveWidget] WebSocket stream connected to Kisan Ai');
        setStatus('listening');
        try {
          await startRecording();
        } catch (err: any) {
          console.error('[VoiceLiveWidget] Microphone access denied:', err);
          setErrorMsg('Microphone access nahi mila. Kripya browser mein mic permissions allow karein.');
          setStatus('error');
        }
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          // Handle tool call events and state updates
          if (payload.type === 'toolCallExecuted') {
            if (payload.profile && onProfileUpdated) {
              onProfileUpdated(payload.profile);
            }
            if (payload.nextQuestion && onNextQuestionUpdated) {
              onNextQuestionUpdated(payload.nextQuestion);
            }
            if (payload.plan && onPlanUpdated) {
              onPlanUpdated(payload.plan);
            }
          }

          if (payload.serverContent) {
            const sc = payload.serverContent;

            // Live Speech Transcriptions
            if (sc.inputTranscription?.text) {
              setTranscript((prev) => [...prev, { role: 'user', text: sc.inputTranscription.text }]);
            }
            if (sc.outputTranscription?.text) {
              setTranscript((prev) => [...prev, { role: 'assistant', text: sc.outputTranscription.text }]);
            }

            // Real-time Audio Stream Playback
            if (sc.modelTurn?.parts) {
              setStatus('speaking');
              for (const part of sc.modelTurn.parts) {
                if (part.inlineData?.data) {
                  player.playChunk(part.inlineData.data);
                }
              }
            }

            // Turn complete
            if (sc.turnComplete) {
              setStatus('listening');
            }

            // Speech Interruption
            if (sc.interrupted) {
              player.clear();
              setStatus('listening');
            }
          }
        } catch (_) {
          // Ignore non-JSON binary frames
        }
      };

      ws.onclose = () => {
        console.log('[VoiceLiveWidget] Live voice WebSocket closed.');
        setStatus('connecting');
      };

      ws.onerror = (err) => {
        console.error('[VoiceLiveWidget] Connection error:', err);
        setErrorMsg('Live voice server se sampark toot gaya.');
        setStatus('error');
      };
    } catch (err: any) {
      console.error('[VoiceLiveWidget] Setup failed:', err.message);
      setStatus('error');
      setErrorMsg(err.message || 'Call shuru karne mein samasya aayi.');
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-stone-200 flex flex-col items-center relative overflow-hidden">
        {/* Top Glow Bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-500" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-1 text-emerald-900">
          <Sprout className="w-6 h-6 text-emerald-600" />
          <h3 className="font-extrabold text-xl font-sans">
            Kisan Ai Live Voice Call
          </h3>
        </div>
        <p className="text-gray-500 text-xs font-semibold tracking-wide uppercase mb-6">
          Sehore Crop Planning Assistant
        </p>

        {/* Animated Audio Visualizer Pulse */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-6 select-none">
          {status === 'listening' && (
            <>
              <div className="absolute inset-0 bg-emerald-500/15 rounded-full animate-ping" />
              <div className="absolute inset-4 bg-emerald-500/25 rounded-full animate-pulse" />
            </>
          )}
          {status === 'speaking' && (
            <>
              <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
              <div className="absolute inset-4 bg-amber-500/30 rounded-full animate-pulse" />
            </>
          )}
          {status === 'connecting' && (
            <div className="absolute inset-0 border-4 border-dashed border-emerald-600/40 rounded-full animate-spin" />
          )}

          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 ${
              status === 'speaking'
                ? 'bg-amber-600 text-white'
                : status === 'listening'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {isMuted ? <MicOff className="w-8 h-8 animate-bounce" /> : <Volume2 className="w-8 h-8" />}
          </div>
        </div>

        {/* Status Pill */}
        <div className="mb-5">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
              status === 'listening'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'speaking'
                ? 'bg-amber-100 text-amber-800'
                : status === 'connecting'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status === 'connecting'
              ? 'Connecting to Kisan Ai...'
              : status === 'listening'
              ? 'Sun rahe hain... Bolein'
              : status === 'speaking'
              ? 'Kisan Ai bol raha hai...'
              : status === 'processing'
              ? 'Samajh rahe hain...'
              : 'Connection Error'}
          </span>
        </div>

        {/* Live Subtitle Transcript */}
        <div className="w-full max-h-24 overflow-y-auto mb-6 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-center">
          {transcript.length > 0 ? (
            <p className="text-gray-800 text-xs sm:text-sm leading-relaxed italic">
              "{transcript[transcript.length - 1].text}"
            </p>
          ) : (
            <p className="text-gray-400 text-xs italic">
              {status === 'connecting'
                ? 'Thoda ruko...'
                : 'Bolein: "Mere paas 5 acre zameen hai aur Sehore mein tubewell hai"'}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-6 z-10">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl transition-all shadow-md ${
              isMuted ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
            }`}
            title={isMuted ? 'Unmute Karein' : 'Mute Karein'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
            title="Call Kat Karein (Hang up)"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
