import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSuperAdminStore from '../../stores/superAdminStore';

const SuperAdminDashboard = () => {
  const { organizations, allUsers, fetchOrganizations, fetchAllUsers, loading } = useSuperAdminStore();

  useEffect(() => {
    fetchOrganizations();
    fetchAllUsers();
  }, []);

  const roleCounts = allUsers.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: 'Organizations', value: organizations.length, icon: '🏢', color: 'linear-gradient(135deg,#f59e0b,#f97316)' },
    { label: 'Total Users', value: allUsers.length, icon: '👥', color: 'linear-gradient(135deg,#60a5fa,#6366f1)' },
    { label: 'Admins', value: roleCounts['ADMIN'] || 0, icon: '🛡️', color: 'linear-gradient(135deg,#a78bfa,#ec4899)' },
    { label: 'Staff Members', value: roleCounts['STAFF'] || 0, icon: '🧑‍💼', color: 'linear-gradient(135deg,#10b981,#34d399)' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              borderRadius: '12px', padding: '10px 14px', fontSize: '1.5rem',
              boxShadow: '0 0 20px rgba(239,68,68,0.4)',
            }}>👑</div>
            <div>
              <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Super Admin Panel</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>System-wide control and management</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {statCards.map(card => (
            <div key={card.label} style={{
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{card.icon}</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{card.label}</p>
              <p style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{loading ? '...' : card.value}</p>
              <div style={{ marginTop: '12px', height: '3px', borderRadius: '2px', background: card.color }} />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { to: '/superadmin/organizations', label: 'Manage Organizations', sub: 'View, add, and configure orgs', icon: '🏢', color: '#f59e0b' },
            { to: '/superadmin/enroll', label: 'Enroll Staff / Admin', sub: 'Register staff members to organizations', icon: '➕', color: '#a78bfa' },
            { to: '/superadmin/users', label: 'All Users', sub: 'View every user across all orgs', icon: '👥', color: '#60a5fa' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{
              background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: '14px', padding: '24px', textDecoration: 'none', display: 'block',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = item.color + '44'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <span style={{ fontSize: '2rem' }}>{item.icon}</span>
              <p style={{ color: item.color, fontWeight: 700, margin: '12px 0 4px' }}>{item.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>{item.sub}</p>
            </Link>
          ))}
        </div>

        {/* Recent Organizations */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', padding: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Registered Organizations</h2>
            <Link to="/superadmin/organizations" style={{ color: '#a78bfa', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          {organizations.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '32px' }}>No organizations yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {organizations.map(org => (
                <div key={org.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🏢</div>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{org.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: 0 }}>{org.orgCode} · {org.contactEmail || '—'}</p>
                    </div>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '0.75rem', padding: '3px 10px', background: 'rgba(16,185,129,0.1)', borderRadius: '20px' }}>Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
