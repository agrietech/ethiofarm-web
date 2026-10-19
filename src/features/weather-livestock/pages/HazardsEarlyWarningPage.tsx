/**
 * @file HazardsEarlyWarningPage.tsx
 * @owner Banchamlak
 * @description Multi-hazard early warning board — mirrors Flutter AlertsListScreen
 *   Data: GET /api/v1/alerts  +  GET /api/v1/alerts/active
 *   Create: POST /api/v1/alerts  (role-gated)
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldAlert, RefreshCw, AlertCircle, Plus, X, Send,
} from 'lucide-react';
import {
  getAlerts,
  createAlert,
  markAlertAsRead,
  deriveAlertStats,
} from '../services/weather-livestock.service';
import { HazardAlertCard } from '../components/HazardAlertCard';
import type {
  AlertModel,
  AlertSeverity,
  HazardType,
  CreateAlertRequest,
  AlertStatistics,
} from '../types/weather-livestock.types';
import { useAuth } from '../../../context/AuthContext';

// ---------------------------------------------------------------------------
// Filter options — mirrors Flutter AlertFilterChips
// ---------------------------------------------------------------------------

const SEVERITY_OPTIONS: Array<{ value: AlertSeverity | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Levels' },
  { value: 'LOW', label: 'Low' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

const HAZARD_OPTIONS: Array<{ value: HazardType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Hazards' },
  { value: 'DROUGHT', label: 'Drought' },
  { value: 'FLOOD', label: 'Flood' },
  { value: 'LOCUST_PEST', label: 'Locust' },
  { value: 'VEGETATION_STRESS', label: 'Vegetation' },
  { value: 'FROST', label: 'Frost' },
  { value: 'HEAT_STRESS', label: 'Heat Stress' },
];

const ALL_HAZARD_TYPES: HazardType[] = [
  'DROUGHT', 'FLOOD', 'LOCUST_PEST', 'VEGETATION_STRESS', 'FROST', 'HEAT_STRESS',
];
const ALL_SEVERITIES: AlertSeverity[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];

// Alert detail modal
const AlertDetailModal: React.FC<{
  alert: AlertModel;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}> = ({ alert, onClose, onMarkRead }) => {
  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('en-ET'); } catch { return iso; }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={alert.title}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header — matches Flutter techHeaderGradient */}
        <div className="modal-header">
          <ShieldAlert size={22} style={{ color: '#F59E0B' }} />
          <span className="modal-header-title">{alert.title}</span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-handle" />

          {/* Severity + hazard type */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className={`risk-badge ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
            <span className="risk-badge compact" style={{ background: '#f3f4f6', color: 'var(--text-secondary)' }}>
              {alert.hazardType.replace(/_/g, ' ')}
            </span>
            <span
              className="risk-badge compact"
              style={alert.isActive
                ? { background: '#DCFCE7', color: '#15803D' }
                : { background: '#f3f4f6', color: '#6b7280' }
              }
            >
              {alert.isActive ? 'Active' : 'Expired'}
            </span>
          </div>

          {/* Message */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: 'var(--text-primary)' }}>Message</div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{alert.message}</p>
          </div>

          {/* Action items — matches Flutter checklist */}
          {alert.actionItems.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-primary)' }}>Action Items</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {alert.actionItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--primary)', marginTop: 2 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detail rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(
              [
                ['Priority', `Priority ${alert.priority}`],
                alert.woreda ? ['Location', alert.woreda.name] : null,
                alert.validUntil ? ['Valid Until', formatDate(alert.validUntil)] : null,
                ['Created', formatDate(alert.createdAt)],
              ] as Array<[string, string] | null>
            ).filter((row): row is [string, string] => row !== null).map(([label, value]) => (
              <div key={label} className="detail-row">
                <span className="detail-label">{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            {!alert.isRead && (
              <button className="btn btn-secondary" onClick={() => { onMarkRead(alert.id); onClose(); }}>
                Mark as Read
              </button>
            )}
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create alert form — mirrors Flutter CreateAlertScreen
const CreateAlertForm: React.FC<{
  onCreated: (alert: AlertModel) => void;
  onCancel: () => void;
}> = ({ onCreated, onCancel }) => {
  const [hazardType, setHazardType] = useState<HazardType>('DROUGHT');
  const [severity, setSeverity] = useState<AlertSeverity>('HIGH');
  const [headline, setHeadline] = useState('');
  const [message, setMessage] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [woredaName, setWoredaName] = useState('');
  const [priority, setPriority] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const SEVERITY_COLORS: Record<AlertSeverity, string> = {
    LOW: '#15803D', MODERATE: '#B45309', HIGH: '#C2410C', CRITICAL: '#991B1B',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) { setFormError('Alert title is required.'); return; }
    if (!message.trim()) { setFormError('Alert message is required.'); return; }
    setFormError(null);
    setSubmitting(true);
    try {
      const items = actionItems.split('\n').map((s) => s.trim()).filter(Boolean);
      const payload: CreateAlertRequest = {
        hazardType, severity, headline: headline.trim(),
        message: message.trim(),
        woredaName: woredaName.trim() || undefined,
        actionItems: items,
        priority,
        language: 'en',
      };
      const created = await createAlert(payload);
      onCreated(created);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create alert.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="form-section-title">Create New Alert</h3>
        <button className="btn btn-ghost" onClick={onCancel} aria-label="Cancel"><X size={16} /></button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Type & Severity */}
        <div className="form-row">
          <div className="form-field">
            <label className="form-label" htmlFor="hazardType">Hazard Type</label>
            <select id="hazardType" className="form-select"
              value={hazardType} onChange={(e) => setHazardType(e.target.value as HazardType)}>
              {ALL_HAZARD_TYPES.map((h) => (
                <option key={h} value={h}>{h.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="severity">Severity</label>
            <select id="severity" className="form-select"
              value={severity} onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
              style={{ borderColor: SEVERITY_COLORS[severity], color: SEVERITY_COLORS[severity] }}>
              {ALL_SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Priority */}
        <div className="form-field">
          <label className="form-label">Priority (1 = Highest)</label>
          <div className="priority-chips">
            {[1,2,3,4,5].map((p) => (
              <button key={p} type="button" className={`priority-chip ${priority === p ? 'active' : ''}`}
                onClick={() => setPriority(p)}>{p}</button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="form-field">
          <label className="form-label" htmlFor="headline">Alert Title *</label>
          <input id="headline" type="text" className="form-input" placeholder="Brief headline…"
            value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={100} />
        </div>

        {/* Message */}
        <div className="form-field">
          <label className="form-label" htmlFor="alertMessage">Alert Message *</label>
          <textarea id="alertMessage" className="form-textarea" placeholder="Detailed warning message…"
            value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} rows={4} />
        </div>

        {/* Action items */}
        <div className="form-field">
          <label className="form-label" htmlFor="actionItems">Action Items (one per line, optional)</label>
          <textarea id="actionItems" className="form-textarea" placeholder="Recommended actions…"
            value={actionItems} onChange={(e) => setActionItems(e.target.value)} rows={3} />
        </div>

        {/* Woreda */}
        <div className="form-field">
          <label className="form-label" htmlFor="woredaName">Woreda Name (optional)</label>
          <input id="woredaName" type="text" className="form-input" placeholder="Leave empty for all woredas"
            value={woredaName} onChange={(e) => setWoredaName(e.target.value)} />
        </div>

        {formError && <p className="field-error">{formError}</p>}

        {/* Info card — matches Flutter green info card */}
        <div className="info-box-green">
          <p className="info-box-text green">
            Alert will be dispatched via push notifications to all affected users in the targeted woreda.
          </p>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}
            style={{ background: SEVERITY_COLORS[severity], borderColor: SEVERITY_COLORS[severity] }}>
            <Send size={14} />
            {submitting ? 'Creating…' : 'Create Alert'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export const HazardsEarlyWarningPage: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AlertModel[]>([]);
  const [stats, setStats] = useState<AlertStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [hazardFilter, setHazardFilter] = useState<HazardType | 'ALL'>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<AlertModel | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Role-gated: DEVELOPMENT_AGENT, WOREDA_OFFICER, etc.
  const canCreate = user?.role && ['DEVELOPMENT_AGENT','WOREDA_OFFICER','ZONAL_OFFICER','REGIONAL_OFFICER','ADMIN'].includes(user.role);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlerts();
      setAlerts(data);
      setStats(deriveAlertStats(data));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAlerts(); }, [loadAlerts]);

  const handleMarkRead = async (id: string) => {
    await markAlertAsRead(id).catch(() => {});
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, isRead: true } : a));
  };

  const handleCreated = (alert: AlertModel) => {
    setAlerts((prev) => [alert, ...prev]);
    setStats(deriveAlertStats([alert, ...alerts]));
    setShowCreate(false);
  };

  const filtered = alerts.filter((a) => {
    const matchSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchHazard = hazardFilter === 'ALL' || a.hazardType === hazardFilter;
    return matchSeverity && matchHazard;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <ShieldAlert size={28} style={{ color: '#C2410C' }} className="page-title-icon" />
          <div>
            <h1 className="page-title">Early Warning Alerts</h1>
            <p className="page-subtitle">Multi-hazard bulletins — drought, flood, locust &amp; more</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={loadAlerts} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
          {canCreate && (
            <button className="btn btn-primary" onClick={() => setShowCreate((v) => !v)}>
              <Plus size={14} /> Create Alert
            </button>
          )}
        </div>
      </div>

      {/* Stats — mirrors Flutter AlertStatisticsCard */}
      {stats && !loading && (
        <div className="stats-row">
          {[
            { label: 'Total', value: stats.total, color: 'var(--text-primary)' },
            { label: 'Active', value: stats.active, color: 'var(--primary)' },
            { label: 'Unread', value: stats.unread, color: 'var(--warning)' },
            { label: 'Critical', value: stats.critical, color: 'var(--error)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card">
              <div className="stat-value" style={{ color }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <CreateAlertForm onCreated={handleCreated} onCancel={() => setShowCreate(false)} />
      )}

      {/* Filters — mirrors Flutter AlertFilterChips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="filter-group">
          <span className="filter-label">Severity:</span>
          <div className="chip-group" role="group" aria-label="Filter by severity">
            {SEVERITY_OPTIONS.map((s) => (
              <button key={s.value} className={`chip ${severityFilter === s.value ? 'chip-active' : ''}`}
                onClick={() => setSeverityFilter(s.value as AlertSeverity | 'ALL')}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Hazard:</span>
          <div className="chip-group" role="group" aria-label="Filter by hazard type">
            {HAZARD_OPTIONS.map((h) => (
              <button key={h.value} className={`chip ${hazardFilter === h.value ? 'chip-active' : ''}`}
                onClick={() => setHazardFilter(h.value as HazardType | 'ALL')}>
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && !error && (
        <p className="result-count">
          {filtered.length} alert{filtered.length !== 1 ? 's' : ''}
          {(severityFilter !== 'ALL' || hazardFilter !== 'ALL') && ` (filtered from ${alerts.length})`}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="state-card loading-state" aria-live="polite" aria-busy="true">
          <div className="spinner" aria-hidden="true" />
          <p>Loading hazard bulletins…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="state-card error-state" role="alert">
          <AlertCircle size={28} />
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={loadAlerts}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Alert list */}
      {!loading && !error && filtered.length > 0 && (
        <div className="alerts-grid">
          {filtered.map((alert) => (
            <HazardAlertCard key={alert.id} alert={alert} onTap={() => setSelectedAlert(alert)} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="state-card empty-state">
          <ShieldAlert size={48} />
          <p>No alerts for the selected filters.</p>
        </div>
      )}

      {/* Detail modal */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onMarkRead={handleMarkRead}
        />
      )}
    </div>
  );
};
