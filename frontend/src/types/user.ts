import type { Category, Author } from './blog';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: 'user' | 'admin';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface userProfileEditData {
  // _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  // email: string;
  // role: 'user' | 'admin';
}

// User role change data
export type UserRole = 'user' | 'admin';

export interface ChangeUserRoleData {
  role: UserRole;
}

// Generic API Response type
export interface ApiResponse<T = any> {
  users: never[];
  success: boolean;
  message: string;
  data?: T; // The actual data returned by the API
}

// Return type for async operations (consistent with blog store)
export interface OperationResult {
  success: boolean;
  message: string;
}

// Response for getting all users
export interface AllUsersResponse {
  users: User[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
  };
}

export interface UserBlogPost {
  _id: string;
  title: string;
  image: string | null;
  content: string;
  category: Category | null;
  author: Author;
  published_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserComment {
  created_at: string;
  post: UserBlogPost;
  _id: string;
  text: string;
  // ... other minimal comment fields needed for display in user context
}

export interface UserPostsResponse {
  posts: UserBlogPost[];
  pagination?: {
    currentPage: number;
    totalPosts: number;
  };
}

export interface UserCommentsResponse {
  comments: UserComment[];
  pagination?: {
    currentPage: number;
    totalComments: number;
  };
}

// User store state interface
export interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  success: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean; // For initial auth check

  allUsers: User[]; // To store the list of all users for admin
  userPosts: UserBlogPost[]; // Posts by the current authenticated user
  userComments: UserComment[]; // Comments by the current authenticated user

  // Actions
  clearMessages: () => void;
  getUserProfile: () => Promise<OperationResult>;
  editUserProfile: (data: userProfileEditData) => Promise<OperationResult>;
  // New actions
  getAllUsersAdmin: () => Promise<OperationResult>;
  changeUserRole: (
    id: string,
    data: ChangeUserRoleData
  ) => Promise<OperationResult>;
  getUserPosts: () => Promise<OperationResult>;
  getUserComments: () => Promise<OperationResult>;
  updateUserProfileImage: (id: string, file: File) => Promise<OperationResult>;
  deleteUserProfileImage: (id: string) => Promise<OperationResult>;
}
