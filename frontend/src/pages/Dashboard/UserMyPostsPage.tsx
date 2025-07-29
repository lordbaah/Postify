import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePostStore } from '@/store/postStore';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  Calendar,
  User,
  ImageIcon,
  TrashIcon,
  EditIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProfilePageLoaders from '@/components/common/ProfilePageLoaders';

const UserMyPostsPage = () => {
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { userPosts, getUserPosts, error, isLoading } = useUserStore();
  const { deleteBlogPost } = usePostStore();

  useEffect(() => {
    getUserPosts();
  }, []);

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

  const handleDeleteBlogPost = async () => {
    if (!postToDelete) return;
    try {
      const result = await deleteBlogPost(postToDelete);
      if (result.success) {
        toast.success('Post deleted successfully');
      }
      await getUserPosts();
    } catch (error) {
      console.error('Delete Post error:', error);
      toast.error('Failed to delete post');
    } finally {
      setPostToDelete(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Posts</h1>
        <p className="text-muted-foreground">
          This page will list all your blog posts.
        </p>
        <p className="text-muted-foreground mt-2">
          This is a protected user dashboard route.
        </p>
      </div>

      {isLoading ? (
        <ProfilePageLoaders />
      ) : userPosts && userPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.map((post) => (
            <Card key={post._id} className="overflow-hidden pt-0">
              <div className="relative h-48 w-full bg-muted">
                {post.image ? (
                  <img
                    alt={post.title}
                    src={post.image || '/placeholder.svg'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">
                  {post.title}
                </CardTitle>

                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-600 hover:bg-purple-200"
                >
                  {post.category?.name}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {post.author && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>
                        {post.author.firstName} {post.author.lastName}
                      </span>
                    </div>
                  )}
                  {post.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Delete Post"
                    variant="destructive"
                    onClick={() => {
                      setPostToDelete(post._id);
                      setIsDialogOpen(true);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="h-8 w-8 p-0" title="Edit Post">
                    <Link to={`/dashboard/edit-post/${post._id}`}>
                      <EditIcon className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  to={`/blogs/${post._id}`}
                  className="hover:text-primary transition-colors"
                >
                  View Post
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Your posts will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBlogPost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserMyPostsPage;
