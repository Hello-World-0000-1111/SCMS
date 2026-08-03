import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// User APIs
export const getUserComplaints = () => api.get('/complaints/my');
export const createComplaint = (complaint) => api.post('/complaints', complaint);
export const getComplaint = (id) => api.get(`/complaints/${id}`);

// Admin APIs
export const getAllComplaints = (params) => api.get('/admin/complaints', { params });
export const getComplaintStats = () => api.get('/admin/complaints/stats');
export const assignComplaint = (id, staffId) => api.put(`/admin/complaints/${id}/assign`, { staffId });
export const getAllUsers = () => api.get('/admin/users');
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const getStaffMembers = () => api.get('/admin/staff');

// Staff APIs
export const getAssignedComplaints = () => api.get('/staff/complaints');
export const updateComplaintStatus = (id, status, note) => 
  api.put(`/staff/complaints/${id}/status`, { status, note });

export default api;