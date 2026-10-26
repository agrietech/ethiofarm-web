
import { apiClient } from '@/services/apiClient';
import type { ApiResponse } from '@/types/common.types';
import type {
  DAEscalationStatus,
  DiagnoseRequestPayload,
  DiagnosisRecord,
  DiseaseDiagnosisResponse,
  DiseaseSeverity,
  TreatmentRecommendation,
} from '../types/crop-pathology.types';

const BASE_PATH = '/diagnosis';

// Gemini analysis routinely exceeds the default 15s client timeout.
const AI_SCAN_TIMEOUT_MS = 60_000;

// Backend may return either the legacy flat shape or the enriched advisory shape.
type RawDiagnosis = Omit<DiseaseDiagnosisResponse, 'treatment'> & {
  treatment?: string | Partial<TreatmentRecommendation> | null;
  severity?: DiseaseSeverity | null;
  symptoms?: string[] | null;
  daEscalationStatus?: DAEscalationStatus | null;
};

type MaybeEnveloped<T> = ApiResponse<T> | T;

function unwrap<T>(body: MaybeEnveloped<T>): T {
  if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
    return (body as ApiResponse<T>).data;
  }
  return body as T;
}

function normalizeConfidence(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 0;
  const ratio = value > 1 ? value / 100 : value;
  return Math.min(Math.max(ratio, 0), 1);
}

function deriveSeverity(raw: RawDiagnosis): DiseaseSeverity {
  if (raw.severity) return raw.severity;
  if (/healthy|no disease/i.test(raw.diseaseDetected ?? '')) return 'NONE';
  return 'MODERATE';
}

function toTreatment(raw: RawDiagnosis): TreatmentRecommendation {
  const { treatment, recommendations } = raw;
  if (treatment && typeof treatment === 'object') {
    return {
      organicControl: treatment.organicControl ?? [],
      chemicalControl: treatment.chemicalControl ?? [],
      preventiveMeasures: treatment.preventiveMeasures ?? recommendations ?? [],
      primaryCooperativeSourcing: treatment.primaryCooperativeSourcing ?? '',
    };
  }
  return {
    organicControl: [],
    chemicalControl: treatment ? [treatment] : [],
    preventiveMeasures: recommendations ?? [],
    primaryCooperativeSourcing: '',
  };
}

function toDiagnosisRecord(raw: RawDiagnosis): DiagnosisRecord {
  return {
    id: raw.id,
    cropName: raw.cropType,
    imageUrl: raw.imageUrl ?? '',
    diseaseIdentified: raw.diseaseDetected,
    confidenceScore: normalizeConfidence(raw.confidence),
    severity: deriveSeverity(raw),
    symptoms: raw.symptoms ?? (raw.description ? [raw.description] : []),
    treatment: toTreatment(raw),
    daEscalationStatus: raw.daEscalationStatus ?? 'NOT_ESCALATED',
    diagnosedAt: raw.createdAt,
  };
}

function toRawList(body: MaybeEnveloped<RawDiagnosis[] | { items: RawDiagnosis[] }>): RawDiagnosis[] {
  const data = unwrap(body);
  return Array.isArray(data) ? data : data?.items ?? [];
}

export const cropPathologyService = {
  async scanLeaf(payload: DiagnoseRequestPayload): Promise<DiagnosisRecord> {
    const form = new FormData();
    form.append('image', payload.imageFile);
    form.append('cropHint', payload.cropHint);
    if (payload.farmId) form.append('farmId', payload.farmId);

    const { data } = await apiClient.post<MaybeEnveloped<RawDiagnosis>>(`${BASE_PATH}/scan`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: AI_SCAN_TIMEOUT_MS,
    });
    return toDiagnosisRecord(unwrap(data));
  },

  async getHistory(): Promise<DiagnosisRecord[]> {
    const { data } = await apiClient.get<MaybeEnveloped<RawDiagnosis[] | { items: RawDiagnosis[] }>>(
      `${BASE_PATH}/history`,
    );
    return toRawList(data).map(toDiagnosisRecord);
  },

  async getDiagnosisById(id: string): Promise<DiagnosisRecord> {
    const { data } = await apiClient.get<MaybeEnveloped<RawDiagnosis>>(
      `${BASE_PATH}/${encodeURIComponent(id)}`,
    );
    return toDiagnosisRecord(unwrap(data));
  },

  async escalateToDA(id: string, notes: string): Promise<DiagnosisRecord> {
    const { data } = await apiClient.post<MaybeEnveloped<RawDiagnosis>>(
      `${BASE_PATH}/${encodeURIComponent(id)}/escalate`,
      { notes },
    );
    return toDiagnosisRecord(unwrap(data));
  },
};
