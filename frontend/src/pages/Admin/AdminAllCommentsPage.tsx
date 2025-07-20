// src/pages/Admin/AdminAllCommentsPage.tsx
import React from 'react';

const AdminAllCommentsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-dark mb-4">
        All Comments (Admin View)
      </h1>
      <p className="text-lg text-gray-700">View and moderate all comments.</p>
      <p className="mt-4 text-gray-600">This is an admin-only route.</p>
      {/* Placeholder for all comments list with moderation options */}
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
        Table/list of all comments with delete options will go here.
      </div>
    </div>
  );
};

export default AdminAllCommentsPage;
