import { supabase } from '@/lib/supabaseClient';
import { Technician } from '@/types';

export const onboardingService = {
    async completeTechnicianProfile(userId: string, data: Partial<Technician>) {
        const { error } = await supabase
            .from('technicians')
            .insert({
                id: userId,
                ...data,
                is_verified: false, // Default to false until admin approves
                availability_status: 'unavailable' // Default until set up
            });

        if (error) throw error;
    }
};
