/**
 * @file weather-livestock.types.ts
 * @owner Banchamlak
 * @description Data contracts matching the real AgriEtech backend schema
 *   Weather:       GET /api/v1/weather/forecast
 *   Alerts:        GET /api/v1/alerts
 *   Risk:          GET /api/v1/risk-assessments
 *   Animal Health: GET /api/v1/animal-health/*
 */

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

export interface HourlyWeatherPoint {
  time: string;
  hourLabel: string;
  temperatureC: number;
  precipitationProbability: number;
  relativeHumidity: number;
  windSpeedKmh: number;
  conditionEn: string;
  conditionAm?: string;
  conditionType: string;
}

export interface DailyWeatherPoint {
  date: string;
  maxTempC: number;
  minTempC: number;
  precipitationMm: number;
  precipitationProbability: number;
  windSpeedKmh: number;
  uvIndex: number;
  conditionEn: string;
  conditionAm?: string;
  conditionType: string;
  et0EvapotranspirationMm?: number;
  sunrise?: string;
  sunset?: string;
  isToday?: boolean;
}

export interface CurrentWeather {
  temperatureC: number;
  maxTempC?: number;
  minTempC?: number;
  feelsLikeC?: number;
  relativeHumidity: number;
  precipitationMm: number;
  windSpeedKmh: number;
  conditionEn: string;
  conditionAm?: string;
  conditionType: string;
  uvIndex?: number;
  et0EvapotranspirationMm?: number;
  isDay?: boolean;
  sunrise?: string;
  sunset?: string;
}

export interface WeatherForecast {
  locationName: string;
  current: CurrentWeather;
  hourly: HourlyWeatherPoint[];
  daily: DailyWeatherPoint[];
}

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
  validUntil?: string;
  createdAt: string;
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
// Risk Assessments
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
  assessedAt: string;
  notes?: string;
}

export interface RiskStatistics {
  total: number;
  bySeverity: Record<RiskLevel, number>;
  mostAffectedWoreda?: string;
}

// ---------------------------------------------------------------------------
// Animal Health & Livestock
// ---------------------------------------------------------------------------

export type LivestockSpecies = 'CATTLE' | 'SHEEP' | 'GOAT' | 'CAMEL' | 'POULTRY' | 'EQUINE';
export type HealthStatus = 'HEALTHY' | 'SICK' | 'QUARANTINED';
export type CampaignStatus = 'IN_PROGRESS' | 'COMPLETE' | 'BELOW_TARGET' | 'PLANNED';
export type OutbreakStatus = 'ACTIVE' | 'CONTAINED' | 'RESOLVED';

export interface LivestockRecord {
  id: string;
  woredaId: string;
  woredaName?: string;
  animalType: LivestockSpecies;
  breedName?: string;
  headCount: number;
  healthStatus: HealthStatus;
  notes?: string;
  registeredAt: string;
}

export interface VaccinationCampaign {
  id: string;
  woredaId: string;
  woredaName?: string;
  title?: string;
  diseaseTarget: string;
  animalType: LivestockSpecies;
  targetCount: number;
  vaccinatedCount: number;
  coveragePercent?: number;
  status: CampaignStatus;
  startDate?: string;
  endDate?: string;
  administeredBy?: string;
}

export interface AnimalOutbreak {
  id: string;
  woredaId: string;
  woredaName?: string;
  diseaseName: string;
  animalType: LivestockSpecies;
  suspectedCases: number;
  confirmedCases?: number;
  mortalities?: number;
  severity: AlertSeverity;
  status: OutbreakStatus;
  quarantineStatus?: boolean;
  reportedAt: string;
}

export interface PastureMonitoring {
  woredaId: string;
  woredaName?: string;
  biomassIndex: number;
  vegetationCondition: string;
  waterAvailability: string;
  droughtStress: boolean;
  grazingPressure: string;
  recommendedMove: string;
}

export interface AnimalHealthStats {
  activeOutbreaksCount: number;
  criticalCasesCount: number;
  totalAffectedLivestock: number;
  activeVaccinationCampaignsCount: number;
  totalVaccinatedCount: number;
  pastureConditionIndex: number;
  overallRiskLevel: RiskLevel;
  lastUpdated: string;
}

export interface NewLivestockPayload {
  woredaId?: string;
  animalType: LivestockSpecies;
  breedName?: string;
  headCount: number;
  healthStatus?: HealthStatus;
  notes?: string;
}
