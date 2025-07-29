import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { useCommentStore } from '@/store/commentStore';
import { User, TrashIcon, EditIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { type Comment } from '@/types/comment';

interface PostCommentProps {
  comment: Comment;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const CommentCard = ({ comment, onDelete, onEdit }: PostCommentProps) => {
  const { user } = useAuthStore();
  const { deleteComment, editComment, isDeleting, isEditing } =
    useCommentStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isUserComment = user?._id === comment.user._id;

  const handleDelete = async () => {
    const result = await deleteComment(comment._id);
    if (result.success) {
      toast.success(result.message);
      onDelete(comment._id);
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = async () => {
    const result = await editComment(comment._id, { text: editText });
    if (result.success) {
      toast.success(result.message);
      onEdit(comment._id, editText);
      setIsEditModalOpen(false);
    } else {
      toast.error(result.message);
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
              onClick={handleDelete}
              className="p-0"
              size="sm"
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? '...' : <TrashIcon />}
            </Button>
            <Button
              className="p-0"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              <EditIcon />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-6">{comment.text}</p>
      </CardContent>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isEditing}>
              {isEditing ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CommentCard;
