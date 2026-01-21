'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import { bookingService } from '@/services/bookingService';

export default function ProviderBookingsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && (!user || user.profile?.role !== 'technician')) {
            router.push('/auth/signin');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-text-primary mb-8">My Bookings</h1>
                    <div className="bg-card p-8 rounded-xl border border-border">
                        <p className="text-text-secondary">Bookings list coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
