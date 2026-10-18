/**
 * @file ScanCropPage.tsx
 * @owner Zinegnaw
 * @feature Crop AI & Plant Pathology
 */

import { useEffect, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { History, Loader2, ScanLine, AlertTriangle } from 'lucide-react';
import { CameraViewfinder } from '../components/CameraViewfinder';
import { useCropDiagnosis } from '../hooks/useCropDiagnosis';
import type { CropType } from '../types/crop-pathology.types';

const CROP_OPTIONS: { value: CropType; label: string }[] = [
  { value: 'Teff', label: 'Teff (ጤፍ)' },
  { value: 'Coffee', label: 'Coffee (ቡና)' },
  { value: 'Maize', label: 'Maize (በቆሎ)' },
  { value: 'Wheat', label: 'Wheat (ስንዴ)' },
  { value: 'Barley', label: 'Barley (ገብስ)' },
];

const PROGRESS_STEPS = [
  'Uploading leaf photo…',
  'Identifying plant species…',
  'Analysing lesions and discoloration…',
  'Preparing treatment advisory…',
];

const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem', color: '#1e293b', textAlign: 'left' },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  title: { margin: 0, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', lineHeight: 1.2 },
  subtitle: { margin: '0.35rem 0 0', color: '#64748b' },
  historyLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#2e7d32',
    fontWeight: 600,
  },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' },
  viewfinderCol: { flex: '1 1 420px', minWidth: 0 },
  formCol: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.25rem',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
  },
  label: { display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 600, fontSize: '0.9rem' },
  input: {
    padding: '0.6rem 0.75rem',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    background: '#ffffff',
    color: '#1e293b',
    fontWeight: 400,
  },
  hint: { fontWeight: 400, fontSize: '0.8rem', color: '#64748b' },
  submit: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: 8,
    border: 'none',
    background: '#2e7d32',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.75rem',
    borderRadius: 8,
    background: '#e8f5e9',
    color: '#1b5e20',
    fontSize: '0.9rem',
  },
  error: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    padding: '0.75rem',
    borderRadius: 8,
    background: '#ffebee',
    color: '#b71c1c',
    fontSize: '0.9rem',
  },
};

export function ScanCropPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { analyzing, error, scanLeaf, clearResult } = useCropDiagnosis();

  const [file, setFile] = useState<File | null>(null);
  const [cropHint, setCropHint] = useState<CropType>('Teff');
  const [farmId, setFarmId] = useState(searchParams.get('farmId') ?? '');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!analyzing) {
      setStepIndex(0);
      return;
    }
    const timer = window.setInterval(
      () => setStepIndex((index) => Math.min(index + 1, PROGRESS_STEPS.length - 1)),
      2500,
    );
    return () => window.clearInterval(timer);
  }, [analyzing]);

  const handleFileChange = (next: File | null) => {
    setFile(next);
    if (error) clearResult();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || analyzing) return;
    const result = await scanLeaf({ imageFile: file, cropHint, farmId: farmId.trim() });
    if (result) {
      navigate(`/scan/${encodeURIComponent(result.id)}`, { state: { diagnosis: result } });
    }
  };

  const canSubmit = !!file && !analyzing;

  return (
    <div style={styles.page}>
      <style>{'@keyframes cp-spin { to { transform: rotate(360deg); } }'}</style>

      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Crop Disease Scanner</h1>
          <p style={styles.subtitle}>Upload or capture a clear photo of an affected leaf for AI diagnosis.</p>
        </div>
        <Link to="/scan/history" style={styles.historyLink}>
          <History size={18} /> Diagnosis history
        </Link>
      </header>

      <form style={styles.grid} onSubmit={handleSubmit} noValidate>
        <section style={styles.viewfinderCol} aria-label="Leaf photo">
          <CameraViewfinder file={file} onFileChange={handleFileChange} disabled={analyzing} />
        </section>

        <section style={styles.formCol} aria-label="Scan details">
          <label style={styles.label}>
            Crop species
            <select
              style={styles.input}
              value={cropHint}
              onChange={(event) => setCropHint(event.target.value as CropType)}
              disabled={analyzing}
            >
              {CROP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Farm ID <span style={styles.hint}>(optional — links the scan to a registered farm)</span>
            <input
              style={styles.input}
              type="text"
              value={farmId}
              onChange={(event) => setFarmId(event.target.value)}
              placeholder="e.g. farm-uuid"
              disabled={analyzing}
              autoComplete="off"
            />
          </label>

          <button
            type="submit"
            style={{ ...styles.submit, ...(canSubmit ? {} : { opacity: 0.6, cursor: 'not-allowed' }) }}
            disabled={!canSubmit}
          >
            {analyzing ? (
              <Loader2 size={20} style={{ animation: 'cp-spin 1s linear infinite' }} />
            ) : (
              <ScanLine size={20} />
            )}
            {analyzing ? 'Analysing…' : 'Diagnose leaf'}
          </button>

          {!file && !analyzing && <span style={styles.hint}>Add a leaf photo to enable diagnosis.</span>}

          {analyzing && (
            <div style={styles.progress} role="status" aria-live="polite">
              <Loader2 size={18} style={{ animation: 'cp-spin 1s linear infinite', flexShrink: 0 }} />
              {PROGRESS_STEPS[stepIndex]}
            </div>
          )}

          {error && !analyzing && (
            <div style={styles.error} role="alert">
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </section>
      </form>
    </div>
  );
}

export default ScanCropPage;
