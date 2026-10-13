/**
 * @file farm.types.ts
 * @owner Alen
 * @feature Farm Operations & IoT Ground Sensors
 */

export type AgroEcologicalZone =
  | "DEGA"
  | "WOYNA_DEGA"
  | "KOLLA"
  | "BEREHA"
  | "WURCH";
export type SensorStatus = "OPTIMAL" | "DRY_STRESS" | "SATURATED" | "OFFLINE";

export interface Farm {
  id: string;
  name: string;
  ownerId: string;
  woredaId: string;
  kebeleId: string;
  areaHectares: number;
  agroEcologicalZone: AgroEcologicalZone;
  primaryCrop: string;
  coordinates: { latitude: number; longitude: number };
  boundaryGeoJson?: unknown;
}

export interface SoilSensor {
  id: string;
  farmId: string;
  deviceSerial: string;
  depthCm: number;
  soilMoistureVwcPct: number;
  soilTemperatureC: number;
  batteryPct: number;
  status: SensorStatus;
}

export type RegisterFarmPayload = Omit<Farm, "id" | "ownerId">;

export {};
