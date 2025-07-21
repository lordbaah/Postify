// src/pages/Dashboard/UserNewPostPage.tsx

const UserNewPostPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-dark mb-4">
        Create New Post
      </h1>
      <p className="text-lg text-gray-700">
        This page will allow you to write and publish new blog posts.
      </p>
      <p className="mt-4 text-gray-600">
        This is a protected user dashboard route.
      </p>
      {/* Placeholder for new post form */}
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
        New post form will go here.
      </div>
    </div>
  );
};

export default UserNewPostPage;
