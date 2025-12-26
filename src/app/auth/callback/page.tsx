'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        // Redirect based on user state
        if (user) {
            if (!user.profile?.role) {
                router.push('/auth/role-selection');
            } else if (user.profile.role === 'customer') {
                router.push('/dashboard/customer');
            } else {
                router.push('/dashboard/provider');
            }
        } else {
            router.push('/auth/signin');
        }
    }, [user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                <p className="mt-4 text-text-secondary">Completing sign in...</p>
            </div>
        </div>
    );
}
