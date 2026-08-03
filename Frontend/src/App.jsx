import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import NewComplaint from './pages/user/NewComplaint';
import UserComplaintDetail from './pages/user/ComplaintDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AssignComplaint from './pages/admin/AssignComplaint';
import Users from './pages/admin/Users';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffComplaintDetail from './pages/staff/ComplaintDetail';
import UpdateStatus from './pages/staff/UpdateStatus';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/complaints/new" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <NewComplaint />
              </ProtectedRoute>
            } />
            <Route path="/complaints/:id" element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <UserComplaintDetail />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/complaints" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminComplaints />
              </ProtectedRoute>
            } />
            <Route path="/admin/assign/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AssignComplaint />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            } />

            {/* Staff Routes */}
            <Route path="/staff/dashboard" element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffDashboard />
              </ProtectedRoute>
            } />
            <Route path="/staff/complaints/:id" element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffComplaintDetail />
              </ProtectedRoute>
            } />
            <Route path="/staff/update-status/:id" element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <UpdateStatus />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
