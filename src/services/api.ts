import { FarmProfile, NextQuestion, ComparisonResponse, Plan, SoilData, MandiAdviceResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://gdg-qyvl.onrender.com/api';
const SESSION_STORAGE_KEY = 'kisan_ai_session_id';

function getSessionId(): string | null {
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

function saveSessionId(id: string) {
  if (id) {
    localStorage.setItem(SESSION_STORAGE_KEY, id);
  }
}

export function clearSessionId() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const sessionId = getSessionId();
  const headers = new Headers(options.headers || {});

  if (sessionId) {
    headers.set('x-session-id', sessionId);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const newSessionId = response.headers.get('x-session-id');
  if (newSessionId) {
    saveSessionId(newSessionId);
  }

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || 'Server se sampark karne mein error hua.');
  }

  return data as T;
}

export const api = {
  async initSession(): Promise<{
    sessionId: string;
    farmerName: string;
    profile: FarmProfile;
    nextQuestion: NextQuestion | null;
    activePlan: Plan | null;
  }> {
    return request('/session/init');
  },

  async sendIntakeMessage(message: string): Promise<{
    profile: FarmProfile;
    assistantResponse: string;
    nextQuestion: NextQuestion | null;
    extracted?: Partial<FarmProfile>;
    mandiAdvice?: MandiAdviceResponse;
    isSellingIntent?: boolean;
  }> {
    return request('/farm/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async updateFarmProfile(updateData: Partial<FarmProfile>): Promise<{
    profile: FarmProfile;
    nextQuestion: NextQuestion | null;
  }> {
    return request('/farm/profile', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  async resetFarmProfile(): Promise<{
    profile: FarmProfile;
    nextQuestion: NextQuestion | null;
  }> {
    return request('/farm/reset', {
      method: 'POST',
    });
  },

  async uploadSoilPdf(file: File): Promise<{
    success: boolean;
    extractedData: SoilData & { summaryHindi?: string };
    fileName: string;
  }> {
    const formData = new FormData();
    formData.append('soilPdf', file);
    return request('/soil/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async confirmSoilData(soilData: Partial<SoilData>): Promise<{
    profile: FarmProfile;
    message: string;
  }> {
    return request('/soil/confirm', {
      method: 'POST',
      body: JSON.stringify(soilData),
    });
  },

  async getCropComparison(): Promise<{
    data: ComparisonResponse;
  }> {
    return request('/comparison');
  },

  async selectCropAndCreatePlan(cropKey: string, scenario: string = 'base'): Promise<{
    plan: Plan;
    message: string;
    profile?: FarmProfile;
  }> {
    return request('/plan/select', {
      method: 'POST',
      body: JSON.stringify({ cropKey, scenario }),
    });
  },

  async getActivePlan(): Promise<{
    plan: Plan | null;
  }> {
    return request('/plan/active');
  },

  async sendFollowUp(question: string): Promise<{
    question: string;
    answer: string;
    plan: Plan;
  }> {
    return request('/plan/followup', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  },

  async sendAudioRecording(audioBlob: Blob, filename = 'recording.webm'): Promise<{
    transcript: string;
    assistantResponse: string;
    profile: FarmProfile;
    nextQuestion: NextQuestion | null;
    spokenSummary?: string;
  }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, filename);
    return request('/voice/transcribe', {
      method: 'POST',
      body: formData,
    });
  },

  async synthesizeSpeech(text: string): Promise<{
    spokenSummary: string;
  }> {
    return request('/voice/synthesize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async getMandiAdvice(crop: string, quantityQuintals: number, origin?: string): Promise<{
    success: boolean;
    data: MandiAdviceResponse;
  }> {
    return request('/mandi/advice', {
      method: 'POST',
      body: JSON.stringify({ crop, quantityQuintals, origin }),
    });
  },
};

