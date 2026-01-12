'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import { profileService } from '@/services/profileService';

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTechnicians: 0,
        pendingTechnicians: 0,
        totalBookings: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await profileService.getUserStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoadingStats(false);
            }
        };

        if (user?.role === 'admin') {
            fetchStats();
        }
    }, [user]);

    // Redirect if not admin
    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Icon name="ArrowPathIcon" size={32} className="text-text-secondary mx-auto animate-spin" />
                    <p className="mt-4 text-text-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
                        <p className="text-text-secondary">Manage your platform and users</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-card p-6 rounded-xl border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-accent/10 rounded-lg">
                                    <Icon name="UsersIcon" size={24} className="text-accent" />
                                </div>
                            </div>
                            <p className="text-text-secondary text-sm mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-text-primary">
                                {loadingStats ? '...' : stats.totalUsers}
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-xl border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-success/10 rounded-lg">
                                    <Icon name="WrenchScrewdriverIcon" size={24} className="text-success" />
                                </div>
                            </div>
                            <p className="text-text-secondary text-sm mb-1">Total Technicians</p>
                            <p className="text-3xl font-bold text-text-primary">
                                {loadingStats ? '...' : stats.totalTechnicians}
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-xl border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-warning/10 rounded-lg">
                                    <Icon name="ClockIcon" size={24} className="text-warning" />
                                </div>
                            </div>
                            <p className="text-text-secondary text-sm mb-1">Pending Verifications</p>
                            <p className="text-3xl font-bold text-text-primary">
                                {loadingStats ? '...' : stats.pendingTechnicians}
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-xl border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-info/10 rounded-lg">
                                    <Icon name="CalendarIcon" size={24} className="text-info" />
                                </div>
                            </div>
                            <p className="text-text-secondary text-sm mb-1">Total Bookings</p>
                            <p className="text-3xl font-bold text-text-primary">
                                {loadingStats ? '...' : stats.totalBookings}
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button
                            onClick={() => router.push('/dashboard/admin/technicians')}
                            className="bg-card p-6 rounded-xl border border-border hover:border-accent transition-smooth text-left group"
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-smooth">
                                    <Icon name="UserGroupIcon" size={24} className="text-accent" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Manage Technicians</h3>
                            <p className="text-text-secondary text-sm">
                                Verify pending technicians and manage existing ones
                            </p>
                            {stats.pendingTechnicians > 0 && (
                                <span className="inline-block mt-3 px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                                    {stats.pendingTechnicians} pending
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => router.push('/dashboard/admin/users')}
                            className="bg-card p-6 rounded-xl border border-border hover:border-accent transition-smooth text-left group"
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-success/10 rounded-lg group-hover:bg-success/20 transition-smooth">
                                    <Icon name="UsersIcon" size={24} className="text-success" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Manage Users</h3>
                            <p className="text-text-secondary text-sm">
                                View and manage all platform users
                            </p>
                        </button>

                        <button
                            onClick={() => router.push('/dashboard/admin/bookings')}
                            className="bg-card p-6 rounded-xl border border-border hover:border-accent transition-smooth text-left group"
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-info/10 rounded-lg group-hover:bg-info/20 transition-smooth">
                                    <Icon name="ClipboardDocumentListIcon" size={24} className="text-info" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">View Bookings</h3>
                            <p className="text-text-secondary text-sm">
                                Monitor all platform bookings and transactions
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
