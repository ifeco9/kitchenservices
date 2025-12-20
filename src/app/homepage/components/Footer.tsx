'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentYear, setCurrentYear] = useState('2025');

  useEffect(() => {
    setIsHydrated(true);
    setCurrentYear(new Date()?.getFullYear()?.toString());
  }, []);

  const footerLinks = {
    services: [
      { label: 'Emergency Repair', href: '/book-a-service' },
      { label: 'Planned Maintenance', href: '/book-a-service' },
      { label: 'Appliance Installation', href: '/book-a-service' },
      { label: 'Find a Technician', href: '/find-a-technician' }
    ],
    company: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'For Technicians', href: '/for-technicians' },
      { label: 'About Us', href: '/homepage' },
      { label: 'Contact', href: '/homepage' }
    ],
    support: [
      { label: 'Help Centre', href: '/homepage' },
      { label: 'Safety & Trust', href: '/homepage' },
      { label: 'Terms of Service', href: '/homepage' },
      { label: 'Privacy Policy', href: '/homepage' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', href: '#' },
    { name: 'Twitter', icon: 'twitter', href: '#' },
    { name: 'Instagram', icon: 'instagram', href: '#' },
    { name: 'LinkedIn', icon: 'linkedin', href: '#' }
  ];

  if (!isHydrated) {
    return (
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-32 bg-secondary rounded animate-pulse"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/homepage" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12 2L2 7V12C2 16.97 5.84 21.5 12 22C18.16 21.5 22 16.97 22 12V7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">KitchenServices</span>
            </Link>
            <p className="text-gray-200 mb-6 leading-relaxed">
              Connecting UK homeowners with verified kitchen appliance technicians for emergency repairs, planned maintenance, and professional installations.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.href}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-accent rounded-full transition-smooth"
                  aria-label={social?.name}
                >
                  <Icon name="ShareIcon" size={18} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              {footerLinks?.services?.map((link) => (
                <li key={link?.label}>
                  <Link
                    href={link?.href}
                    className="text-gray-300 hover:text-white hover:opacity-100 transition-smooth"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks?.company?.map((link) => (
                <li key={link?.label}>
                  <Link
                    href={link?.href}
                    className="text-gray-300 hover:text-white hover:opacity-100 transition-smooth"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks?.support?.map((link) => (
                <li key={link?.label}>
                  <Link
                    href={link?.href}
                    className="text-gray-300 hover:text-white hover:opacity-100 transition-smooth"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-200">
            <div className="flex items-center space-x-2">
              <Icon name="ShieldCheckIcon" size={20} className="text-accent" />
              <span className="text-sm">Gas Safe Registered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="DocumentCheckIcon" size={20} className="text-accent" />
              <span className="text-sm">Fully Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="StarIcon" size={20} className="text-accent" />
              <span className="text-sm">Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} KitchenServices.co.uk. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/homepage"
                className="text-gray-400 hover:text-white transition-smooth"
              >
                Terms
              </Link>
              <Link
                href="/homepage"
                className="text-gray-400 hover:text-white transition-smooth"
              >
                Privacy
              </Link>
              <Link
                href="/homepage"
                className="text-gray-400 hover:text-white transition-smooth"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;