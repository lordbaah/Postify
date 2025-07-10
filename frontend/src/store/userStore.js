import { create } from 'zustand';
import apiInstance from '@/services/api';

export const useUserStore = create((set) => ({
  //initial states
  user: null,
  isAuthenticated: false,
  error: null,
  success: null,
  isLoading: false,
  isCheckingAuth: true,

  //get user profile
  getUserProfile: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiInstance.get('/users/profile');

      const user = response.data?.data;

      set({
        user,
        isLoading: false,
      });
    } catch (error) {
      console.error('getUserProfile failed:', error?.response?.data?.message);

      set({
        user: null,
        error: error?.response?.data?.message || 'Failed to fetch profile',
        isLoading: false,
      });
    }
  },
}));
