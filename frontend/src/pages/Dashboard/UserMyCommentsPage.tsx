// src/pages/Dashboard/UserMyCommentsPage.tsx
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

const UserMyCommentsPage = () => {
  const { getUserComments, userComments } = useUserStore();

  useEffect(() => {
    getUserComments();
  }, []);

  console.log(userComments);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-dark mb-4">My Comments</h1>
      <p className="text-lg text-gray-700">
        This page will list all comments you've made.
      </p>
      <p className="mt-4 text-gray-600">
        This is a protected user dashboard route.
      </p>
      {/* Placeholder for user's comments list */}
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
        Your comments will appear here.
      </div>
    </div>
  );
};

export default UserMyCommentsPage;
