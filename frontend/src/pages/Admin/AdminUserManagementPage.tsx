// src/pages/Admin/AdminUserManagementPage.tsx

// import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
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

const AdminUserManagementPage = () => {
  // const { user } = useAuthStore();
  const { user, getUserProfile, getAllUsersAdmin, allUsers } = useUserStore();

  useEffect(() => {
    getUserProfile();
    getAllUsersAdmin();
  }, []);

  console.log(allUsers);

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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUserManagementPage;
