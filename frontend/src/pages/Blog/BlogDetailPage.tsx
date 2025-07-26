import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePostStore } from '@/store/postStore';
import usePageTitle from '@/hooks/usePageTitle';

import ErrorAlert from '@/components/blog/ErrorAlert';
import LoadingSkeleton from '@/components/blog/LoadingSkeleton';
import PostHeader from '@/components/blog/PostHeader';
import PostCoverImage from '@/components/blog/PostCoverImage';
import PostContent from '@/components/blog/PostContent';
import CommentsSection from '@/components/blog/CommentsSection';

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
        <CommentsSection comments={currentPostComments} />
      </article>
    </div>
  );
}
