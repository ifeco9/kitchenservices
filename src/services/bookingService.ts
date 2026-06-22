import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { Booking } from '@/types';
import { notificationService } from './notificationService';

export const bookingService = {
    async createBooking(booking: Partial<Booking>) {
        // Prevent double booking
        if (booking.technician_id && booking.scheduled_date) {
            const result = await this.checkAvailability(
                booking.technician_id,
                booking.scheduled_date,
                booking.duration_hours || 2
            );

            if (!result.available) {
                throw new Error(result.error || 'Technician is not available at this time');
            }
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert(booking)
            .select()
            .single();

        if (error) throw error;

        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', data.customer_id)
            .maybeSingle();
        const customerEmail = profile?.email || '';

        try {
            await notificationService.sendBookingConfirmation(customerEmail, data);
        } catch (e) {
            console.error('Failed to send notification', e);
        }

        return data as Booking;
    },

    async checkAvailability(technicianId: string, scheduledDate: string, durationHours: number = 2): Promise<{available: boolean; error?: string}> {
        const dateObj = new Date(scheduledDate);
        const newStart = dateObj.getTime();
        const newEnd = newStart + (durationHours * 60 * 60 * 1000);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[dateObj.getDay()];

        const { data: schedule, error: scheduleError } = await supabase
            .from('provider_availability')
            .select('*')
            .eq('technician_id', technicianId)
            .eq('day_of_week', dayOfWeek)
            .maybeSingle();

        if (scheduleError) {
            console.error('Error fetching provider schedule:', scheduleError);
            return { available: false, error: 'Unable to verify availability' };
        }

        if (!schedule || !schedule.is_available) {
            return { available: false };
        }

        const [startH, startM] = schedule.start_time.split(':').map(Number);
        const [endH, endM] = schedule.end_time.split(':').map(Number);

        const scheduleStart = new Date(dateObj);
        scheduleStart.setHours(startH, startM, 0, 0);

        const scheduleEnd = new Date(dateObj);
        scheduleEnd.setHours(endH, endM, 0, 0);

        if (newStart < scheduleStart.getTime() || newEnd > scheduleEnd.getTime()) {
            return { available: false };
        }

        const dayStart = new Date(scheduledDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(scheduledDate);
        dayEnd.setHours(23, 59, 59, 999);

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('scheduled_date, duration_hours')
            .eq('technician_id', technicianId)
            .neq('status', 'cancelled')
            .gte('scheduled_date', dayStart.toISOString())
            .lte('scheduled_date', dayEnd.toISOString());

        if (error) {
            console.error('Error checking existing bookings:', error);
            return { available: false, error: 'Unable to check booking conflicts' };
        }

        if (bookings && bookings.length > 0) {
            for (const existingBooking of bookings) {
                const existingStart = new Date(existingBooking.scheduled_date).getTime();
                const existingDuration = existingBooking.duration_hours || 2;
                const existingEnd = existingStart + (existingDuration * 60 * 60 * 1000);

                if (existingStart < newEnd && existingEnd > newStart) {
                    return { available: false };
                }
            }
        }

        return { available: true };
    },

    async getBookingsByCustomer(customerId: string) {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, technicians:technician_id(id, full_name, avatar_url), services:service_id(name)')
            .eq('customer_id', customerId)
            .order('scheduled_date', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getBookingsByTechnician(technicianId: string) {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, profiles:customer_id(full_name, avatar_url), services:service_id(name)')
            .eq('technician_id', technicianId)
            .order('scheduled_date', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getBookingById(bookingId: string): Promise<Booking | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('bookings')
            .select('*, profiles:customer_id(full_name, avatar_url, email), services:service_id(name), technician:technician_id(full_name)')
            .eq('id', bookingId)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        if (data.customer_id !== user.id && data.technician_id !== user.id) {
            throw new Error('Unauthorized: you do not have access to this booking');
        }

        return data as Booking;
    },

    async updateBookingStatus(bookingId: string, newStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') {
        const { data: currentBooking, error: fetchError } = await supabase
            .from('bookings')
            .select('status')
            .eq('id', bookingId)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (!currentBooking) throw new Error('Booking not found');

        const currentStatus = currentBooking.status;

        const validTransitions: Record<string, string[]> = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['in_progress', 'cancelled'],
            'in_progress': ['completed', 'cancelled'],
            'completed': [],
            'cancelled': []
        };

        if (!validTransitions[currentStatus]?.includes(newStatus) && currentStatus !== newStatus) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }

        const { data, error } = await supabase
            .from('bookings')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
