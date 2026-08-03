import { create } from 'zustand';
import { getAssignedComplaints, updateComplaintStatus } from '../services/api';

const useStaffStore = create((set) => ({
  assignedComplaints: [],
  loading: false,
  error: null,

  fetchAssignedComplaints: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getAssignedComplaints();
      set({ assignedComplaints: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load assigned complaints', loading: false });
    }
  },

  updateStatus: async (id, status, note) => {
    set({ loading: true, error: null });
    try {
      const res = await updateComplaintStatus(id, status, note);
      set((state) => ({
        assignedComplaints: state.assignedComplaints.map((c) => (c.id === id ? res.data : c)),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update status', loading: false });
      throw err;
    }
  },
}));

export default useStaffStore;
