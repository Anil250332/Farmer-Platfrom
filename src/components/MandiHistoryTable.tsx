import React, { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { STRINGS } from '../utils/strings';

interface MandiHistoryProps {
  cropName: string;
  mandiData: {
    source: string;
    timePeriod: string;
    market: string;
    unit: string;
    historicalPrices: Array<{
      year: number;
      month: string;
      minPrice: number;
      maxPrice: number;
      modalPrice: number;
      note?: string;
    }>;
  };
}

export const MandiHistoryTable: React.FC<MandiHistoryProps> = ({ cropName, mandiData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3 pt-3 border-t border-stone-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs text-emerald-800 font-semibold bg-emerald-50/80 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
          {cropName} — {STRINGS.mandiRecordsTitle}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="mt-2 text-xs bg-white rounded-lg border border-emerald-200 p-2.5 space-y-2">
          <div className="text-[11px] text-gray-500 flex items-center justify-between flex-wrap gap-1">
            <span>
              <Database className="w-3 h-3 inline text-emerald-600 mr-1" />
              {STRINGS.mandiSourceLabel} {mandiData.source} ({mandiData.market})
            </span>
            <span>{STRINGS.mandiUnitLabel} {mandiData.unit}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-stone-100 text-gray-700">
                  <th className="p-1.5">Year / Month</th>
                  <th className="p-1.5">Min (₹)</th>
                  <th className="p-1.5">Modal Bhav (₹)</th>
                  <th className="p-1.5">Max (₹)</th>
                  <th className="p-1.5">Note (Variety / Demand)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {mandiData.historicalPrices.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="p-1.5 font-medium text-gray-900">
                      {row.year} {row.month}
                    </td>
                    <td className="p-1.5 text-gray-600">₹{row.minPrice}</td>
                    <td className="p-1.5 font-bold text-emerald-700">₹{row.modalPrice}</td>
                    <td className="p-1.5 text-gray-600">₹{row.maxPrice}</td>
                    <td className="p-1.5 text-gray-500">{row.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            {STRINGS.mandiDisclaimer}
          </p>
        </div>
      )}
    </div>
  );
};
