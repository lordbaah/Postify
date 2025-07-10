import { usePostStore } from '@/store/postStore';

const CreatePost = () => {
  const { createBlogPost, isLoading } = usePostStore();

  const handleNewPost = async () => {
    try {
      await createBlogPost();
    } catch (error) {}
  };

  return (
    <div>
      <h1>CreatePost</h1>
      <button className="bg-blue-600" onClick={handleNewPost}>
        create post
      </button>
    </div>
  );
};

export default CreatePost;
