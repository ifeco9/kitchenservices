'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import { supabase } from '@/lib/supabaseClient';
import { Service, TechnicianService } from '@/types';

interface ServiceState {
    serviceId: string;
    isActive: boolean;
    customPrice: number;
    basePrice: number;
    name: string;
    category: string;
}

export default function ProviderServicesPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [serviceStates, setServiceStates] = useState<ServiceState[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || (user.profile?.role !== 'technician' && user.profile?.role !== 'provider'))) {
            router.push('/auth/signin');
            return;
        }

        if (user) {
            fetchData();
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Fetch all services
            const { data: allServices, error: servicesError } = await supabase
                .from('services')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true });

            if (servicesError) throw servicesError;

            // 2. Fetch technician's current settings
            const { data: techServices, error: techError } = await supabase
                .from('technician_services')
                .select('*')
                .eq('technician_id', user!.id);

            if (techError) throw techError;

            // 3. Merge data
            const mergedState: ServiceState[] = (allServices || []).map((service: Service) => {
                const existing = techServices?.find((ts: any) => ts.service_id === service.id);
                return {
                    serviceId: service.id,
                    isActive: existing ? existing.is_active : false,
                    customPrice: existing?.custom_price || service.base_price,
                    basePrice: service.base_price,
                    name: service.name,
                    category: service.category
                };
            });

            setServiceStates(mergedState);
        } catch (error) {
            console.error('Error fetching services:', error);
            alert('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleService = (index: number) => {
        const newStates = [...serviceStates];
        newStates[index].isActive = !newStates[index].isActive;
        setServiceStates(newStates);
    };

    const handlePriceChange = (index: number, value: string) => {
        const newStates = [...serviceStates];
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            newStates[index].customPrice = numValue;
            setServiceStates(newStates);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Prepare upsert data
            const upsertData = serviceStates.map(state => ({
                technician_id: user!.id,
                service_id: state.serviceId,
                is_active: state.isActive,
                custom_price: state.customPrice
            }));

            const { error } = await supabase
                .from('technician_services')
                .upsert(upsertData, { onConflict: 'technician_id,service_id' });

            if (error) throw error;

            alert('Services saved successfully!');
        } catch (error: any) {
            console.error('Error saving services:', error);
            alert(`Failed to save: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    // Group by category for display
    const groupedServices = serviceStates.reduce((acc, service) => {
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, ServiceState[]>);

    if (authLoading || loading) {
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
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">Manage Services</h1>
                            <p className="text-text-secondary mt-2">Select the services you offer and set your custom rates.</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50 shadow-md"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="space-y-8">
                        {Object.entries(groupedServices).map(([category, services]) => (
                            <div key={category} className="bg-card rounded-xl border border-border overflow-hidden">
                                <div className="bg-secondary/30 px-6 py-3 border-b border-border">
                                    <h2 className="text-lg font-semibold text-text-primary capitalize">{category}</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {services.map((service) => {
                                        // Find original index to update state correctly
                                        const index = serviceStates.findIndex(s => s.serviceId === service.serviceId);
                                        return (
                                            <div key={service.serviceId} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-border/50 last:border-0 last:pb-0 last:mb-0">
                                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={service.isActive}
                                                            onChange={() => handleToggleService(index)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                                    </label>
                                                    <div>
                                                        <span className={`font-medium block ${service.isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                                                            {service.name}
                                                        </span>
                                                        <span className="text-sm text-text-secondary">Base Price: ${service.basePrice}</span>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center gap-3 transition-opacity ${service.isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                                    <label className="text-sm text-text-secondary">Your Price:</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                                                        <input
                                                            type="number"
                                                            value={service.customPrice}
                                                            onChange={(e) => handlePriceChange(index, e.target.value)}
                                                            className="bg-background border border-border rounded-lg pl-7 pr-3 py-1.5 w-32 text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
