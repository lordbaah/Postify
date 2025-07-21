// types/blog.ts

// User type based on your API response
export interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
}

// Category type based on your API response
export interface Category {
  _id: string;
  name: string;
}

// Comment type based on your API response
export interface Comment {
  _id: string;
  post: string; // Post ID
  user: Author;
  text: string;
  created_at: string;
  __v: number;
}

// Pagination type based on your API response
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Blog post type based on your API response
export interface BlogPost {
  _id: string;
  title: string;
  image: string | null;
  content: string;
  category: Category;
  author: Author;
  published_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Request data types
export interface CreateBlogPostData {
  title: string;
  image?: string;
  content: string;
  category: string; // Category ID as string
}

export interface EditBlogPostData {
  title?: string;
  image?: string;
  content?: string;
  category?: string; // Category ID as string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: Pagination;
}

export interface SinglePostResponse {
  post: BlogPost;
  comments: Comment[];
}

// Return type for async operations
export interface OperationResult {
  success: boolean;
  message: string;
}

// Blog post store state interface
export interface PostState {
  // State
  error: string | null;
  success: string | null;
  isLoading: boolean;
  blogPosts: BlogPost[];
  currentPost: BlogPost | null;

  // Actions
  clearMessages: () => void;
  createBlogPost: (data: CreateBlogPostData) => Promise<OperationResult>;
  getAllBlogPosts: () => Promise<OperationResult>;
  getSinglePost: (id: string) => Promise<OperationResult>;
  editBlogPost: (
    id: string,
    data: EditBlogPostData
  ) => Promise<OperationResult>;
  deleteBlogPost: (id: string) => Promise<OperationResult>;
}
