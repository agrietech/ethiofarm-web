/**
 * @file LivestockRegistryPage.tsx
 * @owner Banchamlak
 * @description Risk Assessment command centre — mirrors Flutter RiskMapScreen + DashboardScreen
 *   Data: GET /api/v1/risk-assessments/latest
 *         GET /api/v1/risk-assessments/statistics
 *         POST /api/v1/risk-assessments/evaluate
 *
 * NOTE: The mobile app has no livestock module. This page replaces it with
 * the multi-hazard Risk Assessment dashboard that DOES exist in the backend.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Activity, RefreshCw, AlertCircle, MapPin } from 'lucide-react';
import {
  getLatestRiskAssessments,
  getRiskStatistics,
  getWoredaRiskAssessments,
} from '../services/weather-livestock.service';
import type { RiskAssessment, RiskLevel, RiskStatistics } from '../types/weather-livestock.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  LOW:      { bg: '#DCFCE7', text: '#15803D', label: 'Low' },
  MODERATE: { bg: '#FEF3C7', text: '#B45309', label: 'Moderate' },
  HIGH:     { bg: '#FFEDD5', text: '#C2410C', label: 'High' },
  CRITICAL: { bg: '#FEE2E2', text: '#991B1B', label: 'Critical' },
};

const RiskPill: React.FC<{ level?: RiskLevel }> = ({ level }) => {
  if (!level) return <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>;
  const cfg = RISK_CONFIG[level];
  return (
    <span className={`risk-badge ${level.toLowerCase()}`}>{cfg.label}</span>
  );
};

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('en-ET', { day: 'numeric', month: 'short' }); }
  catch { return iso; }
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const LivestockRegistryPage: React.FC = () => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [stats, setStats] = useState<RiskStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [woredaInput, setWoredaInput] = useState('');
  const [woredaSearch, setWoredaSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, riskStats] = await Promise.all([
        woredaSearch
          ? getWoredaRiskAssessments(woredaSearch)
          : getLatestRiskAssessments(),
        getRiskStatistics(),
      ]);
      setAssessments(data);
      setStats(riskStats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load risk assessments.');
    } finally {
      setLoading(false);
    }
  }, [woredaSearch]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setWoredaSearch(woredaInput.trim());
  };

  return (
    <div className="page-container">
      {/* Tech header */}
      <div className="tech-header">
        <div className="live-pill">
          <span className="live-dot" />
          MULTI-HAZARD RISK COMMAND — SPI-3 DROUGHT · GloFAS FLOOD · LOCUST RADAR
        </div>
        <h1 className="tech-header-title">Risk Assessment Command Centre</h1>
        <p className="tech-header-sub">
          Spatial multi-hazard risk evaluations across Ethiopia's woredas
        </p>
      </div>

      {/* Header row */}
      <div className="page-header" style={{ marginTop: '-0.5rem' }}>
        <form className="coord-form" onSubmit={handleSearch}>
          <div className="coord-inputs">
            <div className="input-group">
              <MapPin size={14} className="input-icon" />
              <input type="text" className="coord-input"
                placeholder="Woreda ID…" value={woredaInput}
                onChange={(e) => setWoredaInput(e.target.value)}
                aria-label="Woreda ID" style={{ width: 160 }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Activity size={14} /> Search
            </button>
            {woredaSearch && (
              <button type="button" className="btn btn-secondary"
                onClick={() => { setWoredaInput(''); setWoredaSearch(''); }}>
                All Woredas
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={loadData} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
          </div>
        </form>
      </div>

      {/* Stats */}
      {stats && !loading && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Assessments</div>
          </div>
          {(['CRITICAL','HIGH','MODERATE','LOW'] as RiskLevel[]).map((level) => {
            const cfg = RISK_CONFIG[level];
            return (
              <div key={level} className="stat-card" style={{ borderTop: `3px solid ${cfg.text}` }}>
                <div className="stat-value" style={{ color: cfg.text }}>
                  {stats.bySeverity?.[level] ?? 0}
                </div>
                <div className="stat-label">{cfg.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="state-card loading-state" aria-live="polite" aria-busy="true">
          <div className="spinner" aria-hidden="true" />
          <p>Loading risk assessments…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="state-card error-state" role="alert">
          <AlertCircle size={28} />
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={loadData}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Risk cards grid */}
      {!loading && !error && assessments.length > 0 && (
        <div className="risk-grid">
          {assessments.map((a) => (
            <div key={a.id} className="risk-card">
              <div className="risk-card-header">
                <div>
                  <div className="risk-card-title">{a.woredaName ?? a.woredaId}</div>
                  <div className="risk-card-meta">{formatDate(a.assessedAt)}</div>
                </div>
                <RiskPill level={a.overallRisk} />
              </div>

              {/* Per-hazard risk breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Drought', level: a.droughtRisk },
                  { label: 'Flood', level: a.floodRisk },
                  { label: 'Locust', level: a.locustRisk },
                  { label: 'Vegetation', level: a.vegetationStress },
                ].map(({ label, level }) => (
                  level && (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', minWidth: 72 }}>{label}</span>
                      <div className="progress-track" style={{ flex: 1 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: level === 'CRITICAL' ? '100%' : level === 'HIGH' ? '75%' : level === 'MODERATE' ? '50%' : '25%',
                            background: RISK_CONFIG[level].text,
                          }}
                        />
                      </div>
                      <RiskPill level={level} />
                    </div>
                  )
                ))}
              </div>

              {a.notes && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  {a.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && assessments.length === 0 && (
        <div className="state-card empty-state">
          <Activity size={48} />
          <p>No risk assessments found.{woredaSearch ? ' Try a different Woreda ID.' : ''}</p>
        </div>
      )}
    </div>
  );
};
