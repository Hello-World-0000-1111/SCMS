import { useEffect, useState } from 'react';
import useSuperAdminStore from '../../stores/superAdminStore';

const roleColors = { USER: '#60a5fa', STAFF: '#10b981', ADMIN: '#a78bfa', SUPER_ADMIN: '#ef4444' };

const SuperAdminUsers = () => {
  const { allUsers, fetchAllUsers, loading } = useSuperAdminStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => { fetchAllUsers(); }, []);

  const filtered = allUsers.filter(u => {
    const matchName = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchName && matchRole;
  });

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 8px' }}>All Users</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>System-wide user directory across all organizations</p>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              flex: 1, minWidth: '240px', padding: '11px 16px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontSize: '0.875rem', outline: 'none',
            }}
          />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{
            padding: '11px 14px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '0.875rem', outline: 'none', cursor: 'pointer',
          }}>
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
            <option value="USER">User</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '60px' }}>Loading users...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['User', 'Role', 'Organization', 'Employee ID'].map(h => (
                    <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', padding: '14px 16px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: `${roleColors[user.role] || '#6b7280'}33`,
                          border: `1px solid ${roleColors[user.role] || '#6b7280'}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: roleColors[user.role] || '#9ca3af', fontWeight: 700, fontSize: '0.875rem',
                        }}>
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</p>
                          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.78rem' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${roleColors[user.role] || '#6b7280'}22`, color: roleColors[user.role] || '#9ca3af' }}>{user.role}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{user.organizationName || '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontFamily: 'monospace' }}>{user.employeeId}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '12px' }}>{filtered.length} of {allUsers.length} users shown</p>
      </div>
    </div>
  );
};

export default SuperAdminUsers;
