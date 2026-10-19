/**
 * @file HomePage.tsx
 * @description EthioFarm web portal home — mirrors Flutter HomeScreen feature grid
 *   Same tech-header gradient, same module cards, same brand identity
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Satellite,
  ShieldAlert,
  Activity,
  CloudSun,
  MapPin,
  Microscope,
  Cpu,
  BarChart3,
  Sprout,
  Mic,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Feature card data — mirrors Flutter HomeScreen GridView children
// ---------------------------------------------------------------------------

const FEATURE_CARDS = [
  {
    title: 'Agro-Weather & Satellite',
    subtitle: 'NDVI, CHIRPS rainfall, NASA POWER telemetry',
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
// Quick telemetry ribbon item — mirrors Flutter _buildQuickTelemetryItem
// ---------------------------------------------------------------------------

const TelemetryItem: React.FC<{
  label: string;
  status: string;
  statusColor: string;
}> = ({ label, status, statusColor }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>{label}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor }}>{status}</span>
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.fullName ?? 'Agricultural Leader';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Tech Hero Banner ─ mirrors Flutter techHeaderGradient ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F2E14, #1B5E20, #004D40)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Faint satellite icon bg */}
        <div style={{
          position: 'absolute', right: -20, top: -20,
          fontSize: 160, opacity: 0.05, lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          🛰️
        </div>

        {/* Live satellite pill */}
        <div className="live-pill" style={{ marginBottom: '1rem' }}>
          <span className="live-dot" />
          SENTINEL-2 · LIVE TELEMETRY
        </div>

        {/* Welcome text */}
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>Welcome,</p>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, margin: '0.25rem 0 1rem', letterSpacing: '-0.3px' }}>
          {userName}
        </h2>

        {/* Telemetry ribbon */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 'var(--radius)',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <TelemetryItem label="Early Warning" status="Active" statusColor="#10B981" />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <TelemetryItem label="IoT Sensors" status="Online" statusColor="#38BDF8" />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <TelemetryItem label="Crop Health" status="Optimal" statusColor="#10B981" />
        </div>
      </div>

      {/* ── AI Assistant card — mirrors Flutter center FAB card ── */}
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

      {/* ── Agro-Intelligence Modules grid — mirrors Flutter GridView ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Agro-Intelligence Modules
          </h3>
        </div>

        <div className="features-grid">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            const inner = (
              <>
                <div className="feature-card-top">
                  <div className="feature-icon-wrap" style={{ background: card.iconBg }}>
                    <Icon size={22} color={card.iconColor} />
                  </div>
                  <span
                    className="feature-badge"
                    style={{ background: `${card.badgeColor}18`, color: card.badgeColor }}
                  >
                    {card.badge}
                  </span>
                </div>
                <div>
                  <div className="feature-card-title">{card.title}</div>
                  <div className="feature-card-sub">{card.subtitle}</div>
                  {card.comingSoon && (
                    <div style={{
                      fontSize: '0.65rem', color: 'var(--text-muted)',
                      marginTop: 4, fontStyle: 'italic',
                    }}>
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

      {/* ── System status footer strip ── */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '0.875rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
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
