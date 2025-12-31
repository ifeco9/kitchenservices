'use client';

import { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';
import { Technician } from '@/types';
import Icon from '@/components/ui/AppIcon';

export default function AdminDashboard() {
    const [pendingTechnicians, setPendingTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingTechnicians();
    }, []);

    const fetchPendingTechnicians = async () => {
        try {
            const data = await profileService.getPendingTechnicians();
            setPendingTechnicians(data);
        } catch (error) {
            console.error('Failed to fetch pending technicians', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to verify ${name}?`)) {
            try {
                await profileService.verifyTechnician(id);
                // Remove from list
                setPendingTechnicians(prev => prev.filter(t => t.id !== id));
                // Note: ID type mismatch handling might be needed depending on parsed ID
                // Refreshing list is safer
                fetchPendingTechnicians();
            } catch (error) {
                console.error('Failed to verify technician', error);
                alert('Failed to verify technician');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
                <p className="text-text-secondary">Manage users and verifications</p>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">Pending Verifications</h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <Icon name="ArrowPathIcon" size={24} className="animate-spin mx-auto text-text-secondary" />
                    </div>
                ) : pendingTechnicians.length === 0 ? (
                    <div className="p-12 text-center">
                        <Icon name="CheckCircleIcon" size={48} className="text-success mx-auto mb-4" />
                        <p className="text-text-secondary">All technicians verified! No pending requests.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {pendingTechnicians.map((tech) => (
                            <div key={tech.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center overflow-hidden">
                                        {tech.avatar_url ? (
                                            <img src={tech.avatar_url} alt={tech.full_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Icon name="UserIcon" size={24} className="text-text-secondary" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-text-primary">{tech.full_name}</h3>
                                        <p className="text-sm text-text-secondary">{tech.email}</p>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {tech.specializations?.map(spec => (
                                                <span key={spec} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleVerify(tech.id, tech.full_name)}
                                        className="px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90 transition-smooth"
                                    >
                                        Verify & Approve
                                    </button>
                                    <button className="px-4 py-2 bg-surface text-text-secondary text-sm font-medium rounded-lg hover:bg-muted border border-border transition-smooth">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
