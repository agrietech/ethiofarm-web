/**
 * @file weather-livestock.types.ts
 * @owner Banchamlak
 * @description Data contracts matching the real AgriEtech backend schema
 *   — Alerts:             /api/v1/alerts
 *   — Risk Assessments:   /api/v1/risk-assessments
 *   — Satellite/Weather:  /api/v1/satellite-observations
 */

// ---------------------------------------------------------------------------
// Alerts (Early Warning)
// ---------------------------------------------------------------------------

export type HazardType =
  | 'DROUGHT'
  | 'FLOOD'
  | 'LOCUST_PEST'
  | 'VEGETATION_STRESS'
  | 'FROST'
  | 'HEAT_STRESS';

export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface AlertWoreda {
  id: string;
  name: string;
}

export interface AlertModel {
  id: string;
  hazardType: HazardType;
  severity: AlertSeverity;
  title: string;
  message: string;
  actionItems: string[];
  priority: number;
  isActive: boolean;
  isRead: boolean;
  woreda?: AlertWoreda;
  validUntil?: string; // ISO 8601
  createdAt: string;   // ISO 8601
}

export interface CreateAlertRequest {
  hazardType: HazardType;
  severity: AlertSeverity;
  headline: string;
  message: string;
  woredaName?: string;
  actionItems?: string[];
  priority?: number;
  language?: 'en' | 'am';
}

export interface AlertStatistics {
  total: number;
  active: number;
  unread: number;
  critical: number;
  byHazardType: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Risk Assessments (Multi-Hazard)
// ---------------------------------------------------------------------------

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskAssessment {
  id: string;
  woredaId: string;
  woredaName?: string;
  overallRisk: RiskLevel;
  droughtRisk: RiskLevel;
  floodRisk: RiskLevel;
  locustRisk: RiskLevel;
  vegetationStress: RiskLevel;
  assessedAt: string; // ISO 8601
  notes?: string;
}

export interface RiskStatistics {
  total: number;
  bySeverity: Record<RiskLevel, number>;
  mostAffectedWoreda?: string;
}

// ---------------------------------------------------------------------------
// Satellite Observations (Weather / NDVI / CHIRPS)
// ---------------------------------------------------------------------------

export interface SatelliteObservation {
  id: string;
  woredaId: string;
  woredaName?: string;
  observedAt: string;          // ISO 8601
  chirpsRainfallMm?: number;   // CHIRPS daily/dekadal rainfall
  nasaPowerTempC?: number;     // NASA POWER temperature
  ndvi?: number;               // Sentinel-2 NDVI (−1 to +1)
  soilMoisturePct?: number;    // SAR soil moisture
  gloFasDischarge?: number;    // GloFAS river discharge m³/s
  elevationM?: number;
}
