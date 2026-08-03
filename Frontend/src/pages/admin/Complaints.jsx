import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../stores/adminStore';

const AdminComplaints = () => {
  const { complaints, loading, fetchAllComplaints } = useAdminStore();
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });

  useEffect(() => {
    fetchAllComplaints(filters);
  }, []);

  const handleFilter = () => fetchAllComplaints(filters);

  const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', CLOSED: '#6b7280' };
  const priorityColor = { HIGH: '#ef4444', CRITICAL: '#dc2626', MEDIUM: '#f59e0b', LOW: '#10b981' };

  const selectStyle = {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '0.875rem', outline: 'none',
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 8px' }}>Complaints</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>Review and manage all complaints in your organization</p>

        {/* Filters */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px', padding: '20px', marginBottom: '24px',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={selectStyle}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })} style={selectStyle}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <button onClick={handleFilter} style={{
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', border: 'none',
            color: '#fff', padding: '10px 24px', borderRadius: '10px', fontWeight: 700,
            cursor: 'pointer', fontSize: '0.875rem',
          }}>Apply Filters</button>
        </div>

        {/* Complaints Table */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)' }}>Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
              No complaints found
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Title', 'Category', 'Status', 'Priority', 'Assigned To', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', padding: '14px 16px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{c.title}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{c.category || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${statusColor[c.status]}22`, color: statusColor[c.status] || '#9ca3af' }}>{c.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${priorityColor[c.priority]}22`, color: priorityColor[c.priority] || '#9ca3af' }}>{c.priority}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{c.assignedTo?.name || 'Unassigned'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link to={`/admin/assign/${c.id}`} style={{
                        color: '#a78bfa', fontWeight: 600, textDecoration: 'none', fontSize: '0.8rem',
                        padding: '5px 12px', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '8px',
                      }}>Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;