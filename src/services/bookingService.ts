import { supabase } from '@/lib/supabaseClient';
import { Booking } from '@/types';

export const bookingService = {
    async createBooking(booking: Partial<Booking>) {
        const { data, error } = await supabase
            .from('bookings')
            .insert(booking)
            .select()
            .single();

        if (error) throw error;
        return data as Booking;
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
