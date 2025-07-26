import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import CommentCard from './CommentCard';
import { type Comment } from '@/types/comment';

interface PostCommentProps {
  comments: Comment[];
}

const CommentsSection = ({ comments }: PostCommentProps) => {
  return (
    <>
      <Separator />
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Comments ({comments?.length || 0})
        </h2>

        {comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
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
