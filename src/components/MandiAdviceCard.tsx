import React from 'react';
import { MandiAdviceResponse } from '../types';

interface Props {
  advice: MandiAdviceResponse;
  onClose?: () => void;
}

export const MandiAdviceCard: React.FC<Props> = ({ advice, onClose }) => {
  if (!advice || !advice.topMandis) return null;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent border-2 border-emerald-500/40 rounded-2xl p-5 shadow-xl my-4 text-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-emerald-500/20 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span>🌾</span> Live Mandi Selling Advisory
            </span>
            {advice.cached && (
              <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded border border-zinc-700">
                Cached Data
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-emerald-100 mt-2">
            {advice.query?.crop || 'Fasal'} Bechne Ki Salah
          </h3>
          <p className="text-xs text-zinc-400">
            Matra: <strong className="text-zinc-200">{advice.query?.quantityQuintals} Quintal</strong> |{' '}
            Origin: <strong className="text-zinc-200">{advice.query?.originName || 'Gwalior'}</strong>
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Prominent Stale Date Notice */}
      {advice.staleWarning && (
        <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-3 mb-4 flex items-start gap-2.5 text-amber-200 text-xs">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <strong>Dhyan dein:</strong> {advice.staleWarning}
          </div>
        </div>
      )}

      {/* Summary in Hinglish */}
      <div className="bg-zinc-900/80 rounded-xl p-3.5 mb-4 border border-zinc-800 text-sm text-zinc-200 leading-relaxed">
        {advice.summaryHindi}
      </div>

      {/* Top Ranked Mandis */}
      <div className="space-y-3 mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Ranked Mandi Vikalp (Distance & Net Receipts)
        </h4>

        {advice.topMandis.map((mandi, idx) => {
          const isTop = idx === 0;
          return (
            <div
              key={`${mandi.market}-${idx}`}
              className={`rounded-xl p-4 transition-all border ${
                isTop
                  ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-lg'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isTop
                        ? 'bg-emerald-500 text-zinc-950 font-black'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    #{idx + 1} {isTop ? 'Sabse Adhik Bachat' : ''}
                  </span>
                  <span className="font-bold text-base text-zinc-100">
                    {mandi.market} Mandi
                  </span>
                  <span className="text-xs text-zinc-400">({mandi.district})</span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-400 block">Modal Bhav</span>
                  <span className="text-sm font-bold text-amber-300">
                    ₹{mandi.modalPrice.toLocaleString('en-IN')}/q
                  </span>
                </div>
              </div>

              {/* Financial Calculation Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800/80 text-xs mt-2">
                <div>
                  <span className="text-zinc-500 block">Duri (Distance)</span>
                  <span className="font-medium text-zinc-300">
                    {mandi.distanceKm !== null ? `${mandi.distanceKm} km` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Transport Kharch</span>
                  <span className="font-medium text-red-300">
                    {mandi.transportCost !== null ? `-₹${mandi.transportCost.toLocaleString('en-IN')}` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">1.5% Mandi Tax</span>
                  <span className="font-medium text-red-300">
                    -₹{mandi.mandiCharges.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20">
                  <span className="text-emerald-400 block font-semibold">Net Bachat</span>
                  <span className="font-bold text-emerald-300 text-sm">
                    {mandi.estimatedNetReceipts !== null
                      ? `₹${mandi.estimatedNetReceipts.toLocaleString('en-IN')}`
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Arrival date & variety badge */}
              <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2.5 pt-1.5 border-t border-zinc-800/40">
                <span>Variety: {mandi.variety || 'Local'}</span>
                <span>Bhav Date: {mandi.priceDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unresolved Mandis (if any) */}
      {advice.unresolvedMandis && advice.unresolvedMandis.length > 0 && (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3 mb-3 text-xs">
          <div className="text-zinc-400 font-semibold mb-1">
            📍 Anya Mandi Record (Verified Location Uplabdh Nahi):
          </div>
          <div className="space-y-1 text-zinc-400">
            {advice.unresolvedMandis.map((um, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <span>{um.market} ({um.district})</span>
                <span className="text-amber-400">₹{um.modalPrice}/q (Date: {um.priceDate})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {advice.warningDisclaimer && (
        <p className="text-[11px] text-zinc-400 italic text-center">
          ℹ️ {advice.warningDisclaimer}
        </p>
      )}
    </div>
  );
};
