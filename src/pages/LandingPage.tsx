import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  ShieldAlert,
  Activity,
  Microscope,
  Cpu,
  Radio,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Users,
  Award,
  Zap,
  Leaf,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  Satellite,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const roles = [
    {
      title: 'Smallholder Farmers',
      icon: Leaf,
      color: '#16A34A',
      benefits: [
        'AI plant pathology identification directly from mobile camera',
        'Localized micro-weather forecasts and optimal spraying windows',
        'Livestock veterinary records and disease vaccination tracking',
        'Offline mobile app and SMS alerts without requiring continuous internet',
      ],
      linkText: 'Sign In as Farmer',
    },
    {
      title: 'Extension Agents',
      icon: Users,
      color: '#0284C7',
      benefits: [
        'High-precision GPS parcel polygon boundary mapping',
        'Automated agronomy extension advisory dispatch to farming clusters',
        'Kebele wireless IoT soil and micro-weather telemetry monitoring',
        'Rapid disease outbreak reporting directly to Woreda experts',
      ],
      linkText: 'Sign In as Extension Agent',
    },
    {
      title: 'Woreda & Zonal Officers',
      icon: Activity,
      color: '#D97706',
      benefits: [
        'District-wide food security surveillance and harvest forecasts',
        'Emergency mass advisory and SMS broadcast console',
        'Multi-hazard disaster risk mitigation (drought, flood, frost)',
        'Agricultural input and fertilizer supply-chain distribution tracking',
      ],
      linkText: 'Sign In as Woreda Officer',
    },
    {
      title: 'Agronomic Researchers',
      icon: Microscope,
      color: '#7C3AED',
      benefits: [
        'Multi-spectral Sentinel-2 NDVI satellite vegetation index feeds',
        'Soil degradation, erosion, and nutrient depletion spatial models',
        'Epidemiological pest migration radar and vector tracking',
        'Exportable high-density agro-climatic datasets',
      ],
      linkText: 'Sign In as Researcher',
    },
    {
      title: 'Agricultural Administrators',
      icon: Award,
      color: '#059669',
      benefits: [
        'Executive real-time national agricultural health dashboard',
        'Strategic grain reserve and yield forecast analytics',
        'Inter-regional disaster response and emergency relief coordination',
        'National agricultural program monitoring and reporting',
      ],
      linkText: 'Sign In as Administrator',
    },
  ];

  const features = [
    {
      id: 0,
      title: 'AI Computer Vision & Plant Pathology',
      icon: Microscope,
      color: '#16A34A',
      summary:
        'Mobile deep-learning models detect and classify 32+ endemic plant diseases and pests (wheat rust, maize fall armyworm, teff smut, coffee berry disease) with 94.8% field accuracy directly from camera photo.',
      metric: '94.8% Accuracy',
      submetric: 'Validated across local Ethiopian crop varieties',
    },
    {
      id: 1,
      title: 'IoT Micro-Climate & Soil Probes',
      icon: Cpu,
      color: '#0284C7',
      summary:
        'Solar-powered wireless LoRaWAN sensor nodes placed across farm parcels stream real-time volumetric soil water content, temperature, nitrogen-phosphorus-potassium balance, and micro-atmospheric rainfall.',
      metric: 'Real-time Telemetry',
      submetric: 'Ultra-low power solar nodes with long wireless range',
    },
    {
      id: 2,
      title: 'Multi-Hazard Early Warning Radar',
      icon: ShieldAlert,
      color: '#DC2626',
      summary:
        'Predictive spatial modeling for sudden highland frosts, landslide risks in hilly slopes, Rift Valley flash floods, and desert locust migration paths with automated SMS alert dispatch.',
      metric: 'Fast Warning Dispatch',
      submetric: 'Instant emergency alerts to affected farming clusters',
    },
    {
      id: 3,
      title: 'Multilingual Voice & SMS Advisory',
      icon: Radio,
      color: '#D97706',
      summary:
        'Zero-barrier rural accessibility: farmers receive instant automated crop advice, weather forecasts, and market notices via SMS and voice guidance in Amharic, Afaan Oromoo, Tigrinya, and Somali.',
      metric: 'Rural Access',
      submetric: 'Works across standard mobile cellular networks without high-speed data',
    },
  ];

  const faqs = [
    {
      q: 'Is EthioFarm accessible for smallholder farmers?',
      a: 'Yes, completely accessible. Farmers can register parcels, access AI crop diagnostics, and receive weather alerts without any subscription barrier.',
    },
    {
      q: 'Can farmers receive advisories in rural areas with low connectivity?',
      a: 'Yes! Farmers receive localized weather bulletins, pest emergency warnings, and audio advisories directly via SMS and localized voice calls in their regional language.',
    },
    {
      q: 'How accurate is the AI crop leaf disease scanner?',
      a: 'The diagnostic computer vision models achieve 94.8% field accuracy on major Ethiopian crops including teff, wheat, maize, barley, and coffee, validated with regional agricultural experts.',
    },
    {
      q: 'Which languages are supported on the platform?',
      a: 'The platform natively supports Amharic (አማርኛ), Afaan Oromoo, Tigrinya (ትግርኛ), Somali (Soomaali), and English across web, mobile, SMS, and voice channels.',
    },
    {
      q: 'How do agricultural officers and DAs get administrative access?',
      a: 'Authorized agricultural personnel receive designated credentials from their respective Woreda or Regional Agricultural Bureaus. Users may also submit an in-app verification request.',
    },
  ];

  return (
    <div className="landing-page-root">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="landing-hero-section">
        {/* Background Image with Cinematic Dark Gradient Vignette */}
        <div className="landing-hero-bg">
          <img
            src="/hero_banner.jpg"
            alt="Ethiopian Smart Agriculture Landscape"
            className="landing-hero-img"
          />
          <div className="landing-hero-overlay" />
        </div>

        <div className="landing-container landing-hero-content">
          <h1 className="landing-hero-title">
            Transforming Ethiopian Agriculture Through{' '}
            <span className="landing-text-highlight">Climate-Resilient Intelligence</span>
          </h1>

          <p className="landing-hero-subtitle">
            Connecting smallholder farmers, extension agents, and agronomic researchers with real-time AI
            plant pathology vision, IoT micro-climate telemetry, Sentinel-2 satellite vegetation index, and
            automated SMS and mobile early warning bulletins.
          </p>

          <div className="landing-hero-actions">
            <Link
              to={isAuthenticated ? '/overview' : '/login'}
              className="landing-btn landing-btn-primary"
            >
              <Zap size={18} />
              <span>{isAuthenticated ? 'Enter Live Dashboard' : 'Launch Web Platform'}</span>
            </Link>
            <Link to="/features" className="landing-btn landing-btn-secondary">
              <Layers size={18} />
              <span>Explore Platform Features</span>
            </Link>
          </div>

          {/* Realtime Stream Status Indicator */}
          <div className="landing-telemetry-indicator">
            <span className="landing-pulse-dot" />
            <span>Live Telemetry Stream Active: Ethiopia Meher Crop Season</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. LIVE KPI METRICS STRIP
          ========================================================================= */}
      <section className="landing-kpi-section">
        <div className="landing-container">
          <div className="landing-kpi-card">
            <div className="landing-kpi-grid">
              <div className="landing-kpi-item">
                <div className="landing-kpi-value" style={{ color: '#16A34A' }}>120,000+</div>
                <div className="landing-kpi-label">Hectares Monitored</div>
                <div className="landing-kpi-sub">Sentinel-2 & High-Res Radar</div>
              </div>
              <div className="landing-kpi-divider" />
              <div className="landing-kpi-item">
                <div className="landing-kpi-value" style={{ color: '#0284C7' }}>94.8%</div>
                <div className="landing-kpi-label">AI Diagnosis Precision</div>
                <div className="landing-kpi-sub">Trained on local Ethiopian crops</div>
              </div>
              <div className="landing-kpi-divider" />
              <div className="landing-kpi-item">
                <div className="landing-kpi-value" style={{ color: '#D97706' }}>18,400+</div>
                <div className="landing-kpi-label">Kebeles Integrated</div>
                <div className="landing-kpi-sub">Nationwide Woreda GIS Boundaries</div>
              </div>
              <div className="landing-kpi-divider" />
              <div className="landing-kpi-item">
                <div className="landing-kpi-value" style={{ color: '#DC2626' }}>&lt; 30 sec</div>
                <div className="landing-kpi-label">Emergency Broadcast</div>
                <div className="landing-kpi-sub">SMS, Push Alerts & Multilingual Voice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. TECHNOLOGICAL FEATURES SHOWCASE
          ========================================================================= */}
      <section className="landing-section" id="features">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Comprehensive National Agricultural Infrastructure</h2>
            <p className="landing-section-subtitle">
              From remote highland mountain terraces to lowland river basins, EthioFarm unifies cutting-edge
              science with grassroots agricultural extension.
            </p>
          </div>

          <div className="landing-features-layout">
            {/* Left: Feature Pillars */}
            <div className="landing-features-list">
              {features.map((f, idx) => {
                const isSelected = activeFeature === idx;
                const Icon = f.icon;
                return (
                  <div
                    key={f.id}
                    onClick={() => setActiveFeature(idx)}
                    className={`landing-feature-card ${isSelected ? 'active' : ''}`}
                    style={{ borderColor: isSelected ? f.color : 'transparent' }}
                  >
                    <div
                      className="landing-feature-icon-box"
                      style={{
                        backgroundColor: `${f.color}15`,
                        color: f.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="landing-feature-card-content">
                      <div className="landing-feature-card-header">
                        <h3 className="landing-feature-card-title">{f.title}</h3>
                      </div>
                      <p className="landing-feature-card-desc">{f.summary}</p>
                      {isSelected && (
                        <div className="landing-feature-metric-row">
                          <span className="landing-feature-metric-val">{f.metric}</span>
                          <span className="landing-feature-metric-sub">{f.submetric}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: AI Crop Vision Graphic Card */}
            <div className="landing-features-graphic-card">
              <img
                src="/ai_diagnosis.jpg"
                alt="AI Plant Pathology Diagnosis in Action"
                className="landing-graphic-img"
              />
              <div className="landing-graphic-overlay">
                <h3 className="landing-graphic-title">Instant Leaf Pathology Diagnosis in Real Time</h3>
                <p className="landing-graphic-desc">
                  Extension agents and farmers capture leaf photos to receive instant diagnosis, confidence score,
                  treatment recommendations, and spray window timings.
                </p>
                <Link to="/scan" className="landing-graphic-link">
                  <span>Try AI Diagnostic Simulator</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. AGRO-CLIMATIC INTELLIGENCE & SATELLITE RADAR
          ========================================================================= */}
      <section className="landing-section landing-section-alt" id="intelligence">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Integrated Climate Intelligence & Early Warning</h2>
            <p className="landing-section-subtitle">
              Micro-climate observations, satellite remote sensing, and proactive hazard warnings designed for
              Ethiopia's primary agro-ecological regions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CloudSun size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Micro-Climate Forecasts</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                High-resolution rainfall estimates, humidity tracking, and spray window calculations tailored to local woreda topography.
              </p>
              <Link to="/weather" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284C7', fontWeight: 600, fontSize: '0.88rem' }}>
                <span>View Weather Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldAlert size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Multi-Hazard Alerts</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                Predictive early warning models for sudden nocturnal frosts, locust swarm trajectories, and flash flood catchments.
              </p>
              <Link to="/hazards" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#DC2626', fontWeight: 600, fontSize: '0.88rem' }}>
                <span>Open Hazard Radar</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Satellite size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sentinel-2 Vegetation Index</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                Regular satellite NDVI canopy density analysis detecting moisture stress and crop anomalies before visual onset.
              </p>
              <Link to="/advisories" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#16A34A', fontWeight: 600, fontSize: '0.88rem' }}>
                <span>Read Advisories</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. STAKEHOLDER ECOSYSTEM ("BUILT FOR EVERY ROLE")
          ========================================================================= */}
      <section className="landing-section" id="ecosystem">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Engineered for Every Agricultural Stakeholder</h2>
            <p className="landing-section-subtitle">
              A unified platform seamlessly connecting grassroots farmers to administrative leaders with
              role-specialized tools and governance workflows.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="landing-role-tabs">
            {roles.map((r, idx) => {
              const isSelected = selectedRole === idx;
              const Icon = r.icon;
              return (
                <button
                  key={r.title}
                  onClick={() => setSelectedRole(idx)}
                  className={`landing-role-tab ${isSelected ? 'active' : ''}`}
                  style={{
                    backgroundColor: isSelected ? r.color : 'transparent',
                    borderColor: isSelected ? r.color : 'var(--border)',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  }}
                >
                  <Icon size={16} />
                  <span>{r.title}</span>
                </button>
              );
            })}
          </div>

          {/* Role Detail Card */}
          <div
            className="landing-role-card"
            style={{ borderColor: `${roles[selectedRole].color}50` }}
          >
            <div className="landing-role-card-header">
              <div
                className="landing-role-avatar"
                style={{
                  backgroundColor: `${roles[selectedRole].color}15`,
                  color: roles[selectedRole].color,
                }}
              >
                {React.createElement(roles[selectedRole].icon, { size: 32 })}
              </div>
              <div>
                <h3 className="landing-role-card-title">{roles[selectedRole].title}</h3>
              </div>
            </div>

            <div className="landing-role-benefits-list">
              {roles[selectedRole].benefits.map((b) => (
                <div key={b} className="landing-role-benefit-item">
                  <CheckCircle2 size={18} color={roles[selectedRole].color} />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="landing-role-card-action">
              <Link
                to="/login"
                className="landing-btn"
                style={{ backgroundColor: roles[selectedRole].color, color: '#ffffff' }}
              >
                <span>{roles[selectedRole].linkText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FREQUENTLY ASKED QUESTIONS (FAQ)
          ========================================================================= */}
      <section className="landing-section" id="faq">
        <div className="landing-container landing-faq-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Frequently Asked Questions</h2>
            <p className="landing-section-subtitle">
              Clear answers on farmer accessibility, offline field connectivity, and platform capabilities.
            </p>
          </div>

          <div className="landing-faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className={`landing-faq-card ${isOpen ? 'open' : ''}`}>
                  <button
                    className="landing-faq-toggle"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && <p className="landing-faq-answer">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FINAL CALL TO ACTION (CTA)
          ========================================================================= */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <div className="landing-cta-card">
            <Leaf size={42} color="#86EFAC" />
            <h2 className="landing-cta-title">Ready to Experience Modern Farming Intelligence?</h2>
            <p className="landing-cta-desc">
              Join agricultural extension agents and farmers transforming crop health, yield
              predictability, and digital farm records today.
            </p>
            <div className="landing-cta-actions">
              <Link to="/register" className="landing-btn landing-btn-white">
                <span>Create Free Account</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="landing-btn landing-btn-outline-white">
                <span>Sign In to Web Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
