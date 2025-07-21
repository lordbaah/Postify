// types/category.ts

// Category type based on your API response
export interface Category {
  _id: string;
  name: string;
  // Add other fields if your category object has more properties
}

// Request data types
export interface CreateCategoryData {
  name: string;
  // Add other fields required for creating a category
}

export interface EditCategoryData {
  name?: string;
  // Add other fields that can be edited (all optional)
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface SingleCategoryResponse {
  category: Category;
}

// Return type for async operations
export interface OperationResult {
  success: boolean;
  message: string;
}

// Category store state interface
export interface CategoryState {
  // State
  error: string | null;
  success: string | null;
  isLoading: boolean;
  categories: Category[];
  currentCategory: Category | null;

  // Actions
  clearMessages: () => void;
  createCategory: (data: CreateCategoryData) => Promise<OperationResult>;
  getAllBlogCategory: () => Promise<OperationResult>;
  getSingleCategory: (id: string) => Promise<OperationResult>;
  editBlogCategory: (
    id: string,
    data: EditCategoryData
  ) => Promise<OperationResult>;
  deleteCategory: (id: string) => Promise<OperationResult>;
}
