'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Find a Technician', href: '/find-a-technician' },
      { label: 'Book a Service', href: '/book-a-service' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'For Technicians', href: '/for-technicians' }
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'FAQs', href: '#faqs' },
      { label: 'Safety Guidelines', href: '#safety' }
    ],
    legal: [
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Cancellation Policy', href: '#cancellation' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'ShareIcon', href: '#facebook' },
    { name: 'Twitter', icon: 'ShareIcon', href: '#twitter' },
    { name: 'LinkedIn', icon: 'ShareIcon', href: '#linkedin' },
    { name: 'Instagram', icon: 'ShareIcon', href: '#instagram' }
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/homepage" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border-2 border-accent overflow-hidden">
                <img 
                  src="/assets/images/logo.png" 
                  alt="KitchenServices Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">KitchenServices</span>
            </Link>
            <p className="text-gray-200 leading-relaxed mb-6">
              Connecting verified kitchen and appliance technicians with homeowners across the UK.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-accent rounded-full transition-smooth"
                  aria-label={social.name}
                >
                  <Icon name={social.icon as any} size={18} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-smooth">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-accent transition-smooth"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-accent transition-smooth"
                  >
                    {link.label}
                  </a>
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
              <span className="text-sm">Verified Platform</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="LockClosedIcon" size={20} className="text-accent" />
              <span className="text-sm">Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} KitchenServices. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/homepage"
                className="text-gray-400 hover:text-white transition-smooth">
                Terms
              </Link>
              <Link
                href="/homepage"
                className="text-gray-400 hover:text-white transition-smooth">
                Privacy
              </Link>
              <Link
                href="/homepage"
                className="text-gray-400 hover:text-white transition-smooth">
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