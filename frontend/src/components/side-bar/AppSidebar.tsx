import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  HomeIcon,
  UserIcon,
  FileTextIcon,
  MessageSquareIcon,
  UsersIcon,
  ListIcon,
  LogOutIcon,
} from 'lucide-react'; // Lucide icons

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'; // Shadcn Sidebar components

// Define the structure for a navigation item
interface NavItem {
  to: string;
  label: string;
  Icon: React.ElementType; // Icon component from lucide-react
}

const AppSidebar = () => {
  const { user, signout } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const handleSignOut = async () => {
    await signout();
    // The apiInstance interceptor or the signout action itself should handle redirecting to /signin
    // You might also want to display a toast message here after signing out.
  };

  // Define user dashboard navigation links in an array
  const userNavItems: NavItem[] = [
    { to: '/dashboard', label: 'Profile', Icon: UserIcon },
    { to: '/dashboard/my-posts', label: 'My Posts', Icon: FileTextIcon },
    { to: '/dashboard/new-post', label: 'New Post', Icon: FileTextIcon },
    {
      to: '/dashboard/my-comments',
      label: 'My Comments',
      Icon: MessageSquareIcon,
    },
  ];

  // Define admin navigation links in a separate array
  const adminNavItems: NavItem[] = [
    { to: '/admin/users', label: 'User Management', Icon: UsersIcon },
    { to: '/admin/categories', label: 'Categories', Icon: ListIcon },
    { to: '/admin/posts', label: 'All Posts', Icon: FileTextIcon },
    { to: '/admin/comments', label: 'All Comments', Icon: MessageSquareIcon },
  ];

  // Define general navigation links (like Back to Home)
  const generalNavItems: NavItem[] = [
    { to: '/', label: 'Back to Home', Icon: HomeIcon },
  ];

  return (
    <Sidebar className="">
      <SidebarContent>
        <div className="">
          <h2 className="">Dashboard</h2>
          {user && <p className="">Welcome, {user.userName}!</p>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Your Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to}>
                      <item.Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Render Admin Links (Conditionally) */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild>
                      <Link to={item.to}>
                        <item.Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to}>
                      <item.Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="flex items-center w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
