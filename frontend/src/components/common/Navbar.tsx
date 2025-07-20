import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavigationItem {
  name: string;
  path: string;
}

interface AuthButton {
  name: string;
  path: string;
  variant: 'primary' | 'secondary';
}

const Navbar = () => {
  return (
    <nav className="p-4">
      <div className="flex items-center justify-between">
        <NavLink to="/">Postiy</NavLink>

        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-4">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <NavLink to={item.path}>{item.name}</NavLink>
              </li>
            ))}
          </ul>
          {/* sign up and sign in buttons */}
          <ul className="flex items-center gap-4">
            {authButtons.map((button, index) => (
              <li key={index}>
                <Button className="bg-blue-600">
                  <NavLink to={button.path}>{button.name}</NavLink>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

const navigationItems: NavigationItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Blogs', path: '/blogs' },
];

const authButtons: AuthButton[] = [
  { name: 'Sign In', path: '/signin', variant: 'secondary' },
  { name: 'Sign Up', path: '/signup', variant: 'primary' },
];
