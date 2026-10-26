
import { useCallback, useState } from "react";
import { getFarmSensors } from "../services/farm.service";
import type { SoilSensor } from "../types/farm.types";

export function useSensorTelemetry() {
  const [sensors, setSensors] = useState<SoilSensor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = useCallback(async (farmId: string) => {
    setLoading(true);
    setError(null);
    try {
      setSensors(await getFarmSensors(farmId));
    } catch {
      setError("Could not load sensor data.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { sensors, loading, error, fetchSensors };
}

export {};
