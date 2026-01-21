import { supabase } from '@/lib/supabaseClient';
import { Booking } from '@/types';
import { notificationService } from './notificationService';

export const bookingService = {
    async createBooking(booking: Partial<Booking>) {
        // Prevent double booking
        if (booking.technician_id && booking.scheduled_date) {
            const isAvailable = await this.checkAvailability(
                booking.technician_id,
                booking.scheduled_date,
                booking.duration_hours || 2 // Use provided duration or default to 2 hours
            );

            if (!isAvailable) {
                throw new Error('Technician is not available at this time');
            }
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert(booking)
            .select()
            .single();

        if (error) throw error;

        // Send dummy notification
        try {
            await notificationService.sendBookingConfirmation('user@example.com', data);
        } catch (e) {
            console.error('Failed to send notification', e);
        }

        return data as Booking;
    },

    async checkAvailability(technicianId: string, scheduledDate: string, durationHours: number = 2): Promise<boolean> {
        const dateObj = new Date(scheduledDate);
        const newStart = dateObj.getTime();
        const newEnd = newStart + (durationHours * 60 * 60 * 1000);

        // 1. Check Provider's Weekly Schedule
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[dateObj.getDay()];

        const { data: schedule, error: scheduleError } = await supabase
            .from('provider_availability')
            .select('*')
            .eq('technician_id', technicianId)
            .eq('day_of_week', dayOfWeek)
            .single();

        if (scheduleError && scheduleError.code !== 'PGRST116') { // PGRST116 is "no rows found"
            console.error('Error fetching provider schedule:', scheduleError);
            // Fallback: If no schedule defined, assume unavailable or default hours?
            // Let's assume unavailable if they haven't set a schedule, or maybe default 9-5?
            // Sticking to "must have schedule" for now to enforce usage.
            return false;
        }

        if (!schedule || !schedule.is_available) {
            return false; // Technician not working this day
        }

        // Parse schedule times
        // format is HH:MM:SS
        const [startH, startM] = schedule.start_time.split(':').map(Number);
        const [endH, endM] = schedule.end_time.split(':').map(Number);

        const scheduleStart = new Date(dateObj);
        scheduleStart.setHours(startH, startM, 0, 0);

        const scheduleEnd = new Date(dateObj);
        scheduleEnd.setHours(endH, endM, 0, 0);

        // Check if booking fits within working hours
        if (newStart < scheduleStart.getTime() || newEnd > scheduleEnd.getTime()) {
            return false;
        }

        // 2. Check Existing Bookings (Overlaps)
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
            throw error;
        }

        if (bookings && bookings.length > 0) {
            for (const existingBooking of bookings) {
                const existingStart = new Date(existingBooking.scheduled_date).getTime();
                const existingDuration = (existingBooking as any).duration_hours || 2; // Use stored duration or default to 2 hours
                const existingEnd = existingStart + (existingDuration * 60 * 60 * 1000);

                // Overlap exists if (StartA < EndB) and (EndA > StartB)
                if (existingStart < newEnd && existingEnd > newStart) {
                    return false; // Time conflict found
                }
            }
        }

        return true;
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

    async getBookingById(bookingId: string) {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, profiles:customer_id(full_name, avatar_url, email), services:service_id(name), technician:technician_id(full_name)')
            .eq('id', bookingId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateBookingStatus(bookingId: string, newStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') {
        // Validate status transitions
        const booking = await this.getBookingById(bookingId);
        const currentStatus = booking.status;

        // Define valid transitions
        const validTransitions: Record<string, string[]> = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['in_progress', 'cancelled'],
            'in_progress': ['completed', 'cancelled'],
            'completed': [], // Cannot transition from completed
            'cancelled': [] // Cannot transition from cancelled
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
