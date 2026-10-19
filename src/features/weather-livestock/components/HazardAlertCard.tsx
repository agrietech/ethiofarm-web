/**
 * @file HazardAlertCard.tsx
 * @owner Banchamlak
 * @description Severity-colored alert card — mirrors Flutter AlertCard + RiskBadge widget
 */

import React from 'react';
import { AlertTriangle, Flame, Waves, Snowflake, Bug, Sun, Leaf } from 'lucide-react';
import type { AlertModel, AlertSeverity, HazardType } from '../types/weather-livestock.types';

// ---------------------------------------------------------------------------
// Config maps — mirrors AppTheme.getRiskColor() + AlertsListScreen colors
// ---------------------------------------------------------------------------

const SEVERITY_CONFIG: Record<AlertSeverity, {
  bg: string; border: string; iconBg: string; text: string; label: string;
}> = {
  LOW:      { bg: '#DCFCE7', border: '#15803D', iconBg: 'rgba(21,128,61,0.12)',  text: '#15803D', label: 'Low' },
  MODERATE: { bg: '#FEF3C7', border: '#B45309', iconBg: 'rgba(180,83,9,0.12)',   text: '#B45309', label: 'Moderate' },
  HIGH:     { bg: '#FFEDD5', border: '#C2410C', iconBg: 'rgba(194,65,12,0.12)',  text: '#C2410C', label: 'High' },
  CRITICAL: { bg: '#FEE2E2', border: '#991B1B', iconBg: 'rgba(153,27,27,0.12)', text: '#991B1B', label: 'Critical' },
};

const HAZARD_CONFIG: Record<HazardType, { label: string; icon: React.ReactNode }> = {
  DROUGHT:            { label: 'Drought (SPI-3)',      icon: <Sun size={20} /> },
  FLOOD:              { label: 'Flood (GloFAS)',        icon: <Waves size={20} /> },
  LOCUST_PEST:        { label: 'Desert Locust',         icon: <Bug size={20} /> },
  VEGETATION_STRESS:  { label: 'Vegetation Stress',     icon: <Leaf size={20} /> },
  FROST:              { label: 'Frost Alert',            icon: <Snowflake size={20} /> },
  HEAT_STRESS:        { label: 'Heat Stress',            icon: <Flame size={20} /> },
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('en-ET', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return iso; }
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface HazardAlertCardProps {
  alert: AlertModel;
  onTap?: () => void;
}

export const HazardAlertCard: React.FC<HazardAlertCardProps> = ({ alert, onTap }) => {
  const sev = SEVERITY_CONFIG[alert.severity];
  const haz = HAZARD_CONFIG[alert.hazardType] ?? { label: alert.hazardType, icon: <AlertTriangle size={20} /> };

  return (
    <div
      className="alert-card"
      onClick={onTap}
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
      onKeyDown={onTap ? (e) => e.key === 'Enter' && onTap() : undefined}
      aria-label={`${sev.label} alert: ${alert.title}`}
      style={{ borderLeft: `4px solid ${sev.border}` }}
    >
      <div className="alert-card-header">
        {/* Severity icon — mirrors Flutter _getSeverityIcon */}
        <div
          className="alert-severity-icon"
          style={{ background: sev.iconBg, color: sev.border }}
          aria-hidden="true"
        >
          <AlertTriangle size={24} />
        </div>

        <div className="alert-card-meta">
          <div className="alert-card-title">{alert.title}</div>
          <div className="alert-card-hazard">{haz.label}</div>
        </div>

        {/* Unread dot */}
        {!alert.isRead && (
          <div className="unread-dot" title="Unread" aria-label="Unread" />
        )}
      </div>

      <p className="alert-card-message">{alert.message}</p>

      <div className="alert-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* RiskBadge */}
          <span className={`risk-badge ${alert.severity.toLowerCase()}`}>
            {sev.label}
          </span>
          {/* Active pill */}
          <span
            className="risk-badge compact"
            style={alert.isActive
              ? { background: '#DCFCE7', color: '#15803D' }
              : { background: '#f3f4f6', color: '#6b7280' }
            }
          >
            {alert.isActive ? 'Active' : 'Expired'}
          </span>
          {alert.woreda && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              📍 {alert.woreda.name}
            </span>
          )}
        </div>
        <span className="alert-meta-text">{formatDate(alert.createdAt)}</span>
      </div>
    </div>
  );
};
