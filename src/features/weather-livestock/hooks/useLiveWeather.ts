
import { useState, useCallback } from 'react';
import { getWeatherForecast } from '../services/weather-livestock.service';
import type { WeatherForecast } from '../types/weather-livestock.types';

interface UseLiveWeatherReturn {
  weather: WeatherForecast | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (params?: { woredaId?: string; lat?: number; lng?: number }) => Promise<void>;
}

export const useLiveWeather = (): UseLiveWeatherReturn => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(
    async (params?: { woredaId?: string; lat?: number; lng?: number }): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWeatherForecast(params);
        setWeather(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to load weather data.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { weather, loading, error, fetchWeather };
};
