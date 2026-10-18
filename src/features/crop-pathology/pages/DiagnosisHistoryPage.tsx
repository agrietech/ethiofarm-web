/**
 * @file DiagnosisHistoryPage.tsx
 * @owner Zinegnaw
 * @feature Crop AI & Plant Pathology
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2, RefreshCw, ScanLine, Search } from 'lucide-react';
import { DiagnosisResultCard, ESCALATION_LABELS, SEVERITY_STYLES } from '../components/DiagnosisResultCard';
import { cropPathologyService } from '../services/crop-pathology.service';
import type { DAEscalationStatus, DiagnosisRecord, DiseaseSeverity } from '../types/crop-pathology.types';

type Filter<T extends string> = T | 'ALL';

const SEVERITIES = Object.keys(SEVERITY_STYLES) as DiseaseSeverity[];
const ESCALATIONS = Object.keys(ESCALATION_LABELS) as DAEscalationStatus[];

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem', color: '#1e293b', textAlign: 'left' },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  title: { margin: 0, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', lineHeight: 1.2 },
  subtitle: { margin: '0.35rem 0 0', color: '#64748b' },
  primaryLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.6rem 1rem',
    borderRadius: 8,
    background: '#2e7d32',
    color: '#ffffff',
    fontWeight: 600,
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.75rem',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
  },
  label: { display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: '#475569' },
  input: {
    padding: '0.5rem 0.65rem',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: '0.9rem',
    background: '#ffffff',
    color: '#1e293b',
  },
  searchWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 10, color: '#94a3b8', pointerEvents: 'none' },
  summary: { margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#64748b' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 },
  date: { fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.35rem 0.25rem' },
  state: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '3rem 1rem',
    borderRadius: 12,
    border: '1px dashed #cbd5e1',
    color: '#475569',
    textAlign: 'center',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer',
  },
};

export function DiagnosisHistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<DiagnosisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [crop, setCrop] = useState<string>('ALL');
  const [severity, setSeverity] = useState<Filter<DiseaseSeverity>>('ALL');
  const [escalation, setEscalation] = useState<Filter<DAEscalationStatus>>('ALL');

  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const history = await cropPathologyService.getHistory();
      if (!signal?.cancelled) setRecords(history);
    } catch {
      if (!signal?.cancelled) setError('Could not load your diagnosis history. Please try again.');
    } finally {
      if (!signal?.cancelled) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    load(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [load]);

  const cropOptions = useMemo(
    () => Array.from(new Set(records.map((record) => record.cropName).filter(Boolean))).sort(),
    [records],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return records
      .filter((record) => crop === 'ALL' || record.cropName === crop)
      .filter((record) => severity === 'ALL' || record.severity === severity)
      .filter((record) => escalation === 'ALL' || record.daEscalationStatus === escalation)
      .filter(
        (record) =>
          !term ||
          record.diseaseIdentified.toLowerCase().includes(term) ||
          record.cropName.toLowerCase().includes(term),
      )
      .sort((a, b) => (b.diagnosedAt ?? '').localeCompare(a.diagnosedAt ?? ''));
  }, [records, query, crop, severity, escalation]);

  const hasActiveFilters = query !== '' || crop !== 'ALL' || severity !== 'ALL' || escalation !== 'ALL';

  const resetFilters = () => {
    setQuery('');
    setCrop('ALL');
    setSeverity('ALL');
    setEscalation('ALL');
  };

  const openDetails = (id: string) => {
    const diagnosis = records.find((record) => record.id === id);
    navigate(`/scan/${encodeURIComponent(id)}`, { state: { diagnosis } });
  };

  const renderBody = () => {
    if (loading) {
      return (
        <div style={styles.state} role="status">
          <Loader2 size={28} style={{ animation: 'cp-spin 1s linear infinite' }} />
          Loading diagnosis history…
        </div>
      );
    }
    if (error) {
      return (
        <div style={{ ...styles.state, borderColor: '#ef9a9a', color: '#b71c1c' }} role="alert">
          <AlertTriangle size={28} />
          {error}
          <button type="button" style={styles.secondaryButton} onClick={() => load()}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      );
    }
    if (records.length === 0) {
      return (
        <div style={styles.state}>
          <ScanLine size={28} color="#2e7d32" />
          You have not scanned any crops yet.
          <Link to="/scan" style={styles.primaryLink}>
            Scan your first leaf
          </Link>
        </div>
      );
    }
    if (filtered.length === 0) {
      return (
        <div style={styles.state}>
          No diagnoses match the selected filters.
          <button type="button" style={styles.secondaryButton} onClick={resetFilters}>
            Clear filters
          </button>
        </div>
      );
    }
    return (
      <ul style={styles.list}>
        {filtered.map((record) => (
          <li key={record.id}>
            {record.diagnosedAt && <div style={styles.date}>{formatDate(record.diagnosedAt)}</div>}
            <DiagnosisResultCard diagnosis={record} onViewDetails={openDetails} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={styles.page}>
      <style>{'@keyframes cp-spin { to { transform: rotate(360deg); } }'}</style>

      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Diagnosis History</h1>
          <p style={styles.subtitle}>Review previous crop scans, severity levels and DA escalation status.</p>
        </div>
        <Link to="/scan" style={styles.primaryLink}>
          <ScanLine size={18} /> New scan
        </Link>
      </header>

      <section style={styles.filters} aria-label="Filters">
        <label style={styles.label}>
          Search
          <div style={styles.searchWrap}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="search"
              style={{ ...styles.input, width: '100%', paddingLeft: '2rem' }}
              placeholder="Disease or crop"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </label>

        <label style={styles.label}>
          Crop
          <select style={styles.input} value={crop} onChange={(event) => setCrop(event.target.value)}>
            <option value="ALL">All crops</option>
            {cropOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Severity
          <select
            style={styles.input}
            value={severity}
            onChange={(event) => setSeverity(event.target.value as Filter<DiseaseSeverity>)}
          >
            <option value="ALL">All severities</option>
            {SEVERITIES.map((level) => (
              <option key={level} value={level}>
                {SEVERITY_STYLES[level].label}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          DA status
          <select
            style={styles.input}
            value={escalation}
            onChange={(event) => setEscalation(event.target.value as Filter<DAEscalationStatus>)}
          >
            <option value="ALL">All statuses</option>
            {ESCALATIONS.map((status) => (
              <option key={status} value={status}>
                {ESCALATION_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
      </section>

      {!loading && !error && records.length > 0 && (
        <p style={styles.summary}>
          Showing {filtered.length} of {records.length} diagnoses
          {hasActiveFilters && (
            <>
              {' · '}
              <button
                type="button"
                onClick={resetFilters}
                style={{ background: 'none', border: 'none', padding: 0, color: '#2e7d32', cursor: 'pointer' }}
              >
                Clear filters
              </button>
            </>
          )}
        </p>
      )}

      {renderBody()}
    </div>
  );
}

export default DiagnosisHistoryPage;
