// src/router/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

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

  // If not authenticated after check, redirect to the sign-in page
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
