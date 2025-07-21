// stores/usePostStore.ts
import { create } from 'zustand';
import apiInstance from '@/services/api';
import type {
  PostState,
  CreateBlogPostData,
  EditBlogPostData,
  OperationResult,
  ApiResponse,
  BlogPostsResponse,
  SinglePostResponse,
} from '@/types/blog';

export const usePostStore = create<PostState>((set) => ({
  error: null,
  success: null,
  isLoading: false,
  blogPosts: [],
  currentPost: null,

  clearMessages: () => set({ error: null, success: null }),

  createBlogPost: async (
    data: CreateBlogPostData
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.post<ApiResponse>('/blog/posts', data);
      console.log(response);
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error creating post. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  getAllBlogPosts: async (): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.get<ApiResponse<BlogPostsResponse>>(
        '/blog/posts'
      );
      set({ blogPosts: response.data.data?.posts || [], isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error fetching posts. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  getSinglePost: async (id: string): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.get<ApiResponse<SinglePostResponse>>(
        `/blog/posts/${id}`
      );
      set({ currentPost: response.data.data?.post || null, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error fetching post. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  editBlogPost: async (
    id: string,
    data: EditBlogPostData
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.put<ApiResponse>(
        `/blog/posts/${id}`,
        data
      );
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error editing post. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  deleteBlogPost: async (id: string): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.delete<ApiResponse>(
        `/blog/posts/${id}`
      );
      set((state: PostState) => ({
        blogPosts: state.blogPosts.filter((post) => post._id !== id),
        currentPost: state.currentPost?._id === id ? null : state.currentPost,
        success: response.data.message,
        isLoading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error deleting post. Try again.';
      console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },
}));
