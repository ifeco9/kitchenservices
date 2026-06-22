import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
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
        if (!review.rating || review.rating < 1 || review.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        if (review.comment && review.comment.length > 1000) {
            throw new Error('Comment must not exceed 1000 characters');
        }

        const { data: existing, error: checkError } = await supabase
            .from('reviews')
            .select('id')
            .eq('booking_id', review.booking_id)
            .maybeSingle();

        if (checkError) throw new Error('Unable to verify duplicate review');
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
        const { data, error, count } = await supabase
            .from('reviews')
            .select('rating', { count: 'exact', head: false })
            .eq('technician_id', technicianId);

        if (error) throw error;

        if (!data || data.length === 0) {
            return { average: 0, count: 0 };
        }

        const sum = data.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / data.length;

        return {
            average: Math.round(average * 10) / 10,
            count: count || data.length
        };
    },

    async updateReview(reviewId: string, updates: Partial<Review>) {
        const allowedFields: (keyof Review)[] = ['rating', 'comment'];
        const filteredUpdates: Partial<Review> = {};
        for (const key of allowedFields) {
            if (key in updates) {
                (filteredUpdates as any)[key] = updates[key];
            }
        }

        if ('rating' in filteredUpdates) {
            const rating = filteredUpdates.rating;
            if (rating !== undefined && (rating < 1 || rating > 5)) {
                throw new Error('Rating must be between 1 and 5');
            }
        }
        if ('comment' in filteredUpdates && filteredUpdates.comment && filteredUpdates.comment.length > 1000) {
            throw new Error('Comment must not exceed 1000 characters');
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: existing } = await supabase
            .from('reviews')
            .select('customer_id')
            .eq('id', reviewId)
            .maybeSingle();

        if (!existing) throw new Error('Review not found');
        if (existing.customer_id !== user.id) throw new Error('Unauthorized: you can only update your own reviews');

        const { data, error } = await supabase
            .from('reviews')
            .update(filteredUpdates)
            .eq('id', reviewId)
            .select()
            .single();

        if (error) throw error;
        return data as Review;
    }
};
