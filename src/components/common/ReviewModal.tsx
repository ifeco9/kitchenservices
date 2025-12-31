'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { reviewService } from '@/services/reviewService';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    technicianId: string;
    technicianName: string;
    customerId: string;
}

const ReviewModal = ({ isOpen, onClose, bookingId, technicianId, technicianName, customerId }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await reviewService.createReview({
                booking_id: bookingId,
                technician_id: technicianId,
                customer_id: customerId,
                rating,
                comment
            });
            onClose();
            // Ideally show success toast
        } catch (error) {
            console.error('Failed to submit review', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-zoom-in">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary">Rate Experience</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-smooth">
                        <Icon name="XMarkIcon" size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-text-secondary mb-2">How was your service with</p>
                        <p className="text-lg font-semibold text-text-primary">{technicianName}?</p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex justify-center space-x-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Icon
                                    name="StarIcon"
                                    size={32}
                                    className={`${star <= (hoverRating || rating)
                                            ? 'text-warning fill-current'
                                            : 'text-border'
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Additional Comments (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth h-32 resize-none"
                            placeholder="Tell us about your experience..."
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-sm font-medium text-text-secondary bg-surface hover:bg-muted rounded-lg transition-smooth"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={rating === 0 || isSubmitting}
                            className="flex-1 py-3 text-sm font-semibold text-accent-foreground bg-accent hover:bg-success rounded-lg shadow-cta disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
