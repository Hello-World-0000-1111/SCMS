import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../stores/adminStore';

const StatCard = ({ label, value, icon, color }) => (
  <div style={{
    background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }}
  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)`; }}
  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
        <p style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{value ?? '...'}</p>
      </div>
      <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>{icon}</div>
    </div>
    <div style={{ marginTop: '12px', height: '3px', borderRadius: '2px', background: color }} />
  </div>
);

const AdminDashboard = () => {
  const { stats, complaints, loading, fetchStats, fetchAllComplaints } = useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchAllComplaints();
  }, []);

  const recentComplaints = complaints.slice(0, 5);

  const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', CLOSED: '#6b7280' };
  const priorityColor = { HIGH: '#ef4444', CRITICAL: '#dc2626', MEDIUM: '#f59e0b', LOW: '#10b981' };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 8px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Monitor and manage your organization's complaints</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <StatCard label="Total Complaints" value={stats?.total} icon="📋" color="linear-gradient(90deg, #a78bfa, #60a5fa)" />
          <StatCard label="Pending" value={stats?.pending} icon="⏳" color="linear-gradient(90deg, #f59e0b, #f97316)" />
          <StatCard label="In Progress" value={stats?.inProgress} icon="🔄" color="linear-gradient(90deg, #3b82f6, #06b6d4)" />
          <StatCard label="Resolved" value={stats?.resolved} icon="✅" color="linear-gradient(90deg, #10b981, #34d399)" />
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { to: '/admin/complaints', label: 'View All Complaints', icon: '📂', color: '#a78bfa' },
            { to: '/admin/users', label: 'Manage Users', icon: '👥', color: '#60a5fa' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '20px', textDecoration: 'none', display: 'block',
              transition: 'all 0.2s', textAlign: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <span style={{ fontSize: '2rem' }}>{item.icon}</span>
              <p style={{ color: item.color, fontWeight: 600, margin: '8px 0 0', fontSize: '0.9rem' }}>{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Complaints */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', padding: '24px',
        }}>
          <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 20px' }}>Recent Complaints</h2>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '40px' }}>Loading...</p>
          ) : recentComplaints.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>No complaints yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Title', 'Status', 'Priority', 'Assigned To', 'Action'].map(h => (
                      <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', color: '#fff', fontSize: '0.9rem' }}>{c.title}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${statusColor[c.status]}22`, color: statusColor[c.status] || '#9ca3af' }}>{c.status}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${priorityColor[c.priority]}22`, color: priorityColor[c.priority] || '#9ca3af' }}>{c.priority}</span>
                      </td>
                      <td style={{ padding: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{c.assignedTo?.name || '—'}</td>
                      <td style={{ padding: '12px' }}>
                        <Link to={`/admin/assign/${c.id}`} style={{ color: '#a78bfa', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>Manage →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
