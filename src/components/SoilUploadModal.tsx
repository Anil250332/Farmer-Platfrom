import React, { useState } from 'react';
import { SoilData } from '../types';
import { api } from '../services/api';
import { STRINGS } from '../utils/strings';
import { X, UploadCloud, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface SoilUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSoilData?: SoilData;
  onSoilConfirmed: (data: SoilData) => void;
}

export const SoilUploadModal: React.FC<SoilUploadModalProps> = ({
  isOpen,
  onClose,
  currentSoilData,
  onSoilConfirmed,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [summaryHindi, setSummaryHindi] = useState<string>('');

  // Editable fields
  const [ph, setPh] = useState(currentSoilData?.ph?.toString() || '');
  const [ec, setEc] = useState(currentSoilData?.ec?.toString() || '');
  const [oc, setOc] = useState(currentSoilData?.organicCarbon?.toString() || '');
  const [nitrogen, setNitrogen] = useState(currentSoilData?.nitrogen?.toString() || '');
  const [phosphorus, setPhosphorus] = useState(currentSoilData?.phosphorus?.toString() || '');
  const [potassium, setPotassium] = useState(currentSoilData?.potassium?.toString() || '');
  const [zinc, setZinc] = useState(currentSoilData?.zinc?.toString() || '');
  const [sulphur, setSulphur] = useState(currentSoilData?.sulphur?.toString() || '');
  const [reportDate, setReportDate] = useState(currentSoilData?.reportDate || '');
  const [labName, setLabName] = useState(currentSoilData?.labName || '');

  // Synchronize fields when modal opens or currentSoilData changes
  React.useEffect(() => {
    if (isOpen) {
      setFile(null);
      setUploadError(null);
      setSummaryHindi('');
      setPh(currentSoilData?.ph?.toString() || '');
      setEc(currentSoilData?.ec?.toString() || '');
      setOc(currentSoilData?.organicCarbon?.toString() || '');
      setNitrogen(currentSoilData?.nitrogen?.toString() || '');
      setPhosphorus(currentSoilData?.phosphorus?.toString() || '');
      setPotassium(currentSoilData?.potassium?.toString() || '');
      setZinc(currentSoilData?.zinc?.toString() || '');
      setSulphur(currentSoilData?.sulphur?.toString() || '');
      setReportDate(currentSoilData?.reportDate || '');
      setLabName(currentSoilData?.labName || '');
    }
  }, [isOpen, currentSoilData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        setUploadError('File ka size 5MB se kam hona chahiye.');
        return;
      }
      setFile(selected);
      setUploadError(null);
    }
  };

  const handleProcessPdf = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await api.uploadSoilPdf(file);
      const data = res.extractedData;
      setPh(data.ph !== null && data.ph !== undefined ? data.ph.toString() : '');
      setEc(data.ec !== null && data.ec !== undefined ? data.ec.toString() : '');
      setOc(data.organicCarbon !== null && data.organicCarbon !== undefined ? data.organicCarbon.toString() : '');
      setNitrogen(data.nitrogen !== null && data.nitrogen !== undefined ? data.nitrogen.toString() : '');
      setPhosphorus(data.phosphorus !== null && data.phosphorus !== undefined ? data.phosphorus.toString() : '');
      setPotassium(data.potassium !== null && data.potassium !== undefined ? data.potassium.toString() : '');
      setZinc(data.zinc !== null && data.zinc !== undefined ? data.zinc.toString() : '');
      setSulphur(data.sulphur !== null && data.sulphur !== undefined ? data.sulphur.toString() : '');
      setReportDate(data.reportDate || '');
      setLabName(data.labName || '');
      setSummaryHindi(data.summaryHindi || '');
    } catch (err: any) {
      setUploadError(err.message || 'PDF se data padhne mein samasya aayi. Aap neeche hath se maan bhar sakte hain.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmSave = async () => {
    const validated: SoilData = {
      ph: ph ? parseFloat(ph) : null,
      ec: ec ? parseFloat(ec) : null,
      organicCarbon: oc ? parseFloat(oc) : null,
      nitrogen: nitrogen ? parseFloat(nitrogen) : null,
      phosphorus: phosphorus ? parseFloat(phosphorus) : null,
      potassium: potassium ? parseFloat(potassium) : null,
      zinc: zinc ? parseFloat(zinc) : null,
      sulphur: sulphur ? parseFloat(sulphur) : null,
      reportDate: reportDate || null,
      labName: labName || null,
      isManual: !file,
    };

    try {
      await api.confirmSoilData(validated);
      onSoilConfirmed(validated);
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Save karne mein error hua.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base sm:text-lg">
              {STRINGS.soilModalTitle}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {/* PDF Upload Box */}
          <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl p-4 text-center">
            <UploadCloud className="w-8 h-8 text-emerald-700 mx-auto mb-1.5" />
            <p className="font-semibold text-emerald-950 text-xs sm:text-sm">
              {STRINGS.soilPdfUploadText}
            </p>
            <p className="text-gray-500 text-[11px] mb-3">
              {STRINGS.soilPdfSubtext}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <input
                type="file"
                accept="application/pdf"
                id="soil-pdf-input"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="soil-pdf-input"
                className="bg-white hover:bg-emerald-100 text-emerald-800 font-medium px-4 py-1.5 rounded-lg border border-emerald-300 cursor-pointer shadow-2xs text-xs"
              >
                {file ? file.name : STRINGS.choosePdfBtn}
              </label>

              {file && (
                <button
                  type="button"
                  onClick={handleProcessPdf}
                  disabled={isUploading}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold px-4 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5 text-xs"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{isUploading ? STRINGS.readingPdf : STRINGS.extractDataBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Upload / Extraction alerts */}
          {uploadError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-lg flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {summaryHindi && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-lg text-xs">
              <p className="font-semibold mb-0.5">Summary:</p>
              <p>{summaryHindi}</p>
            </div>
          )}

          {/* Extracted & Verified Values Form */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {STRINGS.verifiedValuesHeader}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.phLabel}</label>
                <input
                  type="number"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  placeholder="jaise 7.6"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.ecLabel}</label>
                <input
                  type="number"
                  step="0.01"
                  value={ec}
                  onChange={(e) => setEc(e.target.value)}
                  placeholder="jaise 0.45"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.ocLabel}</label>
                <input
                  type="number"
                  step="0.01"
                  value={oc}
                  onChange={(e) => setOc(e.target.value)}
                  placeholder="jaise 0.55"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.nLabel}</label>
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  placeholder="jaise 240"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.pLabel}</label>
                <input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  placeholder="jaise 18"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.kLabel}</label>
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  placeholder="jaise 290"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.znLabel}</label>
                <input
                  type="number"
                  step="0.1"
                  value={zinc}
                  onChange={(e) => setZinc(e.target.value)}
                  placeholder="jaise 0.6"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.sLabel}</label>
                <input
                  type="number"
                  step="0.1"
                  value={sulphur}
                  onChange={(e) => setSulphur(e.target.value)}
                  placeholder="jaise 8.5"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.reportDateLabel}</label>
                <input
                  type="text"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  placeholder="jaise 15-09-2024"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-600 font-medium mb-1">{STRINGS.labNameLabel}</label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="jaise KVK Sehore"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-600 hover:text-gray-800 font-medium px-3 py-1.5"
          >
            {STRINGS.cancelBtn}
          </button>
          <button
            type="button"
            onClick={handleConfirmSave}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm shadow-sm transition-all"
          >
            {STRINGS.confirmSaveSoilBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
