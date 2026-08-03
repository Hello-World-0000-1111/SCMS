import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userRole = user?.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'SUPER_ADMIN') return <Navigate to="/superadmin/dashboard" />;
    if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" />;
    if (userRole === 'STAFF') return <Navigate to="/staff/dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
