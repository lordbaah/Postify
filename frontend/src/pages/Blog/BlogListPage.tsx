import { useEffect } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import BlogCard from '@/components/blog/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
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

  // console.log(blogPosts);
  // console.log(pagination);

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
    <div className="">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Discover our latest articles and insights
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard
              key={post._id}
              _id={post._id}
              title={post.title}
              blogCategory={post.category?.name || 'General'}
              image={post.image}
            />
          ))}
        </div>
      )}

      {blogPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
