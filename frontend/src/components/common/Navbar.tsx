import { Link } from 'react-router-dom';
import { Menu, Mountain } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

interface NavigationItem {
  name: string;
  path: string;
}

interface AuthButton {
  name: string;
  path: string;
  variant: 'outline' | 'default';
}

const navigationItems: NavigationItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Blogs', path: '/blogs' },
];

const authButtons: AuthButton[] = [
  { name: 'Sign In', path: '/signin', variant: 'outline' },
  { name: 'Sign Up', path: '/signup', variant: 'default' },
];

const Navbar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b">
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden bg-transparent"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Mountain className="h-6 w-6" />
            <span>Postiy</span>
          </Link>
          <div className="grid gap-2 py-6">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex w-full items-center py-2 text-lg font-semibold"
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              {!user ? (
                <>
                  {authButtons.map((button, index) => (
                    <Button key={index} asChild variant={button.variant}>
                      <Link to={button.path}>{button.name}</Link>
                    </Button>
                  ))}
                </>
              ) : (
                <Button asChild>
                  <Link to="/dashboard">Goto Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <Link to="/" className="mr-6 hidden lg:flex items-center gap-2">
        <Mountain className="h-6 w-6" />
        <span className="font-semibold">Postiy</span>
      </Link>

      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {navigationItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink asChild>
                <Link
                  to={item.path}
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/5"
                >
                  {item.name}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-auto hidden lg:flex gap-2">
        {!user ? (
          <>
            {authButtons.map((button, index) => (
              <Button key={index} variant={button.variant}>
                <Link to={button.path}>{button.name}</Link>
              </Button>
            ))}
          </>
        ) : (
          <Button>
            <Link to="/dashboard">Goto Dashboard</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
