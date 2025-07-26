import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { type Comment } from '@/types/comment';

interface PostCommentProps {
  comment: Comment;
}

const CommentCard = ({ comment }: PostCommentProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{comment.user.userName}</span>
          {comment.created_at && (
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-6">{comment.text}</p>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
