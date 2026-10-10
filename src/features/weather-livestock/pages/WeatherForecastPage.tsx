/**
 * @file WeatherForecastPage.tsx
 * @owner Banchamlak
 * @description Satellite observation dashboard — mirrors Flutter WeatherScreen
 *   Data: /api/v1/satellite-observations (CHIRPS rainfall, NASA POWER temp, NDVI, GloFAS)
 */

import React, { useEffect, useState } from 'react';
import { Satellite, RefreshCw, AlertCircle, Search } from 'lucide-react';
import { useLiveWeather } from '../hooks/useLiveWeather';
import { WeatherWidget } from '../components/WeatherWidget';

// ---------------------------------------------------------------------------
// NDVI bar chart helper
// ---------------------------------------------------------------------------

const NdviBar: React.FC<{ value: number }> = ({ value }) => {
  // NDVI ranges from -1 to +1; display 0–1 range
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const color = value >= 0.6 ? '#10B981' : value >= 0.4 ? '#4CAF50' : value >= 0.2 ? '#F59E0B' : '#DC2626';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div className="progress-track" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color, minWidth: 36 }}>{value.toFixed(2)}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const WeatherForecastPage: React.FC = () => {
  const { observations, loading, error, fetchWeather } = useLiveWeather();
  const [woredaInput, setWoredaInput] = useState('');
  const [woredaSearch, setWoredaSearch] = useState('');

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = woredaInput.trim();
    setWoredaSearch(v);
    fetchWeather(v || undefined);
  };

  // Most recent observation to show in the hero widget
  const latest = observations[0] ?? null;

  return (
    <div className="page-container">
      {/* Tech header — mirrors Flutter HomeScreen banner */}
      <div className="tech-header">
        <div className="live-pill">
          <span className="live-dot" />
          SENTINEL-2 · NASA POWER · CHIRPS · GloFAS — LIVE TELEMETRY
        </div>
        <h1 className="tech-header-title">Agro-Weather & Satellite Intelligence</h1>
        <p className="tech-header-sub">
          Planetary remote sensing — NDVI, soil moisture, rainfall &amp; temperature
        </p>
      </div>

      {/* Woreda search */}
      <div className="page-header" style={{ marginTop: '-0.5rem' }}>
        <form className="coord-form" onSubmit={handleSearch}>
          <div className="coord-inputs">
            <div className="input-group">
              <Search size={14} className="input-icon" />
              <input
                type="text"
                className="coord-input"
                placeholder="Woreda ID…"
                value={woredaInput}
                onChange={(e) => setWoredaInput(e.target.value)}
                aria-label="Filter by Woreda ID"
                style={{ width: 180 }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Search size={14} /> Search
            </button>
            {woredaSearch && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setWoredaInput(''); setWoredaSearch(''); fetchWeather(); }}
              >
                All Woredas
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => fetchWeather(woredaSearch || undefined)}
              disabled={loading}
              aria-label="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="state-card loading-state" aria-live="polite" aria-busy="true">
          <div className="spinner" aria-hidden="true" />
          <p>Loading satellite telemetry…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="state-card error-state" role="alert">
          <AlertCircle size={28} />
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={() => fetchWeather()}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Hero widget — latest observation */}
      {!loading && !error && latest && (
        <WeatherWidget observation={latest} />
      )}

      {/* All observations table / cards */}
      {!loading && !error && observations.length > 1 && (
        <div className="section-card">
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Satellite size={18} style={{ color: 'var(--primary)' }} />
            All Observations ({observations.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Woreda</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Temp (°C)</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Rain (mm)</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>NDVI</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Soil Moisture</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((obs) => (
                  <tr key={obs.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.625rem 0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {obs.woredaName ?? obs.woredaId}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)' }}>
                      {(() => { try { return new Date(obs.observedAt).toLocaleDateString(); } catch { return obs.observedAt; } })()}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem' }}>
                      {obs.nasaPowerTempC != null ? `${obs.nasaPowerTempC.toFixed(1)}°` : '—'}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem' }}>
                      {obs.chirpsRainfallMm != null ? `${obs.chirpsRainfallMm.toFixed(1)}` : '—'}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', minWidth: 120 }}>
                      {obs.ndvi != null ? <NdviBar value={obs.ndvi} /> : '—'}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem' }}>
                      {obs.soilMoisturePct != null ? `${obs.soilMoisturePct.toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && observations.length === 0 && (
        <div className="state-card empty-state">
          <Satellite size={48} />
          <p>No satellite observations found.{woredaSearch ? ` Try a different Woreda ID.` : ''}</p>
          {woredaSearch && (
            <button className="btn btn-secondary" onClick={() => { setWoredaInput(''); setWoredaSearch(''); fetchWeather(); }}>
              Show All
            </button>
          )}
        </div>
      )}
    </div>
  );
};
