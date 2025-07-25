// types/user.ts

// Basic User type (adjust properties based on your actual backend user schema)
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
  // Add any other user-related fields from your API response
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
  // You might also have pagination info here, similar to blog posts
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
  };
}

// BlogPost and Comment types (referencing from your blog store, if needed in user store)
// For simplicity, I'll keep them minimal here, assuming they are fully defined in types/blog.ts
export interface UserBlogPost {
  _id: string;
  title: string;
  // ... other minimal post fields needed for display in user context
}

export interface UserComment {
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
