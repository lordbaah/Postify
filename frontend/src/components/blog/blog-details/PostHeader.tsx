import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { type BlogPost } from '@/types/blog';

interface PostContentHeaderProps {
  post: BlogPost;
}

const PostHeader = ({ post }: PostContentHeaderProps) => {
  return (
    <div className="space-y-4">
      {post.category && <Badge variant="secondary">{post.category.name}</Badge>}

      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
        {post.title}
      </h1>

      <div className="flex items-center space-x-4 text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.profileImge || '/placeholder.svg'} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {post.author.firstName} {post.author.lastName}
          </span>
        </div>

        {post.createdAt && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
