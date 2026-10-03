import React, { useState } from 'react';
import { FarmProfile } from '../types';
import { STRINGS } from '../utils/strings';
import { Layers, Droplets, Calendar, Wallet, FileText, CheckCircle2, Edit2, X, Check } from 'lucide-react';

interface FarmSummaryCardProps {
  profile: FarmProfile;
  onUpdateProfile: (updates: Partial<FarmProfile>) => Promise<void>;
  onOpenSoilModal: () => void;
}

export const FarmSummaryCard: React.FC<FarmSummaryCardProps> = ({
  profile,
  onUpdateProfile,
  onOpenSoilModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [area, setArea] = useState(profile.totalArea?.toString() || '');
  const [unit, setUnit] = useState(profile.areaUnit || 'Acre');
  const [water, setWater] = useState(profile.waterAvailability || 'Paryapt (3-4 Sinchai)');
  const [budget, setBudget] = useState(profile.budget?.toString() || '');
  const [sowingDate, setSowingDate] = useState(profile.intendedSowingDate || '');
  const [prevCrop, setPrevCrop] = useState(profile.previousCrop || 'Soybean');

  const handleSave = async () => {
    await onUpdateProfile({
      totalArea: parseFloat(area) || 0,
      areaUnit: unit,
      waterAvailability: water,
      budget: parseInt(budget, 10) || 0,
      intendedSowingDate: sowingDate,
      previousCrop: prevCrop,
    });
    setIsEditing(false);
  };

  return (
    <div className="kisan-card p-4 sm:p-5 mb-4 border-l-4 border-l-emerald-600">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700" />
          <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
            {STRINGS.farmDetails}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => {
                setArea(profile.totalArea?.toString() || '');
                setUnit(profile.areaUnit || 'Acre');
                setWater(profile.waterAvailability || '');
                setBudget(profile.budget?.toString() || '');
                setSowingDate(profile.intendedSowingDate || '');
                setPrevCrop(profile.previousCrop || '');
                setIsEditing(true);
              }}
              className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-medium"
            >
              <Edit2 className="w-3 h-3" />
              <span>{STRINGS.editBtn}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-md font-medium"
              >
                <Check className="w-3 h-3" />
                <span>{STRINGS.saveBtn}</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs sm:text-sm">
          {/* Area */}
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
            <span className="text-gray-500 text-[11px] block">{STRINGS.totalArea}</span>
            <span className="font-bold text-gray-900 text-base">
              {profile.totalArea > 0 ? `${profile.totalArea} ${profile.areaUnit}` : '—'}
            </span>
          </div>

          {/* Irrigation */}
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
            <span className="text-gray-500 text-[11px] flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-500" />
              {STRINGS.irrigation}
            </span>
            <span className="font-semibold text-gray-900 truncate block mt-0.5" title={profile.waterAvailability}>
              {profile.waterAvailability || '—'}
            </span>
          </div>

          {/* Sowing Date */}
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
            <span className="text-gray-500 text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-600" />
              {STRINGS.sowingDate}
            </span>
            <span className="font-semibold text-gray-900 block mt-0.5 truncate">
              {profile.intendedSowingDate || '—'}
            </span>
          </div>

          {/* Previous Crop */}
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
            <span className="text-gray-500 text-[11px] block">{STRINGS.prevCrop}</span>
            <span className="font-semibold text-gray-900 block mt-0.5 truncate">
              {profile.previousCrop || '—'}
            </span>
          </div>

          {/* Budget */}
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
            <span className="text-gray-500 text-[11px] flex items-center gap-1">
              <Wallet className="w-3 h-3 text-emerald-600" />
              {STRINGS.budget}
            </span>
            <span className="font-bold text-emerald-800 text-base">
              {profile.budget > 0 ? `₹${profile.budget.toLocaleString('en-IN')}` : '—'}
            </span>
          </div>

          {/* Soil Test */}
          <div
            onClick={onOpenSoilModal}
            className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
              profile.soilTestConfirmed
                ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100/70'
                : 'bg-amber-50/80 border-amber-200 hover:bg-amber-100/70'
            }`}
          >
            <span className="text-gray-600 text-[11px] flex items-center gap-1">
              <FileText className="w-3 h-3 text-emerald-700" />
              {STRINGS.soilCard}
            </span>
            {profile.soilTestConfirmed ? (
              <span className="font-bold text-emerald-800 text-xs flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {STRINGS.soilConfirmed} (pH {profile.soilData?.ph || '—'})
              </span>
            ) : (
              <span className="text-amber-800 text-xs font-medium block mt-0.5 underline">
                {STRINGS.uploadSoilPdf}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Inline Edit Form */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Rakba (Area) & Unit:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Area (jaise 5)"
                className="w-2/3 border border-gray-300 rounded px-2.5 py-1.5 text-sm"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-1/3 border border-gray-300 rounded px-2 py-1.5 text-sm"
              >
                <option value="Acre">Acre</option>
                <option value="Bigha">Bigha</option>
                <option value="Hectare">Hectare</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Sinchai Suvidha:</label>
            <select
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm"
            >
              <option value="Paryapt (3-4 Sinchai / Tubewell)">Paryapt Paani (3-4 Sinchai / Tubewell)</option>
              <option value="Seemit (1-2 Sinchai / Well)">Seemit Paani (1-2 Sinchai / Kuan)</option>
              <option value="Asinchit (Rainfed)">Asinchit (Rainfed / Barish par)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Budget (Rupees):</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Jaise 40000"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Buwai Time:</label>
            <input
              type="text"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              placeholder="Jaise 10-15 November"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Pichhli Fasal:</label>
            <input
              type="text"
              value={prevCrop}
              onChange={(e) => setPrevCrop(e.target.value)}
              placeholder="Jaise Soybean / Maize"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
