// stores/useCommentStore.ts
import { create } from 'zustand';
import apiInstance from '@/services/api'; // Assuming this is your Axios instance
import type { ApiResponse, OperationResult } from '@/types/blog'; // Generic types still imported from blog.ts
import type {
  Comment,
  CreateCommentData,
  EditCommentData,
  CommentState,
} from '@/types/comment'; // All comment-specific types from the new file

export const useCommentStore = create<CommentState>((set) => ({
  // Initial states
  error: null,
  success: null,
  isLoading: false,

  // Action to clear success/error messages
  clearMessages: () => set({ error: null, success: null }),

  /**
   * Posts a new comment on a specific blog post.
   * @param postId The ID of the post to comment on.
   * @param data The comment data (e.g., text).
   * @returns An OperationResult indicating success or failure.
   */
  createComment: async (
    postId: string,
    data: CreateCommentData
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.post<ApiResponse<Comment>>(
        `/blog/posts/${postId}/comments`,
        data
      );
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error creating comment. Try again.';
      console.error('createComment failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  /**
   * Edits an existing comment.
   * @param commentId The ID of the comment to edit.
   * @param data The updated comment data (e.g., text).
   * @returns An OperationResult indicating success or failure.
   */
  editComment: async (
    commentId: string,
    data: EditCommentData
  ): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.put<ApiResponse<Comment>>(
        `/blog/comments/${commentId}`,
        data
      );
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error editing comment. Try again.';
      console.error('editComment failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  /**
   * Deletes a comment.
   * @param commentId The ID of the comment to delete.
   * @returns An OperationResult indicating success or failure.
   */
  deleteComment: async (commentId: string): Promise<OperationResult> => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await apiInstance.delete<ApiResponse>(
        `/blog/comments/${commentId}`
      );
      set({ success: response.data.message, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error deleting comment. Try again.';
      console.error('deleteComment failed:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },
}));
