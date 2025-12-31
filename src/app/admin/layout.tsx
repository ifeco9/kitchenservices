'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth/signin');
            } else if (user.profile?.role !== 'admin') {
                router.push('/');
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    if (loading || !isAuthorized) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Icon name="ArrowPathIcon" size={32} className="animate-spin text-text-secondary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-16">
                {children}
            </div>
        </div>
    );
}
