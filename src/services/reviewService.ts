import { supabase } from '@/lib/supabaseClient';
import { Review } from '@/types';

export const reviewService = {
    async getReviewsByTechnicianId(technicianId: string) {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('technician_id', technicianId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Review[];
    },

    async createReview(review: Partial<Review>) {
        const { data, error } = await supabase
            .from('reviews')
            .insert(review)
            .select()
            .single();

        if (error) throw error;
        return data as Review;
    }
};
