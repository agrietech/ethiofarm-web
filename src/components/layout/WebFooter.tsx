import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Leaf } from 'lucide-react';

export const WebFooter: React.FC = () => {
  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="landing-footer-grid">
          {/* Brand Column */}
          <div className="landing-footer-brand-col">
            <div className="landing-footer-logo-row">
              <Leaf size={24} color="#4ADE80" />
              <span className="landing-footer-brand-title">EthioFarm</span>
            </div>
            <p className="landing-footer-tagline">
              Smart Agriculture & Climate-Resilience Platform connecting smallholder farmers,
              agricultural extension agents, and agronomists with AI crop vision, IoT telemetry, and offline mobile tools.
            </p>

            {/* Helpline Box */}
            <div className="landing-footer-hotline-box">
              <PhoneCall size={18} color="#4ADE80" />
              <div>
                <div style={{ fontSize: '0.78rem', color: '#86EFAC', fontWeight: 600 }}>Farmer Support Hotline</div>
                <div className="landing-footer-hotline-num">+251 11 646 0101</div>
              </div>
            </div>
          </div>

          {/* Column 1: Roles */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-col-title">Solutions</h4>
            <ul className="landing-footer-links">
              <li><Link to="/#ecosystem">Smallholder Farmers</Link></li>
              <li><Link to="/#ecosystem">Extension Agents</Link></li>
              <li><Link to="/#ecosystem">Woreda Officers</Link></li>
              <li><Link to="/#ecosystem">Agronomic Researchers</Link></li>
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-col-title">Platform</h4>
            <ul className="landing-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/advisories">Advisories</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>

          {/* Column 3: Capabilities */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-col-title">Capabilities</h4>
            <ul className="landing-footer-links">
              <li><Link to="/scan">AI Leaf Pathology</Link></li>
              <li><Link to="/sensors">IoT Soil Telemetry</Link></li>
              <li><Link to="/weather">Micro-Climate Forecast</Link></li>
              <li><Link to="/hazards">Early Hazard Warnings</Link></li>
            </ul>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <div className="landing-footer-copy">
            © {new Date().getFullYear()} EthioFarm. All rights reserved.
          </div>
          <div className="landing-footer-extra">
            <span>Climate-resilient agriculture technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default WebFooter;
