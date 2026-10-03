import React from 'react';
import { Sprout, RefreshCw, Volume2, VolumeX, PhoneCall } from 'lucide-react';
import { STRINGS } from '../utils/strings';

interface HeaderProps {
  ttsEnabled: boolean;
  onToggleTts: () => void;
  onResetSession: () => void;
  onStartLiveCall: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  ttsEnabled,
  onToggleTts,
  onResetSession,
  onStartLiveCall,
  isLoading = false,
}) => {
  return (
    <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-30 border-b border-emerald-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="bg-emerald-800 p-2 rounded-xl border border-emerald-700">
            <Sprout className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                {STRINGS.appTitle}
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-emerald-200">
              {STRINGS.appSubtitle}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Live Voice Call Button */}
          <button
            onClick={onStartLiveCall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-amber-950 shadow transition-all active:scale-95 border border-amber-300"
            title="AI se live voice call par baat karein"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-current" />
            <span>Voice Call</span>
          </button>

          {/* TTS Audio Toggle */}
          <button
            onClick={onToggleTts}
            title={ttsEnabled ? STRINGS.voiceOn : STRINGS.voiceOff}
            className={`p-2 rounded-full text-xs transition-all ${
              ttsEnabled
                ? 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
                : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-950'
            }`}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>

          {/* Reset / New Chat */}
          <button
            onClick={() => {
              if (window.confirm(STRINGS.confirmReset)) {
                onResetSession();
              }
            }}
            disabled={isLoading}
            className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-all border border-emerald-700"
            title="Naya Session Shuru Karein"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Naya Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};

