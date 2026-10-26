import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Phone,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sprout,
  ArrowRight,
  X,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../services/apiClient';
import '../auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Restore remembered user identifier if available
  useEffect(() => {
    const savedId = localStorage.getItem('ethiofarm_remembered_id');
    if (savedId) {
      setIdentifier(savedId);
      setRememberMe(true);
    }
  }, []);

  // Determine if current identifier is predominantly phone or email
  const isPhoneIdentifier = /^[0-9+\s-]*$/.test(identifier.trim()) && identifier.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      setError('Please provide your phone number or email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    // Format payload for backend login
    const isEmail = cleanId.includes('@');
    let normalizedPhone: string | undefined = undefined;

    if (!isEmail) {
      // Normalize raw Ethiopian phone input
      let digits = cleanId.replace(/[\s-]/g, '');
      if (digits.startsWith('+251')) {
        normalizedPhone = digits;
      } else if (digits.startsWith('09') || digits.startsWith('07')) {
        normalizedPhone = `+251${digits.substring(1)}`;
      } else if (digits.startsWith('9') || digits.startsWith('7')) {
        normalizedPhone = `+251${digits}`;
      } else {
        normalizedPhone = digits;
      }
    }

    try {
      const response = await apiClient.post('/auth/login', {
        email: isEmail ? cleanId.toLowerCase() : undefined,
        phoneNumber: !isEmail ? normalizedPhone : undefined,
        password,
      });

      const payload = response.data?.data || response.data;
      if (payload?.token && payload?.user) {
        if (rememberMe) {
          localStorage.setItem('ethiofarm_remembered_id', cleanId);
        } else {
          localStorage.removeItem('ethiofarm_remembered_id');
        }

        login(payload.token, payload.user);
        navigate('/');
      } else {
        setError('Unexpected authentication response format. Please try again.');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please verify your phone number and password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge" aria-hidden="true">
            <Sprout size={30} />
          </div>
          <h1 className="auth-title">Welcome to EthioFarm</h1>
          <p className="auth-subtitle">Access your sovereign agriculture portal</p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="auth-alert-error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div className="auth-alert-content">
              <div className="auth-alert-title">Authentication Failed</div>
              <div className="auth-alert-message">{error}</div>
            </div>
            <button
              type="button"
              className="auth-alert-close"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Identifier Field (Phone or Email) */}
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="identifier-input">
              <span>
                Phone number or email <span className="required">*</span>
              </span>
            </label>
            <div className="auth-input-wrapper">
              {isPhoneIdentifier ? (
                <div className="auth-phone-prefix">
                  <Phone size={15} />
                  <span>+251</span>
                </div>
              ) : (
                <div className="auth-input-prefix-icon">
                  <Mail size={17} />
                </div>
              )}
              <input
                id="identifier-input"
                type="text"
                className={`auth-input ${isPhoneIdentifier ? 'has-phone-prefix' : 'has-prefix-icon'}`}
                placeholder={isPhoneIdentifier ? '911 234 567' : 'name@ethiofarm.et or 09...'}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password-input">
              <span>
                Password <span className="required">*</span>
              </span>
            </label>
            <div className="auth-input-wrapper">
              <div className="auth-input-prefix-icon">
                <Lock size={17} />
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="auth-input has-prefix-icon has-suffix-icon"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-input-suffix-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options: Remember Me & Forgot Password */}
          <div className="auth-row-options">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="auth-forgot-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => setShowForgotModal(true)}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="auth-btn-primary">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer: Create Account Link */}
        <div className="auth-card-footer">
          Don't have an account?
          <Link to="/register">Create an account</Link>
        </div>
      </div>

      {/* Forgot Password Information Modal */}
      {showForgotModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B5E20' }}>
                <HelpCircle size={22} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Password Assistance</h3>
              </div>
              <button
                type="button"
                className="auth-alert-close"
                onClick={() => setShowForgotModal(false)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
              To recover your EthioFarm account:
            </p>
            <ul style={{ fontSize: '0.85rem', color: '#334155', paddingLeft: '1.25rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              <li><strong>Account Recovery:</strong> Request a secure password reset link or contact support at <strong>+251 11 646 0101</strong>.</li>
              <li><strong>Extension Office:</strong> Visit your local Kebele Farmer Training Center (FTC) or Woreda Agricultural Office for identity verification.</li>
            </ul>
            <button
              type="button"
              className="auth-btn-primary"
              style={{ marginTop: 0 }}
              onClick={() => setShowForgotModal(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
