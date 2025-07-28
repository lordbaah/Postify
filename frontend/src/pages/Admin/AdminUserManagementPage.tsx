import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import type { UserRole } from '@/types/user';

const AdminUserManagementPage = () => {
  const { user, getUserProfile, getAllUsersAdmin, allUsers, changeUserRole } =
    useUserStore();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getUserProfile();
    getAllUsersAdmin();
  }, []);

  const handleUpdateUserRole = async () => {
    if (!selectedUserId) return;

    const res = await changeUserRole(selectedUserId, { role: selectedRole });

    if (res.success) {
      toast.success(res.message);
      getAllUsersAdmin(); // Optional if store updates allUsers locally
    } else {
      toast.error(res.message);
    }

    setIsDialogOpen(false);
    setSelectedUserId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-dark mb-4">
        User Management
      </h1>
      <p className="text-lg text-gray-700">Manage all users in the system.</p>
      <p className="mt-4 text-gray-600">
        This is an admin-only route. Current user:{' '}
        <span className="font-semibold">
          {user?.userName} ({user?.role})
        </span>
      </p>

      <Table>
        <TableCaption>A list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.map((user, index) => (
            <TableRow key={user._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedUserId(user._id);
                    setSelectedRole(user.role);
                    setIsDialogOpen(true);
                  }}
                >
                  Edit Role
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Role Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="role">Select a new role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUserRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagementPage;
