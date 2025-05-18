import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user, signout } = useAuthStore();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signout();
    navigate('/signin');
  };

  if (!user) {
    return <div className="p-4">Loading user information...</div>;
  }

  // Create initials fallback (e.g., "John Doe" → "JD")
  const initials = `${user.firstName?.[0] || ''}${
    user.lastName?.[0] || ''
  }`.toUpperCase();

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || ''} alt="User avatar" />
            <AvatarFallback className="text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 mt-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Full Name</span>
            <span>
              {user.firstName} {user.lastName}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Username</span>
            <span>@{user.userName}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Email</span>
            <span>{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Verified</span>
            <Badge variant={user.isVerified ? 'default' : 'destructive'}>
              {user.isVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>

          <Button onClick={handleSignOut}>Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
