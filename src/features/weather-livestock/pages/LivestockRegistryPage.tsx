
import React, { useEffect, useState, useCallback } from 'react';
import {
  HeartPulse, RefreshCw, AlertCircle, Plus, X,
  AlertTriangle, Syringe, Leaf, Activity,
} from 'lucide-react';
import {
  getLivestock,
  registerLivestock,
  getVaccinationCampaigns,
  getOutbreaks,
  reportOutbreak,
  getPastureMonitoring,
  getAnimalHealthStats,
} from '../services/weather-livestock.service';
import type {
  LivestockRecord,
  VaccinationCampaign,
  AnimalOutbreak,
  PastureMonitoring,
  AnimalHealthStats,
  LivestockSpecies,
  AlertSeverity,
  NewLivestockPayload,
} from '../types/weather-livestock.types';


const SEV_COLOR: Record<string, string> = {
  LOW: '#15803D', MODERATE: '#B45309', HIGH: '#C2410C', CRITICAL: '#991B1B',
};
const SEV_BG: Record<string, string> = {
  LOW: '#DCFCE7', MODERATE: '#FEF3C7', HIGH: '#FFEDD5', CRITICAL: '#FEE2E2',
};

const SPECIES_LABEL: Record<string, string> = {
  CATTLE: '🐄 Cattle', SHEEP: '🐑 Sheep', GOAT: '🐐 Goat',
  CAMEL: '🐪 Camel', POULTRY: '🐓 Poultry', EQUINE: '🐎 Equine',
};

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-ET', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
};

const ProgressBar: React.FC<{ value: number; max: number; color?: string }> = ({
  value, max, color = '#10B981',
}) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
};

type Tab = 'outbreaks' | 'vaccines' | 'pasture';


const PRESET_DISEASES = [
  { label: 'FMD (የአፍና እግር)', disease: 'Foot & Mouth Disease', animal: 'CATTLE', sev: 'HIGH' },
  { label: 'Anthrax (አንትራክስ)', disease: 'Anthrax', animal: 'CATTLE', sev: 'CRITICAL' },
  { label: 'CCPP (የፍየል ሳንባ)', disease: 'Contagious Caprine Pleuropneumonia', animal: 'GOAT', sev: 'HIGH' },
  { label: 'Newcastle (የዶሮ ቸነፈር)', disease: 'Newcastle Disease', animal: 'POULTRY', sev: 'HIGH' },
];


export const LivestockRegistryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('outbreaks');
  const [stats, setStats] = useState<AnimalHealthStats | null>(null);
  const [outbreaks, setOutbreaks] = useState<AnimalOutbreak[]>([]);
  const [campaigns, setCampaigns] = useState<VaccinationCampaign[]>([]);
  const [pasture, setPasture] = useState<PastureMonitoring[]>([]);
  const [livestock, setLivestock] = useState<LivestockRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showOutbreakForm, setShowOutbreakForm] = useState(false);
  const [obDisease, setObDisease] = useState('Foot & Mouth Disease');
  const [obAnimal, setObAnimal] = useState<LivestockSpecies>('CATTLE');
  const [obSeverity, setObSeverity] = useState<AlertSeverity>('HIGH');
  const [obCases, setObCases] = useState('5');
  const [obDeaths, setObDeaths] = useState('0');
  const [obKebele, setObKebele] = useState('');
  const [obQuarantine, setObQuarantine] = useState(true);
  const [obSubmitting, setObSubmitting] = useState(false);
  const [obError, setObError] = useState<string | null>(null);

  const [showLivestockForm, setShowLivestockForm] = useState(false);
  const [lsAnimal, setLsAnimal] = useState<LivestockSpecies>('CATTLE');
  const [lsCount, setLsCount] = useState('');
  const [lsBreed, setLsBreed] = useState('');
  const [lsSubmitting, setLsSubmitting] = useState(false);
  const [lsError, setLsError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, ob, camp, past, herd] = await Promise.all([
        getAnimalHealthStats().catch(() => null),
        getOutbreaks().catch(() => []),
        getVaccinationCampaigns().catch(() => []),
        getPastureMonitoring().catch(() => []),
        getLivestock().catch(() => []),
      ]);
      setStats(s);
      setOutbreaks(ob);
      setCampaigns(camp);
      setPasture(past);
      setLivestock(herd);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load animal health data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleReportOutbreak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!obDisease.trim()) { setObError('Disease name is required.'); return; }
    setObError(null);
    setObSubmitting(true);
    try {
      const created = await reportOutbreak({
        diseaseName: obDisease.trim(),
        animalType: obAnimal,
        severity: obSeverity,
        suspectedCases: parseInt(obCases) || 1,
        mortalities: parseInt(obDeaths) || 0,
        kebele: obKebele.trim() || undefined,
        quarantineStatus: obQuarantine,
      });
      setOutbreaks((prev) => [created, ...prev]);
      setShowOutbreakForm(false);
    } catch (err: unknown) {
      setObError(err instanceof Error ? err.message : 'Failed to report outbreak.');
    } finally {
      setObSubmitting(false);
    }
  };

  const handleRegisterLivestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lsCount || parseInt(lsCount) < 1) { setLsError('Head count is required.'); return; }
    setLsError(null);
    setLsSubmitting(true);
    try {
      const payload: NewLivestockPayload = {
        animalType: lsAnimal,
        headCount: parseInt(lsCount),
        breedName: lsBreed.trim() || undefined,
      };
      const created = await registerLivestock(payload);
      setLivestock((prev) => [created, ...prev]);
      setShowLivestockForm(false);
      setLsCount(''); setLsBreed('');
    } catch (err: unknown) {
      setLsError(err instanceof Error ? err.message : 'Failed to register livestock.');
    } finally {
      setLsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Tech header */}
      <div className="tech-header" style={{ background: 'linear-gradient(135deg, #064E3B, #047857, #065F46)' }}>
        <div className="live-pill">
          <span className="live-dot" style={{ background: '#4ADE80' }} />
          NATIONAL EPIDEMIOLOGICAL GRID · SENTINEL-2 LIVE
        </div>
        <h1 className="tech-header-title">Livestock &amp; Animal Health</h1>
        <p className="tech-header-sub">
          Disease outbreak surveillance, vaccination campaigns &amp; pasture monitoring
        </p>
      </div>

      {/* Stats bar */}
      {stats && !loading && (
        <div className="stats-row">
          <div className="stat-card" style={{ borderTop: '3px solid #ef4444' }}>
            <div className="stat-value" style={{ color: '#ef4444' }}>{stats.activeOutbreaksCount}</div>
            <div className="stat-label">Active Outbreaks</div>
          </div>
          <div className="stat-card" style={{ borderTop: '3px solid #3b82f6' }}>
            <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.activeVaccinationCampaignsCount}</div>
            <div className="stat-label">Active Campaigns</div>
          </div>
          <div className="stat-card" style={{ borderTop: '3px solid #10B981' }}>
            <div className="stat-value" style={{ color: '#10B981' }}>{stats.totalVaccinatedCount.toLocaleString()}</div>
            <div className="stat-label">Total Vaccinated</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: SEV_COLOR[stats.overallRiskLevel] ?? 'var(--text-primary)' }}>
              {stats.overallRiskLevel}
            </div>
            <div className="stat-label">Overall Risk</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{(stats.pastureConditionIndex * 100).toFixed(0)}%</div>
            <div className="stat-label">Biomass Index</div>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0' }}>
        {([
          { id: 'outbreaks', label: 'Outbreaks', icon: <AlertTriangle size={15} /> },
          { id: 'vaccines', label: 'Vaccines', icon: <Syringe size={15} /> },
          { id: 'pasture', label: 'Pasture (NDVI)', icon: <Leaf size={15} /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0.5rem 1rem', cursor: 'pointer', border: 'none',
              background: 'transparent', fontFamily: 'inherit',
              fontSize: '0.85rem', fontWeight: 600,
              color: activeTab === tab.id ? '#10B981' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '3px solid #10B981' : '3px solid transparent',
              marginBottom: -2,
              transition: 'color 0.15s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost" onClick={loadAll} disabled={loading} style={{ marginBottom: 4 }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="state-card loading-state" aria-live="polite" aria-busy="true">
          <div className="spinner" aria-hidden="true" />
          <p>Loading animal health data…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="state-card error-state" role="alert">
          <AlertCircle size={28} />
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={loadAll}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* ── OUTBREAKS TAB ── */}
      {!loading && !error && activeTab === 'outbreaks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-danger"
              onClick={() => setShowOutbreakForm((v) => !v)}
            >
              <AlertTriangle size={14} /> Report Outbreak
            </button>
          </div>

          {showOutbreakForm && (
            <div className="form-card" style={{ border: '1px solid #fca5a5', background: '#fef2f2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="form-section-title" style={{ color: '#991B1B' }}>
                  🚨 Report Disease Outbreak
                </h3>
                <button className="btn btn-ghost" onClick={() => setShowOutbreakForm(false)}>
                  <X size={16} />
                </button>
              </div>

              {/* Preset disease chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {PRESET_DISEASES.map((p) => (
                  <button
                    key={p.disease}
                    type="button"
                    className="chip"
                    onClick={() => {
                      setObDisease(p.disease);
                      setObAnimal(p.animal as LivestockSpecies);
                      setObSeverity(p.sev as AlertSeverity);
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleReportOutbreak} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Disease Name *</label>
                    <input className="form-input" value={obDisease}
                      onChange={(e) => setObDisease(e.target.value)} placeholder="Disease name…" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Species *</label>
                    <select className="form-select" value={obAnimal}
                      onChange={(e) => setObAnimal(e.target.value as LivestockSpecies)}>
                      {Object.entries(SPECIES_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Severity *</label>
                    <select className="form-select" value={obSeverity}
                      style={{ borderColor: SEV_COLOR[obSeverity], color: SEV_COLOR[obSeverity] }}
                      onChange={(e) => setObSeverity(e.target.value as AlertSeverity)}>
                      {['LOW','MODERATE','HIGH','CRITICAL'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Suspected Head</label>
                    <input className="form-input" type="number" min="1" value={obCases}
                      onChange={(e) => setObCases(e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Mortalities</label>
                    <input className="form-input" type="number" min="0" value={obDeaths}
                      onChange={(e) => setObDeaths(e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Kebele / Village</label>
                    <input className="form-input" value={obKebele}
                      onChange={(e) => setObKebele(e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(220,38,38,0.08)', borderRadius: 'var(--radius)', padding: '0.625rem 0.875rem' }}>
                  <AlertTriangle size={18} color="#DC2626" />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', flex: 1 }}>Declare Quarantine Movement Ring</span>
                  <input type="checkbox" checked={obQuarantine}
                    onChange={(e) => setObQuarantine(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }} />
                </div>
                {obError && <p className="field-error">{obError}</p>}
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowOutbreakForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-danger" disabled={obSubmitting}>
                    <AlertTriangle size={14} />
                    {obSubmitting ? 'Transmitting…' : 'Broadcast Outbreak Alert'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {outbreaks.length === 0 ? (
            <div className="state-card empty-state">
              <HeartPulse size={48} />
              <p>No active outbreaks reported.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {outbreaks.map((ob) => (
                <div key={ob.id} className="alert-card" style={{ borderLeft: `4px solid ${SEV_COLOR[ob.severity] ?? '#64748b'}` }}>
                  <div className="alert-card-header">
                    <div className="alert-severity-icon"
                      style={{ background: SEV_BG[ob.severity], color: SEV_COLOR[ob.severity] }}>
                      <AlertTriangle size={22} />
                    </div>
                    <div className="alert-card-meta">
                      <div className="alert-card-title">{ob.diseaseName}</div>
                      <div className="alert-card-hazard">
                        {SPECIES_LABEL[ob.animalType] ?? ob.animalType}
                        {ob.woredaName ? ` · ${ob.woredaName}` : ''}
                      </div>
                    </div>
                    <span className={`risk-badge ${ob.severity.toLowerCase()}`}>{ob.severity}</span>
                  </div>
                  <div className="alert-card-footer">
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {ob.suspectedCases} suspected · {ob.mortalities ?? 0} deaths
                    </span>
                    <span className="alert-meta-text">{formatDate(ob.reportedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VACCINES TAB ── */}
      {!loading && !error && activeTab === 'vaccines' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setShowLivestockForm((v) => !v)}>
              <Plus size={14} /> Register Livestock
            </button>
          </div>

          {showLivestockForm && (
            <div className="form-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="form-section-title">Register Livestock</h3>
                <button className="btn btn-ghost" onClick={() => setShowLivestockForm(false)}>
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleRegisterLivestock} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Species *</label>
                    <select className="form-select" value={lsAnimal}
                      onChange={(e) => setLsAnimal(e.target.value as LivestockSpecies)}>
                      {Object.entries(SPECIES_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Head Count *</label>
                    <input className="form-input" type="number" min="1" value={lsCount}
                      onChange={(e) => setLsCount(e.target.value)} placeholder="e.g. 50" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Breed (optional)</label>
                    <input className="form-input" value={lsBreed}
                      onChange={(e) => setLsBreed(e.target.value)} placeholder="e.g. Borana" />
                  </div>
                </div>
                {lsError && <p className="field-error">{lsError}</p>}
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowLivestockForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={lsSubmitting}>
                    {lsSubmitting ? 'Registering…' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vaccination campaigns */}
          {campaigns.length > 0 && (
            <div className="section-card">
              <h3 className="section-title">Vaccination Campaigns</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {campaigns.map((c) => {
                  const pct = c.coveragePercent ?? (c.targetCount > 0 ? Math.round((c.vaccinatedCount / c.targetCount) * 100) : 0);
                  const color = c.status === 'COMPLETE' ? '#10B981' : c.status === 'IN_PROGRESS' ? '#0ea5e9' : '#f97316';
                  return (
                    <div key={c.id} style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 4 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.title ?? c.diseaseTarget}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {SPECIES_LABEL[c.animalType] ?? c.animalType}
                            {c.woredaName ? ` · ${c.woredaName}` : ''}
                          </div>
                        </div>
                        <span className="status-badge" style={{ color, border: `1px solid ${color}22`, background: `${color}11` }}>
                          {c.status}
                        </span>
                      </div>
                      <ProgressBar value={c.vaccinatedCount} max={c.targetCount} color={color} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                        <span>{c.vaccinatedCount.toLocaleString()} / {c.targetCount.toLocaleString()} animals</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Livestock herd */}
          {livestock.length > 0 && (
            <div className="section-card">
              <h3 className="section-title">Registered Herd</h3>
              <div className="risk-grid">
                {livestock.map((h) => (
                  <div key={h.id} className="risk-card">
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{SPECIES_LABEL[h.animalType] ?? h.animalType}</div>
                    {h.breedName && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.breedName}</div>}
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
                      {h.headCount.toLocaleString()} head
                    </div>
                    <span className={`risk-badge ${h.healthStatus === 'HEALTHY' ? 'low' : h.healthStatus === 'SICK' ? 'high' : 'critical'}`}>
                      {h.healthStatus}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {formatDate(h.registeredAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {campaigns.length === 0 && livestock.length === 0 && (
            <div className="state-card empty-state">
              <Activity size={48} />
              <p>No vaccination campaigns or herd records found.</p>
            </div>
          )}
        </div>
      )}

      {/* ── PASTURE TAB ── */}
      {!loading && !error && activeTab === 'pasture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pasture.length === 0 ? (
            <div className="state-card empty-state">
              <Leaf size={48} />
              <p>No pasture monitoring data available.</p>
            </div>
          ) : (
            <div className="risk-grid">
              {pasture.map((p, idx) => {
                const ndvi = p.biomassIndex;
                const color = ndvi >= 0.65 ? '#10B981' : ndvi >= 0.5 ? '#4CAF50' : ndvi >= 0.35 ? '#F59E0B' : '#DC2626';
                const pct = Math.min(ndvi * 100, 100);
                return (
                  <div key={idx} className="risk-card">
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.woredaName ?? p.woredaId}</div>
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Biomass Index (NDVI)</span>
                        <span style={{ fontWeight: 700, color }}>{ndvi.toFixed(2)}</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                      {p.vegetationCondition}
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: 8 }}>
                      <span className={`risk-badge compact ${p.droughtStress ? 'high' : 'low'}`}>
                        {p.droughtStress ? 'Drought Stress' : 'Normal'}
                      </span>
                      <span className="risk-badge compact" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                        💧 {p.waterAvailability}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                      {p.recommendedMove}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
