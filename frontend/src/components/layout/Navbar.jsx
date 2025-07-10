import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ModeToggle } from '../mode-toggle';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="custom-container flex h-16 items-center justify-between">
        <NavLink to="/" className="font-bold text-xl">
          Postify
        </NavLink>

        <nav className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-4">
            <li onClick={closeMobileMenu}>
              <NavLink to="/signin">Sign In</NavLink>
            </li>
            <li onClick={closeMobileMenu}>
              <NavLink to="/signup">Sign Up</NavLink>
            </li>
            <li onClick={closeMobileMenu}>
              <NavLink to="/dashboard">My Profile</NavLink>
            </li>
          </ul>

          <ModeToggle />
        </nav>

        {/* Mobile Menu Button - Only visible on small screens */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu - Conditionally rendered based on state */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="custom-container py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-center">
              <ModeToggle />
              <ul>
                <li onClick={closeMobileMenu}>
                  <NavLink to="/signin">Sign In</NavLink>
                </li>
                <li onClick={closeMobileMenu}>
                  <NavLink to="/signup">Sign Up</NavLink>
                </li>
                <li onClick={closeMobileMenu}>
                  <NavLink to="/profile">My Profile</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
