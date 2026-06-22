import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { Service } from '@/types';

function getServiceBySlugQuery(slug: string) {
    return supabase.from('services').select('*').eq('slug', slug);
}

export const serviceService = {
    async getServices() {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as Service[];
    },

    async getServiceBySlug(slug: string): Promise<Service | null> {
        const { data, error } = await getServiceBySlugQuery(slug).maybeSingle();

        if (error) throw error;
        return data as Service | null;
    },

    async getServiceByApplianceType(applianceType: string): Promise<Service | null> {
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
            return null;
        }

        const { data, error } = await getServiceBySlugQuery(slug).maybeSingle();

        if (error || !data) return null;

        return data as Service;
    }
};
