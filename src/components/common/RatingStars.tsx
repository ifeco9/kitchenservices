'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface RatingStarsProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    interactive?: boolean;
    showHalfStars?: boolean;
}

export default function RatingStars({
    rating,
    onRatingChange,
    size = 20,
    interactive = false,
    showHalfStars = false
}: RatingStarsProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

    const handleClick = (starRating: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(starRating);
        }
    };

    const handleMouseEnter = (starRating: number) => {
        if (interactive) {
            setHoverRating(starRating);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const renderStar = (index: number) => {
        const starValue = index + 1;
        const isFilled = displayRating >= starValue;
        const isHalfFilled = showHalfStars && displayRating >= starValue - 0.5 && displayRating < starValue;

        return (
            <button
                key={index}
                type="button"
                onClick={() => handleClick(starValue)}
                onMouseEnter={() => handleMouseEnter(starValue)}
                onMouseLeave={handleMouseLeave}
                disabled={!interactive}
                className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            >
                {isHalfFilled ? (
                    <div className="relative inline-block">
                        <Icon name="StarIcon" size={size} className="text-muted" />
                        <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                            <Icon name="StarIcon" size={size} variant="solid" className="text-warning" />
                        </div>
                    </div>
                ) : (
                    <Icon
                        name="StarIcon"
                        size={size}
                        variant={isFilled ? 'solid' : 'outline'}
                        className={isFilled ? 'text-warning' : 'text-muted'}
                    />
                )}
            </button>
        );
    };

    return (
        <div className="flex items-center space-x-1">
            {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
            {interactive && (
                <span className="ml-2 text-sm text-text-secondary">
                    {displayRating > 0 ? `${displayRating}/5` : 'Select rating'}
                </span>
            )}
        </div>
    );
}
