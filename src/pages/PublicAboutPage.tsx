import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Building2,
  Leaf,
  PhoneCall,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const PublicAboutPage: React.FC = () => {
  const regions = [
    { name: 'Oromia Region', color: '#16A34A' },
    { name: 'Amhara Region', color: '#0284C7' },
    { name: 'Sidama Region', color: '#D97706' },
    { name: 'South Ethiopia Region', color: '#7C3AED' },
    { name: 'Central Ethiopia Region', color: '#059669' },
    { name: 'Tigray Region', color: '#EA580C' },
    { name: 'Somali Region', color: '#DC2626' },
    { name: 'Afar Region', color: '#B45309' },
    { name: 'Benishangul-Gumuz', color: '#10B981' },
    { name: 'Gambella Region', color: '#0D9488' },
    { name: 'Harari Region', color: '#6366F1' },
    { name: 'Dire Dawa Administration', color: '#EC4899' },
    { name: 'Addis Ababa Urban Agriculture', color: '#15803D' },
  ];

  return (
    <div className="landing-page-root">
      {/* Header Banner */}
      <section className="landing-subpage-header">
        <div className="landing-container">
          <h1 className="landing-subpage-title">About EthioFarm Platform</h1>
          <p className="landing-subpage-desc">
            A comprehensive smart agriculture initiative modernizing farming operations through climate-resilient
            intelligence, digital cadastral extension, and inclusive rural connectivity.
          </p>
        </div>
      </section>

      {/* Purpose & Context */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-about-split">
            <div className="landing-about-text">
              <h2 className="landing-section-title">
                Democratizing Precision Agronomy for Smallholder Farmers
              </h2>
              <p className="landing-about-paragraph">
                Agriculture is the backbone of the Ethiopian society, supporting millions of households
                and representing the primary livelihood across the nation. Yet, smallholder cultivators face
                growing climate volatility, including unseasonal frosts, localized droughts, soil acidity, and
                unpredictable pest occurrences.
              </p>
              <p className="landing-about-paragraph">
                EthioFarm bridges the gap between state-of-the-art satellite earth observation and smallholder
                farming plots. By equipping agricultural extension agents with offline computer vision models and
                giving farmers real-time SMS and mobile advice, EthioFarm empowers farming communities to safeguard yields,
                optimize inputs, and build sustainable resilience.
              </p>

              <div className="landing-about-highlights">
                <div className="landing-about-highlight-item">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Designed specifically for Ethiopian agro-climatic conditions and major crops</span>
                </div>
                <div className="landing-about-highlight-item">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Offline-first architecture enabling full functionality in remote rural kebeles</span>
                </div>
                <div className="landing-about-highlight-item">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Multilingual support across Amharic, Afaan Oromoo, Tigrinya, and Somali</span>
                </div>
              </div>
            </div>

            <div className="landing-about-stat-card">
              <div className="landing-about-stat-inner">
                <Leaf size={38} color="#16A34A" />
                <h3 className="landing-about-stat-title">Inclusive Farming Access</h3>
                <p className="landing-about-stat-desc">
                  Smallholder farmers have open access to crop diagnostics and climate early warning alerts
                  without recurring subscription fees.
                </p>
                <div className="landing-about-stat-grid">
                  <div>
                    <div className="landing-about-stat-num">120K+</div>
                    <div className="landing-about-stat-label">Hectares Monitored</div>
                  </div>
                  <div>
                    <div className="landing-about-stat-num">18.4K</div>
                    <div className="landing-about-stat-label">Kebeles Supported</div>
                  </div>
                </div>
                <Link to="/register" className="landing-btn landing-btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
                  <span>Get Started on the Web Platform</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nationwide Regional Coverage Grid */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Nationwide Regional Coverage</h2>
            <p className="landing-section-subtitle">
              Agro-climatic telemetry and parcel monitoring active across all regional states and administrations.
            </p>
          </div>

          <div className="landing-regions-grid">
            {regions.map((reg) => (
              <div key={reg.name} className="landing-region-card">
                <div className="landing-region-dot" style={{ backgroundColor: reg.color }} />
                <div className="landing-region-info">
                  <div className="landing-region-name">{reg.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-contact-card">
            <div>
              <h3 className="landing-contact-title">Platform & Technical Support</h3>
              <p className="landing-contact-desc">
                For administrative onboarding, field extension queries, or technical assistance, get in touch with our team.
              </p>
            </div>
            <div className="landing-contact-details">
              <div className="landing-contact-item">
                <Building2 size={18} color="#16A34A" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
              <div className="landing-contact-item">
                <PhoneCall size={18} color="#16A34A" />
                <span>Farmer Toll-Free: 8440 · Support: +251 11 646 0101</span>
              </div>
              <div className="landing-contact-item">
                <Mail size={18} color="#16A34A" />
                <span>support@ethiofarm.et</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default PublicAboutPage;
