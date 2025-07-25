import { useEffect } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import BlogCard from '@/components/blog/BlogCard';
import { usePostStore } from '@/store/postStore';
import { useAuthToast } from '@/hooks/useAuthToast';

const BlogListPage = () => {
  const { getAllBlogPosts, blogPosts, pagination, isLoading, error } =
    usePostStore();
  usePageTitle('Blog'); // Set the page title
  useAuthToast();

  useEffect(() => {
    getAllBlogPosts(1, 20);
  }, []);

  console.log(blogPosts);
  console.log(pagination);

  // // Get all posts
  // getAllBlogPosts();

  // // Get posts with pagination
  // first number is page=1, second is limit=10
  // getAllBlogPosts(1, 10);

  // // Get posts by category
  // getAllBlogPosts(undefined, undefined, 'Technology');

  // // Get posts with category and pagination
  // getAllBlogPosts(1, 10, 'Technology');

  return (
    <div className="grid grid-cols-2 gap-4">
      {isLoading && <h1>loading....</h1>}
      {error && <h1 className="text-red-500">{error}</h1>}
      {blogPosts.map((post) => (
        <BlogCard
          key={post._id}
          _id={post._id}
          title={post.title}
          // blogCategory={post.category.name}
          blogCategory={post.category?.name || 'General'}
        />
      ))}
    </div>
  );
};

export default BlogListPage;
