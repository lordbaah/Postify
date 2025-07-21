// src/pages/Admin/AdminUserManagementPage.tsx

import { useAuthStore } from '@/store/authStore';

const AdminUserManagementPage = () => {
  const { user } = useAuthStore();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-dark mb-4">
        User Management
      </h1>
      <p className="text-lg text-gray-700">Manage all users in the system.</p>
      <p className="mt-4 text-gray-600">
        This is an admin-only route. Current user:{' '}
        <span className="font-semibold">
          {user?.userName} ({user?.role})
        </span>
      </p>
      {/* Placeholder for user table */}
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
        User table and management tools will go here.
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
