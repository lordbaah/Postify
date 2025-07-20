// src/pages/Dashboard/UserProfilePage.tsx
import React from 'react';
import { useAuthStore } from '@/store/authStore';

const UserProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-dark mb-4">
        User Profile
      </h1>
      <p className="text-lg text-gray-700">
        Welcome to your profile,{' '}
        <span className="font-semibold">{user?.userName || 'User'}</span>!
      </p>
      <p className="mt-2 text-gray-600">
        Email: <span className="font-medium">{user?.email || 'N/A'}</span>
      </p>
      <p className="mt-2 text-gray-600">
        Your role:{' '}
        <span className="font-medium text-primary-DEFAULT">{user?.role}</span>
      </p>
      <p className="mt-4 text-gray-600">
        This is a protected route, accessible only to logged-in users.
      </p>
    </div>
  );
};

export default UserProfilePage;
