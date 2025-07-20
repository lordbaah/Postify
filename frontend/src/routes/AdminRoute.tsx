import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  // Show a loading indicator while the initial auth check is in progress
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-primary-DEFAULT">
          Loading authentication...
        </p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If authenticated but not an admin, redirect to a common dashboard or home
  if (user?.role !== 'admin') {
    // You might want to show a toast message here indicating unauthorized access
    return <Navigate to="/dashboard" replace />; // Redirect to user dashboard
  }

  // If authenticated and is admin, render the children
  return <>{children}</>;
};

export default AdminRoute;
