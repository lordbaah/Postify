import { useEffect, useState } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import BlogCard from '@/components/blog/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { usePostStore } from '@/store/postStore';
import { useCategoryStore } from '@/store/categoryStore';
import { Button } from '@/components/ui/button';
// import type { Pagination } from '@/types/blog';
// import { useAuthToast } from '@/hooks/useAuthToast';

const BlogListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');
  const [lmit, setLimit] = useState(5);

  const { getAllBlogPosts, blogPosts, pagination, isLoading, error } =
    usePostStore();

  const { getAllBlogCategory, categories } = useCategoryStore();

  usePageTitle('Blogs'); // Set the page title
  // useAuthToast();

  useEffect(() => {
    getAllBlogCategory();
  }, []);

  useEffect(() => {
    // getAllBlogPosts(1, 20, 'React JS');
    getAllBlogPosts(currentPage, lmit, category);
  }, [currentPage, category]);

  // console.log(blogPosts);
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
    <div className="">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Discover our latest articles and insights
        </p>
      </div>

      {/* Category Filter */}
      <Select>
        <SelectTrigger className="">
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
              image={post?.image ?? undefined}
            />
          ))}
        </div>
      )}

      {blogPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      )}

      {pagination?.totalPages && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={!pagination?.hasPrevPage}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {pagination?.currentPage ?? 1} of {pagination?.totalPages ?? 1}
          </span>

          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={!pagination?.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
