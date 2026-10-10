/**
 * @file weather-livestock.service.ts
 * @owner Banchamlak
 * @description API calls wired to real AgriEtech backend endpoints
 */

import { apiClient } from '../../../services/apiClient';
import type { ApiResponse } from '../../../types/common.types';
import type {
  AlertModel,
  CreateAlertRequest,
  AlertStatistics,
  RiskAssessment,
  RiskStatistics,
  SatelliteObservation,
} from '../types/weather-livestock.types';

// ---------------------------------------------------------------------------
// Alerts  —  /api/v1/alerts
// ---------------------------------------------------------------------------

export const getAlerts = async (): Promise<AlertModel[]> => {
  const res = await apiClient.get<ApiResponse<AlertModel[]>>('/alerts');
  return res.data.data;
};

export const getActiveAlerts = async (): Promise<AlertModel[]> => {
  const res = await apiClient.get<ApiResponse<AlertModel[]>>('/alerts/active');
  return res.data.data;
};

export const getAlertById = async (id: string): Promise<AlertModel> => {
  const res = await apiClient.get<ApiResponse<AlertModel>>(`/alerts/${id}`);
  return res.data.data;
};

export const createAlert = async (
  payload: CreateAlertRequest
): Promise<AlertModel> => {
  const res = await apiClient.post<ApiResponse<AlertModel>>('/alerts', payload);
  return res.data.data;
};

export const markAlertAsRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/alerts/${id}/read`);
};

// ---------------------------------------------------------------------------
// Risk Assessments  —  /api/v1/risk-assessments
// ---------------------------------------------------------------------------

export const getLatestRiskAssessments = async (): Promise<RiskAssessment[]> => {
  const res = await apiClient.get<ApiResponse<RiskAssessment[]>>(
    '/risk-assessments/latest'
  );
  return res.data.data;
};

export const getWoredaRiskAssessments = async (
  woredaId: string
): Promise<RiskAssessment[]> => {
  const res = await apiClient.get<ApiResponse<RiskAssessment[]>>(
    `/risk-assessments/woreda/${woredaId}`
  );
  return res.data.data;
};

export const getRiskStatistics = async (): Promise<RiskStatistics> => {
  const res = await apiClient.get<ApiResponse<RiskStatistics>>(
    '/risk-assessments/statistics'
  );
  return res.data.data;
};

// ---------------------------------------------------------------------------
// Satellite Observations  —  /api/v1/satellite-observations
// ---------------------------------------------------------------------------

export const getSatelliteObservations = async (): Promise<
  SatelliteObservation[]
> => {
  const res = await apiClient.get<ApiResponse<SatelliteObservation[]>>(
    '/satellite-observations'
  );
  return res.data.data;
};

export const getWoredaSatelliteData = async (
  woredaId: string
): Promise<SatelliteObservation[]> => {
  const res = await apiClient.get<ApiResponse<SatelliteObservation[]>>(
    `/satellite-observations/woreda/${woredaId}`
  );
  return res.data.data;
};

// ---------------------------------------------------------------------------
// Alert statistics (derived client-side from alert list)
// ---------------------------------------------------------------------------

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
