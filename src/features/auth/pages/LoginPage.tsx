import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../services/apiClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide your email/phone and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/login', {
        email: identifier.includes('@') ? identifier : undefined,
        phoneNumber: !identifier.includes('@') ? identifier : undefined,
        password,
      });

      const payload = response.data?.data || response.data;
      if (payload?.token && payload?.user) {
        login(payload.token, payload.user);
        navigate('/');
      } else {
        setError('Unexpected authentication response format.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '3rem auto', padding: '2rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1B5E20', margin: 0 }}>EthioFarm Sign In</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Access your smart agriculture portal</p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '8px', color: '#b91c1c', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
            Email or Phone Number
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="e.g. admin@ethiofarm.et or +2519..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              disabled={loading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#1B5E20', color: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', marginTop: '0.5rem' }}
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Authenticating...</> : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#1B5E20', fontWeight: 600, textDecoration: 'none' }}>
          Create an account
        </Link>
      </div>
    </div>
  );
}
