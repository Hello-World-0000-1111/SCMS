import { create } from 'zustand';
import {
  getAllComplaints,
  getComplaintStats,
  assignComplaint,
  getAllUsers,
  updateUserRole,
  getStaffMembers,
} from '../services/api';

const useAdminStore = create((set) => ({
  complaints: [],
  stats: null,
  users: [],
  staffMembers: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getComplaintStats();
      set({ stats: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load stats', loading: false });
    }
  },

  fetchAllComplaints: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllComplaints(filters);
      set({ complaints: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load complaints', loading: false });
    }
  },

  assignComplaint: async (id, staffId) => {
    set({ loading: true, error: null });
    try {
      const res = await assignComplaint(id, staffId);
      set((state) => ({
        complaints: state.complaints.map((c) => (c.id === id ? res.data : c)),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to assign complaint', loading: false });
      throw err;
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getAllUsers();
      set({ users: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load users', loading: false });
    }
  },

  fetchStaffMembers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getStaffMembers();
      set({ staffMembers: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load staff', loading: false });
    }
  },

  updateUserRole: async (id, role) => {
    try {
      const res = await updateUserRole(id, role);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? res.data : u)),
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update role' });
      throw err;
    }
  },
}));

export default useAdminStore;
