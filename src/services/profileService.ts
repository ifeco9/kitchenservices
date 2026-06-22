import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
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
        const { data: { user: authUser } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: authUser?.email || '',
                full_name: authUser?.user_metadata?.full_name || '',
                role: 'customer',
                ...updates,
                updated_at: new Date().toISOString()
            })
            .select()
            .maybeSingle();

        if (error) throw error;
        return data as Profile;
    },

    async updateCustomerProfile(userId: string, customerData: {
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        preferred_contact?: 'email' | 'phone';
        avatar_url?: string;
    }) {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                phone: customerData.phone,
                address: customerData.address,
                city: customerData.city,
                state: customerData.state,
                preferred_contact: customerData.preferred_contact || 'email',
                avatar_url: customerData.avatar_url || undefined,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data as Profile;
    },

    async getTechnicianProfile(userId: string): Promise<Technician | null> {
        const { data, error } = await supabase
            .from('technicians')
            .select(`
                *,
                profiles!technicians_id_fkey (*)
            `)
            .eq('id', userId)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        const { profiles, ...techData } = data;
        const profile = profiles as Profile;

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

    async getTechnicians(page = 1, pageSize = 20) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error } = await supabase
            .from('technicians')
            .select(`
                *,
                profiles!technicians_id_fkey (full_name, avatar_url)
            `)
            .eq('is_verified', true)
            .order('rating', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return (data || []).map((tech) => ({
            ...tech,
            ...tech.profiles
        })) as Technician[];
    },

    async getPendingTechnicians() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') throw new Error('Unauthorized');

        const { data, error } = await supabase
            .from('technicians')
            .select(`
                *,
                profiles!technicians_id_fkey (full_name, avatar_url, email)
            `)
            .eq('is_verified', false);

        if (error) throw error;

        return data.map((tech) => ({
            ...tech,
            ...tech.profiles
        })) as Technician[];
    },

    async getTechniciansByService(serviceId: string) {
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

        return data.map((tech) => {
            const techService = tech.technician_services[0];
            return {
                ...tech,
                ...tech.profiles,
                service_price: techService?.custom_price
            };
        }) as (Technician & { service_price?: number })[];
    },

    // Haversine formula to calculate distance in km
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    async getTechniciansByLocation(customerLat: number, customerLng: number, page = 1, pageSize = 20) {
        const { data, error } = await supabase
            .from('technicians')
            .select(`
                *,
                profiles!technicians_id_fkey (full_name, avatar_url)
            `)
            .eq('is_verified', true)
            .eq('availability_status', 'available');

        if (error) throw error;

        const techniciansWithDistance = data
            .map((tech) => {
                const distance = this.calculateDistance(
                    customerLat,
                    customerLng,
                    tech.location_lat || 0,
                    tech.location_lng || 0
                );
                return {
                    ...tech,
                    ...tech.profiles,
                    distance: Math.round(distance * 10) / 10
                };
            })
            .filter((tech) => tech.distance <= tech.service_radius_km)
            .sort((a, b) => a.distance - b.distance);

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        return techniciansWithDistance.slice(from, to) as Technician[];
    },

    async getAllUsers(page = 1, pageSize = 20) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') throw new Error('Unauthorized');

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        return data as Profile[];
    },

    async getUserStats() {
        const [usersResult, techResult, pendingResult, bookingsResult] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('technicians').select('*', { count: 'exact', head: true }),
            supabase.from('technicians').select('*', { count: 'exact', head: true }).eq('is_verified', false),
            supabase.from('bookings').select('*', { count: 'exact', head: true })
        ]);

        if (usersResult.error) throw usersResult.error;
        if (techResult.error) throw techResult.error;
        if (pendingResult.error) throw pendingResult.error;
        if (bookingsResult.error) throw bookingsResult.error;

        return {
            totalUsers: usersResult.count || 0,
            totalTechnicians: techResult.count || 0,
            pendingTechnicians: pendingResult.count || 0,
            totalBookings: bookingsResult.count || 0
        };
    },

    async verifyTechnician(technicianId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') throw new Error('Unauthorized');

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
