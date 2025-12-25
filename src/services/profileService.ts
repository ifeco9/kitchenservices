import { supabase } from '@/lib/supabaseClient';
import { Profile, Technician } from '@/types';

export const profileService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data as Profile;
    },

    async updateProfile(userId: string, updates: Partial<Profile>) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
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
        profiles:id (*)
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
                profiles:id (full_name, avatar_url)
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
    }
};
