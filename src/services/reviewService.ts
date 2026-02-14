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
        // Check for duplicate review
        const { data: existing } = await supabase
            .from('reviews')
            .select('id')
            .eq('booking_id', review.booking_id)
            .single();

        if (existing) {
            throw new Error('You have already reviewed this booking');
        }

        const { data, error } = await supabase
            .from('reviews')
            .insert(review)
            .select()
            .single();

        if (error) throw error;
        return data as Review;
    },

    async getAverageRating(technicianId: string): Promise<{ average: number; count: number }> {
        const { data, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('technician_id', technicianId);

        if (error) throw error;

        if (!data || data.length === 0) {
            return { average: 0, count: 0 };
        }

        const sum = data.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / data.length;

        return {
            average: Math.round(average * 10) / 10, // Round to 1 decimal
            count: data.length
        };
    },

    async updateReview(reviewId: string, updates: Partial<Review>) {
        const { data, error } = await supabase
            .from('reviews')
            .update(updates)
            .eq('id', reviewId)
            .select()
            .single();

        if (error) throw error;
        return data as Review;
    }
};
