import { supabase } from '@/lib/supabaseClient';
import { Profile, Technician } from '@/types';

export const profileService = {
    async getProfile(userId: string): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (error) throw error;
        return data as Profile | null;
    },

    async updateProfile(userId: string, updates: Partial<Profile>) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            // Profile doesn't exist, create it
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user found');

            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    email: user.email!,
                    full_name: user.user_metadata.full_name || '',
                    role: 'customer', // Default role
                    ...updates
                })
                .select()
                .single();

            if (insertError) throw insertError;
            return newProfile as Profile;
        }

        return data as Profile;
    },

    async updateCustomerProfile(userId: string, customerData: {
        phone?: string;
        address?: string;
        city?: string;
        postcode?: string;
        preferred_contact?: 'email' | 'phone';
    }) {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                phone: customerData.phone,
                address: customerData.address,
                city: customerData.city,
                postcode: customerData.postcode,
                preferred_contact: customerData.preferred_contact || 'email',
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as Profile;
    },

    async getTechnicianProfile(userId: string) {
        const { data, error } = await supabase
            .from('technicians') // Query the specific table
            .select(`
        *,
        profiles!technicians_id_fkey (*)
      `) // Join with profiles linked by ID
            .eq('id', userId)
            .single();

        if (error) throw error;

        // Flatten the response to match the Technician interface
        // data.profiles is an object (single relation) because relation is 1:1 on id
        const profile = data.profiles as unknown as Profile;
        const { profiles, ...techData } = data;

        return { ...profile, ...techData } as Technician;
    },

    async createTechnicianProfile(userId: string, initialData: Partial<Technician>) {
        const { data, error } = await supabase
            .from('technicians')
            .insert({ id: userId, ...initialData })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getTechnicians(limit?: number) {
        let query = supabase
            .from('technicians')
            .select(`
                *,
                profiles!technicians_id_fkey (full_name, avatar_url)
            `)
            .eq('is_verified', true)
            .eq('availability_status', 'available');

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data.map((tech: any) => ({
            ...tech,
            ...tech.profiles // Flatten profile data
        })) as Technician[];
    },

    async getPendingTechnicians() {
        const { data, error } = await supabase
            .from('technicians')
            .select(`
                *,
                profiles!technicians_id_fkey (full_name, avatar_url, email)
            `)
            .eq('is_verified', false);

        if (error) throw error;

        return data.map((tech: any) => ({
            ...tech,
            ...tech.profiles
        })) as Technician[];
    },

    async getTechniciansByService(serviceId: string) {
        // Use !inner to filter technicians who have this service
        // and where is_active is true
        const { data, error } = await supabase
            .from('technicians')
            .select(`
                *,
                profiles!technicians_id_fkey (full_name, avatar_url),
                technician_services!inner(service_id, custom_price, is_active)
            `)
            .eq('is_verified', true)
            .eq('availability_status', 'available')
            .eq('technician_services.service_id', serviceId)
            .eq('technician_services.is_active', true);

        if (error) throw error;

        return data.map((tech: any) => {
            // Flatten and include custom price if needed
            const techService = tech.technician_services[0];
            return {
                ...tech,
                ...tech.profiles,
                // We could override hourly_rate with custom_price here if we wanted, 
                // but let's keep base rate for now or handle it in UI.
                // Or maybe attach it?
                service_price: techService?.custom_price
            };
        }) as (Technician & { service_price?: number })[];
    },

    // Haversine formula to calculate distance between two points
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    async getTechniciansByLocation(customerLat: number, customerLng: number, limit?: number) {
        // Fetch all verified and available technicians with location data
        const { data, error } = await supabase
            .from('technicians')
            .select(`
                *,
                profiles!technicians_id_fkey (full_name, avatar_url)
            `)
            .eq('is_verified', true)
            .eq('availability_status', 'available');

        if (error) throw error;

        // Calculate distance and filter by service radius
        const techniciansWithDistance = data
            .map((tech: any) => {
                const distance = this.calculateDistance(
                    customerLat,
                    customerLng,
                    tech.location_lat || 0, // Handle missing location
                    tech.location_lng || 0
                );
                return {
                    ...tech,
                    ...tech.profiles,
                    distance: Math.round(distance * 10) / 10 // Round to 1 decimal
                };
            })
            .filter((tech: any) => tech.distance <= tech.service_radius_miles)
            .sort((a: any, b: any) => a.distance - b.distance);

        if (limit) {
            return techniciansWithDistance.slice(0, limit) as Technician[];
        }

        return techniciansWithDistance as Technician[];
    },

    async getAllUsers() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Profile[];
    },

    async getUserStats() {
        // Get total users
        const { count: totalUsers, error: usersError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // Get total technicians
        const { count: totalTechnicians, error: techError } = await supabase
            .from('technicians')
            .select('*', { count: 'exact', head: true });

        // Get pending technicians
        const { count: pendingTechnicians, error: pendingError } = await supabase
            .from('technicians')
            .select('*', { count: 'exact', head: true })
            .eq('is_verified', false);

        // Get total bookings
        const { count: totalBookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });

        if (usersError || techError || pendingError || bookingsError) {
            throw usersError || techError || pendingError || bookingsError;
        }

        return {
            totalUsers: totalUsers || 0,
            totalTechnicians: totalTechnicians || 0,
            pendingTechnicians: pendingTechnicians || 0,
            totalBookings: totalBookings || 0
        };
    },

    async verifyTechnician(technicianId: string) {
        const { data, error } = await supabase
            .from('technicians')
            .update({ is_verified: true, availability_status: 'available' })
            .eq('id', technicianId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
