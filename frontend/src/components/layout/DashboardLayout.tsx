import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '../side-bar/AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />
      {/* Main Content Area */}
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
