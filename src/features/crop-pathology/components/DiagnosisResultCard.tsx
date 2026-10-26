
import type { CSSProperties } from 'react';
import { ChevronRight, Leaf, ShieldAlert } from 'lucide-react';
import type { DAEscalationStatus, DiagnosisRecord, DiseaseSeverity } from '../types/crop-pathology.types';

export const SEVERITY_STYLES: Record<DiseaseSeverity, { label: string; color: string; background: string }> = {
  NONE: { label: 'Healthy', color: '#1b5e20', background: '#e8f5e9' },
  LOW: { label: 'Low', color: '#2e7d32', background: '#e8f5e9' },
  MODERATE: { label: 'Moderate', color: '#e65100', background: '#fff3e0' },
  HIGH: { label: 'High', color: '#bf360c', background: '#fbe9e7' },
  CRITICAL: { label: 'Critical', color: '#b71c1c', background: '#ffebee' },
};

const SEVERITY_BAR_COLORS: Record<DiseaseSeverity, string> = {
  NONE: '#2e7d32',
  LOW: '#43a047',
  MODERATE: '#fb8c00',
  HIGH: '#f4511e',
  CRITICAL: '#d32f2f',
};

export const ESCALATION_LABELS: Record<DAEscalationStatus, string> = {
  NOT_ESCALATED: 'Not escalated',
  PENDING: 'Escalation pending',
  UNDER_REVIEW: 'Under DA review',
  RESOLVED: 'Resolved by DA',
};

export function SeverityBadge({ severity }: { severity: DiseaseSeverity }) {
  const { label, color, background } = SEVERITY_STYLES[severity];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.6rem',
        borderRadius: 999,
        fontSize: '0.75rem',
        fontWeight: 600,
        color,
        background,
        border: `1px solid ${color}33`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

export interface DiagnosisResultCardProps {
  diagnosis: DiagnosisRecord;
  onViewDetails?: (id: string) => void;
}

const styles: Record<string, CSSProperties> = {
  card: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1rem',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#1e293b',
    textAlign: 'left',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
  },
  thumb: {
    width: 120,
    height: 120,
    flexShrink: 0,
    borderRadius: 8,
    objectFit: 'cover',
    background: '#f1f5f9',
  },
  thumbPlaceholder: {
    width: 120,
    height: 120,
    flexShrink: 0,
    borderRadius: 8,
    background: '#e8f5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' },
  crop: { fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' },
  disease: { margin: 0, fontSize: '1.15rem', lineHeight: 1.3 },
  confidenceRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569' },
  track: { height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' },
  symptoms: { margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem', color: '#475569' },
  footer: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' },
  escalation: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#64748b' },
  detailsButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
    padding: '0.4rem 0.8rem',
    borderRadius: 8,
    border: '1px solid #2e7d32',
    background: '#2e7d32',
    color: '#ffffff',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};

export function DiagnosisResultCard({ diagnosis, onViewDetails }: DiagnosisResultCardProps) {
  const confidencePct = Math.round(diagnosis.confidenceScore * 100);
  const visibleSymptoms = diagnosis.symptoms.slice(0, 3);

  return (
    <article style={styles.card} aria-label={`Diagnosis: ${diagnosis.diseaseIdentified}`}>
      {diagnosis.imageUrl ? (
        <img src={diagnosis.imageUrl} alt={`${diagnosis.cropName} leaf`} style={styles.thumb} loading="lazy" />
      ) : (
        <div style={styles.thumbPlaceholder} aria-hidden>
          <Leaf size={40} color="#2e7d32" />
        </div>
      )}

      <div style={styles.body}>
        <div style={styles.header}>
          <div style={{ minWidth: 0 }}>
            <div style={styles.crop}>{diagnosis.cropName}</div>
            <h3 style={styles.disease}>{diagnosis.diseaseIdentified}</h3>
          </div>
          <SeverityBadge severity={diagnosis.severity} />
        </div>

        <div>
          <div style={styles.confidenceRow}>
            <span>AI confidence</span>
            <strong>{confidencePct}%</strong>
          </div>
          <div
            style={styles.track}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={confidencePct}
            aria-label="AI confidence"
          >
            <div
              style={{
                width: `${confidencePct}%`,
                height: '100%',
                background: SEVERITY_BAR_COLORS[diagnosis.severity],
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {visibleSymptoms.length > 0 && (
          <ul style={styles.symptoms}>
            {visibleSymptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        )}

        <div style={styles.footer}>
          <span style={styles.escalation}>
            <ShieldAlert size={14} /> {ESCALATION_LABELS[diagnosis.daEscalationStatus]}
          </span>
          {onViewDetails && (
            <button type="button" style={styles.detailsButton} onClick={() => onViewDetails(diagnosis.id)}>
              View advisory <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default DiagnosisResultCard;
