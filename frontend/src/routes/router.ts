import type { AppRoute } from '@/types/routes';

// Import page components
import HomePage from '@/pages/Home/HomePage';

// Auth pages
import SignInPage from '@/pages/Auth/SignInPage';
import SignUpPage from '@/pages/Auth/SignUpPage';
import EmailVerificationPage from '@/pages/Auth/EmailVerificationPage';
import ForgotPasswordPage from '@/pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/Auth/ResetPasswordPage';

// Blog pages
import BlogListPage from '@/pages/Blog/BlogListPage';
import BlogDetailPage from '@/pages/Blog/BlogDetailPage';

// Error page
import NotFoundPage from '@/pages/Error/NotFoundPage';

// Dashboard Pages (User & Admin) - Now more specific
import UserProfilePage from '@/pages/Dashboard/UserProfilePage'; // New: User Profile
import UserMyPostsPage from '@/pages/Dashboard/UserMyPostsPage'; // New: User's Posts
import UserNewPostPage from '@/pages/Dashboard/UserNewPostPage'; // New: User New Post
import UserMyCommentsPage from '@/pages/Dashboard/UserMyCommentsPage'; // New: User's Comments

import AdminUserManagementPage from '@/pages/Admin/AdminUserManagementPage'; // New: Admin Users
import AdminCategoryManagementPage from '@/pages/Admin/AdminCategoryManagementPage'; // New: Admin Categories
import AdminAllPostsPage from '@/pages/Admin/AdminAllPostsPage'; // New: Admin All Posts
import AdminAllCommentsPage from '@/pages/Admin/AdminAllCommentsPage'; // New: Admin All Comments

// Import layout components
import MainLayout from '@/components/layout/MainLayout';
import DashboardLayout from '@/components/layout/DashboardLayout'; // Import DashboardLayout

export const appRoutes: AppRoute[] = [
  // --- Public Routes ---
  {
    path: '/',
    component: HomePage,
    layout: MainLayout,
  },

  // Blog Routes
  {
    path: '/blogs',
    component: BlogListPage,
    layout: MainLayout,
  },
  {
    path: '/blogs/:id',
    component: BlogDetailPage,
    layout: MainLayout,
  },

  // --- Auth Pages (Public Only) ---
  {
    path: '/signin',
    component: SignInPage,
    isPublicOnly: true, // Add public only flag
    layout: MainLayout,
  },
  {
    path: '/signup',
    component: SignUpPage,
    isPublicOnly: true, // Add public only flag
    layout: MainLayout,
  },
  {
    path: '/verify-email',
    component: EmailVerificationPage,
    isPublicOnly: true, // Often public, but redirects if already verified/logged in
    layout: MainLayout,
  },
  {
    path: '/forgot-password',
    component: ForgotPasswordPage,
    isPublicOnly: true, // Add public only flag
    layout: MainLayout,
  },
  {
    path: '/reset-password',
    component: ResetPasswordPage,
    isPublicOnly: true, // Add public only flag
    layout: MainLayout,
  },

  // --- Protected User Routes ---
  {
    path: '/dashboard',
    component: UserProfilePage,
    isProtected: true,
    layout: DashboardLayout,
  },
  {
    path: '/dashboard/my-posts',
    component: UserMyPostsPage,
    isProtected: true,
    layout: DashboardLayout,
  },
  {
    path: '/dashboard/new-post',
    component: UserNewPostPage,
    isProtected: true,
    layout: DashboardLayout,
  },
  {
    path: '/dashboard/my-comments',
    component: UserMyCommentsPage,
    isProtected: true,
    layout: DashboardLayout,
  },

  // --- Protected Admin Routes ---
  {
    path: '/admin',
    component: AdminUserManagementPage,
    isProtected: true,
    isAdminOnly: true,
    layout: DashboardLayout,
  },
  {
    path: '/admin/users',
    component: AdminUserManagementPage,
    isProtected: true,
    isAdminOnly: true,
    layout: DashboardLayout,
  },
  {
    path: '/admin/categories',
    component: AdminCategoryManagementPage,
    isProtected: true,
    isAdminOnly: true,
    layout: DashboardLayout,
  },
  {
    path: '/admin/posts',
    component: AdminAllPostsPage,
    isProtected: true,
    isAdminOnly: true,
    layout: DashboardLayout,
  },
  {
    path: '/admin/comments',
    component: AdminAllCommentsPage,
    isProtected: true,
    isAdminOnly: true,
    layout: DashboardLayout,
  },

  // --- Fallback/Not Found Page ---
  {
    path: '*', // Catch-all route for any unmatched paths
    component: NotFoundPage,
    layout: MainLayout,
  },
];
