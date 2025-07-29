import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useCommentStore } from '@/store/commentStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, Calendar, User, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import ProfilePageLoaders from '@/components/common/ProfilePageLoaders';

const UserMyCommentsPage = () => {
  const { getUserComments, userComments, error, isLoading } = useUserStore();
  const { deleteComment } = useCommentStore();

  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getUserComments();
  }, []);

  const handleCommentDelete = async () => {
    if (!commentToDelete) return;
    const result = await deleteComment(commentToDelete);
    if (result.success) {
      toast.success(result.message);
      await getUserComments();
    } else {
      toast.error('Failed to delete comment');
    }
    setIsDialogOpen(false);
    setCommentToDelete(null);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Comments</h1>
        <p className="text-muted-foreground">
          This page will list all comments you've made.
        </p>
        <p className="text-muted-foreground mt-2">
          This is a protected user dashboard route.
        </p>
      </div>

      {isLoading ? (
        <ProfilePageLoaders />
      ) : userComments && userComments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {userComments.map((comment) => (
            <Card key={comment._id}>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Comment on:</span>
                      {comment.post ? (
                        <Link
                          to={`/blogs/${comment.post._id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {comment.post.title}
                          <ExternalLink className="h-3 w-3 inline ml-1" />
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">
                          Unknown Post
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setCommentToDelete(comment._id);
                    setIsDialogOpen(true);
                  }}
                  size="sm"
                  variant="destructive"
                >
                  delete comment
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm leading-relaxed">{comment.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Your comments will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCommentDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserMyCommentsPage;
