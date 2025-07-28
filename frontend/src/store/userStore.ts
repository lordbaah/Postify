// stores/useUserStore.ts
import { create } from 'zustand';
import apiInstance from '@/services/api'; // Assuming this is your Axios instance
import type {
  UserState,
  User,
  ApiResponse,
  OperationResult,
  AllUsersResponse,
  ChangeUserRoleData,
  UserPostsResponse,
  UserCommentsResponse,
  userProfileEditData,
} from '@/types/user';

export const useUserStore = create<UserState>((set, get) => ({
  // Initial states
  user: null,
  isAuthenticated: false,
  error: null,
  success: null,
  isLoading: false,
  isCheckingAuth: true, // Indicates if the initial auth check is ongoing

  allUsers: [],
  userPosts: [],
  userComments: [],

  // Action to clear success/error messages
  clearMessages: () => set({ error: null, success: null }),

  // Action to get user profile
  getUserProfile: async (): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null, isCheckingAuth: false }); // Set isCheckingAuth to false once an attempt is made
    try {
      const response = await apiInstance.get<ApiResponse<User>>(
        '/users/profile'
      );
      const user = response.data?.data;

      set({
        user: user || null, // Ensure it's null if data is empty
        isAuthenticated: !!user, // True if user data exists
        isLoading: false,
        isCheckingAuth: false,
      });
      return {
        success: true,
        message: response.data.message || 'Profile fetched successfully.',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch profile.';
      console.error('getUserProfile failed:', errorMessage);
      set({
        user: null,
        isAuthenticated: false,
        error: errorMessage,
        isLoading: false,
        isCheckingAuth: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  editUserProfile: async (
    data: userProfileEditData
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null, isCheckingAuth: false }); // Set isCheckingAuth to false once an attempt is made
    try {
      const response = await apiInstance.put<ApiResponse<User>>(
        '/users/profile',
        data
      );
      const user = response.data?.data;

      set({
        user: user || null, // Ensure it's null if data is empty
        isAuthenticated: !!user, // True if user data exists
        isLoading: false,
        isCheckingAuth: false,
      });
      return {
        success: true,
        message: response.data.message || 'Profile updated successfully.',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to Updated profile.';
      console.error('updateProfile failed:', errorMessage);
      set({
        user: null,
        isAuthenticated: false,
        error: errorMessage,
        isLoading: false,
        isCheckingAuth: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  // --- New Functionalities ---

  // Get all users (Admin only)
  getAllUsersAdmin: async (): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.get<ApiResponse<AllUsersResponse>>(
        '/users'
      );
      set({
        allUsers: response.data.data?.users || [],
        isLoading: false,
      });
      return {
        success: true,
        message: response.data.message || 'Users fetched successfully.',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Error fetching all users. (Admin access required)';
      console.error('getAllUsersAdmin failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Change user role (Admin only)
  changeUserRole: async (
    id: string,
    data: ChangeUserRoleData
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.put<ApiResponse>(
        `/users/role/${id}`,
        data
      );
      set((state) => ({
        // Optionally update the role in allUsers array if it's currently loaded
        allUsers: state.allUsers.map((user) =>
          user._id === id ? { ...user, role: data.role } : user
        ),
        success: response.data.message,
        isLoading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Error changing user role. (Admin access required)';
      console.error('changeUserRole failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Get posts by the authenticated user
  getUserPosts: async (): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.get<ApiResponse<UserPostsResponse>>(
        '/users/posts'
      );
      set({
        userPosts: response.data.data?.posts || [],
        isLoading: false,
      });
      return {
        success: true,
        message: response.data.message || 'User posts fetched successfully.',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error fetching user posts.';
      console.error('getUserPosts failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Get comments by the authenticated user
  getUserComments: async (): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.get<ApiResponse<UserCommentsResponse>>(
        '/users/comments'
      );
      set({
        userComments: response.data.data?.comments || [],
        isLoading: false,
      });
      return {
        success: true,
        message: response.data.message || 'User comments fetched successfully.',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error fetching user comments.';
      console.error('getUserComments failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Update user profile image
  updateUserProfileImage: async (
    id: string,
    file: File
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const formData = new FormData();
      formData.append('image', file); // 'image' should match the field name your backend expects

      const response = await apiInstance.put<ApiResponse>(
        `/users/profile/${id}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        }
      );
      set((state) => ({
        // Assuming the API returns the updated user with the new image URL
        user: response.data.data?.user || state.user,
        success: response.data.message,
        isLoading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error updating profile image.';
      console.error('updateUserProfileImage failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Delete user profile image
  deleteUserProfileImage: async (id: string): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.delete<ApiResponse>(
        `/users/profile/${id}/image`
      );
      set((state) => ({
        // Clear the profile image from the user state upon successful deletion
        user: state.user ? { ...state.user, profileImage: undefined } : null,
        success: response.data.message,
        isLoading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error deleting profile image.';
      console.error('deleteUserProfileImage failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },
}));
