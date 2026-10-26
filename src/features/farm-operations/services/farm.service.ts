
import { apiClient } from "@/services/apiClient";
import type {
  Farm,
  SoilSensor,
  RegisterFarmPayload,
} from "../types/farm.types";

export const getFarms = async (): Promise<Farm[]> => {
  const res = await apiClient.get("/farms");
  return res.data?.data ?? res.data ?? [];
};

export const getFarmById = async (id: string): Promise<Farm> => {
  const res = await apiClient.get(`/farms/${id}`);
  return res.data?.data ?? res.data;
};

export const registerFarm = async (p: RegisterFarmPayload): Promise<Farm> => {
  const res = await apiClient.post("/farms", p);
  return res.data?.data ?? res.data;
};

export const getFarmSensors = async (farmId: string): Promise<SoilSensor[]> => {
  const res = await apiClient.get(`/sensors/farm/${farmId}`);
  return res.data?.data ?? res.data ?? [];
};

