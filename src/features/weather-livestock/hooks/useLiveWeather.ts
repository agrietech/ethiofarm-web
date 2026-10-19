/**
 * @file useLiveWeather.ts
 * @owner Banchamlak
 * @description Manages satellite observation state for a woreda or all woredas
 */

import { useState, useCallback } from 'react';
import {
  getSatelliteObservations,
  getWoredaSatelliteData,
} from '../services/weather-livestock.service';
import type { SatelliteObservation } from '../types/weather-livestock.types';

interface UseLiveWeatherReturn {
  observations: SatelliteObservation[];
  loading: boolean;
  error: string | null;
  fetchWeather: (woredaId?: string) => Promise<void>;
}

export const useLiveWeather = (): UseLiveWeatherReturn => {
  const [observations, setObservations] = useState<SatelliteObservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (woredaId?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = woredaId
        ? await getWoredaSatelliteData(woredaId)
        : await getSatelliteObservations();
      setObservations(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load satellite data. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { observations, loading, error, fetchWeather };
};
