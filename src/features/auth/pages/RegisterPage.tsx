import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sprout,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe,
  MapPin,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../services/apiClient';
import '../auth.css';

const ETHIOPIAN_REGIONS = [
  'Oromia',
  'Amhara',
  'Sidama',
  'Somali',
  'Tigray',
  'Afar',
  'Central Ethiopia',
  'South Ethiopia',
  'South West Ethiopia',
  'Benishangul-Gumuz',
  'Gambella',
  'Harari',
  'Addis Ababa (Charter City)',
  'Dire Dawa (Charter City)',
];

const LANGUAGES = [
  { code: 'am', label: 'Amharic (አማርኛ)' },
  { code: 'om', label: 'Afaan Oromoo' },
  { code: 'ti', label: 'Tigrinya (ትግርኛ)' },
  { code: 'so', label: 'Somali (Soomaali)' },
  { code: 'en', label: 'English' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [currentStep, setCurrentStep] = useState<0 | 1>(0);

  // Step 0: Identity & Security
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLang, setPreferredLang] = useState('am');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Farm Location & Jurisdiction
  const [region, setRegion] = useState('');
  const [zone, setZone] = useState('');
  const [woreda, setWoreda] = useState('');
  const [kebeleName, setKebeleName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Strength Calculation (matches mobile _buildPasswordStrengthMeter)
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '#E2E8F0', width: '0%' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#DC2626', width: '25%' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#D97706', width: '50%' };
    if (score === 3) return { score: 3, label: 'Good', color: '#2563EB', width: '75%' };
    return { score: 4, label: 'Strong', color: '#16A34A', width: '100%' };
  };

  const strength = calculatePasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Validate Step 0 before continuing
  const handleContinueToStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Please provide your full legal name (minimum 3 characters).');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setError('Please enter a valid 9-digit Ethiopian phone number (e.g., 911 234 567).');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number (0-9).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setCurrentStep(1);
  };

  // Submit Final Registration (Step 1)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!region) {
      setError('Please select your regional agricultural state.');
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy to register.');
      return;
    }

    setLoading(true);

    // Normalize Ethiopian phone number (+251...)
    let digits = phoneNumber.replace(/[\s-]/g, '');
    if (digits.startsWith('0')) digits = digits.substring(1);
    const normalizedPhone = digits.startsWith('+251') ? digits : `+251${digits.replace(/^\+?251/, '')}`;

    try {
      const response = await apiClient.post('/auth/register', {
        fullName: fullName.trim(),
        phoneNumber: normalizedPhone,
        email: email.trim() ? email.trim().toLowerCase() : undefined,
        password,
        role: 'FARMER', // Standard sovereign farmer role matching mobile client
        regionId: region,
        zoneId: zone.trim() || undefined,
        woredaId: woreda.trim() || undefined,
        kebeleName: kebeleName.trim() || undefined,
        preferredLang,
      });

      const payload = response.data?.data || response.data;
      if (payload?.token && payload?.user) {
        login(payload.token, payload.user);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Registration could not be completed. Please review your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge" aria-hidden="true">
            <Sprout size={30} />
          </div>
          <h1 className="auth-title">Register Account</h1>
          <p className="auth-subtitle">Join the sovereign digital agriculture network</p>
        </div>

        {/* Step Navigation Bar */}
        <div className="auth-stepper">
          <div className="stepper-item">
            <div className={`stepper-circle ${currentStep === 0 ? 'active' : 'completed'}`}>
              {currentStep > 0 ? <CheckCircle2 size={18} /> : '1'}
            </div>
            <span className={`stepper-label ${currentStep === 0 ? 'active' : ''}`}>Identity</span>
          </div>

          <div className={`stepper-line ${currentStep > 0 ? 'completed' : ''}`} />

          <div className="stepper-item">
            <div className={`stepper-circle ${currentStep === 1 ? 'active' : ''}`}>2</div>
            <span className={`stepper-label ${currentStep === 1 ? 'active' : ''}`}>Location</span>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="auth-alert-error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div className="auth-alert-content">
              <div className="auth-alert-title">Registration Error</div>
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

        {/* STEP 0: Identity & Security Form */}
        {currentStep === 0 && (
          <form onSubmit={handleContinueToStep1} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-fullname">
                <span>
                  Full Name <span className="required">*</span>
                </span>
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-prefix-icon">
                  <User size={17} />
                </div>
                <input
                  id="reg-fullname"
                  type="text"
                  className="auth-input has-prefix-icon"
                  placeholder="e.g. Abebe Balcha"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-phone">
                <span>
                  Phone Number <span className="required">*</span>
                </span>
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-phone-prefix">
                  <Phone size={15} />
                  <span>+251</span>
                </div>
                <input
                  id="reg-phone"
                  type="tel"
                  className="auth-input has-phone-prefix"
                  placeholder="911 234 567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Email Address (Optional) */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-email">
                <span>Email Address (Optional)</span>
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-prefix-icon">
                  <Mail size={17} />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  className="auth-input has-prefix-icon"
                  placeholder="farmer@ethiofarm.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-password">
                <span>
                  Password <span className="required">*</span>
                </span>
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-prefix-icon">
                  <Lock size={17} />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input has-prefix-icon has-suffix-icon"
                  placeholder="Minimum 8 characters with a number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="password-meter-wrap">
                  <div className="password-meter-bar">
                    <div
                      className="password-meter-fill"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                  <div className="password-meter-label">
                    <span style={{ color: '#64748B' }}>Strength:</span>
                    <span style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-confirm-password">
                <span>
                  Confirm Password <span className="required">*</span>
                </span>
                {passwordsMatch && (
                  <span style={{ color: '#16A34A', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={13} /> Matches
                  </span>
                )}
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-prefix-icon">
                  <Lock size={17} />
                </div>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="auth-input has-prefix-icon has-suffix-icon"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-input-suffix-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-lang">
                <span>Preferred Language</span>
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-prefix-icon">
                  <Globe size={17} />
                </div>
                <select
                  id="reg-lang"
                  className="auth-select"
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Continue Button */}
            <button type="submit" className="auth-btn-primary">
              <span>Continue to Farm Location</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* STEP 1: Farm Location & Jurisdiction Form */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Informational Guidance Banner matching mobile */}
            <div className="auth-info-notice">
              <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong>Standard Farmer Account:</strong> Access plot cadastral mapping, crop AI scans, and local weather. Institutional roles (DA, Officer, Researcher) can be requested from your Profile after sign-up.
              </div>
            </div>

            {/* Region Dropdown */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-region">
                <span>
                  Region <span className="required">*</span>
                </span>
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-prefix-icon">
                  <MapPin size={17} />
                </div>
                <select
                  id="reg-region"
                  className="auth-select"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                >
                  <option value="">Select your region</option>
                  {ETHIOPIAN_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Zone (Optional) */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-zone">
                <span>Zone / Sub-City (Optional)</span>
              </label>
              <input
                id="reg-zone"
                type="text"
                className="auth-input"
                placeholder="e.g. East Shewa, Jimma, Arsi"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              />
            </div>

            {/* Woreda (Optional) */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-woreda">
                <span>Woreda / District (Optional)</span>
              </label>
              <input
                id="reg-woreda"
                type="text"
                className="auth-input"
                placeholder="e.g. Ada'a, Bako Tibe, Lume"
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
              />
            </div>

            {/* Kebele Name (Optional) */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-kebele">
                <span>Kebele Name (Optional)</span>
              </label>
              <input
                id="reg-kebele"
                type="text"
                className="auth-input"
                placeholder="e.g. Kebele 01, Hidi"
                value={kebeleName}
                onChange={(e) => setKebeleName(e.target.value)}
              />
            </div>

            {/* Terms of Service Checkbox */}
            <div className="auth-form-group" style={{ marginTop: '0.25rem' }}>
              <label className="auth-checkbox-label" style={{ alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{ marginTop: '3px' }}
                  required
                />
                <span style={{ fontSize: '0.84rem', lineHeight: 1.45 }}>
                  I agree to the EthioFarm Terms of Service and Privacy Policy for agricultural data stewardship.
                </span>
              </label>
            </div>

            {/* Button Group (Back & Submit) */}
            <div className="auth-btn-group">
              <button
                type="button"
                className="auth-btn-secondary"
                onClick={() => {
                  setError(null);
                  setCurrentStep(0);
                }}
                disabled={loading}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="auth-btn-primary"
                style={{ flex: 1, marginTop: 0 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer: Sign In Link */}
        <div className="auth-card-footer">
          Already have an account?
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
