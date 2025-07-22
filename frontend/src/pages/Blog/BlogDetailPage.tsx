import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePostStore } from '@/store/postStore';

const BlogDetailPage = () => {
  const { id } = useParams();
  const { getSinglePost, currentPost, currentPostComments, isLoading, error } =
    usePostStore();

  useEffect(() => {
    if (id) {
      getSinglePost(id);
    }
  }, [id]);

  return (
    <div>
      <h1>Blog Detail Page</h1>

      {isLoading && <h2>Loading...</h2>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {currentPost && (
        <>
          <h2>{currentPost.title}</h2>
          <p>{currentPost.content}</p>
        </>
      )}

      <section>
        <h3>Comments</h3>
        {currentPostComments?.length > 0 ? (
          currentPostComments.map((comment) => (
            <div key={comment._id}>
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p>No comments</p>
        )}
      </section>
    </div>
  );
};

export default BlogDetailPage;
