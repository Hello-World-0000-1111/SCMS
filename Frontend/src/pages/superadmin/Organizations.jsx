import { useState, useEffect } from 'react';
import useSuperAdminStore from '../../stores/superAdminStore';

const Organizations = () => {
  const { organizations, fetchOrganizations, registerOrganization, loading } = useSuperAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orgName: '', adminName: '', adminEmail: '', adminPassword: '', adminEmployeeId: '', address: '', contactEmail: '' });
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => { fetchOrganizations(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); setSuccess('');
    try {
      await registerOrganization(form);
      setSuccess('✅ Organization registered successfully!');
      setShowForm(false);
      setForm({ orgName: '', adminName: '', adminEmail: '', adminPassword: '', adminEmployeeId: '', address: '', contactEmail: '' });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to register organization');
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '10px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff', fontSize: '0.875rem', outline: 'none',
  };
  const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 500 };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 8px' }}>Organizations</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Manage all registered organizations</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setApiError(''); setSuccess(''); }} style={{
            background: 'linear-gradient(135deg, #f59e0b, #f97316)', border: 'none',
            color: '#fff', padding: '12px 24px', borderRadius: '10px', fontWeight: 700,
            cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
          }}>
            {showForm ? '✕ Cancel' : '+ Register Organization'}
          </button>
        </div>

        {success && (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#6ee7b7', fontSize: '0.9rem' }}>{success}</div>
        )}
        {apiError && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#fca5a5', fontSize: '0.9rem' }}>⚠ {apiError}</div>
        )}

        {/* Register Org Form */}
        {showForm && (
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '28px', marginBottom: '24px',
          }}>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 20px' }}>New Organization Details</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div><label style={labelStyle}>Organization Name *</label><input style={inputStyle} value={form.orgName} onChange={e => setForm({ ...form, orgName: e.target.value })} placeholder="Acme Corp" required /></div>
                <div><label style={labelStyle}>Contact Email</label><input style={inputStyle} value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder="info@org.com" type="email" /></div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Address</label><input style={inputStyle} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City" />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '4px 0 14px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>Admin User Details (will be created as ADMIN)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div><label style={labelStyle}>Admin Full Name *</label><input style={inputStyle} value={form.adminName} onChange={e => setForm({ ...form, adminName: e.target.value })} placeholder="Jane Doe" required /></div>
                <div><label style={labelStyle}>Admin Email *</label><input style={inputStyle} value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })} placeholder="admin@org.com" type="email" required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div><label style={labelStyle}>Admin Password *</label><input style={inputStyle} value={form.adminPassword} onChange={e => setForm({ ...form, adminPassword: e.target.value })} placeholder="••••••••" type="password" required /></div>
                <div><label style={labelStyle}>Admin Employee ID *</label><input style={inputStyle} value={form.adminEmployeeId} onChange={e => setForm({ ...form, adminEmployeeId: e.target.value })} placeholder="ADM-001" required /></div>
              </div>
              <button type="submit" disabled={loading} style={{
                background: loading ? 'rgba(245,158,11,0.4)' : 'linear-gradient(135deg, #f59e0b, #f97316)',
                border: 'none', color: '#fff', padding: '12px 28px', borderRadius: '10px',
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
              }}>
                {loading ? 'Registering...' : '🏢 Register Organization'}
              </button>
            </form>
          </div>
        )}

        {/* Organizations List */}
        {loading && organizations.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '60px' }}>Loading organizations...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {organizations.map(org => (
              <div key={org.id} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px', padding: '20px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                  }}>🏢</div>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 4px', fontSize: '1rem' }}>{org.name}</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Code: <span style={{ color: '#f59e0b' }}>{org.orgCode}</span></span>
                      {org.contactEmail && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{org.contactEmail}</span>}
                      {org.address && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{org.address}</span>}
                    </div>
                  </div>
                </div>
                <span style={{ color: '#10b981', fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', fontWeight: 600 }}>Active</span>
              </div>
            ))}
            {organizations.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏢</div>
                No organizations registered yet. Create your first one!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
