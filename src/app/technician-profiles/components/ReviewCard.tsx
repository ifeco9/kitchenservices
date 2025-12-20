import Icon from '@/components/ui/AppIcon';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  date: string;
  serviceType: string;
  comment: string;
  verified: boolean;
  technicianResponse?: string;
  responseDate?: string;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="StarIcon"
        size={16}
        className={index < rating ? 'text-warning' : 'text-muted'}
        variant={index < rating ? 'solid' : 'outline'}
      />
    ));
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-base font-semibold text-text-primary">{review.customerName}</h4>
            {review.verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded-full">
                <Icon name="CheckBadgeIcon" size={14} className="text-accent" variant="solid" />
                <span className="text-xs font-medium text-accent">Verified</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>{review.date}</span>
            <span>•</span>
            <span>{review.serviceType}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
      </div>

      <p className="text-sm text-text-primary leading-relaxed mb-4">{review.comment}</p>

      {review.technicianResponse && (
        <div className="mt-4 pt-4 border-t border-border bg-surface/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="ChatBubbleLeftRightIcon" size={16} className="text-primary" />
            <span className="text-sm font-semibold text-text-primary">Technician Response</span>
            <span className="text-xs text-text-secondary ml-auto">{review.responseDate}</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{review.technicianResponse}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;