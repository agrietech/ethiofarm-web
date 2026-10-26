
import React from 'react';
import { Thermometer, Droplets, Wind, Leaf, Sun } from 'lucide-react';
import type { WeatherForecast } from '../types/weather-livestock.types';

const CONDITION_EMOJI: Record<string, string> = {
  sunny: '☀️', partlyCloudy: '⛅', cloudy: '☁️',
  rainy: '🌧️', drizzle: '🌦️', thunderstorm: '⛈️',
  frost: '❄️', fog: '🌫️',
};
const condEmoji = (type?: string) => CONDITION_EMOJI[type ?? ''] ?? '🌤️';

interface WeatherWidgetProps {
  forecast: WeatherForecast;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ forecast }) => {
  const { locationName, current, hourly, daily } = forecast;
  const next24 = hourly.slice(0, 24);

  const temps = next24.map((h) => h.temperatureC);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="weather-hero">
        <div className="live-pill" style={{ marginBottom: '0.875rem' }}>
          <span className="live-dot" style={{ background: '#38BDF8' }} />
          OPEN-METEO · LIVE TELEMETRY
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div className="weather-hero-label">{locationName}</div>
            <div className="weather-hero-temp">{current.temperatureC.toFixed(1)}°C</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
              {condEmoji(current.conditionType)} {current.conditionEn}
              {current.conditionAm && ` · ${current.conditionAm}`}
            </div>
          </div>
          {(current.maxTempC !== undefined && current.minTempC !== undefined) && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>H / L</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>
                {current.maxTempC.toFixed(0)}° / {current.minTempC.toFixed(0)}°
              </div>
            </div>
          )}
        </div>

        <div className="weather-stats-row">
          <div className="weather-stat">
            <Droplets size={18} color="rgba(255,255,255,0.85)" />
            <span className="weather-stat-label">Humidity</span>
            <span className="weather-stat-value">{current.relativeHumidity}%</span>
          </div>
          <div className="weather-stat">
            <Wind size={18} color="rgba(255,255,255,0.85)" />
            <span className="weather-stat-label">Wind</span>
            <span className="weather-stat-value">{current.windSpeedKmh.toFixed(1)} km/h</span>
          </div>
          <div className="weather-stat">
            <Droplets size={18} color="rgba(255,255,255,0.85)" />
            <span className="weather-stat-label">Rain</span>
            <span className="weather-stat-value">{current.precipitationMm.toFixed(1)} mm</span>
          </div>
          {current.uvIndex !== undefined && (
            <div className="weather-stat">
              <Sun size={18} color="rgba(255,255,255,0.85)" />
              <span className="weather-stat-label">UV Index</span>
              <span className="weather-stat-value">{current.uvIndex.toFixed(1)}</span>
            </div>
          )}
          {current.et0EvapotranspirationMm !== undefined && (
            <div className="weather-stat">
              <Leaf size={18} color="rgba(255,255,255,0.85)" />
              <span className="weather-stat-label">ET₀</span>
              <span className="weather-stat-value">{current.et0EvapotranspirationMm.toFixed(1)} mm</span>
            </div>
          )}
          {current.feelsLikeC !== undefined && (
            <div className="weather-stat">
              <Thermometer size={18} color="rgba(255,255,255,0.85)" />
              <span className="weather-stat-label">Feels Like</span>
              <span className="weather-stat-value">{current.feelsLikeC.toFixed(1)}°</span>
            </div>
          )}
        </div>
      </div>

      {next24.length > 0 && (
        <div className="section-card">
          <h4 className="section-label">24-Hour Forecast</h4>
          <div className="chart-scroll">
            {next24.map((point, idx) => {
              const barH = ((point.temperatureC - minT) / range) * 48 + 10;
              return (
                <div key={idx} className="chart-bar-item">
                  <span className="chart-bar-label">{point.hourLabel}</span>
                  <span style={{ fontSize: '1rem' }} role="img" aria-label={point.conditionEn}>
                    {condEmoji(point.conditionType)}
                  </span>
                  <div className="chart-bar" style={{ height: barH }} title={`${point.temperatureC}°C`} />
                  <span className="chart-bar-value">{point.temperatureC.toFixed(0)}°</span>
                  {point.precipitationProbability > 20 && (
                    <span style={{ fontSize: '0.62rem', color: '#60a5fa' }}>
                      {point.precipitationProbability}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {daily.length > 0 && (
        <div className="section-card">
          <h4 className="section-label">7-Day Outlook</h4>
          <div className="forecast-list">
            {daily.slice(0, 7).map((day, idx) => {
              const label = day.isToday ? 'Today'
                : new Date(day.date).toLocaleDateString('en-ET', { weekday: 'short', day: 'numeric', month: 'short' });
              return (
                <div key={idx} className="forecast-day">
                  <div className="forecast-day-icon">
                    <span style={{ fontSize: '1.4rem' }} role="img" aria-label={day.conditionEn}>
                      {condEmoji(day.conditionType)}
                    </span>
                  </div>
                  <span className="forecast-day-label">{label}</span>
                  <span className="forecast-day-rain">
                    💧 {day.precipitationMm.toFixed(1)} mm
                  </span>
                  <span className="forecast-day-temp">
                    {day.maxTempC.toFixed(0)}° / {day.minTempC.toFixed(0)}°
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
