

// Values match the cropHint strings the backend expects (same as the mobile app).
export type CropType = 'Teff' | 'Coffee' | 'Maize' | 'Wheat' | 'Barley';

// Mirrors the mobile app's risk levels; NONE = healthy plant.
export type DiseaseSeverity = 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DAEscalationStatus = 'NOT_ESCALATED' | 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED';

export interface TreatmentRecommendation {
  organicControl: string[];
  chemicalControl: string[];
  preventiveMeasures: string[];
  primaryCooperativeSourcing: string;
}

export interface DiagnosisRecord {
  id: string;
  cropName: string;
  imageUrl: string;
  diseaseIdentified: string;
  /** 0–1 probability returned by the AI model */
  confidenceScore: number;
  severity: DiseaseSeverity;
  symptoms: string[];
  treatment: TreatmentRecommendation;
  daEscalationStatus: DAEscalationStatus;
  /** ISO timestamp of when the scan was made */
  diagnosedAt: string;
}

export interface DiagnoseRequestPayload {
  imageFile: File;
  cropHint: CropType;
  farmId: string;
}

// Raw record returned by /disease-diagnosis endpoints; the service maps it to DiagnosisRecord.
export interface DiseaseDiagnosisResponse {
  id: string;
  userId: string;
  farmId?: string | null;
  cropType: string;
  diseaseDetected: string;
  description?: string | null;
  confidence?: number | null;
  recommendations?: string[] | null;
  treatment?: string | null;
  imageUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

