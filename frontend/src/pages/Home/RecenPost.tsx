import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePostStore } from '@/store/postStore';
import BlogCard from '@/components/blog/BlogCard';

const RecenPost = () => {
  const { getAllBlogPosts, blogPosts } = usePostStore();

  useEffect(() => {
    getAllBlogPosts();
  }, []);

  // console.log(blogPosts);

  const recentPosts = blogPosts.slice(0, 3);

  // console.log(recentPosts);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Recent Posts
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Catch up on our latest articles and stay informed.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {recentPosts.map((post) => (
            <BlogCard
              key={post._id}
              _id={post._id}
              title={post.title}
              blogCategory={post.category?.name || 'General'}
              image={post.image ?? undefined}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/blogs">View All Blogs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecenPost;
