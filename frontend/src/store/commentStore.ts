import { create } from 'zustand';
import apiInstance from '@/services/api';
import type { ApiResponse, OperationResult } from '@/types/blog';
import type {
  Comment,
  CreateCommentData,
  EditCommentData,
  CommentState,
} from '@/types/comment';

export const useCommentStore = create<CommentState>((set) => ({
  // Initial states
  error: null,
  success: null,
  isCreating: false,
  isEditing: false,
  isDeleting: false,

  // Action to clear success/error messages
  clearMessages: () => set({ error: null, success: null }),

  // Posts a new comment on a specific blog post
  createComment: async (
    postId: string,
    data: CreateCommentData
  ): Promise<OperationResult> => {
    set({ isCreating: true, error: null, success: null });
    try {
      const response = await apiInstance.post<ApiResponse<Comment>>(
        `/blog/posts/${postId}/comments`,
        data
      );

      set({ success: response.data.message, isCreating: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error creating comment. Try again.';
      console.error('createComment failed:', errorMessage);
      set({ error: errorMessage, isCreating: false });
      return { success: false, message: errorMessage };
    }
  },

  // Edits an existing comment
  editComment: async (
    commentId: string,
    data: EditCommentData
  ): Promise<OperationResult> => {
    set({ isEditing: true, error: null, success: null });
    try {
      const response = await apiInstance.put<ApiResponse<Comment>>(
        `/blog/comments/${commentId}`,
        data
      );
      set({ success: response.data.message, isEditing: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error editing comment. Try again.';
      console.error('editComment failed:', errorMessage);
      set({ error: errorMessage, isEditing: false });
      return { success: false, message: errorMessage };
    }
  },

  // Deletes a comment
  deleteComment: async (commentId: string): Promise<OperationResult> => {
    set({ isDeleting: true, error: null, success: null });
    try {
      const response = await apiInstance.delete<ApiResponse>(
        `/blog/comments/${commentId}`
      );
      set({ success: response.data.message, isDeleting: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error deleting comment. Try again.';
      console.error('deleteComment failed:', errorMessage);
      set({ error: errorMessage, isDeleting: false });
      return { success: false, message: errorMessage };
    }
  },
}));
