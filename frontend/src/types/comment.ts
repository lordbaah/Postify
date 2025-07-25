import type { Author, OperationResult, ApiResponse } from './blog'; // Import necessary types from blog.ts
// Import necessary types from blog.ts

/**
 * Interface for a single Comment object, as returned from the API.
 */
export interface Comment {
  _id: string;
  post: string; // The ID of the post this comment belongs to
  user: Author; // The author of the comment
  text: string;
  created_at: string; // Timestamp for creation
  __v: number; // Version key for Mongoose
}

/**
 * Data required to create a new comment.
 */
export interface CreateCommentData {
  text: string;
}

/**
 * Data required to edit an existing comment.
 */
export interface EditCommentData {
  text: string;
}

/**
 * Interface for the state and actions of the Comment Zustand store.
 */
export interface CommentState {
  // State properties
  error: string | null;
  success: string | null;
  isLoading: boolean;

  // Actions
  clearMessages: () => void;
  createComment: (
    postId: string,
    data: CreateCommentData
  ) => Promise<OperationResult>;
  editComment: (
    commentId: string,
    data: EditCommentData
  ) => Promise<OperationResult>;
  deleteComment: (commentId: string) => Promise<OperationResult>;
}
