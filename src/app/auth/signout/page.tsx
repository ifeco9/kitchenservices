'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignOutPage() {
    const router = useRouter();
    const { signOut } = useAuth();

    useEffect(() => {
        const handleSignOut = async () => {
            await signOut();
            router.push('/');
        };
        handleSignOut();
    }, [signOut, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                <p className="mt-4 text-text-secondary">Signing out...</p>
            </div>
        </div>
    );
}
