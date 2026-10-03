import React from 'react';
import { Plan } from '../types';
import { FollowUpChat } from './FollowUpChat';
import { STRINGS } from '../utils/strings';
import {
  Calendar,
  AlertTriangle,
  Droplets,
  RefreshCw,
  Sprout,
  ArrowRight,
} from 'lucide-react';

interface SavedPlanViewProps {
  plan: Plan;
  onSendFollowUp: (question: string) => Promise<void>;
  onRecalculateOrChange: () => void;
  isLoading?: boolean;
}

export const SavedPlanView: React.FC<SavedPlanViewProps> = ({
  plan,
  onSendFollowUp,
  onRecalculateOrChange,
  isLoading = false,
}) => {
  return (
    <div className="space-y-5">
      {/* Outdated Plan Warning Banner */}
      {plan.isOutdated && (
        <div className="bg-amber-100 border-l-4 border-amber-600 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-amber-950">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <span>
              <strong>Dhyan dein:</strong> {STRINGS.outdatedPlanWarning}
            </span>
          </div>
          <button
            type="button"
            onClick={onRecalculateOrChange}
            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{STRINGS.recomputeBtn}</span>
          </button>
        </div>
      )}

      {/* Plan Main Header Card */}
      <div className="kisan-card p-4 sm:p-6 bg-emerald-900 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-700/60 pb-4 mb-4">
          <div>
            <span className="bg-emerald-500/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-400/30 inline-block mb-1">
              {STRINGS.activePlanBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-sans">
              {plan.cropNameHindi} — {plan.area} {plan.areaUnit} ke liye
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              Anushansit Kismein: <strong className="text-white">{plan.variety}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onRecalculateOrChange}
            className="bg-white/15 hover:bg-white/25 text-white text-xs px-3.5 py-2 rounded-xl border border-white/20 font-medium flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{STRINGS.changeCropBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
          <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-600/40">
            <span className="text-emerald-300 text-[11px] block">{STRINGS.estimatedProduction}</span>
            <span className="font-bold text-lg text-white">
              {plan.financials.productionTotal} Quintal
            </span>
          </div>

          <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-600/40">
            <span className="text-emerald-300 text-[11px] block">{STRINGS.marketPrice}</span>
            <span className="font-bold text-lg text-white">
              ₹{plan.financials.unitPrice.toLocaleString('en-IN')}/q
            </span>
          </div>

          <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-600/40">
            <span className="text-emerald-300 text-[11px] block">{STRINGS.totalCostLabel}</span>
            <span className="font-bold text-lg text-rose-300">
              ₹{plan.financials.totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-600/40">
            <span className="text-emerald-300 text-[11px] block">{STRINGS.netProfitLabel}</span>
            <span className="font-bold text-lg text-emerald-300">
              ₹{plan.financials.netReturn.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Agronomic Recommendations & Cost Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agronomy Guidelines */}
        <div className="kisan-card p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
          <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            {STRINGS.certifiedGuideHeader}
          </h3>

          <div>
            <span className="font-semibold text-gray-800 block text-xs">{STRINGS.soilPrepLabel}</span>
            <p className="text-gray-600 text-xs mt-0.5">{plan.agronomyPlan.soilPreparation}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-800 block text-xs">{STRINGS.seedRateLabel}</span>
            <p className="text-gray-600 text-xs mt-0.5">{plan.agronomyPlan.seedRate}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-800 block text-xs">{STRINGS.fertilizerGuideLabel}</span>
            <p className="text-gray-600 text-xs mt-0.5">{plan.agronomyPlan.fertilizerGuidance}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-800 block text-xs">{STRINGS.harvestWindowLabel}</span>
            <p className="text-gray-600 text-xs mt-0.5">{plan.agronomyPlan.harvestWindow}</p>
          </div>
        </div>

        {/* Cost Breakdown & Stage Based Irrigation */}
        <div className="kisan-card p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
          <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            {STRINGS.irrigationScheduleHeader}
          </h3>

          {/* Cost Items */}
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>{STRINGS.seedsCost}</span>
              <span className="font-medium text-gray-900">₹{plan.financials.costBreakdown.seeds.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{STRINGS.fertilizerCost}</span>
              <span className="font-medium text-gray-900">₹{plan.financials.costBreakdown.fertilizers.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{STRINGS.irrigationCost}</span>
              <span className="font-medium text-gray-900">₹{plan.financials.costBreakdown.irrigation.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{STRINGS.laborCost}</span>
              <span className="font-medium text-gray-900">₹{plan.financials.costBreakdown.laborAndMachinery.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{STRINGS.pestCost}</span>
              <span className="font-medium text-gray-900">₹{plan.financials.costBreakdown.plantProtection.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Irrigation Schedule */}
          <div>
            <span className="font-semibold text-gray-800 block text-xs mb-1">Important Sinchai Stages:</span>
            <div className="space-y-1.5">
              {plan.agronomyPlan.irrigationSchedule?.map((stage, idx) => (
                <div key={idx} className="bg-blue-50/70 p-2 rounded border border-blue-200/70 text-[11px]">
                  <span className="font-bold text-blue-950">{stage.stage} (Day {stage.daysAfterSowing}):</span>{' '}
                  <span className="text-gray-700">{stage.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stage-based checks timeline */}
      <div className="kisan-card p-4 sm:p-5 text-xs sm:text-sm">
        <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          {STRINGS.stageTimelineHeader}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plan.agronomyPlan.stageBasedChecks?.map((stage, i) => (
            <div key={i} className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="font-bold text-emerald-900 text-xs block mb-1">
                  {stage.stage}
                </span>
                <p className="text-gray-700 text-xs mb-2">{stage.keyActivity}</p>
              </div>
              <div className="bg-amber-50 p-2 rounded border border-amber-200 text-[11px] text-amber-900">
                <strong>Savdhani:</strong> {stage.precaution}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up Questions & Memory Interface */}
      <FollowUpChat
        plan={plan}
        onSendFollowUp={onSendFollowUp}
        isLoading={isLoading}
      />
    </div>
  );
};
