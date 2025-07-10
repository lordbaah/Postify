import { create } from 'zustand';
import apiInstance from '@/services/api';

export const usePostStore = create((set) => ({
  //initial states
  error: null,
  success: null,
  isLoading: false,

  //creating new post
  createBlogPost: async (data) => {
    //initail state
    set({ isLoading: true, error: null, success: null });

    try {
      console.log('blog post data:', data);

      const response = await apiInstance.post('/blog/posts', {
        title: data.title,
        image: data.image,
        content: data.content,
        category: data.category,
      });

      console.log('creating post success:', response.data);

      set({
        success: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      console.log('error:', error.response.data.message);
      set({
        error: error.response.data.message || 'Error creatng post. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },

  getAllBlogPost: async () => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.get('/blog/posts');
      const blogPosts = response.data.posts;

      set({
        success: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      console.log('error:', error.response.data.message);
      set({
        error: error.response.data.message || 'Error getting post. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },

  getSingleBlogPost: async () => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await apiInstance.get('/blog/posts/:id');
      const blogPosts = response.data.post;

      set({
        // success: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      console.log('error:', error.response.data.message);
      set({
        error: error.response.data.message || 'Error getting post. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },

  //editing new post
  editBlogPost: async (data) => {
    //initail state
    set({ isLoading: true, error: null, success: null });

    try {
      console.log('blog post data:', data);

      const response = await apiInstance.put('/blog/posts/:id', {
        title: data.title,
        image: data.image,
        content: data.content,
        category: data.category,
      });

      console.log('creating post success:', response.data);

      set({
        success: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      console.log('error:', error.response.data.message);
      set({
        error: error.response.data.message || 'Error creatng post. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBlogPost: async (data) => {
    //initail state
    set({ isLoading: true, error: null, success: null });

    try {
      console.log('blog post data:', data);

      const response = await apiInstance.delete('/blog/posts/:id', {
        title: data.title,
        image: data.image,
        content: data.content,
        category: data.category,
      });

      console.log('creating post success:', response.data);

      set({
        success: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      console.log('error:', error.response.data.message);
      set({
        error: error.response.data.message || 'Error creatng post. Try again.',
        isLoading: false,
      });
      throw error;
    }
  },
}));
