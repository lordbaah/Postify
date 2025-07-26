import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePostStore } from '@/store/postStore';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  Calendar,
  User,
  ImageIcon,
  TrashIcon,
  EditIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UserMyPostsPage = () => {
  const { userPosts, getUserPosts, error, isLoading } = useUserStore();
  const { deleteBlogPost } = usePostStore();

  useEffect(() => {
    getUserPosts();
  }, []);

  // console.log(userPosts.map(p => p.));

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
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Posts</h1>
        <p className="text-muted-foreground">
          This page will list all your blog posts.
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
                <Skeleton className="h-48 w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="h-8 w-8 p-0" title="Edit Post">
                    <EditIcon className="w-4 h-4" />
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
    </div>
  );
};

export default UserMyPostsPage;
