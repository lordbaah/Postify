import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePostStore } from '@/store/postStore';
import usePageTitle from '@/hooks/usePageTitle';

import ErrorAlert from '@/components/blog/blog-details/ErrorAlert';
import LoadingSkeleton from '@/components/blog/blog-details/LoadingSkeleton';
import PostHeader from '@/components/blog/blog-details/PostHeader';
import PostCoverImage from '@/components/blog/blog-details/PostCoverImage';
import PostContent from '@/components/blog/blog-details/PostContent';
import CommentsSection from '@/components/blog/blog-details/CommentsSection';
import BlogComment from '@/components/blog/blog-details/BlogComment';

export default function BlogDetailPage() {
  const { id } = useParams();
  const { getSinglePost, currentPost, currentPostComments, isLoading, error } =
    usePostStore();

  useEffect(() => {
    if (id) getSinglePost(id);
  }, [id]);

  usePageTitle(currentPost?.title);

  if (error) return <ErrorAlert message={error} />;
  if (isLoading) return <LoadingSkeleton />;
  if (!currentPost) return <ErrorAlert message="Blog post not found." />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="space-y-8">
        <PostHeader post={currentPost} />
        <PostCoverImage post={currentPost} />
        <PostContent content={currentPost.content} />
        <BlogComment postId={currentPost._id} />
        <CommentsSection comments={currentPostComments} />
      </article>
    </div>
  );
}
