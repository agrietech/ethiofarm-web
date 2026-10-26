import React from 'react';
import { Link } from 'react-router-dom';
import {
  Microscope,
  Cpu,
  Satellite,
  ShieldAlert,
  MapPin,
  Radio,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const PublicFeaturesPage: React.FC = () => {
  const deepFeatures = [
    {
      id: 'ai-pathology',
      title: 'AI Computer Vision & Plant Pathology',
      color: '#16A34A',
      icon: Microscope,
      tagline: 'Instant identification of 32+ endemic Ethiopian crop diseases and pests',
      description:
        'Powered by localized deep convolutional neural networks fine-tuned on Ethiopian highland and lowland crop varieties. Operates offline directly on mobile hardware or syncs with pathology servers for high-resolution validation.',
      specs: [
        '94.8% classification precision on Wheat Rust, Maize Armyworm, Teff Smut, Coffee Berry Disease',
        'Fast inference time under 800ms per image on standard mobile devices',
        'Prescribes tailored chemical and organic treatments registered by agricultural standards',
        'Automatic calculation of optimal spraying weather window to prevent rain wash-off',
      ],
      actionLink: '/scan',
      actionText: 'Experience Crop Scanner',
    },
    {
      id: 'iot-sensors',
      title: 'Wireless LoRaWAN IoT Soil & Climate Nodes',
      color: '#0284C7',
      icon: Cpu,
      tagline: 'Sub-surface soil moisture, temperature, and atmospheric conditions',
      description:
        'Field-hardened solar sensor nodes placed across farm parcels transmit periodic telemetry via rural LoRaWAN gateways. Data feeds directly into irrigation scheduling and drought warning systems.',
      specs: [
        'Triple-depth volumetric soil water content (10cm, 30cm, 60cm)',
        'Ambient air temperature, relative humidity, barometric pressure, and rainfall accumulation',
        'Long-range line-of-sight wireless transmission with zero cellular recurring costs',
        'Integrated battery and solar harvesting built for maintenance-free field operation',
      ],
      actionLink: '/sensors',
      actionText: 'Explore IoT Telemetry',
    },
    {
      id: 'satellite-ndvi',
      title: 'Sentinel-2 Satellite & Radar Vegetation Mapping',
      color: '#059669',
      icon: Satellite,
      tagline: 'Multi-spectral vegetation indices updated every 5 days',
      description:
        'Ingests Sentinel-2 optical and synthetic aperture radar (SAR) imagery to compute Normalized Difference Vegetation Index (NDVI), Normalized Difference Water Index (NDWI), and canopy moisture dynamics across woredas.',
      specs: [
        'Continuous cloud-penetrating radar monitoring during Meher rainy season',
        'Automated spatial anomaly alerts when parcel NDVI deviates significantly from historical mean',
        'Kebele and woreda aggregate yield estimation models for food security planning',
        'Integrated with digital soil maps for targeted fertilizer recommendations',
      ],
      actionLink: '/farms',
      actionText: 'View Farm Operations',
    },
    {
      id: 'early-warning',
      title: 'Multi-Hazard Early Warning Radar',
      color: '#DC2626',
      icon: ShieldAlert,
      tagline: 'Proactive alerts for desert locusts, highland frosts, and river floods',
      description:
        'Combines global meteorological ensemble models, topographic elevation rasters, and field scout incident reports into a real-time risk scoring engine.',
      specs: [
        'Automated night frost prediction 48 hours in advance for highland elevations',
        'Locust swarm tracking and migratory corridor modeling',
        'Flash flood catchment inundation modeling along river basins',
        'Rapid alert broadcast via USSD push, SMS, and regional voice guidance',
      ],
      actionLink: '/hazards',
      actionText: 'Open Risk Radar',
    },
    {
      id: 'gis-parcels',
      title: 'Kebele GIS Parcel Polygon & Boundary Editor',
      color: '#7C3AED',
      icon: MapPin,
      tagline: 'Precise GPS demarcation of farm boundaries and agro-ecological zones',
      description:
        'Empowers Kebele Development Agents to walk farm boundaries with offline GPS tracking to map land parcels, establish digital cadastral tenure records, and link soil tests directly to geographic polygons.',
      specs: [
        'Accurate polygon editing with vertex snapping and area calculation',
        'Offline GeoJSON caching with automatic background synchronization when cell network returns',
        'Multi-layer overlay: Satellite imagery, elevation contours, soil type, and watershed vectors',
        'Digital agricultural land registry export capabilities',
      ],
      actionLink: '/farms/register',
      actionText: 'Register Farm Parcel',
    },
    {
      id: 'ussd-voice',
      title: 'Inclusive USSD *844# & Multilingual Voice Gateway',
      color: '#D97706',
      icon: Radio,
      tagline: 'Democratizing smart agriculture to smallholder farmers',
      description:
        'Ensures no farmer is excluded due to smartphone availability, data connectivity gaps, or literacy barriers. Delivers real-time weather, market guidance, and pest emergency bulletins over basic GSM mobile networks.',
      specs: [
        'Interactive USSD menus accessible via shortcode *844#',
        'Natural speech voice guidance in Amharic (አማርኛ), Afaan Oromoo, Tigrinya, and Somali',
        'Zero mobile data requirement — operates on standard mobile cellular signals',
        'Automated outbound voice alerts broadcast to registered farmer clusters',
      ],
      actionLink: '/advisories',
      actionText: 'Check Advisories',
    },
  ];

  return (
    <div className="landing-page-root">
      {/* Header Banner */}
      <section className="landing-subpage-header">
        <div className="landing-container">
          <h1 className="landing-subpage-title">Technological Capabilities & Innovations</h1>
          <p className="landing-subpage-desc">
            Explore the six technological pillars powering Ethiopia's climate-resilient
            agricultural intelligence platform.
          </p>
        </div>
      </section>

      {/* Feature Pillars Detailed Breakdown */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-deep-features-list">
            {deepFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.id} className="landing-deep-feature-card" id={feat.id}>
                  <div className="landing-deep-feature-top">
                    <div
                      className="landing-feature-icon-box"
                      style={{ backgroundColor: `${feat.color}15`, color: feat.color }}
                    >
                      <Icon size={28} />
                    </div>
                    <div>
                      <h2 className="landing-deep-feature-title">{feat.title}</h2>
                    </div>
                  </div>

                  <p className="landing-deep-feature-tagline">{feat.tagline}</p>
                  <p className="landing-deep-feature-desc">{feat.description}</p>

                  <div className="landing-deep-feature-specs">
                    <h4 className="landing-deep-feature-specs-title">Technical Highlights:</h4>
                    {feat.specs.map((spec) => (
                      <div key={spec} className="landing-deep-feature-spec-item">
                        <CheckCircle2 size={16} color={feat.color} />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="landing-deep-feature-action">
                    <Link
                      to={feat.actionLink}
                      className="landing-btn"
                      style={{ backgroundColor: feat.color, color: '#ffffff' }}
                    >
                      <span>{feat.actionText}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture System Diagram Strip */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">End-to-End Agri-Intelligence Workflow</h2>
            <p className="landing-section-subtitle">
              How data flows seamlessly from satellite observation and farm fields to agronomic decisions.
            </p>
          </div>

          <div className="landing-pipeline-grid">
            <div className="landing-pipeline-step">
              <div className="landing-pipeline-num">01</div>
              <h4>Data Ingestion</h4>
              <p>Sentinel-2 remote sensing, solar IoT telemetry, and field scout inputs.</p>
            </div>
            <div className="landing-pipeline-step">
              <div className="landing-pipeline-num">02</div>
              <h4>AI & Spatial Models</h4>
              <p>Convolutional neural nets, NDVI vegetation indices, and drought risk scoring.</p>
            </div>
            <div className="landing-pipeline-step">
              <div className="landing-pipeline-num">03</div>
              <h4>Extension Delivery</h4>
              <p>Localized USSD *844#, voice advisories, and mobile web field guides.</p>
            </div>
            <div className="landing-pipeline-step">
              <div className="landing-pipeline-num">04</div>
              <h4>District Analytics</h4>
              <p>Woreda and regional food security dashboards and emergency planning.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default PublicFeaturesPage;
