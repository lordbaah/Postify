import { create } from 'zustand';
import apiInstance from '@/services/api';

export const useAuthStore = create((set) => ({
  //initial states
  user: null,
  isAuthenticated: false,
  error: null,
  success: null,
  isLoading: false,
  isCheckingAuth: true,

  //sign up logic
  signup: async (data) => {
    //initail state
    set({ isLoading: true, error: null, success: null });

    try {
      console.log('Incoming signup data:', data);

      const response = await apiInstance.post('/auth/signup', {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
      });

      console.log('Signup success:', response.data);
      const user = response.data.data.user;

      set({
        user: user,
        success: response.data.message,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.log('error:', error.response.data.message);
      set({
        error: error.response.data.message || 'Error signing up. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyaccount: async (data) => {
    set({ isLoading: true, error: null, success: null });
    try {
      console.log('Verifying with:', data); // should contain email or user ID and OTP

      const response = await apiInstance.post('/auth/verify-email', {
        email: data.email,
        otp: data.otp,
      });

      console.log('verification success:', response.data?.message);
      const user = response.data.data.user;

      set({
        user: user,
        success: response.data?.message,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.log('error:', error?.response?.data?.message);
      set({
        error:
          error?.response?.data?.message || 'Error Verifying email. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },

  resendSignUpOTp: async (email) => {
    set({ isLoading: true, error: null, success: null });

    console.log('Resending OTP to:', email);
    try {
      const response = await apiInstance.post('/auth/resend-verification', {
        email,
      });

      console.log('verification code resent:', response.data?.message);
      const user = response.data.data.user;

      set({
        user: user,
        success: response.data?.message,
        isLoading: false,
      });
    } catch (error) {
      console.log('error:', error?.response?.data?.message);
      set({
        error:
          error?.response?.data?.message ||
          'Error resending verification otp. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },

  signin: async (data) => {
    //initail state
    set({ isLoading: true, error: null, success: null });

    try {
      console.log('Incoming signup data:', data);

      const response = await apiInstance.post('/auth/signin', {
        email: data.email,
        password: data.password,
      });

      console.log('Signin success:', response.data);
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
    } catch (error) {
      console.log('error:', error.response.data.message);
      set({
        error: error.response?.data?.message || 'Error signing in. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },

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
      console.log('checkAuth failed:', error?.response?.data?.message);

      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

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
    } catch (error) {
      set({ error: 'Error logging out', isLoading: false });
      throw error;
    }
  },
}));
