import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    setApiError('');
    try {
      const user = await login(formData);
      const role = user.role;
      if (role === 'SUPER_ADMIN') navigate('/superadmin/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'STAFF') navigate('/staff/dashboard');
      else navigate('/dashboard');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(167,139,250,0.4)',
          }}>⚡</div>
          <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px' }}>Welcome back</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Sign in to your SCMS account</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          {apiError && (
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#fca5a5', fontSize: '0.875rem',
            }}>⚠ {apiError}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '8px', fontWeight: 500 }}>
                Email Address
              </label>
              <input
                id="email" name="email" type="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)', border: `1px solid ${errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.15)'}`,
                  color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
                }}
              />
              {errors.email && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '8px', fontWeight: 500 }}>
                Password
              </label>
              <input
                id="password" name="password" type="password"
                value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)', border: `1px solid ${errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.15)'}`,
                  color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
                }}
              />
              {errors.password && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? 'rgba(167,139,250,0.4)' : 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(167,139,250,0.4)', transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/register" style={{ color: '#a78bfa', fontSize: '0.875rem', textDecoration: 'none' }}>
              Don't have an account? Register with org code
            </Link>
          </div>
        </div>

        {/* Demo credentials */}
      
      </div>
    </div>
  );
};

export default Login;
