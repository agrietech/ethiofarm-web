import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Camera,
  CloudSun,
  ShieldAlert,
  Activity,
  LogOut,
  Menu,
  X,
  Sparkles,
  Layers,
  BellRing,
  Info,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WebNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="web-navbar">
      <div className="navbar-inner">
        {/* Brand Link */}
        <Link to="/" className="brand-link" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/logo.png"
            alt="EthioFarm logo"
            style={{ height: 38, width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              // Graceful fallback if logo fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="brand-title">EthioFarm</div>
            <div className="brand-subtitle">Smart Agriculture Web Portal</div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/features" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={15} />
                <span>Features</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/advisories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <BellRing size={15} />
                <span>Advisories</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Info size={15} />
                <span>About</span>
              </NavLink>
            </li>

            {/* Authenticated Fast Links */}
            {isAuthenticated && (
              <>
                <li className="nav-divider" />
                <li>
                  <NavLink to="/overview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Zap size={15} />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/farms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <MapPin size={15} />
                    <span>Farms</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/scan" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Camera size={15} />
                    <span>Crop AI</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/weather" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <CloudSun size={15} />
                    <span>Weather</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.fullName || user.email || 'User'}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', textTransform: 'capitalize' }}>
                  {user.role ? user.role.toLowerCase().replace('_', ' ') : 'Member'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-signout"
                title="Sign Out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn-nav-login">
                Sign In
              </Link>
              <Link to="/register" className="btn-nav-primary">
                Launch Platform
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <ul className="mobile-nav-links">
            <li>
              <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>
                Home Overview
              </NavLink>
            </li>
            <li>
              <NavLink to="/features" onClick={() => setMobileMenuOpen(false)}>
                Features & Innovations
              </NavLink>
            </li>
            <li>
              <NavLink to="/advisories" onClick={() => setMobileMenuOpen(false)}>
                Public Advisories & Bulletins
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
                About & National Impact
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                <li className="mobile-divider" />
                <li>
                  <NavLink to="/overview" onClick={() => setMobileMenuOpen(false)}>
                    Operational Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/farms" onClick={() => setMobileMenuOpen(false)}>
                    Farm Operations
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/scan" onClick={() => setMobileMenuOpen(false)}>
                    AI Crop Scanner
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/weather" onClick={() => setMobileMenuOpen(false)}>
                    Agro-Weather
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleSignOut} className="mobile-signout-btn">
                    <LogOut size={16} /> Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mobile-divider" />
                <li>
                  <Link to="/login" className="mobile-btn-login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="mobile-btn-register" onClick={() => setMobileMenuOpen(false)}>
                    Create Account / Launch
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};
