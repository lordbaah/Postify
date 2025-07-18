import { create } from 'zustand';
import apiInstance from '@/services/api';

export const usePostStore = create((set) => ({
  error: null,
  success: null,
  isLoading: false,
  blogPosts: [],
  currentPost: null,

  clearMessages: () => set({ error: null, success: null }),

  createBlogPost: async (data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.post('/blog/posts', data);
      console.log(response);

      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error creating post. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  getAllBlogPosts: async () => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.get('/blog/posts');
      set({ blogPosts: response.data.data?.posts || [], isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error fetching posts. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  getSinglePost: async (id) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.get(`/blog/posts/${id}`);
      set({ currentPost: response.data.post, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error fetching post. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  editBlogPost: async (id, data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.put(`/blog/posts/${id}`, data);
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error editing post. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  deleteBlogPost: async (id) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.delete(`/blog/posts/${id}`);
      set((state) => ({
        blogPosts: state.blogPosts.filter((post) => post.id !== id),
        currentPost: state.currentPost?.id === id ? null : state.currentPost,
        success: response.data.message,
        isLoading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error deleting post. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },
}));
