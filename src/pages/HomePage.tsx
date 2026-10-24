/**
 * @file HomePage.tsx
 * @description EthioFarm web portal home — mirrors Flutter HomeScreen
 *   + Time-of-day greeting
 *   + Live weather banner from /api/v1/weather/forecast
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Satellite, ShieldAlert, Activity, CloudSun,
  MapPin, Microscope, Cpu, BarChart3, Sprout, Mic,
  Droplets, Wind, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getWeatherForecast } from '../features/weather-livestock/services/weather-livestock.service';
import type { WeatherForecast } from '../features/weather-livestock/types/weather-livestock.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  return 'Good evening';
}

const CONDITION_EMOJI: Record<string, string> = {
  sunny: '☀️', partlyCloudy: '⛅', cloudy: '☁️',
  rainy: '🌧️', drizzle: '🌦️', thunderstorm: '⛈️',
  frost: '❄️', fog: '🌫️',
};
const condEmoji = (type?: string) => CONDITION_EMOJI[type ?? ''] ?? '🌤️';

// ---------------------------------------------------------------------------
// Feature cards
// ---------------------------------------------------------------------------

const FEATURE_CARDS = [
  {
    title: 'Agro-Weather & Satellite',
    subtitle: 'Live forecast, NDVI, rainfall & ET₀',
    badge: 'Live',
    badgeColor: '#10B981',
    icon: CloudSun,
    iconBg: 'rgba(16,185,129,0.1)',
    iconColor: '#10B981',
    to: '/weather',
  },
  {
    title: 'Early Warning Alerts',
    subtitle: 'Drought, flood, locust & frost bulletins',
    badge: 'Realtime',
    badgeColor: '#E65100',
    icon: ShieldAlert,
    iconBg: 'rgba(230,81,0,0.1)',
    iconColor: '#E65100',
    to: '/hazards',
  },
  {
    title: 'Risk Command Centre',
    subtitle: 'Multi-hazard spatial risk per woreda',
    badge: 'SPI-3',
    badgeColor: '#C2410C',
    icon: Activity,
    iconBg: 'rgba(194,65,12,0.1)',
    iconColor: '#C2410C',
    to: '/risk',
  },
  {
    title: 'Farm Operations & GIS',
    subtitle: 'Farm plots, geofencing & parcels',
    badge: 'GIS',
    badgeColor: '#1B5E20',
    icon: MapPin,
    iconBg: 'rgba(27,94,32,0.1)',
    iconColor: '#1B5E20',
    to: '/farms',
    comingSoon: true,
  },
  {
    title: 'IoT Soil Sensors',
    subtitle: 'Volumetric water content & NPK telemetry',
    badge: 'LoRaWAN',
    badgeColor: '#0284C7',
    icon: Cpu,
    iconBg: 'rgba(2,132,199,0.1)',
    iconColor: '#0284C7',
    to: '/sensors',
    comingSoon: true,
  },
  {
    title: 'AI Crop Vision',
    subtitle: 'Leaf disease scanner — Plant.id + Gemini',
    badge: 'AI Model',
    badgeColor: '#00796B',
    icon: Microscope,
    iconBg: 'rgba(0,121,107,0.1)',
    iconColor: '#00796B',
    to: '/scan',
    comingSoon: true,
  },
  {
    title: 'Boundaries & GIS',
    subtitle: 'Woreda & kebele parcel mapping',
    badge: 'Centroids',
    badgeColor: '#059669',
    icon: Satellite,
    iconBg: 'rgba(5,150,105,0.1)',
    iconColor: '#059669',
    to: '/boundaries',
    comingSoon: true,
  },
  {
    title: 'Agro-Analytics',
    subtitle: 'Trends, harvest reports & insights',
    badge: 'Insights',
    badgeColor: '#4338CA',
    icon: BarChart3,
    iconBg: 'rgba(67,56,202,0.1)',
    iconColor: '#4338CA',
    to: '/analytics',
    comingSoon: true,
  },
];

// ---------------------------------------------------------------------------
// Live Weather Banner — mirrors Flutter HomeCommandCenterHero weather card
// ---------------------------------------------------------------------------

const LiveWeatherBanner: React.FC = () => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getWeatherForecast()
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(52,211,153,0.4)',
        borderRadius: 'var(--radius)',
        padding: '0.75rem 1rem',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div className="spinner" style={{ width: 18, height: 18, borderTopColor: '#34D399' }} />
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>
          Fetching live weather…
        </span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 'var(--radius)',
        padding: '0.75rem 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
          Weather unavailable
        </span>
        <button onClick={load} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#34D399', display: 'flex', alignItems: 'center', gap: 4,
          fontSize: '0.75rem', fontWeight: 600,
        }}>
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  const c = weather.current;
  const today = weather.daily[0];
  const now = new Date();
  const hourLabel = `${String(now.getHours()).padStart(2, '0')}:00`;

  return (
    <Link to="/weather" style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(20,83,45,0.92), rgba(15,62,80,0.92))',
        border: '1.2px solid rgba(52,211,153,0.4)',
        borderRadius: 'var(--radius)',
        padding: '0.75rem 1rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        cursor: 'pointer',
        transition: 'opacity 0.15s',
      }}>
        {/* Weather icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'rgba(245,158,11,0.22)',
          border: '1px solid rgba(251,191,36,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem',
        }}>
          {condEmoji(c.conditionType)}
        </div>

        {/* Temp + condition + H/L + stats */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>
              {c.temperatureC.toFixed(1)}°C
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'white' }}>
              {c.conditionEn}
            </span>
            {c.conditionAm && (
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>
                {c.conditionAm}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 3 }}>
            {today && (
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                H: {today.maxTempC.toFixed(0)}° / L: {today.minTempC.toFixed(0)}°
              </span>
            )}
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>·</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Droplets size={10} /> {c.relativeHumidity}%
            </span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>·</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Wind size={10} /> {c.windSpeedKmh.toFixed(0)} km/h
            </span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>·</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
              🌧️ {c.precipitationMm.toFixed(1)} mm
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            {weather.locationName}
          </div>
        </div>

        {/* Hourly live badge */}
        <div style={{
          flexShrink: 0, padding: '4px 8px',
          background: 'rgba(16,185,129,0.22)',
          border: '1px solid rgba(52,211,153,0.5)',
          borderRadius: 10,
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#34D399', display: 'inline-block',
              boxShadow: '0 0 5px #34D399',
            }} />
            <span style={{ fontSize: '0.62rem', fontWeight: 900, color: '#6EE7B7', letterSpacing: 0.4 }}>
              HOURLY LIVE
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
            {hourLabel}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.fullName ?? 'Agricultural Leader';
  const greeting = getGreeting();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Tech Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2E14, #1B5E20, #004D40)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Faint satellite bg */}
        <div style={{
          position: 'absolute', right: -20, top: -20,
          fontSize: 160, opacity: 0.05, lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          🛰️
        </div>

        {/* Live pill */}
        <div className="live-pill" style={{ marginBottom: '1rem' }}>
          <span className="live-dot" />
          SENTINEL-2 · LIVE TELEMETRY
        </div>

        {/* Time-of-day greeting — matches Flutter HomeCommandCenterHero */}
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.72)', margin: 0, fontWeight: 500 }}>
          {greeting},
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.2rem 0 1rem', letterSpacing: '-0.4px' }}>
          {userName}
        </h2>

        {/* Live weather banner — mirrors Flutter daily temperature banner */}
        <LiveWeatherBanner />
      </div>

      {/* ── AI Assistant card ── */}
      <div className="ai-feature-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(245,158,11,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Mic size={24} color="#F59E0B" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>AI Agronomic Assistant</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
            አማርኛ & English Voice & Chat — coming soon
          </div>
        </div>
        <span style={{
          background: '#F59E0B', color: 'black',
          fontSize: '0.68rem', fontWeight: 700,
          padding: '3px 8px', borderRadius: 999,
        }}>Voice AI</span>
      </div>

      {/* ── Agro-Intelligence Modules grid ── */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.875rem' }}>
          Agro-Intelligence Modules
        </h3>
        <div className="features-grid">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            const inner = (
              <>
                <div className="feature-card-top">
                  <div className="feature-icon-wrap" style={{ background: card.iconBg }}>
                    <Icon size={22} color={card.iconColor} />
                  </div>
                  <span className="feature-badge" style={{ background: `${card.badgeColor}18`, color: card.badgeColor }}>
                    {card.badge}
                  </span>
                </div>
                <div>
                  <div className="feature-card-title">{card.title}</div>
                  <div className="feature-card-sub">{card.subtitle}</div>
                  {card.comingSoon && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                      Coming soon
                    </div>
                  )}
                </div>
              </>
            );

            return card.comingSoon ? (
              <div key={card.to} className="feature-card" style={{ opacity: 0.6, cursor: 'default' }}>
                {inner}
              </div>
            ) : (
              <Link key={card.to} to={card.to} className="feature-card">
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── System status strip ── */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '0.875rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
      }}>
        <Sprout size={16} color="var(--primary)" />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', flex: 1 }}>
          <strong style={{ color: 'var(--text-primary)' }}>AgriEtech Platform</strong> — Multi-hazard Early Warning System for Ethiopian Agriculture
        </span>
        <span style={{
          fontSize: '0.72rem', background: 'var(--primary-bg)',
          color: 'var(--primary-dark)', padding: '2px 8px',
          borderRadius: 999, fontWeight: 600,
        }}>
          v1.0.0
        </span>
      </div>
    </div>
  );
};
