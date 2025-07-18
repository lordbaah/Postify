import { create } from 'zustand';
import apiInstance from '@/services/api';

export const useAuthStore = create((set) => ({
  // Initial states
  user: null,
  isAuthenticated: false,
  error: null,
  success: null,
  isLoading: false,
  isCheckingAuth: true,

  // Clear messages - call this when component unmounts or before new actions
  clearMessages: () => set({ error: null, success: null }),

  // Sign up logic
  signup: async (data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/auth/signup', {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
      });

      const user = response.data?.data?.user;

      set({
        user: user,
        success: response.data.message,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error signing up. Try again.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  // Verify account
  verifyaccount: async (data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/auth/verify-email', {
        email: data.email,
        otp: data.otp,
      });

      const user = response.data.data.user;

      set({
        user: user,
        success: response.data?.message,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, message: response.data?.message };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Error verifying email. Try again.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  // Resend signup OTP
  resendSignUpOTp: async (email) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/auth/resend-verification', {
        email,
      });

      const user = response.data.data.user;

      set({
        user: user,
        success: response.data?.message,
        isLoading: false,
      });

      return { success: true, message: response.data?.message };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        'Error resending verification otp. Try again.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  // Sign in
  signin: async (data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/auth/signin', {
        email: data.email,
        password: data.password,
      });

      const token = response.data.data.token;
      const user = response.data.data.user;

      if (!token) {
        throw new Error('Token missing in response');
      }

      localStorage.setItem('token', token);

      set({
        user: user,
        success: response.data.message,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error signing in. Try again.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  // Check auth
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await apiInstance.get('/auth/check-auth');
      const user = response.data.data.user;

      set({
        user: user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  // Sign out
  signout: async () => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/auth/signout');
      localStorage.removeItem('token');

      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        success: response.data.message,
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = 'Error logging out';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/auth/forgot-password', {
        email,
      });

      set({
        success: response.data?.message,
        isLoading: false,
      });

      return { success: true, message: response.data?.message };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        'Error sending reset email. Try again.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  // Reset password
  resetPassword: async (data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/auth/reset-password', {
        email: data.email,
        otp: data.otp,
        newPassword: data.password,
      });

      set({
        success: response.data?.message || 'Password reset successful',
        isLoading: false,
      });

      return {
        success: true,
        message: response.data?.message || 'Password reset successful',
      };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        'Error resetting password. Try again.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return { success: false, message: errorMessage };
    }
  },
}));
