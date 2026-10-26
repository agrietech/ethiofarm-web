import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MapPin, Camera, CloudSun, ShieldAlert, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WebNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

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
          {isAuthenticated && user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                  {user.fullName || user.email || 'User'}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', textTransform: 'capitalize' }}>
                  {user.role ? user.role.toLowerCase().replace('_', ' ') : 'Member'}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                title="Sign Out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/login"
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #16a34a',
                  color: '#16a34a',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
