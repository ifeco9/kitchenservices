'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import { supabase } from '@/lib/supabaseClient';
import { TechnicianAvailability } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

interface DaySchedule {
    day: string;
    isAvailable: boolean;
    startTime: string;
    endTime: string;
}

export default function ProviderAvailabilityPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [schedule, setSchedule] = useState<DaySchedule[]>(
        DAYS_OF_WEEK.map(day => ({
            day,
            isAvailable: true,
            startTime: '09:00',
            endTime: '17:00'
        }))
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.profile?.role !== 'technician')) {
            router.push('/auth/signin');
            return;
        }

        if (user) {
            fetchAvailability();
        }
    }, [user, authLoading, router]);

    const fetchAvailability = async () => {
        try {
            const { data, error } = await supabase
                .from('provider_availability')
                .select('*')
                .eq('technician_id', user!.id);

            if (error) throw error;

            if (data && data.length > 0) {
                const newSchedule = DAYS_OF_WEEK.map(day => {
                    const existing = data.find((d: any) => d.day_of_week === day);
                    if (existing) {
                        return {
                            day,
                            isAvailable: existing.is_available,
                            startTime: existing.start_time.slice(0, 5), // HH:MM:SS -> HH:MM
                            endTime: existing.end_time.slice(0, 5)
                        };
                    }
                    return {
                        day,
                        isAvailable: false, // Default to unavailable if not found but others exist? Or remain default. Let's stick to state init.
                        startTime: '09:00',
                        endTime: '17:00'
                    };
                });
                setSchedule(newSchedule);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
            toast.error('Failed to load availability');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDay = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule[index].isAvailable = !newSchedule[index].isAvailable;
        setSchedule(newSchedule);
    };

    const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const newSchedule = [...schedule];
        newSchedule[index][field] = value;
        setSchedule(newSchedule);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Prepare upsert data
            const upsertData = schedule.map(day => ({
                technician_id: user!.id,
                day_of_week: day.day,
                start_time: day.startTime,
                end_time: day.endTime,
                is_available: day.isAvailable
            }));

            // We iterate and upsert because of the logic, or we can use upsert with onConflict.
            // But we need to handle potential duplicates if logic was bad.
            // Supabase upsert handles array nicely.

            const { error } = await supabase
                .from('provider_availability')
                .upsert(upsertData, { onConflict: 'technician_id,day_of_week' });

            if (error) throw error;

            toast.success('Availability saved successfully!');
        } catch (error: any) {
            console.error('Error saving availability:', error);
            toast.error(`Failed to save: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-right" />
            <Header />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-text-primary">Manage Availability</h1>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="bg-card p-8 rounded-xl border border-border space-y-6">
                        {schedule.map((day, index) => (
                            <div key={day.day} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border/50 last:border-0">
                                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-40">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={day.isAvailable}
                                            onChange={() => handleToggleDay(index)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                    </label>
                                    <span className={`font-medium ${day.isAvailable ? 'text-text-primary' : 'text-text-secondary'}`}>
                                        {day.day}
                                    </span>
                                </div>

                                <div className={`flex items-center gap-4 transition-opacity ${day.isAvailable ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={day.startTime}
                                            onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                                            className="bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                        />
                                        <span className="text-text-secondary">to</span>
                                        <input
                                            type="time"
                                            value={day.endTime}
                                            onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                                            className="bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
