
import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  Leaf,
  Loader2,
  RefreshCw,
  Send,
  ShieldCheck,
  Store,
  Stethoscope,
} from 'lucide-react';
import axios from 'axios';
import { DiagnosisResultCard, ESCALATION_LABELS } from '../components/DiagnosisResultCard';
import { cropPathologyService } from '../services/crop-pathology.service';
import type { DiagnosisRecord } from '../types/crop-pathology.types';

const MAX_NOTES_LENGTH = 1000;

const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem', color: '#1e293b', textAlign: 'left' },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: '#2e7d32',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  title: { margin: '0 0 1rem', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', lineHeight: 1.2 },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' },
  mainCol: { flex: '2 1 520px', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 },
  sideCol: { flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 },
  panel: {
    padding: '1.25rem',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 0 0.75rem',
    fontSize: '1.05rem',
  },
  list: { margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#334155' },
  empty: { margin: 0, color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' },
  treatmentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' },
  warning: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
    padding: '0.6rem 0.75rem',
    borderRadius: 8,
    background: '#fff3e0',
    color: '#e65100',
    fontSize: '0.8rem',
  },
  textarea: {
    width: '100%',
    minHeight: 110,
    boxSizing: 'border-box',
    padding: '0.6rem 0.75rem',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    resize: 'vertical',
    background: '#ffffff',
    color: '#1e293b',
  },
  counter: { textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0 0.75rem' },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: 8,
    border: 'none',
    background: '#e65100',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
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
  success: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.75rem',
    borderRadius: 8,
    background: '#e8f5e9',
    color: '#1b5e20',
    fontSize: '0.9rem',
  },
  error: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
    padding: '0.75rem',
    borderRadius: 8,
    background: '#ffebee',
    color: '#b71c1c',
    fontSize: '0.9rem',
  },
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
};

function Panel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) return <p style={styles.empty}>{emptyText}</p>;
  return (
    <ul style={styles.list}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function escalationErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const message = (err.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (!err.response) return 'Network error. Check your connection and try again.';
  }
  return 'Could not escalate this case. Please try again.';
}

export function DiagnosisDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const location = useLocation();
  const passedDiagnosis = (location.state as { diagnosis?: DiagnosisRecord } | null)?.diagnosis;
  const initial = passedDiagnosis?.id === id ? passedDiagnosis : null;

  const [diagnosis, setDiagnosis] = useState<DiagnosisRecord | null>(initial);
  const [loading, setLoading] = useState(!initial);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [notes, setNotes] = useState('');
  const [escalating, setEscalating] = useState(false);
  const [escalationError, setEscalationError] = useState<string | null>(null);
  const [escalationSuccess, setEscalationSuccess] = useState(false);

  const load = useCallback(
    async (signal?: { cancelled: boolean }) => {
      if (!id) return;
      setLoadError(null);
      try {
        const record = await cropPathologyService.getDiagnosisById(id);
        if (!signal?.cancelled) setDiagnosis(record);
      } catch {
        if (!signal?.cancelled) setLoadError('Could not load this diagnosis. Please try again.');
      } finally {
        if (!signal?.cancelled) setLoading(false);
      }
    },
    [id],
  );

  // Always refresh from the server so escalation status is current, even when state was passed in.
  useEffect(() => {
    const signal = { cancelled: false };
    load(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [load]);

  const handleEscalate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!diagnosis || escalating) return;
    setEscalating(true);
    setEscalationError(null);
    try {
      const updated = await cropPathologyService.escalateToDA(diagnosis.id, notes.trim());
      setDiagnosis(updated.daEscalationStatus === 'NOT_ESCALATED' ? { ...updated, daEscalationStatus: 'PENDING' } : updated);
      setEscalationSuccess(true);
      setNotes('');
    } catch (err) {
      setEscalationError(escalationErrorMessage(err));
    } finally {
      setEscalating(false);
    }
  };

  const backLink = (
    <Link to="/scan/history" style={styles.backLink}>
      <ArrowLeft size={18} /> Back to history
    </Link>
  );

  if (loading && !diagnosis) {
    return (
      <div style={styles.page}>
        <style>{'@keyframes cp-spin { to { transform: rotate(360deg); } }'}</style>
        {backLink}
        <div style={styles.state} role="status">
          <Loader2 size={28} style={{ animation: 'cp-spin 1s linear infinite' }} />
          Loading advisory…
        </div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div style={styles.page}>
        {backLink}
        <div style={{ ...styles.state, borderColor: '#ef9a9a', color: '#b71c1c' }} role="alert">
          <AlertTriangle size={28} />
          {loadError ?? 'Diagnosis not found.'}
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const { treatment } = diagnosis;
  const alreadyEscalated = diagnosis.daEscalationStatus !== 'NOT_ESCALATED';

  return (
    <div style={styles.page}>
      {backLink}
      <h1 style={styles.title}>Agronomic Advisory</h1>

      <div style={styles.grid}>
        <div style={styles.mainCol}>
          <DiagnosisResultCard diagnosis={diagnosis} />

          <Panel icon={<Stethoscope size={20} color="#2e7d32" />} title="Observed symptoms">
            <BulletList items={diagnosis.symptoms} emptyText="No symptoms were reported for this scan." />
          </Panel>

          <div style={styles.treatmentGrid}>
            <Panel icon={<Leaf size={20} color="#2e7d32" />} title="Organic control">
              <BulletList items={treatment.organicControl} emptyText="No organic control advice available." />
            </Panel>

            <Panel icon={<FlaskConical size={20} color="#e65100" />} title="Chemical control">
              <BulletList items={treatment.chemicalControl} emptyText="No chemical control advice available." />
              {treatment.chemicalControl.length > 0 && (
                <div style={styles.warning}>
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  Follow label dosage, wear protective equipment and confirm with your DA before applying.
                </div>
              )}
            </Panel>
          </div>

          <Panel icon={<ShieldCheck size={20} color="#00796b" />} title="Preventive measures">
            <BulletList items={treatment.preventiveMeasures} emptyText="No preventive measures listed." />
          </Panel>

          <Panel icon={<Store size={20} color="#00796b" />} title="Cooperative sourcing">
            {treatment.primaryCooperativeSourcing ? (
              <p style={{ margin: 0, color: '#334155' }}>{treatment.primaryCooperativeSourcing}</p>
            ) : (
              <p style={styles.empty}>Ask your local cooperative or DA for recommended input suppliers.</p>
            )}
          </Panel>
        </div>

        <aside style={styles.sideCol}>
          <Panel icon={<Send size={20} color="#e65100" />} title="Escalate to Development Agent">
            {alreadyEscalated ? (
              <div style={styles.success} role={escalationSuccess ? 'status' : undefined}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>
                  {escalationSuccess ? 'Case submitted for DA review. ' : ''}
                  Status: <strong>{ESCALATION_LABELS[diagnosis.daEscalationStatus]}</strong>
                </span>
              </div>
            ) : (
              <form onSubmit={handleEscalate}>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                  Not sure about the AI result or the disease is spreading? Send this case to your kebele
                  Development Agent for an expert review.
                </p>
                <label htmlFor="da-notes" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Notes for the DA (optional)
                </label>
                <textarea
                  id="da-notes"
                  style={{ ...styles.textarea, marginTop: '0.35rem' }}
                  value={notes}
                  maxLength={MAX_NOTES_LENGTH}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="e.g. Spots appeared 5 days ago and are spreading to neighbouring plots."
                  disabled={escalating}
                />
                <div style={styles.counter}>
                  {notes.length}/{MAX_NOTES_LENGTH}
                </div>
                <button
                  type="submit"
                  style={{ ...styles.primaryButton, ...(escalating ? { opacity: 0.7, cursor: 'wait' } : {}) }}
                  disabled={escalating}
                >
                  {escalating ? (
                    <Loader2 size={18} style={{ animation: 'cp-spin 1s linear infinite' }} />
                  ) : (
                    <Send size={18} />
                  )}
                  {escalating ? 'Submitting…' : 'Escalate to DA'}
                </button>
                {escalationError && (
                  <div style={styles.error} role="alert">
                    <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                    <span>{escalationError}</span>
                  </div>
                )}
              </form>
            )}
          </Panel>

          <Link to="/scan" style={{ ...styles.secondaryButton, justifyContent: 'center' }}>
            Scan another leaf
          </Link>
        </aside>
      </div>
      <style>{'@keyframes cp-spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}

export default DiagnosisDetailPage;
