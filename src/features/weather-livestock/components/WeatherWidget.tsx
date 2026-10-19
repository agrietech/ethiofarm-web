/**
 * @file WeatherWidget.tsx
 * @owner Banchamlak
 * @description Satellite observation telemetry display — mirrors Flutter WeatherScreen
 *   Data source: /api/v1/satellite-observations (CHIRPS, NASA POWER, NDVI, GloFAS)
 */

import React from 'react';
import { Thermometer, Droplets, BarChart3, Waves, Leaf, Mountain } from 'lucide-react';
import type { SatelliteObservation } from '../types/weather-livestock.types';

interface WeatherWidgetProps {
  observation: SatelliteObservation;
}

const MetricTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="weather-stat" style={{ minWidth: 80 }}>
    <div style={{ color: 'rgba(255,255,255,0.85)' }}>{icon}</div>
    <span className="weather-stat-label">{label}</span>
    <span className="weather-stat-value">{value}</span>
  </div>
);

const ndviToLabel = (ndvi?: number): string => {
  if (ndvi == null) return 'N/A';
  if (ndvi >= 0.6) return 'Dense Vegetation';
  if (ndvi >= 0.4) return 'Moderate';
  if (ndvi >= 0.2) return 'Sparse';
  return 'Bare / Stressed';
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ observation }) => {
  const {
    nasaPowerTempC,
    chirpsRainfallMm,
    soilMoisturePct,
    gloFasDischarge,
    ndvi,
    elevationM,
    woredaName,
    observedAt,
  } = observation;

  const observedDate = (() => {
    try { return new Date(observedAt).toLocaleDateString('en-ET', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return observedAt; }
  })();

  return (
    <div className="weather-hero">
      {/* Live pill */}
      <div className="live-pill">
        <span className="live-dot" />
        SENTINEL-2 · NASA POWER · CHIRPS
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div className="weather-hero-label">
            {woredaName ? `${woredaName} Woreda` : 'Satellite Observation'}
          </div>
          <div className="weather-hero-temp">
            {nasaPowerTempC != null ? `${nasaPowerTempC.toFixed(1)}°C` : '--°C'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>Last updated</div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{observedDate}</div>
        </div>
      </div>

      <div className="weather-stats-row">
        {chirpsRainfallMm != null && (
          <MetricTile icon={<Droplets size={20} />} label="CHIRPS Rain" value={`${chirpsRainfallMm.toFixed(1)} mm`} color="white" />
        )}
        {soilMoisturePct != null && (
          <MetricTile icon={<BarChart3 size={20} />} label="Soil Moisture" value={`${soilMoisturePct.toFixed(1)}%`} color="white" />
        )}
        {ndvi != null && (
          <MetricTile icon={<Leaf size={20} />} label="NDVI" value={`${ndvi.toFixed(2)} · ${ndviToLabel(ndvi)}`} color="white" />
        )}
        {gloFasDischarge != null && (
          <MetricTile icon={<Waves size={20} />} label="GloFAS" value={`${gloFasDischarge.toFixed(1)} m³/s`} color="white" />
        )}
        {elevationM != null && (
          <MetricTile icon={<Mountain size={20} />} label="Elevation" value={`${elevationM.toFixed(0)} m`} color="white" />
        )}
        {nasaPowerTempC != null && (
          <MetricTile icon={<Thermometer size={20} />} label="Temperature" value={`${nasaPowerTempC.toFixed(1)}°C`} color="white" />
        )}
      </div>
    </div>
  );
};
