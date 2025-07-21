// src/pages/Dashboard/UserMyPostsPage.tsx

const UserMyPostsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-dark mb-4">My Posts</h1>
      <p className="text-lg text-gray-700">
        This page will list all your blog posts.
      </p>
      <p className="mt-4 text-gray-600">
        This is a protected user dashboard route.
      </p>
      {/* Placeholder for user's posts list */}
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
        Your posts will appear here.
      </div>
    </div>
  );
};

export default UserMyPostsPage;
