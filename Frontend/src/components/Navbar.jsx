import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = {
    USER: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/complaints/new', label: 'New Complaint' },
    ],
    ADMIN: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/complaints', label: 'Complaints' },
      { to: '/admin/users', label: 'Users' },
    ],
    STAFF: [
      { to: '/staff/dashboard', label: 'My Assignments' },
    ],
    SUPER_ADMIN: [
      { to: '/superadmin/dashboard', label: 'Overview' },
      { to: '/superadmin/organizations', label: 'Organizations' },
      { to: '/superadmin/users', label: 'All Users' },
      { to: '/superadmin/enroll', label: 'Enroll Staff' },
    ],
  };

  const links = navLinks[role] || [];

  const roleColors = {
    USER: 'bg-blue-500',
    ADMIN: 'bg-purple-500',
    STAFF: 'bg-green-500',
    SUPER_ADMIN: 'bg-red-500',
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          {/* Logo & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/" style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
            }}>
              ⚡ SCMS
            </Link>

            {isAuthenticated && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: 700, color: '#fff',
                  }}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{user?.name}</p>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '1px 8px',
                      borderRadius: '20px',
                      background: roleColors[role] || '#6b7280',
                      color: '#fff',
                      fontWeight: 600,
                    }}>{role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(239,68,68,0.2)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    color: '#fca5a5',
                    padding: '6px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.4)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                    e.currentTarget.style.color = '#fca5a5';
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}>
                  Login
                </Link>
                <Link to="/register" style={{
                  background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
