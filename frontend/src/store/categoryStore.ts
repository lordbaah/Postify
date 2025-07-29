// stores/useCategoryStore.ts
import { create } from 'zustand';
import apiInstance from '@/services/api';
import type {
  CategoryState,
  CreateCategoryData,
  EditCategoryData,
  OperationResult,
  ApiResponse,
  CategoriesResponse,
  SingleCategoryResponse,
} from '@/types/category';

export const useCategoryStore = create<CategoryState>((set) => ({
  error: null,
  success: null,
  isLoading: false,
  categories: [],
  currentCategory: null,

  clearMessages: () => set({ error: null, success: null }),

  createCategory: async (
    data: CreateCategoryData
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.post<ApiResponse>(
        '/blog/categories',
        data
      );
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error creating category. Try again.';
      // console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  getAllBlogCategory: async (): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.get<ApiResponse<CategoriesResponse>>(
        '/blog/categories'
      );
      set({
        categories: response.data.data?.categories || [],
        isLoading: false,
      });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      // console.log(error);
      const errorMessage: string =
        error.response?.data?.message || 'Error fetching categories.';
      // console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  getSingleCategory: async (id: string): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.get<
        ApiResponse<SingleCategoryResponse>
      >(`/blog/categories/${id}`);
      set({
        currentCategory: response.data.data?.category || null,
        isLoading: false,
      });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error getting category. Try again.';
      // console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  editBlogCategory: async (
    id: string,
    data: EditCategoryData
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.put<ApiResponse>(
        `/blog/categories/${id}`,
        data
      );
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error editing category. Try again.';
      // console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  deleteCategory: async (id: string): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.delete<ApiResponse>(
        `/blog/categories/${id}`
      );
      set((state: CategoryState) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        currentCategory:
          state.currentCategory?._id === id ? null : state.currentCategory,
        success: response.data.message,
        isLoading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage: string =
        error.response?.data?.message || 'Error deleting category.';
      // console.log('error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },
}));
