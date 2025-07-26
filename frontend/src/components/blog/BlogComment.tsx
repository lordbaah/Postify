import { useCommentStore } from '@/store/commentStore';

//use zod and form hooks to handle this
interface BlogComment {
  text: string;
}

// post id as a props for other components
interface BlogCommentProps {
  postId: string;
}

const BlogComment = ({ postId }: BlogCommentProps) => {
  const {
    createComment,
    editComment,
    deleteComment,
    isLoading,
    error,
    success,
    clearMessages,
  } = useCommentStore();

  const handleCreateComment = async (data) => {
    const result = await createComment(data, postId);
    if (result.success) {
      //reset form
    }
  };

  const handleEditComment = async (data) => {
    const result = await editComment(data, postId);
    if (result.success) {
      //reset form
    }
  };

  const handleDeleteComment = async () => {
    await deleteComment(postId);
  };

  return <div>BlogComment</div>;
};

export default BlogComment;
