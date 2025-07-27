import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/authStore';
import { useCommentStore } from '@/store/commentStore';
import { User, TrashIcon, EditIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { type Comment } from '@/types/comment';

interface PostCommentProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

const CommentCard = ({ comment, onDelete }: PostCommentProps) => {
  const { user } = useAuthStore();
  const { deleteComment } = useCommentStore();

  const isUserComment = user?._id === comment.user._id;

  const handleCommentDelete = async (commentId: string) => {
    const result = await deleteComment(commentId);
    if (result.success) {
      // toast.success(result.message);
      onDelete(commentId);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex items-center justify-between">
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
        {isUserComment && (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleCommentDelete(comment._id)}
              className="p-0"
              size="sm"
              variant="destructive"
            >
              <TrashIcon />
            </Button>
            <Button className="p-0" size="sm">
              <EditIcon />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-6">{comment.text}</p>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
