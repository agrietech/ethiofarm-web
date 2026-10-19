/**
 * @file farm.service.ts
 * @owner Alen
 * @feature Farm Operations & IoT Ground Sensors
 */

import { apiClient } from "@/services/apiClient";
import type {
  Farm,
  SoilSensor,
  RegisterFarmPayload,
} from "../types/farm.types";

export const getFarms = async (): Promise<Farm[]> =>
  (await apiClient.get("/api/v1/farms")).data;

export const getFarmById = async (id: string): Promise<Farm> =>
  (await apiClient.get(`/api/v1/farms/${id}`)).data;

export const registerFarm = async (p: RegisterFarmPayload): Promise<Farm> =>
  (await apiClient.post("/api/v1/farms", p)).data;

export const getFarmSensors = async (farmId: string): Promise<SoilSensor[]> =>
  (await apiClient.get(`/api/v1/sensors/farm/${farmId}`)).data;

export {};
