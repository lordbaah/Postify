// src/components/layout/DashboardLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

import {
  HomeIcon,
  UserIcon,
  FileTextIcon,
  MessageSquareIcon,
  UsersIcon,
  ListIcon,
  LogOutIcon,
} from 'lucide-react'; // Example icons

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signout } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const handleSignOut = async () => {
    await signout();
    // The apiInstance interceptor or the signout action itself should handle redirecting to /signin
    //I will import message hooks
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-roboto antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 flex flex-col rounded-r-xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary-DEFAULT">Dashboard</h2>
          {user && (
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user.userName}!
            </p>
          )}
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2">
            {/* User Dashboard Links */}
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-primary-light hover:text-white transition-colors duration-200"
              >
                <UserIcon className="mr-3 h-5 w-5" /> Profile
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/my-posts"
                className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-primary-light hover:text-white transition-colors duration-200"
              >
                <FileTextIcon className="mr-3 h-5 w-5" /> My Posts
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/new-post"
                className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-primary-light hover:text-white transition-colors duration-200"
              >
                <FileTextIcon className="mr-3 h-5 w-5" /> New Post
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/my-comments"
                className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-primary-light hover:text-white transition-colors duration-200"
              >
                <MessageSquareIcon className="mr-3 h-5 w-5" /> My Comments
              </Link>
            </li>

            {/* Admin Links (Conditionally Rendered) */}
            {isAdmin && (
              <>
                <li className="pt-6 pb-2 text-gray-500 font-semibold text-sm uppercase tracking-wider">
                  Admin Tools
                </li>
                <li>
                  <Link
                    to="/admin/users"
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-primary-light hover:text-white transition-colors duration-200"
                  >
                    <UsersIcon className="mr-3 h-5 w-5" /> User Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categories"
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-primary-light hover:text-white transition-colors duration-200"
                  >
                    <ListIcon className="mr-3 h-5 w-5" /> Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/posts"
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-primary-light hover:text-white transition-colors duration-200"
                  >
                    <FileTextIcon className="mr-3 h-5 w-5" /> All Posts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/comments"
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-primary-light hover:text-white transition-colors duration-200"
                  >
                    <MessageSquareIcon className="mr-3 h-5 w-5" /> All Comments
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Logout and Back to Home */}
        <div className="mt-8 space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              <HomeIcon className="mr-3 h-5 w-5" /> Back to Home
            </Link>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md"
            >
              <LogOutIcon className="mr-3 h-5 w-5" /> Sign Out
            </button>
          </li>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8">
        <div className="bg-white rounded-xl shadow-md p-6 min-h-[calc(100vh-64px)]">
          {' '}
          {/* Adjust min-height as needed */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
