export interface SoilData {
  ph: number | null;
  ec: number | null;
  organicCarbon: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  zinc: number | null;
  sulphur: number | null;
  reportDate: string | null;
  labName: string | null;
  isManual?: boolean;
}

export interface FarmProfile {
  sessionId: string;
  district: string;
  village?: string;
  totalArea: number;
  areaUnit: string;
  intendedSowingDate: string;
  irrigationType: string;
  waterAvailability: string;
  budget: number;
  previousCrop: string;
  soilTestConfirmed: boolean;
  soilData: SoilData;
  intakeCompleted: boolean;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
}

export interface NextQuestion {
  field: string;
  questionHindi: string;
  options: string[];
}

export interface FinancialScenario {
  yieldPerAcre: number;
  totalProductionQuintals: number;
  pricePerQuintal: number;
  grossRevenue: number;
  totalCost: number;
  netReturn: number;
  returnOnInvestmentPercent: number;
}

export interface CropComparisonItem {
  cropKey: 'wheat' | 'chickpea' | 'mustard';
  nameHindi: string;
  variety: string;
  durationDays: string;
  sowingWindow: {
    start: string;
    end: string;
    optimalHindi: string;
    lateSowingAllowed?: boolean;
    lateDeadline?: string;
  };
  waterRequirements: {
    category: string;
    irrigationCountMin: number;
    irrigationCountOptimal: number;
    irrigationStages: Array<{
      stage: string;
      daysAfterSowing: number;
      description: string;
    }>;
    descriptionHindi: string;
  };
  costBreakdown: {
    seeds: number;
    fertilizers: number;
    irrigation: number;
    laborAndMachinery: number;
    plantProtection: number;
    total: number;
  };
  scenarios: {
    low: FinancialScenario;
    base: FinancialScenario;
    high: FinancialScenario;
  };
  suitabilityLevel: string;
  suitabilityChecks: Array<{
    factor: string;
    status: 'good' | 'warning' | 'neutral';
    message: string;
  }>;
  prosHindi: string[];
  consHindi: string[];
  mandiPriceHistory: {
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

export interface ComparisonResponse {
  districtInfo: {
    district: string;
    districtHindi: string;
    state: string;
    stateHindi: string;
    agroClimaticZone: string;
    primarySoilType: string;
    typicalSoilPhRange: { min: number; max: number };
    rabiSeasonMonths: string;
    supportedCropsHindi: string[];
  };
  farmerContext: {
    totalArea: number;
    areaUnit: string;
    normalizedAcres: number;
    waterAvailability: string;
    budget: number;
    soilConfirmed: boolean;
  };
  climateReference: Array<{
    month: string;
    avgMaxTempC: number;
    avgMinTempC: number;
    rainfallMm: number;
    historicalCondition: string;
    coverage: string;
  }>;
  liveWeather?: {
    success: boolean;
    location: string;
    currentTempC: number;
    humidityPercent: number;
    avgMaxTempC: number;
    avgMinTempC: number;
    rainForecast7DaysMm: number;
    conditionHindi: string;
    source: string;
    fetchedAt: string;
  };
  comparisons: CropComparisonItem[];
  aiExplanationHindi: string;
}


export interface Plan {
  sessionId: string;
  cropKey: string;
  cropNameHindi: string;
  variety: string;
  area: number;
  areaUnit: string;
  selectedScenario: 'low' | 'base' | 'high';
  financials: {
    yieldPerUnit: number;
    productionTotal: number;
    unitPrice: number;
    totalRevenue: number;
    totalCost: number;
    netReturn: number;
    costBreakdown: {
      seeds: number;
      fertilizers: number;
      irrigation: number;
      laborAndMachinery: number;
      plantProtection: number;
    };
  };
  agronomyPlan: {
    soilPreparation: string;
    sowingWindow: string;
    seedRate: string;
    fertilizerGuidance: string;
    irrigationSchedule: Array<{ stage: string; daysAfterSowing: number; description: string }>;
    stageBasedChecks: Array<{ stage: string; keyActivity: string; precaution: string }>;
    harvestWindow: string;
  };
  isOutdated?: boolean;
  followUpHistory: Array<{
    question: string;
    answer: string;
    timestamp?: string;
  }>;
}

export interface MandiRecord {
  market: string;
  district: string;
  state: string;
  commodity: string;
  variety?: string;
  grade?: string;
  modalPrice: number;
  priceDate: string;
  isStale?: boolean;
  staleDays?: number;
  distanceKm: number | null;
  distanceSource?: string;
  transportCost: number | null;
  mandiCharges: number;
  grossReceipts: number;
  estimatedNetReceipts: number | null;
  unresolvedLocation?: boolean;
}

export interface MandiAdviceResponse {
  success: boolean;
  error?: string;
  query?: {
    crop: string;
    quantityQuintals: number;
    originName: string;
    state: string;
  };
  topMandis: MandiRecord[];
  unresolvedMandis?: MandiRecord[];
  summaryHindi: string;
  staleWarning?: string;
  warningDisclaimer?: string;
  totalCandidatesCount?: number;
  cached?: boolean;
  fetchWarning?: string;
}

