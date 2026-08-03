import { useState, useEffect } from 'react';
import useSuperAdminStore from '../../stores/superAdminStore';

const EnrollUser = () => {
  const { organizations, fetchOrganizations, enrollUser, loading } = useSuperAdminStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', employeeId: '', role: 'STAFF', organizationId: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => { fetchOrganizations(); }, []);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be 6+ chars';
    if (!form.employeeId) e.employeeId = 'Employee ID required';
    if (!form.organizationId) e.organizationId = 'Organization required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setApiError(''); setSuccess('');
    try {
      const result = await enrollUser(form);
      setSuccess(`✅ ${result.name} (${result.role}) enrolled successfully!`);
      setForm({ name: '', email: '', password: '', employeeId: '', role: 'STAFF', organizationId: '' });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff', fontSize: '0.9rem', outline: 'none',
  };

  const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '8px', fontWeight: 500 };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 8px' }}>Enroll User</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Register a new staff member, admin, or user to an organization</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '36px',
        }}>
          {success && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#6ee7b7', fontSize: '0.9rem' }}>{success}</div>
          )}
          {apiError && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#fca5a5', fontSize: '0.9rem' }}>⚠ {apiError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
                {errors.name && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errors.name}</p>}
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@org.com" type="email" />
                {errors.email && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errors.email}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="min 6 characters" type="password" />
                {errors.password && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errors.password}</p>}
              </div>
              <div>
                <label style={labelStyle}>Employee ID</label>
                <input style={inputStyle} value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} placeholder="EMP-0001" />
                {errors.employeeId && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errors.employeeId}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Organization</label>
                <select value={form.organizationId} onChange={e => setForm({ ...form, organizationId: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select organization...</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name} ({org.orgCode})</option>
                  ))}
                </select>
                {errors.organizationId && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errors.organizationId}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(167,139,250,0.4)' : 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(167,139,250,0.3)',
            }}>
              {loading ? 'Enrolling...' : '➕ Enroll User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollUser;
