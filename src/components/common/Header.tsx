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
    <header className={`relative lg:fixed lg:top-0 lg:left-0 lg:right-0 z-50 bg-transparent lg:bg-background lg:border-b lg:border-border ${className}`}>
      <div className="w-full">
        <div className="flex items-center justify-between h-24 px-4 lg:px-8">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-20 h-20 bg-white rounded-lg border-2 border-primary shadow-xl overflow-hidden">
              <img
                src="/assets/images/logo.png"
                alt="KitchenServices Logo"
                className="w-full h-full object-contain scale-150"
              />
            </div>
            <span className="text-3xl font-bold text-primary sm:text-white">KitchenServices</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface rounded-md transition-smooth"
              >
                {item.label}
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