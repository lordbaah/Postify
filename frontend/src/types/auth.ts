// types/auth.ts

// User type based on your API response
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profileImage: string | null;
  isVerified: boolean;
  role: 'user' | 'admin';
  // Add other fields if your user object has more properties
}

// Request data types
export interface SignupData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface VerifyAccountData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// Return type for async operations
export interface OperationResult {
  success: boolean;
  message: string;
}

// Auth store state interface
export interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  success: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;

  // Actions
  clearMessages: () => void;
  signup: (data: SignupData) => Promise<OperationResult>;
  verifyaccount: (data: VerifyAccountData) => Promise<OperationResult>;
  resendOtp: (email: string) => Promise<OperationResult>;
  signin: (data: SigninData) => Promise<OperationResult>;
  checkAuth: () => Promise<void>;
  signout: () => Promise<OperationResult>;
  forgotPassword: (email: string) => Promise<OperationResult>;
  resetPassword: (data: ResetPasswordData) => Promise<OperationResult>;
}
