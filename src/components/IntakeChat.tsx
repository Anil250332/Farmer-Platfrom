import React, { useState, useRef, useEffect } from 'react';
import { FarmProfile, NextQuestion, MandiAdviceResponse, ComparisonResponse, Plan } from '../types';
import { VoiceRecorder } from './VoiceRecorder';
import { MandiAdviceCard } from './MandiAdviceCard';
import { STRINGS } from '../utils/strings';
import { Send, Bot, User, Sparkles, Paperclip, Loader2, TrendingUp, Sprout } from 'lucide-react';


interface IntakeChatProps {
  profile: FarmProfile;
  nextQuestion: NextQuestion | null;
  mandiAdvice?: MandiAdviceResponse | null;
  comparisonData?: ComparisonResponse | null;
  activePlan?: Plan | null;
  onDismissMandiAdvice?: () => void;
  onSelectCrop?: (cropKey: string, scenario: 'low' | 'base' | 'high') => Promise<void>;
  onOpenSoilModal?: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onSendAudio: (blob: Blob, mimeType: string) => Promise<void>;
  isLoading?: boolean;
}

export const IntakeChat: React.FC<IntakeChatProps> = ({
  profile,
  nextQuestion,
  mandiAdvice,
  comparisonData,
  activePlan,
  onDismissMandiAdvice,
  onSelectCrop,
  onOpenSoilModal,
  onSendMessage,
  onSendAudio,
  isLoading = false,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [profile.conversationHistory, nextQuestion, mandiAdvice, comparisonData, activePlan, pendingUserMessage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const msg = inputVal.trim();
    setInputVal('');
    setPendingUserMessage(msg);
    try {
      await onSendMessage(msg);
    } finally {
      setPendingUserMessage(null);
    }
  };

  const handleStarterClick = async (text: string) => {
    if (isLoading) return;
    setPendingUserMessage(text);
    try {
      await onSendMessage(text);
    } finally {
      setPendingUserMessage(null);
    }
  };

  const hasMessages =
    (profile.conversationHistory && profile.conversationHistory.length > 0) ||
    Boolean(pendingUserMessage);

  return (

    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden h-[calc(100vh-95px)]">
      {/* Active Saved Plan In-Stream Banner */}
      {activePlan && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>
              Sakriya Yojana: <strong>{activePlan.cropNameHindi} ({activePlan.area} {activePlan.areaUnit})</strong>
            </span>
          </div>
          <span className="bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
            Anumanit Net: ₹{activePlan.financials.netReturn.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Welcome Empty State */}
        {!hasMessages && (
          <div className="py-6 sm:py-10 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800 shadow-sm border border-emerald-200">
              <Sparkles className="w-7 h-7 text-emerald-700" />
            </div>
            <h2 className="text-xl font-bold text-zinc-800 mb-2">
              Ram-ram kisan bhai!
            </h2>
            <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
              Main Kisan Ai hoon. Aap bol kar ya likh kar fasal planning aur taaza mandi bhav ki salah le sakte hain.
            </p>

            {/* Quick Starter Pills */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleStarterClick('Mere paas 400 quintal gehu hai, kahan bechu?')}
                className="w-full p-3 rounded-xl border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/60 text-left text-xs sm:text-sm font-medium text-zinc-700 transition-all flex items-center justify-between group shadow-2xs"
              >
                <span>🌾 Mere paas 400 quintal gehu hai, kahan bechu?</span>
                <span className="text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => handleStarterClick('Mere khet ke liye fasal plan batao (5 acre zameen)')}
                className="w-full p-3 rounded-xl border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/60 text-left text-xs sm:text-sm font-medium text-zinc-700 transition-all flex items-center justify-between group shadow-2xs"
              >
                <span>🌱 Mere khet ke liye fasal plan batao (5 acre zameen)</span>
                <span className="text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {onOpenSoilModal && (
                <button
                  type="button"
                  onClick={onOpenSoilModal}
                  className="w-full p-3 rounded-xl border border-dashed border-emerald-300 hover:border-emerald-600 hover:bg-emerald-50/40 text-left text-xs sm:text-sm font-medium text-emerald-800 transition-all flex items-center justify-between group"
                >
                  <span>🧪 Mitti Jaanch Report (Soil PDF) upload karein</span>
                  <span className="text-emerald-700 font-semibold">📎</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Conversation Stream */}
        {profile.conversationHistory?.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4 text-amber-800" /> : <Bot className="w-4 h-4 text-emerald-800" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-sm shadow-sm'
                    : 'bg-zinc-100 text-zinc-800 rounded-tl-sm border border-zinc-200/80 shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Optional Quick Reply Chips attached directly to the latest assistant message */}
                {!isUser &&
                  idx === (profile.conversationHistory?.length || 0) - 1 &&
                  nextQuestion?.options &&
                  nextQuestion.options.length > 0 &&
                  !isLoading && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-zinc-200/70">
                      {nextQuestion.options.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleStarterClick(opt)}
                          disabled={isLoading}
                          className="bg-white hover:bg-emerald-700 hover:text-white text-emerald-900 text-xs px-3 py-1 rounded-full border border-emerald-300 shadow-2xs transition-all font-medium active:scale-95 cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          );
        })}

        {/* Optimistic Pending User Message Bubble (only while waiting for server response) */}
        {isLoading && pendingUserMessage && (
          <div className="flex items-start gap-2.5 flex-row-reverse animate-fade-in">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <User className="w-4 h-4 text-amber-800" />
            </div>
            <div className="p-3.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed bg-emerald-700 text-white rounded-tr-sm shadow-sm">
              <p className="whitespace-pre-wrap">{pendingUserMessage}</p>
            </div>
          </div>
        )}

        {/* In-Stream Mandi Advice Card */}
        {mandiAdvice && (
          <MandiAdviceCard advice={mandiAdvice} onClose={onDismissMandiAdvice} />
        )}

        {/* In-Stream Dynamic Crop Comparison Card (when comparison is ready) */}
        {comparisonData && comparisonData.comparisons && comparisonData.comparisons.length > 0 && !mandiAdvice && (
          <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 my-3 text-zinc-900 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-sm text-emerald-950">
                  {profile.district ? `${profile.district} - ` : ''}Fasal Tulna (Comparison & Planning)
                </h4>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-semibold border border-emerald-300">
                {profile.totalArea} {profile.areaUnit} Rakba
              </span>
            </div>

            {/* Live Weather Forecast Bar */}
            {comparisonData.liveWeather && (
              <div className="bg-white/90 border border-emerald-200/80 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-zinc-800">
                  <span>🌤️</span>
                  <span><strong>{comparisonData.liveWeather.location} Mausam:</strong> {comparisonData.liveWeather.currentTempC}°C (7-Din Varsha: {comparisonData.liveWeather.rainForecast7DaysMm}mm)</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {comparisonData.liveWeather.conditionHindi}
                </span>
              </div>
            )}

            {/* AI Explanation / Agronomist Why Recommended */}
            {comparisonData.aiExplanationHindi && (
              <div className="bg-emerald-100/60 border border-emerald-300/80 rounded-xl p-2.5 text-xs text-emerald-950">
                <strong className="text-emerald-900">💡 Salah: </strong>
                <span>{comparisonData.aiExplanationHindi}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {comparisonData.comparisons.map((crop) => {
                const isSelected = activePlan?.cropKey === crop.cropKey;
                return (
                  <div
                    key={crop.cropKey}
                    className={`rounded-xl p-3 border shadow-2xs flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-100/90 border-emerald-600 ring-2 ring-emerald-500'
                        : 'bg-white border-emerald-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-zinc-900">{crop.nameHindi}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isSelected ? '✓ Chuna Hua' : `${crop.durationDays} Din`}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mb-2">Variety: {crop.variety}</p>

                      <div className="space-y-1 text-xs mb-3">
                        <div className="flex justify-between text-zinc-600">
                          <span>Utpadan:</span>
                          <strong className="text-zinc-900">{crop.scenarios.base.totalProductionQuintals} q</strong>
                        </div>
                        <div className="flex justify-between text-zinc-600">
                          <span>Kul Kharch:</span>
                          <span className="text-red-600 font-medium">₹{crop.scenarios.base.totalCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between bg-emerald-50 p-1 rounded font-semibold text-emerald-900">
                          <span>Net Labh:</span>
                          <span>₹{crop.scenarios.base.netReturn.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {onSelectCrop && (
                      <button
                        type="button"
                        onClick={() => onSelectCrop(crop.cropKey, 'base')}
                        className={`w-full text-xs font-semibold py-1.5 rounded-lg transition-all shadow-xs cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-900 text-white font-bold'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                      >
                        {isSelected ? '✓ Yojana Sakriya Hai' : `${crop.nameHindi} Chunein`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Active Saved Plan Agronomy Card */}
        {activePlan && !mandiAdvice && (
          <div className="bg-white border-2 border-emerald-600 rounded-2xl p-4 my-3 text-zinc-900 shadow-md animate-fade-in space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <div>
                  <h3 className="font-bold text-base text-emerald-950">
                    {activePlan.cropNameHindi} — Krishi & Sinchai Yojana
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Rakba: {activePlan.area} {activePlan.areaUnit} | Variety: {activePlan.variety}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Anumanit Shuddh Labh</div>
                <div className="text-base font-bold text-emerald-700">
                  ₹{activePlan.financials.netReturn.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Quick Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-xs">
              <div>
                <span className="text-zinc-500 block text-[11px]">Kul Utpadan:</span>
                <strong className="text-zinc-900 font-semibold">{activePlan.financials.productionTotal} Quintal</strong>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Kul Lagat:</span>
                <strong className="text-red-700 font-semibold">₹{activePlan.financials.totalCost.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Beej Dar:</span>
                <strong className="text-zinc-900 font-semibold">{activePlan.agronomyPlan.seedRate}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Buwai Window:</span>
                <strong className="text-emerald-900 font-semibold">{activePlan.agronomyPlan.sowingWindow}</strong>
              </div>
            </div>

            {/* Stage Timeline / Irrigation Schedule */}
            {activePlan.agronomyPlan.stageBasedChecks && activePlan.agronomyPlan.stageBasedChecks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-zinc-800 flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span>Fasal Chakra & Sinchai Schedule (Stage Timeline):</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {activePlan.agronomyPlan.stageBasedChecks.map((stage, sIdx) => (
                    <div key={sIdx} className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl">
                      <div className="font-semibold text-emerald-900 mb-0.5">{stage.stage}</div>
                      <div className="text-zinc-700">{stage.keyActivity}</div>
                      {stage.precaution && (
                        <div className="text-[11px] text-amber-800 mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{stage.precaution}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fertilizer guidance */}
            {activePlan.agronomyPlan.fertilizerGuidance && (
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl text-xs text-amber-950">
                <strong className="text-amber-900 block mb-1">🧪 Khaad & Urvarak Nirdesh:</strong>
                <p>{activePlan.agronomyPlan.fertilizerGuidance}</p>
              </div>
            )}
          </div>
        )}


        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 italic pl-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>Kisan Ai jawab taiyar kar raha hai...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Clean Bottom Input Bar */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-200">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* Soil Test Modal Trigger (Paperclip) */}
          {onOpenSoilModal && (
            <button
              type="button"
              onClick={onOpenSoilModal}
              className="p-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-600 transition-all flex-shrink-0"
              title="Mitti Jaanch Report (Soil Test PDF) Upload Karein"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          )}

          {/* Voice Push to Talk Mic Button */}
          <div className="flex-shrink-0">
            <VoiceRecorder onAudioRecorded={onSendAudio} disabled={isLoading} />
          </div>

          {/* Text Input Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isLoading}
              placeholder="Apna sawal yahan likhein ya bol kar batayein..."
              className="flex-1 bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all placeholder:text-zinc-400"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-sm flex-shrink-0"
              title={STRINGS.sendBtn}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
