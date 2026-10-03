import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { STRINGS } from '../utils/strings';

interface VoiceRecorderProps {
  onAudioRecorded: (audioBlob: Blob, mimeType: string) => Promise<void>;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onAudioRecorded,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const getSupportedMimeType = (): string => {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/wav'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all audio tracks to release microphone hardware
        stream.getTracks().forEach((track) => track.stop());

        const finalMimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMimeType });

        if (audioBlob.size > 0) {
          setIsProcessing(true);
          try {
            await onAudioRecorded(audioBlob, finalMimeType);
          } catch (err: any) {
            setErrorMessage(err.message || 'Awaaz process karne mein error hua. Text se likhein.');
          } finally {
            setIsProcessing(false);
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setErrorMessage(STRINGS.micDenied);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative flex items-center">
      {errorMessage && (
        <div className="absolute bottom-12 left-0 right-0 z-20 whitespace-nowrap text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 shadow-md">
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        disabled={disabled || isProcessing}
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex items-center justify-center p-2.5 rounded-xl transition-all shadow-xs ${
          isRecording
            ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
            : isProcessing
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
        }`}
        title={isRecording ? 'Recording Rokein' : 'Bol kar sawal poochein (Microphone)'}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
        ) : isRecording ? (
          <Square className="w-4 h-4 fill-current animate-pulse" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
