
import React, { useEffect, useState } from 'react';
import { CloudSun, RefreshCw, AlertCircle, MapPin } from 'lucide-react';
import { useLiveWeather } from '../hooks/useLiveWeather';
import { WeatherWidget } from '../components/WeatherWidget';

export const WeatherForecastPage: React.FC = () => {
  const { weather, loading, error, fetchWeather } = useLiveWeather();

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [woredaId, setWoredaId] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  // On mount — use browser geolocation if available, else let backend use user's woreda
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => fetchWeather(),
        { timeout: 8000 }
      );
    } else {
      fetchWeather();
    }
  }, [fetchWeather]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    if (woredaId.trim()) {
      fetchWeather({ woredaId: woredaId.trim() });
      return;
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
        setInputError('Coordinates are out of valid range.');
        return;
      }
      fetchWeather({ lat: parsedLat, lng: parsedLng });
      return;
    }

    setInputError('Enter a Woreda ID or valid coordinates.');
  };

  return (
    <div className="page-container">
      {/* Tech header */}
      <div className="tech-header">
        <div className="live-pill">
          <span className="live-dot" style={{ background: '#38BDF8' }} />
          OPEN-METEO · NASA POWER · HYPER-LOCAL AGRO-METEOROLOGY
        </div>
        <h1 className="tech-header-title">Agro-Weather Forecast</h1>
        <p className="tech-header-sub">
          Live temperature, rainfall, humidity, wind &amp; ET₀ evapotranspiration
        </p>
      </div>

      {/* Location search */}
      <form className="coord-form" onSubmit={handleSearch}>
        <div className="coord-inputs">
          <div className="input-group">
            <MapPin size={14} className="input-icon" />
            <input
              type="text"
              className="coord-input"
              placeholder="Woreda ID…"
              value={woredaId}
              onChange={(e) => setWoredaId(e.target.value)}
              aria-label="Woreda ID"
              style={{ width: 150 }}
            />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>or GPS:</span>
          <input
            type="number"
            step="any"
            className="coord-input"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            aria-label="Latitude"
          />
          <input
            type="number"
            step="any"
            className="coord-input"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            aria-label="Longitude"
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <CloudSun size={14} /> Search
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => fetchWeather()}
            disabled={loading}
            aria-label="Use my location"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            My Location
          </button>
        </div>
        {inputError && <p className="field-error">{inputError}</p>}
      </form>

      {/* Loading */}
      {loading && (
        <div className="state-card loading-state" aria-live="polite" aria-busy="true">
          <div className="spinner" aria-hidden="true" />
          <p>Fetching live weather data…</p>
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

      {/* Weather widget */}
      {!loading && !error && weather && (
        <WeatherWidget forecast={weather} />
      )}

      {/* Empty state */}
      {!loading && !error && !weather && (
        <div className="state-card empty-state">
          <CloudSun size={48} />
          <p>No weather data yet. Allow location access or search by Woreda ID.</p>
        </div>
      )}
    </div>
  );
};
