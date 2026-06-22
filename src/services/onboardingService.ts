import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { Technician } from '@/types';

function validateTechnicianData(data: Partial<Technician>): void {
    if (!data.bio || data.bio.trim().length < 10) {
        throw new Error('Business name/bio must be at least 10 characters');
    }
    if (!data.specializations || data.specializations.length === 0) {
        throw new Error('Please select at least one specialization');
    }
    if (data.years_experience !== undefined && (data.years_experience < 0 || data.years_experience > 70)) {
        throw new Error('Years of experience must be between 0 and 70');
    }
    if (data.hourly_rate !== undefined && data.hourly_rate < 0) {
        throw new Error('Hourly rate must be a positive number');
    }
    if (data.callout_fee !== undefined && data.callout_fee < 0) {
        throw new Error('Callout fee must be a positive number');
    }
    if (data.service_radius_km !== undefined && (data.service_radius_km < 1 || data.service_radius_km > 500)) {
        throw new Error('Service radius must be between 1 and 500 km');
    }
}

export const onboardingService = {
    async getTechnicianProfile(userId: string): Promise<Technician | null> {
        const { data, error } = await supabase
            .from('technicians')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (error) throw error;
        return data as Technician | null;
    },

    async completeTechnicianProfile(userId: string, data: Partial<Technician>) {
        validateTechnicianData(data);

        const { data: result, error } = await supabase
            .from('technicians')
            .upsert({
                id: userId,
                ...data,
                is_verified: true,
                availability_status: 'available'
            })
            .select()
            .maybeSingle();

        if (error) throw error;
        return result;
    }
};
