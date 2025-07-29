import { useEffect } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import BlogCard from '@/components/blog/BlogCard';
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
import { useSearchParams } from 'react-router-dom';
import BlogListLoader from './BlogListLoader';
import ErrorAlert from '@/components/blog/blog-details/ErrorAlert';

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const selectedCategory = searchParams.get('category') || 'all';

  const { getAllBlogPosts, blogPosts, pagination, isLoading, error } =
    usePostStore();
  const { getAllBlogCategory, categories } = useCategoryStore();

  usePageTitle('Blogs');

  useEffect(() => {
    getAllBlogCategory();
  }, []);

  useEffect(() => {
    const categoryParam = selectedCategory === 'all' ? '' : selectedCategory;
    getAllBlogPosts(currentPage, 6, categoryParam);
  }, [currentPage, selectedCategory]);

  const handleCategoryChange = (value: string) => {
    setSearchParams({ category: value, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({
      category: selectedCategory,
      page: page.toString(),
    });
  };

  if (isLoading) {
    return <BlogListLoader />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Discover our latest articles and insights
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex justify-center">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {blogPosts && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard
              key={post._id}
              _id={post._id}
              title={post.title}
              blogCategory={post.category?.name || 'General'}
              image={post.image ?? undefined}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {blogPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination?.totalPages && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 gap-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination?.hasPrevPage}
          >
            Prev
          </Button>
          <p>
            {pagination.currentPage} / {pagination.totalPages}
          </p>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
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
