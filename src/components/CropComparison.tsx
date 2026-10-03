import React, { useState } from 'react';
import { ComparisonResponse, CropComparisonItem } from '../types';
import { ClimateReferenceCard } from './ClimateReferenceCard';
import { MandiHistoryTable } from './MandiHistoryTable';
import { STRINGS } from '../utils/strings';
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Wheat,
  Sliders,
} from 'lucide-react';

interface CropComparisonProps {
  comparisonData: ComparisonResponse;
  onSelectCrop: (cropKey: string, scenario: 'low' | 'base' | 'high') => Promise<void>;
  isLoading?: boolean;
}

export const CropComparison: React.FC<CropComparisonProps> = ({
  comparisonData,
  onSelectCrop,
  isLoading = false,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'low' | 'base' | 'high'>('base');

  return (
    <div className="space-y-5">
      {/* Regional Climate Context Banner */}
      <ClimateReferenceCard climateData={comparisonData.climateReference} />

      {/* AI Scientific Summary Card */}
      {comparisonData.aiExplanationHindi && (
        <div className="kisan-card p-4 sm:p-5 bg-emerald-900 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <Wheat className="w-48 h-48" />
          </div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="bg-emerald-700/80 p-2.5 rounded-xl border border-emerald-500/40">
              <Sparkles className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-emerald-100 mb-1">
                {STRINGS.scientificAdviceHeader}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-sans">
                {comparisonData.aiExplanationHindi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Financial Scenario Selector Pills */}
      <div className="kisan-card p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-800" />
          <span className="font-bold text-xs sm:text-sm text-gray-800">
            {STRINGS.scenarioSelectorLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-300 shadow-2xs">
          <button
            type="button"
            onClick={() => setSelectedScenario('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedScenario === 'low'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-600 hover:bg-stone-100'
            }`}
          >
            {STRINGS.scenarioLow}
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario('base')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedScenario === 'base'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 hover:bg-stone-100'
            }`}
          >
            {STRINGS.scenarioBase}
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario('high')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedScenario === 'high'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-600 hover:bg-stone-100'
            }`}
          >
            {STRINGS.scenarioHigh}
          </button>
        </div>
      </div>

      {/* 3 Crop Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {comparisonData.comparisons.map((crop: CropComparisonItem) => {
          const scenarioData = crop.scenarios[selectedScenario];
          const isWheat = crop.cropKey === 'wheat';
          const isChickpea = crop.cropKey === 'chickpea';

          return (
            <div
              key={crop.cropKey}
              className="kisan-card p-4 sm:p-5 flex flex-col justify-between border-t-4 hover:shadow-lg transition-all"
              style={{
                borderTopColor: isWheat ? '#2D6A4F' : isChickpea ? '#D97706' : '#B45309',
              }}
            >
              {/* Top Details */}
              <div>
                {/* Crop Name & Tag */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">
                      {crop.nameHindi}
                    </h3>
                    <p className="text-[11px] text-gray-500">{crop.variety}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border text-center ${
                      crop.suitabilityLevel.includes('Highly')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : crop.suitabilityLevel.includes('Moderately')
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {crop.suitabilityLevel}
                  </span>
                </div>

                {/* Sowing & Water Quick Badges */}
                <div className="grid grid-cols-2 gap-2 my-3 text-[11px] bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                    <span>{crop.durationDays}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{crop.waterRequirements.category} {STRINGS.waterLabel}</span>
                  </div>
                </div>

                {/* Sowing Window */}
                <p className="text-xs text-gray-700 mb-3 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                  <strong className="text-emerald-950 font-semibold">{STRINGS.sowingWindowLabel}</strong>{' '}
                  {crop.sowingWindow.optimalHindi}
                </p>

                {/* Suitability Checks */}
                <div className="space-y-1.5 mb-4">
                  {crop.suitabilityChecks.map((chk, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5 text-[11px] leading-tight"
                    >
                      {chk.status === 'good' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-gray-700">{chk.message}</span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary Box */}
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mb-3">
                  <div className="flex items-center justify-between text-xs mb-2 border-b border-stone-200 pb-1.5">
                    <span className="text-gray-500 font-medium">{STRINGS.estimatedProduction}</span>
                    <span className="font-bold text-gray-900">
                      {scenarioData.totalProductionQuintals} Quintal ({scenarioData.yieldPerAcre} q/acre)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-2 border-b border-stone-200 pb-1.5">
                    <span className="text-gray-500 font-medium">{STRINGS.marketPrice}</span>
                    <span className="font-bold text-emerald-800">
                      ₹{scenarioData.pricePerQuintal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-2 border-b border-stone-200 pb-1.5">
                    <span className="text-gray-500 font-medium">{STRINGS.totalCostLabel}</span>
                    <span className="font-bold text-rose-700">
                      ₹{scenarioData.totalCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-emerald-950 font-bold">{STRINGS.netProfitLabel}</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      ₹{scenarioData.netReturn.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Cost Breakdown Accordion */}
                <div className="text-[11px] text-gray-600 space-y-1 mb-3 px-1">
                  <div className="flex justify-between">
                    <span>• {STRINGS.seedsCost}</span>
                    <span>₹{crop.costBreakdown.seeds.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• {STRINGS.fertilizerCost}</span>
                    <span>₹{crop.costBreakdown.fertilizers.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• {STRINGS.irrigationCost}</span>
                    <span>₹{crop.costBreakdown.irrigation.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• {STRINGS.laborCost}</span>
                    <span>₹{crop.costBreakdown.laborAndMachinery.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="text-[11px] space-y-1.5 mb-3">
                  <p className="font-semibold text-emerald-900">{STRINGS.benefitsLabel}</p>
                  <p className="text-gray-700 bg-emerald-50/60 p-1.5 rounded">
                    {crop.prosHindi[0]}
                  </p>

                  <p className="font-semibold text-amber-900 mt-1">{STRINGS.cautionLabel}</p>
                  <p className="text-gray-700 bg-amber-50/60 p-1.5 rounded">
                    {crop.consHindi[0]}
                  </p>
                </div>

                {/* Mandi Historical Table */}
                <MandiHistoryTable cropName={crop.nameHindi} mandiData={crop.mandiPriceHistory} />
              </div>

              {/* Action Button: Select and Save Plan */}
              <div className="mt-4 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => onSelectCrop(crop.cropKey, selectedScenario)}
                  disabled={isLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{STRINGS.selectCropBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
