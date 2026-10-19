/**
 * @file useFarms.ts
 * @owner Alen
 * @feature Farm Operations & IoT Ground Sensors
 */

import { useCallback, useState } from "react";
import { getFarms } from "../services/farm.service";
import type { Farm } from "../types/farm.types";

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFarms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setFarms(await getFarms());
    } catch {
      setError("Could not load farms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { farms, loading, error, fetchFarms };
}

export {};
