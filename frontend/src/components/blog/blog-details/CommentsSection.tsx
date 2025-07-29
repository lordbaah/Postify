import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import CommentCard from './CommentCard';
import { type Comment } from '@/types/comment';

interface PostCommentProps {
  comments: Comment[];
}

const CommentsSection = ({ comments }: PostCommentProps) => {
  const [commentList, setCommentList] = useState<Comment[]>(comments);

  const handleDeleteComment = (commentId: string) => {
    setCommentList((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleEditComment = (commentId: string, newText: string) => {
    setCommentList((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, text: newText } : c))
    );
  };

  return (
    <>
      <Separator />
      <section className="space-y-6">
        <h2>Comments ({commentList.length})</h2>

        {commentList.length > 0 ? (
          <div className="space-y-4">
            {commentList.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
};

export default CommentsSection;
