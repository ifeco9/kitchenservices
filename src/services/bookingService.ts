import { supabase } from '@/lib/supabaseClient';
import { Booking } from '@/types';
import { notificationService } from './notificationService';

export const bookingService = {
    async createBooking(booking: Partial<Booking>) {
        // Prevent double booking
        if (booking.technician_id && booking.scheduled_date) {
            const isAvailable = await this.checkAvailability(
                booking.technician_id,
                booking.scheduled_date
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
        // Calculate the time window for the requested booking
        const newStart = new Date(scheduledDate).getTime();
        const newEnd = newStart + (durationHours * 60 * 60 * 1000);

        // Fetch existing bookings for the technician on the same day
        // Optimization: checking only same day +/- some buffer
        const dayStart = new Date(scheduledDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(scheduledDate);
        dayEnd.setHours(23, 59, 59, 999);

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('scheduled_date')
            .eq('technician_id', technicianId)
            .neq('status', 'cancelled')
            .gte('scheduled_date', dayStart.toISOString())
            .lte('scheduled_date', dayEnd.toISOString());

        if (error) {
            console.error('Error checking availability:', error);
            // Fail safe: assume available or throw? Let's assume available to not block, but log error.
            // Better to throw so we don't double book during outage.
            throw error;
        }

        // Check for overlaps
        if (bookings && bookings.length > 0) {
            for (const existingBooking of bookings) {
                const existingStart = new Date(existingBooking.scheduled_date).getTime();
                const existingEnd = existingStart + (2 * 60 * 60 * 1000); // Assuming 2 hours for existing bookings too

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
    }
};
