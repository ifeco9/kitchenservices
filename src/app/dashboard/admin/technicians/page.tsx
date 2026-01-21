'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import { profileService } from '@/services/profileService';
import { Technician } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminTechniciansPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [pendingTechnicians, setPendingTechnicians] = useState<Technician[]>([]);
    const [loadingTechs, setLoadingTechs] = useState(true);
    const [verifying, setVerifying] = useState<string | null>(null);

    useEffect(() => {
        const fetchPendingTechnicians = async () => {
            try {
                const data = await profileService.getPendingTechnicians();
                setPendingTechnicians(data);
            } catch (error) {
                console.error('Failed to fetch pending technicians:', error);
                toast.error('Failed to load pending technicians');
            } finally {
                setLoadingTechs(false);
            }
        };

        if (user?.role === 'admin') {
            fetchPendingTechnicians();
        }
    }, [user]);

    // Redirect if not admin
    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleVerify = async (technicianId: string) => {
        setVerifying(technicianId);
        try {
            await profileService.verifyTechnician(technicianId);
            // Remove from pending list
            setPendingTechnicians(prev => prev.filter(t => t.id !== technicianId));
            toast.success('Technician verified successfully!');
        } catch (error: any) {
            console.error('Failed to verify technician:', error);
            toast.error(error.message || 'Failed to verify technician');
        } finally {
            setVerifying(null);
        }
    };

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
            <Toaster position="top-right" />
            <Header />
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-text-primary mb-2">Technician Verifications</h1>
                            <p className="text-text-secondary">Review and verify pending technician applications</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard/admin')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-text-secondary bg-surface rounded-lg hover:bg-muted transition-smooth"
                        >
                            <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                            Back to Dashboard
                        </button>
                    </div>

                    {loadingTechs ? (
                        <div className="text-center py-12">
                            <Icon name="ArrowPathIcon" size={32} className="text-text-secondary mx-auto animate-spin mb-4" />
                            <p className="text-text-secondary">Loading technicians...</p>
                        </div>
                    ) : pendingTechnicians.length === 0 ? (
                        <div className="bg-card p-12 rounded-xl border border-border text-center">
                            <Icon name="CheckCircleIcon" size={48} className="text-success mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-text-primary mb-2">All Caught Up!</h3>
                            <p className="text-text-secondary">No pending technician verifications at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {pendingTechnicians.map((tech) => (
                                <div key={tech.id} className="bg-card p-6 rounded-xl border border-border">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-accent to-success rounded-full flex items-center justify-center text-white text-xl font-bold">
                                                {tech.full_name?.charAt(0) || 'T'}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-text-primary">{tech.full_name}</h3>
                                                <p className="text-text-secondary text-sm">{tech.email}</p>
                                                <p className="text-text-secondary text-sm mt-1">
                                                    {tech.years_experience} years experience
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                                            Pending Verification
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-text-secondary mb-1">Specializations</p>
                                            <div className="flex flex-wrap gap-2">
                                                {tech.specializations?.map((spec, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-surface text-text-primary text-xs rounded">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-text-secondary mb-1">Rates</p>
                                            <p className="text-text-primary">
                                                £{tech.hourly_rate}/hr • £{tech.callout_fee} callout fee
                                            </p>
                                            <p className="text-text-secondary text-sm">
                                                Service radius: {tech.service_radius_miles} miles
                                            </p>
                                        </div>
                                    </div>

                                    {tech.bio && (
                                        <div className="mb-4">
                                            <p className="text-sm text-text-secondary mb-1">Bio</p>
                                            <p className="text-text-primary text-sm">{tech.bio}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4 border-t border-border">
                                        <button
                                            onClick={() => handleVerify(tech.id)}
                                            disabled={verifying === tech.id}
                                            className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-success hover:bg-success/90 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {verifying === tech.id ? 'Verifying...' : 'Verify Technician'}
                                        </button>
                                        <button
                                            className="px-4 py-2.5 text-sm font-medium text-text-secondary bg-surface hover:bg-muted rounded-lg transition-smooth"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
