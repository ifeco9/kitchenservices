'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to appropriate dashboard
      if (user.profile?.role === 'technician') {
        router.push('/dashboard/provider');
      } else {
        router.push('/dashboard/customer');
      }
    }
  }, [user, loading, router]);

  // This component doesn't render anything
  return null;
}