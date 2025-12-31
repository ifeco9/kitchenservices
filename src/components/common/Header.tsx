'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/AppIcon';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  // Navigation items for unauthenticated users
  const unauthNavigationItems = [
    { label: 'Home', href: '/homepage' },
    { label: 'Find a Technician', href: '/find-a-technician' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Book a Service', href: '/book-a-service' },
    { label: 'For Technicians', href: '/for-technicians' }
  ];

  // Navigation items for authenticated users
  const authNavigationItems = user?.profile?.role === 'technician' ? [
    { label: 'Home', href: '/homepage' },
    { label: 'Dashboard', href: '/dashboard/provider' },
    { label: 'Find a Technician', href: '/find-a-technician' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'For Technicians', href: '/for-technicians' }
  ] : [
    { label: 'Home', href: '/homepage' },
    { label: 'Dashboard', href: '/dashboard/customer' },
    { label: 'Find a Technician', href: '/find-a-technician' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Book a Service', href: '/book-a-service' }
  ];

  const navigationItems = user ? authNavigationItems : unauthNavigationItems;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300 ${className}`}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img
                src="/assets/images/logo.png"
                alt="KitchenServices Logo"
                className="w-full h-full object-cover scale-100"
              />
            </div>
            <span className="hidden md:block text-xl font-bold">
              <span className="text-text-primary">Kitchen</span>
              <span className="text-accent">Services</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              // Show profile menu for authenticated users
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
                    onClick={() => {
                      // In a real app, this would open a dropdown menu
                      if (user.profile?.role === 'technician') {
                        window.location.href = '/dashboard/provider';
                      } else {
                        window.location.href = '/dashboard/customer';
                      }
                    }}
                  >
                    <Icon name="UserCircleIcon" size={18} className="mr-2" />
                    <span>{user.profile?.full_name || user.email || 'User'}</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-error-foreground bg-error rounded-lg hover:bg-destructive shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
                    onClick={async () => {
                      await signOut();
                      window.location.href = '/';
                    }}
                  >
                    <Icon name="ArrowRightStartOnRectangleIcon" size={18} className="mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              // Show auth buttons for unauthenticated users
              <>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-text-secondary bg-surface rounded-lg hover:bg-muted transition-smooth focus-ring"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-md transition-smooth focus-ring"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="px-4 py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-primary hover:bg-surface rounded-md transition-smooth"
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (user.profile?.role === 'technician') {
                        window.location.href = '/dashboard/provider';
                      } else {
                        window.location.href = '/dashboard/customer';
                      }
                    }}
                    className="flex items-center justify-center w-full px-6 py-3 mt-4 text-base font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta transition-smooth"
                  >
                    <Icon name="UserCircleIcon" size={20} className="mr-2" />
                    My Dashboard
                  </button>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await signOut();
                      window.location.href = '/';
                    }}
                    className="flex items-center justify-center w-full px-6 py-3 mt-2 text-base font-semibold text-error bg-error/10 rounded-lg hover:bg-error/20 transition-smooth"
                  >
                    <Icon name="ArrowRightStartOnRectangleIcon" size={20} className="mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 mt-4 text-base font-semibold text-text-secondary bg-surface rounded-md transition-smooth"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-3 mt-2 text-base font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta transition-smooth"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;