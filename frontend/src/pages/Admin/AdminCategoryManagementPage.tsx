// src/pages/Admin/AdminCategoryManagementPage.tsx
import React from 'react';

const AdminCategoryManagementPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-dark mb-4">
        Category Management
      </h1>
      <p className="text-lg text-gray-700">Manage blog post categories.</p>
      <p className="mt-4 text-gray-600">This is an admin-only route.</p>
      {/* Placeholder for category management form/list */}
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
        Category creation/editing tools will go here.
      </div>
    </div>
  );
};

export default AdminCategoryManagementPage;
