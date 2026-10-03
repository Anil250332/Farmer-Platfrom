/**
 * Centralized Hinglish UI Strings for Kisan Ai
 * Clean, natural Hindi written in Latin/English script
 */

export const STRINGS = {
  // Brand & Header
  appTitle: 'Kisan Ai',
  appSubtitle: 'Aapka Personal Fasal Salahkar',
  regionBadge: '',
  regionSubtext: '',
  voiceOn: 'Awaaz Chalu',
  voiceOff: 'Awaaz Band',
  newSession: 'Naya Session',
  confirmReset: 'Kya aap naye kisan ke liye profile reset karna chahte hain?',

  // Navigation Tabs
  tabChat: '1. Khet & Baat-cheet',
  tabComparison: '2. Fasal Tulna',
  tabPlan: '3. Meri Fasal Yojana',

  // Farm Summary Card
  farmDetails: 'Khet Ka Vivran (Farm Profile)',
  editBtn: 'Badlein (Edit)',
  saveBtn: 'Save Karein',
  cancelBtn: 'Cancel',
  totalArea: 'Kul Rakba (Area)',
  irrigation: 'Sinchai / Paani',
  sowingDate: 'Buwai Ka Time',
  prevCrop: 'Pichhli Fasal',
  budget: 'Anumanit Budget',
  soilCard: 'Mitti Jaanch (Soil Card)',
  soilConfirmed: 'Jaanch Verified',
  uploadSoilPdf: '+ Soil PDF Upload Karein',

  // Intake Chat
  welcomeGreeting: 'Ram-ram kisan bhai! Main Kisan Ai hoon, aapka personal crop-planning assistant. Apne khet ke baare mein batayein taaki hum sahi Rabi fasal chun sakein.',
  nextQuestionLabel: 'Agla Sawal (Next Question):',
  intakeCompleteBadge: 'Aapke khet ki jaankari poori ho gayi hai! Ab fasal tulna dekhein.',
  seeComparisonBtn: 'Fasal Tulna Dekhein',
  chatPlaceholder: 'Hinglish mein likhein (jaise: 5 acre zameen hai, tubewell ka paani hai)...',
  sendBtn: 'Bhejein',

  // Voice Recorder
  micStart: 'Mic dabakar bolein',
  micRecording: 'Recording chalu hai... Rokne ke liye dabayein',
  micProcessing: 'Awaaz samajh rahe hain...',
  micDenied: 'Microphone ki permission nahi mili. Kripya permission dein ya text likhkar bhejein.',

  // Soil Modal
  soilModalTitle: 'Mitti Jaanch Report (Soil Health Card)',
  soilPdfUploadText: 'Soil Test PDF Upload Karein (Max 5 MB)',
  soilPdfSubtext: 'Gemini AI aapki report se pH, EC, Carbon aur nutrients nikaal lega',
  choosePdfBtn: 'PDF File Chunein',
  extractDataBtn: 'Data Nikalein (Extract)',
  readingPdf: 'Padh rahe hain...',
  verifiedValuesHeader: 'Report ke mukhya maan (Check & Edit karein):',
  phLabel: 'pH Maan (Soil pH):',
  ecLabel: 'Vidyut Chalakta (EC dS/m):',
  ocLabel: 'Jaivik Carbon (Organic Carbon %):',
  nLabel: 'Nitrogen (N kg/ha):',
  pLabel: 'Phosphorus (P kg/ha):',
  kLabel: 'Potash (K kg/ha):',
  znLabel: 'Zinc (Zn ppm):',
  sLabel: 'Sulphur (S ppm):',
  reportDateLabel: 'Report Date:',
  labNameLabel: 'Lab Ka Naam:',
  confirmSaveSoilBtn: 'Satyapit Karein & Save Karein',

  // Crop Comparison
  scientificAdviceHeader: 'Krishi Vaigyanik Salah (Crop Analysis)',
  scenarioSelectorLabel: 'Financial Scenario Chunein:',
  scenarioLow: 'Nyuntam / MSP (Low)',
  scenarioBase: 'Modal / Market Average (Base)',
  scenarioHigh: 'Premium / High Grade (High)',
  sowingWindowLabel: 'Buwai Window:',
  waterLabel: 'Paani',
  estimatedProduction: 'Anumanit Utpadan:',
  marketPrice: 'Mandi Bhav (per quintal):',
  totalCostLabel: 'Kul Lagat (All Costs):',
  netProfitLabel: 'Anumanit Shuddh Munafa:',
  seedsCost: 'Beej Lagat:',
  fertilizerCost: 'Khaad & Poshan:',
  irrigationCost: 'Sinchai Kharch:',
  laborCost: 'Jutai, Katai & Shram:',
  pestCost: 'Keet & Kharpatwar:',
  benefitsLabel: 'Fayde:',
  cautionLabel: 'Mukhya Savdhani:',
  selectCropBtn: 'Yeh Fasal Chunein & Plan Banayein',

  // Mandi Table
  mandiRecordsTitle: 'Taaza Mandi Bhav Records (Agmarknet Live)',
  mandiSourceLabel: 'Source:',
  mandiUnitLabel: 'Unit:',
  mandiDisclaimer: '* Yeh bhav pichhle varshon ke aadhar par hain. Yeh bhavishya ke vikray mulya ki guarantee nahi hain.',

  // Climate Reference
  climateCardTitle: 'Rabi Mausam Reference & Forecast',
  climateSource: 'Source: Live Open-Meteo & IMD Agromet Advisory',
  climateDisclaimer: 'Dhyan dein: Yeh mausam aur mandi aakdon par aadharit anuman hai.',

  // Saved Plan
  activePlanBadge: 'Sakriya Fasal Yojana (Active Crop Plan)',
  outdatedPlanWarning: 'Dhyan dein: Aapne khet ke rakbe, paani ya budget mein badlav kiya hai. Nayi ganana ke liye recompute karein.',
  recomputeBtn: 'Punarganana Karein (Recompute)',
  changeCropBtn: 'Dusri Fasal Badlein',
  certifiedGuideHeader: 'Pramanit Krishi Nirdesh (Package of Practices)',
  soilPrepLabel: 'Khet Ki Taiyari:',
  seedRateLabel: 'Beej Dar & Upchar:',
  fertilizerGuideLabel: 'Khaad & Urvarak:',
  harvestWindowLabel: 'Katai Window:',
  irrigationScheduleHeader: 'Sinchai Time-Table & Kharch Vivran',
  stageTimelineHeader: 'Fasal Chakra Charan & Savdhaniyan (Stage Timeline)',

  // Follow-up Q&A
  followUpHeader: 'Fasal Yojana Par Sawal & Recalculation',
  frequentQuestions: 'Aksar pooche jaane wale sawal:',
  askBtn: 'Poochhein',
  followUpPlaceholder: 'Apna sawal ya naya rakba likhein (jaise: Agar 3 bigha lagau toh lagat kya hogi?)...',

  // Footer
  footerText: 'Kisan Ai — Personal Rabi Fasal Niyojan Sahayak',
  footerSources: 'Data Source: ICAR / Krishi Vibhag / Agmarknet Live',
};
