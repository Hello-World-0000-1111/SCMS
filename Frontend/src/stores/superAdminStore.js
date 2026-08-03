import { create } from 'zustand';
import api from '../services/api';

const useSuperAdminStore = create((set) => ({
  organizations: [],
  allUsers: [],
  loading: false,
  error: null,

  fetchOrganizations: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/superadmin/organizations');
      set({ organizations: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load organizations', loading: false });
    }
  },

  registerOrganization: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/superadmin/organizations', data);
      set((state) => ({ organizations: [...state.organizations, res.data], loading: false }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to register organization', loading: false });
      throw err;
    }
  },

  enrollUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/superadmin/enroll', data);
      set((state) => ({ allUsers: [...state.allUsers, res.data], loading: false }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to enroll user', loading: false });
      throw err;
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/superadmin/users');
      set({ allUsers: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load users', loading: false });
    }
  },
}));

export default useSuperAdminStore;
