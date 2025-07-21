import { useEffect } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import BlogCard from '@/components/blog/BlogCard';
import { usePostStore } from '@/store/postStore';
import { useAuthToast } from '@/hooks/useAuthToast';

const BlogListPage = () => {
  const { getAllBlogPosts, blogPosts, isLoading } = usePostStore();
  usePageTitle('Blog'); // Set the page title
  useAuthToast();

  useEffect(() => {
    getAllBlogPosts();
  }, []);

  console.log(blogPosts);
  console.log(blogPosts.map((blog) => console.log(blog?.category?.name)));

  if (isLoading) {
    return <h1>loading....</h1>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
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
