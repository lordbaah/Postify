import { create } from 'zustand';
import apiInstance from '@/services/api';

export const useCategoryStore = create((set) => ({
  error: null,
  success: null,
  isLoading: false,
  categories: [],
  currentCategory: null,

  clearMessages: () => set({ error: null, success: null }),

  createCategory: async (data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/blog/categories', data);
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error creating category. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  getAllBlogCategory: async () => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.get('/blog/categories');
      set({
        categories: response.data.data?.categories || [],
        isLoading: false,
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      console.log(error);

      const errorMessage =
        error.response?.data?.message || 'Error fetching categories.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  getSingleCategory: async (id) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.get(`/blog/categories/${id}`);
      set({ currentCategory: response.data.category, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error getting category. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  editBlogCategory: async (id, data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.put(`/blog/categories/${id}`, data);
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error editing category. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.delete(`/blog/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        currentCategory:
          state.currentCategory?.id === id ? null : state.currentCategory,
        success: response.data.message,
        isLoading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error deleting category.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },
}));
