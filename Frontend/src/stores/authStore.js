import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi, register as registerApi } from '../services/api';
import { setToken, removeToken, decodeToken } from '../utils/auth';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const response = await loginApi(credentials);
        const { token, ...user } = response.data;
        setToken(token);
        const decoded = decodeToken(token);
        set({ user: { ...user, role: decoded.role }, token, isAuthenticated: true });
        return user;
      },

      register: async (userData) => {
        return await registerApi(userData);
      },

      logout: () => {
        removeToken();
        set({ user: null, token: null, isAuthenticated: false });
      },

      getRole: () => {
        const state = useAuthStore.getState();
        return state.user?.role || null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
