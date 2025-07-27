import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useCommentStore } from '@/store/commentStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, Calendar, User, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UserMyCommentsPage = () => {
  const { getUserComments, userComments, error, isLoading } = useUserStore();
  const { deleteComment } = useCommentStore();

  useEffect(() => {
    getUserComments();
  }, []);

  console.log(userComments);

  const handleCommentDelete = async (commentId: string) => {
    const result = await deleteComment(commentId);

    if (result.success) {
      toast.success(result.message);
    }
    getUserComments();
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
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : userComments && userComments.length > 0 ? (
        <div className="space-y-4">
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
                  onClick={() => handleCommentDelete(comment._id)}
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
    </div>
  );
};

export default UserMyCommentsPage;
