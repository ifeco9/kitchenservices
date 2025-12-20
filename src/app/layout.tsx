import React from 'react';
import '../styles/tailwind.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Kitchen Services - Connect with Professional Kitchen Technicians',
  description: 'Find verified kitchen appliance technicians for emergency repairs, planned maintenance, and professional installations with transparent pricing and instant availability.',
  icons: {
    icon: [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fkitchenser3976back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.12" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}
