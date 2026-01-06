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
    },

    async getServiceByApplianceType(applianceType: string): Promise<Service | null> {
        // Map appliance types to service names/slugs
        const applianceToServiceMap: Record<string, string> = {
            'Oven': 'oven-repair',
            'Dishwasher': 'dishwasher-repair',
            'Refrigerator': 'refrigerator-repair',
            'Washing Machine': 'washing-machine-repair',
            'Dryer': 'dryer-repair',
            'Microwave': 'microwave-repair',
            'Cooker Hood': 'cooker-hood-repair',
            'Hob': 'hob-repair',
            'Freezer': 'freezer-repair',
            'Range Cooker': 'range-cooker-repair',
        };

        const slug = applianceToServiceMap[applianceType];
        if (!slug) {
            // Fallback to generic repair service
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .limit(1)
                .single();

            if (error) return null;
            return data as Service;
        }

        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            // If specific service not found, return first available service
            const { data: fallbackData } = await supabase
                .from('services')
                .select('*')
                .limit(1)
                .single();
            return fallbackData as Service | null;
        }

        return data as Service;
    }
};
