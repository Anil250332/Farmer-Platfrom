import React, { useState, useEffect, useCallback } from 'react';
import { FarmProfile, NextQuestion, ComparisonResponse, Plan, SoilData, MandiAdviceResponse } from './types';
import { api, clearSessionId } from './services/api';
import { Header } from './components/Header';
import { IntakeChat } from './components/IntakeChat';
import { SoilUploadModal } from './components/SoilUploadModal';
import { VoiceLiveWidget } from './components/VoiceLiveWidget';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [nextQuestion, setNextQuestion] = useState<NextQuestion | null>(null);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [mandiAdvice, setMandiAdvice] = useState<MandiAdviceResponse | null>(null);

  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
  const [isLiveCallActive, setIsLiveCallActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Show temporary toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Browser Speech Synthesis for Hindi/Hinglish Voice Output
  const speakHindiText = useCallback((text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('HI'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  // Load initial session on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const res = await api.initSession();
        setProfile(res.profile);
        setNextQuestion(res.nextQuestion);
        if (res.activePlan) {
          setActivePlan(res.activePlan);
        } else if (res.profile.intakeCompleted) {
          fetchComparison();
        }
      } catch (err: any) {
        console.error('Session init error:', err);
        showToast(err.message || 'Session load karne mein dikkat aayi.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const fetchComparison = async () => {
    try {
      const res = await api.getCropComparison();
      setComparisonData(res.data);
    } catch (err: any) {
      console.warn('Comparison fetch:', err.message);
    }
  };

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await api.sendIntakeMessage(text);
      setProfile(res.profile);
      setNextQuestion(res.nextQuestion);

      if (res.mandiAdvice) {
        setMandiAdvice(res.mandiAdvice);
      }

      if (res.assistantResponse) {
        speakHindiText(res.assistantResponse);
      }

      if (res.profile.intakeCompleted) {
        await fetchComparison();
      }
    } catch (err: any) {
      showToast(err.message || 'Message bhejne mein error hua.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAudio = async (audioBlob: Blob, mimeType: string) => {
    setIsLoading(true);
    try {
      const extension = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('wav') ? 'wav' : 'webm';
      const res = await api.sendAudioRecording(audioBlob, `recording.${extension}`);
      setProfile(res.profile);
      setNextQuestion(res.nextQuestion);

      showToast(`Awaaz samjhi: "${res.transcript}"`, 'success');

      if (res.assistantResponse) {
        speakHindiText(res.spokenSummary || res.assistantResponse);
      }

      if (res.profile.intakeCompleted) {
        await fetchComparison();
      }
    } catch (err: any) {
      showToast(err.message || 'Audio process karne mein error hua.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoilConfirmed = async (data: SoilData) => {
    if (profile) {
      setProfile({
        ...profile,
        soilData: data,
        soilTestConfirmed: true,
      });
    }
    showToast('Soil test report save ho gayi.', 'success');
    await fetchComparison();
    try {
      const planRes = await api.getActivePlan();
      setActivePlan(planRes.plan);
    } catch (_) {}
  };

  const handleSelectCrop = async (cropKey: string, scenario: 'low' | 'base' | 'high' = 'base') => {
    setIsLoading(true);
    try {
      const res = await api.selectCropAndCreatePlan(cropKey, scenario);
      setActivePlan(res.plan);
      if (res.profile) {
        setProfile(res.profile);
      }
      showToast(res.message || 'Fasal yojana save ho gayi!', 'success');
      speakHindiText(`Badhai! Aapki ${res.plan.cropNameHindi} ki yojana safalta se taiyar hai.`);
    } catch (err: any) {
      showToast(err.message || 'Fasal chunne mein error hua.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = async () => {
    setIsLoading(true);
    try {
      window.speechSynthesis?.cancel();
      clearSessionId();
      setIsSoilModalOpen(false);
      setIsLiveCallActive(false);
      const res = await api.initSession();
      setProfile(res.profile);
      setNextQuestion(res.nextQuestion);
      setActivePlan(null);
      setComparisonData(null);
      setMandiAdvice(null);
      showToast('Naya chat session shuru ho gaya.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Reset karne mein error hua.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 text-zinc-900 font-sans">
      {/* Clean Minimal Header */}
      <Header
        ttsEnabled={ttsEnabled}
        onToggleTts={() => setTtsEnabled(!ttsEnabled)}
        onResetSession={handleResetSession}
        onStartLiveCall={() => setIsLiveCallActive(true)}
        isLoading={isLoading}
      />

      {/* Main Single Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-2 sm:p-4 flex flex-col">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`mb-3 p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm shadow-sm transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-zinc-500 hover:text-zinc-800 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Clean Conversational Chat & Voice Area */}
        {profile ? (
          <IntakeChat
            profile={profile}
            nextQuestion={nextQuestion}
            mandiAdvice={mandiAdvice}
            comparisonData={comparisonData}
            activePlan={activePlan}
            onDismissMandiAdvice={() => setMandiAdvice(null)}
            onSelectCrop={handleSelectCrop}
            onOpenSoilModal={() => setIsSoilModalOpen(true)}
            onSendMessage={handleSendMessage}
            onSendAudio={handleSendAudio}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
            Session load ho raha hai...
          </div>
        )}
      </main>

      {/* Soil PDF Upload Modal */}
      <SoilUploadModal
        isOpen={isSoilModalOpen}
        onClose={() => setIsSoilModalOpen(false)}
        currentSoilData={profile?.soilData}
        onSoilConfirmed={handleSoilConfirmed}
      />

      {/* Real-time Voice Live Call Widget */}
      <VoiceLiveWidget
        isActive={isLiveCallActive}
        onClose={() => {
          setIsLiveCallActive(false);
          api.initSession().then((res) => {
            setProfile(res.profile);
            setNextQuestion(res.nextQuestion);
            if (res.activePlan) setActivePlan(res.activePlan);
          });
        }}
        onProfileUpdated={(updatedProfile) => {
          setProfile(updatedProfile);
          fetchComparison();
        }}
        onPlanUpdated={(newPlan) => {
          setActivePlan(newPlan);
          showToast(`Fasal yojana save ho gayi: ${newPlan.cropNameHindi}`, 'success');
        }}
        onNextQuestionUpdated={(nextQ) => {
          setNextQuestion(nextQ);
        }}
      />
    </div>
  );
};

