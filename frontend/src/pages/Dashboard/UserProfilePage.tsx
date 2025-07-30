import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, Mail, Briefcase } from 'lucide-react';
import EditProfileModal from '@/components/user/EditProfileModal';
import ErrorAlert from '@/components/blog/blog-details/ErrorAlert';

export default function UserProfilePage() {
  const { user, getUserProfile, isLoading, error } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getUserProfile();
  }, []);

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-col items-center gap-4 pb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal profile information.
          </p>
        </div>
        {user && (
          <Button onClick={() => setIsModalOpen(true)}>Edit Profile</Button>
        )}
      </div>

      {user ? (
        <Card>
          <CardHeader className="flex flex-col items-center gap-4 pb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.profileImage}
                alt={`${user.userName}'s profile picture`}
              />
              <AvatarFallback className="text-4xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-semibold">
              {user.userName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2>
                Welcome to your Profile {user.firstName} {user.lastName}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <p>
                Email:{' '}
                <span className="font-medium text-foreground">
                  {user.email}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              <p>
                Role:{' '}
                <span className="font-medium text-foreground">{user.role}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">User profile not found.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal for editing profile (details + image) */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
