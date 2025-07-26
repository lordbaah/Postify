import { ImageIcon } from 'lucide-react';
import { type BlogPost } from '@/types/blog';

interface PostCoverImageProps {
  post: BlogPost;
}

const PostCoverImage = ({ post }: PostCoverImageProps) => {
  return post.image ? (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover"
      />
    </div>
  ) : (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-muted">
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <ImageIcon className="h-16 w-16 mx-auto mb-4" />
          <p className="text-lg font-medium">No cover image available</p>
        </div>
      </div>
    </div>
  );
};

export default PostCoverImage;
