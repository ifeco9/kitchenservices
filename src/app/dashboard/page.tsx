'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth/signin');
            } else if (user.profile?.role === 'customer') {
                router.push('/dashboard/customer');
            } else if (user.profile?.role === 'technician') {
                router.push('/dashboard/provider');
            } else {
                router.push('/auth/role-selection');
            }
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                <p className="mt-4 text-text-secondary">Loading dashboard...</p>
            </div>
        </div>
    );
}
