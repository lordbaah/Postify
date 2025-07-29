import type { Author, OperationResult, ApiResponse } from './blog';

export interface Comment {
  _id: string;
  post: string;
  user: Author;
  text: string;
  created_at: string;
  __v: number;
}

export interface CreateCommentData {
  text: string;
}

export interface EditCommentData {
  text: string;
}

export interface CommentState {
  // State properties
  error: string | null;
  success: string | null;
  isCreating: boolean;
  isEditing: boolean;
  isDeleting: boolean;

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
