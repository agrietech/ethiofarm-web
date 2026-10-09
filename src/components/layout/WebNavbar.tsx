/**
 * @file WebNavbar.tsx
 * @description Master responsive navigation header for all devices (Desktop, Tablet, Large Displays)
 */

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sprout, MapPin, Camera, CloudSun, HeartPulse } from 'lucide-react';

export const WebNavbar: React.FC = () => {
  return (
    <header className="web-navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-link">
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sprout size={22} />
          </div>
          <div>
            <div className="brand-title">EthioFarm</div>
            <div className="brand-subtitle">Smart Agriculture Web Portal</div>
          </div>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/farms"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <MapPin size={16} />
                <span>Farm Ops</span>
                <span className="nav-badge-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>Alen</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/scan"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Camera size={16} />
                <span>Crop AI</span>
                <span className="nav-badge-pill" style={{ background: '#fef3c7', color: '#b45309' }}>Zinegnaw</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/weather"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <CloudSun size={16} />
                <span>Weather &amp; Hazards</span>
                <span className="nav-badge-pill" style={{ background: '#dcfce7', color: '#15803d' }}>Banchamlak</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/livestock"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <HeartPulse size={16} />
                <span>Livestock</span>
                <span className="nav-badge-pill" style={{ background: '#dcfce7', color: '#15803d' }}>Banchamlak</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
            Enterprise Web
          </span>
        </div>
      </div>
    </header>
  );
};
