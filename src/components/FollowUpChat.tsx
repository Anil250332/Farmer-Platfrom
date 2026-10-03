import React, { useState } from 'react';
import { Plan } from '../types';
import { STRINGS } from '../utils/strings';
import { MessageSquare, Send, HelpCircle, Bot, User } from 'lucide-react';

interface FollowUpChatProps {
  plan: Plan;
  onSendFollowUp: (question: string) => Promise<void>;
  isLoading?: boolean;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({
  plan,
  onSendFollowUp,
  isLoading = false,
}) => {
  const [questionText, setQuestionText] = useState('');

  const quickQuestions = [
    `Agar main sirf 2 acre mein ${plan.cropNameHindi} lagau toh?`,
    'Khaad aur urvarak daalne ka sahi samay kya hai?',
    'Keet ya illi se bachav ke liye kya karein?',
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionText.trim() || isLoading) return;

    const q = questionText.trim();
    setQuestionText('');
    await onSendFollowUp(q);
  };

  const handleQuickClick = async (q: string) => {
    if (isLoading) return;
    await onSendFollowUp(q);
  };

  return (
    <div className="kisan-card p-4 sm:p-5">
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-3">
        <MessageSquare className="w-5 h-5 text-emerald-700" />
        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
          {STRINGS.followUpHeader}
        </h3>
      </div>

      {/* Suggestion Chips */}
      <div className="mb-4">
        <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mb-1.5">
          <HelpCircle className="w-3 h-3 text-emerald-600" />
          {STRINGS.frequentQuestions}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickClick(q)}
              disabled={isLoading}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs px-3 py-1.5 rounded-full border border-emerald-300 font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* History of Follow-ups */}
      {plan.followUpHistory && plan.followUpHistory.length > 0 && (
        <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
          {plan.followUpHistory.map((item, idx) => (
            <div key={idx} className="space-y-1.5 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex items-start gap-1.5 font-bold text-amber-900">
                <User className="w-3.5 h-3.5 text-amber-700 mt-0.5 flex-shrink-0" />
                <span>Kisan: "{item.question}"</span>
              </div>
              <div className="flex items-start gap-1.5 text-gray-800 bg-white p-2.5 rounded-lg border border-stone-200">
                <Bot className="w-3.5 h-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div className="leading-relaxed whitespace-pre-wrap">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          disabled={isLoading}
          placeholder={STRINGS.followUpPlaceholder}
          className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={!questionText.trim() || isLoading}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{STRINGS.askBtn}</span>
        </button>
      </form>
    </div>
  );
};
