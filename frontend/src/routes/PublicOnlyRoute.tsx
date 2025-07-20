// src/router/PublicOnlyRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
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

  // If authenticated and verified, redirect away from public-only pages
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated or not verified, render the children
  return <>{children}</>;
};

export default PublicOnlyRoute;
