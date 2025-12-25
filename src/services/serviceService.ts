import { supabase } from '@/lib/supabaseClient';
import { Service } from '@/types';

export const serviceService = {
    async getServices() {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as Service[];
    },

    async getServiceBySlug(slug: string) {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data as Service;
    }
};
