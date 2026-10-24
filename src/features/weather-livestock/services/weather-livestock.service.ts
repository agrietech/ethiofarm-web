/**
 * @file weather-livestock.service.ts
 * @owner Banchamlak
 * @description API calls wired to real AgriEtech backend endpoints
 */

import { apiClient } from '../../../services/apiClient';
import type { ApiResponse } from '../../../types/common.types';
import type {
  WeatherForecast,
  AlertModel,
  CreateAlertRequest,
  AlertStatistics,
  RiskAssessment,
  RiskStatistics,
  LivestockRecord,
  NewLivestockPayload,
  VaccinationCampaign,
  AnimalOutbreak,
  PastureMonitoring,
  AnimalHealthStats,
} from '../types/weather-livestock.types';

// ---------------------------------------------------------------------------
// Weather  —  /api/v1/weather
// ---------------------------------------------------------------------------

export const getWeatherForecast = async (params?: {
  woredaId?: string;
  lat?: number;
  lng?: number;
  days?: number;
}): Promise<WeatherForecast> => {
  const res = await apiClient.get<ApiResponse<WeatherForecast>>(
    '/weather/forecast',
    { params: { days: 7, ...params } }
  );
  return res.data.data;
};

// ---------------------------------------------------------------------------
// Alerts  —  /api/v1/alerts
// ---------------------------------------------------------------------------

export const getAlerts = async (): Promise<AlertModel[]> => {
  const res = await apiClient.get<ApiResponse<AlertModel[]>>('/alerts');
  return res.data.data;
};

export const getAlertById = async (id: string): Promise<AlertModel> => {
  const res = await apiClient.get<ApiResponse<AlertModel>>(`/alerts/${id}`);
  return res.data.data;
};

export const createAlert = async (payload: CreateAlertRequest): Promise<AlertModel> => {
  const res = await apiClient.post<ApiResponse<AlertModel>>('/alerts', payload);
  return res.data.data;
};

export const markAlertAsRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/alerts/${id}/read`);
};

export const deriveAlertStats = (alerts: AlertModel[]): AlertStatistics => {
  const byHazardType: Record<string, number> = {};
  alerts.forEach((a) => {
    byHazardType[a.hazardType] = (byHazardType[a.hazardType] ?? 0) + 1;
  });
  return {
    total: alerts.length,
    active: alerts.filter((a) => a.isActive).length,
    unread: alerts.filter((a) => !a.isRead).length,
    critical: alerts.filter((a) => a.severity === 'CRITICAL').length,
    byHazardType,
  };
};

// ---------------------------------------------------------------------------
// Risk Assessments  —  /api/v1/risk-assessments
// ---------------------------------------------------------------------------

export const getLatestRiskAssessments = async (): Promise<RiskAssessment[]> => {
  const res = await apiClient.get<ApiResponse<RiskAssessment[]>>('/risk-assessments/latest');
  return res.data.data;
};

export const getWoredaRiskAssessments = async (woredaId: string): Promise<RiskAssessment[]> => {
  const res = await apiClient.get<ApiResponse<RiskAssessment[]>>(
    `/risk-assessments/woreda/${woredaId}`
  );
  return res.data.data;
};

export const getRiskStatistics = async (): Promise<RiskStatistics> => {
  const res = await apiClient.get<ApiResponse<RiskStatistics>>('/risk-assessments/statistics');
  return res.data.data;
};

// ---------------------------------------------------------------------------
// Animal Health  —  /api/v1/animal-health
// ---------------------------------------------------------------------------

export const getLivestock = async (woredaId?: string): Promise<LivestockRecord[]> => {
  const res = await apiClient.get<ApiResponse<LivestockRecord[]>>(
    '/animal-health/livestock',
    { params: woredaId ? { woredaId } : {} }
  );
  return res.data.data;
};

export const registerLivestock = async (payload: NewLivestockPayload): Promise<LivestockRecord> => {
  const res = await apiClient.post<ApiResponse<LivestockRecord>>('/animal-health/livestock', payload);
  return res.data.data;
};

export const getVaccinationCampaigns = async (woredaId?: string): Promise<VaccinationCampaign[]> => {
  const res = await apiClient.get<ApiResponse<VaccinationCampaign[]>>(
    '/animal-health/campaigns',
    { params: woredaId ? { woredaId } : {} }
  );
  return res.data.data;
};

export const getOutbreaks = async (woredaId?: string): Promise<AnimalOutbreak[]> => {
  const res = await apiClient.get<ApiResponse<AnimalOutbreak[]>>(
    '/animal-health/outbreaks',
    { params: woredaId ? { woredaId } : {} }
  );
  return res.data.data;
};

export const reportOutbreak = async (payload: {
  diseaseName: string;
  animalType: string;
  suspectedCases: number;
  mortalities?: number;
  severity: string;
  woredaId?: string;
  kebele?: string;
  quarantineStatus?: boolean;
}): Promise<AnimalOutbreak> => {
  const res = await apiClient.post<ApiResponse<AnimalOutbreak>>(
    '/animal-health/outbreaks',
    payload
  );
  return res.data.data;
};

export const getPastureMonitoring = async (woredaId?: string): Promise<PastureMonitoring[]> => {
  const res = await apiClient.get<ApiResponse<PastureMonitoring[]>>(
    '/animal-health/pasture',
    { params: woredaId ? { woredaId } : {} }
  );
  return res.data.data;
};

export const getAnimalHealthStats = async (woredaId?: string): Promise<AnimalHealthStats> => {
  const res = await apiClient.get<ApiResponse<AnimalHealthStats>>(
    '/animal-health/stats',
    { params: woredaId ? { woredaId } : {} }
  );
  return res.data.data;
};
