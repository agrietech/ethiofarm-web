/**
 * @file WebNavbar.tsx
 * @description Master responsive navigation header for all devices (Desktop, Tablet, Large Displays)
 */

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MapPin, Camera, CloudSun, ShieldAlert, Activity } from 'lucide-react';

export const WebNavbar: React.FC = () => {
  return (
    <header className="web-navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-link">
          <img
            src="/logo.png"
            alt="AgriEtech logo"
            style={{ height: 38, width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div className="brand-title">EthioFarm</div>
            <div className="brand-subtitle">Smart Agriculture Web Portal</div>
          </div>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink to="/farms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <MapPin size={16} />
                <span>Farm Ops</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/scan" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Camera size={16} />
                <span>Crop AI</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/weather" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <CloudSun size={16} />
                <span>Weather</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/hazards" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <ShieldAlert size={16} />
                <span>Alerts</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/risk" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Activity size={16} />
                <span>Risk</span>
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
