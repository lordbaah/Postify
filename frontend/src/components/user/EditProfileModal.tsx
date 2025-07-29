import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/store/userStore';
import { User } from 'lucide-react';

const profileSchema = z.object({
  userName: z.string().min(2, 'Username must be at least 2 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const {
    user,
    editUserProfile,
    getUserProfile,
    updateUserProfileImage,
    deleteUserProfileImage,
  } = useUserStore();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        userName: user.userName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user, form]);

  const handleSaveProfile = async (data: ProfileFormData) => {
    const result = await editUserProfile(data);
    if (result.success) {
      toast.success(result.message || 'Profile updated!');
      await getUserProfile();
      onClose();
    } else {
      toast.error(result.message || 'Failed to update profile.');
    }
  };

  const handleImageUpload = async () => {
    if (!user || !imageFile) return;
    setIsUpdatingImage(true);
    const result = await updateUserProfileImage(user._id, imageFile);
    if (result.success) {
      toast.success(result.message || 'Profile image updated!');
      setImageFile(null);
      await getUserProfile();
    } else {
      toast.error(result.message || 'Failed to update image.');
    }
    setIsUpdatingImage(false);
  };

  const handleImageDelete = async () => {
    if (!user) return;
    setIsDeletingImage(true);
    const result = await deleteUserProfileImage(user._id);
    if (result.success) {
      toast.success(result.message || 'Profile image removed!');
      await getUserProfile();
    } else {
      toast.error(result.message || 'Failed to delete image.');
    }
    setIsDeletingImage(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user?.profileImage}
              alt={user?.userName || 'User'}
            />
            <AvatarFallback className="text-4xl">
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>

          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            <Button
              type="button"
              onClick={handleImageUpload}
              disabled={!imageFile || isUpdatingImage}
            >
              {isUpdatingImage ? 'Uploading...' : 'Upload'}
            </Button>
            {user?.profileImage && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleImageDelete}
                disabled={isDeletingImage}
              >
                {isDeletingImage ? 'Deleting...' : 'Remove'}
              </Button>
            )}
          </div>
        </div>

        {/* Edit Profile Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSaveProfile)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
