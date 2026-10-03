import React, { useState } from 'react';
import { Sun, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { STRINGS } from '../utils/strings';

interface ClimateItem {
  month: string;
  avgMaxTempC: number;
  avgMinTempC: number;
  rainfallMm: number;
  historicalCondition: string;
  coverage: string;
}

interface ClimateReferenceCardProps {
  climateData: ClimateItem[];
}

export const ClimateReferenceCard: React.FC<ClimateReferenceCardProps> = ({ climateData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="kisan-card p-4 sm:p-5 mb-5 bg-stone-50/70 border border-stone-200">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              {STRINGS.climateCardTitle}
            </h3>
            <p className="text-[11px] text-gray-500">
              {STRINGS.climateSource}
            </p>
          </div>
        </div>

        <button className="text-gray-500 hover:text-gray-700 p-1">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-stone-200 text-xs">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg mb-3 flex items-start gap-2 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> {STRINGS.climateDisclaimer}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-200/70 text-gray-700 text-[11px]">
                  <th className="p-2 rounded-l">Mahina (Month)</th>
                  <th className="p-2">Max Temp (°C)</th>
                  <th className="p-2">Min Temp (°C)</th>
                  <th className="p-2">Rainfall (mm)</th>
                  <th className="p-2 rounded-r">Krishi Sthiti (Agronomic Impact)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {climateData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/80 transition-colors">
                    <td className="p-2 font-semibold text-gray-900">{item.month}</td>
                    <td className="p-2 text-rose-700 font-medium">{item.avgMaxTempC}°C</td>
                    <td className="p-2 text-blue-700 font-medium">{item.avgMinTempC}°C</td>
                    <td className="p-2 text-gray-700">{item.rainfallMm} mm</td>
                    <td className="p-2 text-gray-600">{item.historicalCondition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
