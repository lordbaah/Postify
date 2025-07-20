import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

/**
 * Simple hook to automatically show toast messages for auth success/error states
 * Just add this one line to any component that uses auth store actions
 */
export const useAuthToast = () => {
  const { success, error, clearMessages } = useAuthStore();

  useEffect(() => {
    if (success) {
      toast.success(success);
      clearMessages(); // Clear immediately after showing
    }
    if (error) {
      toast.error(error);
      clearMessages(); // Clear immediately after showing
    }
  }, [success, error, clearMessages]);
};
