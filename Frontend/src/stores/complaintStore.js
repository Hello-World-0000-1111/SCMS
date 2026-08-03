import { create } from 'zustand';
import {
  getUserComplaints,
  createComplaint,
  getComplaint,
} from '../services/api';

const useComplaintStore = create((set, get) => ({
  complaints: [],
  currentComplaint: null,
  loading: false,
  error: null,

  fetchMyComplaints: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getUserComplaints();
      set({ complaints: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load complaints', loading: false });
    }
  },

  fetchComplaint: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await getComplaint(id);
      set({ currentComplaint: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load complaint', loading: false });
    }
  },

  submitComplaint: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await createComplaint(data);
      set((state) => ({
        complaints: [res.data, ...state.complaints],
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to submit complaint', loading: false });
      throw err;
    }
  },

  clearCurrent: () => set({ currentComplaint: null }),
}));

export default useComplaintStore;
