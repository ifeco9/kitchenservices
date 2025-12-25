import Icon from '@/components/ui/AppIcon';
import { Review } from '@/types';

// Extended interface for joined data
interface ReviewWithCustomer extends Review {
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ReviewCardProps {
  review: ReviewWithCustomer;
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

  const customerName = review.profiles?.full_name || 'Anonymous User';
  const dateFormatted = new Date(review.created_at).toLocaleDateString();

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-base font-semibold text-text-primary">{customerName}</h4>
            {/* Verified logic would depend on booking link, for now assuming verified if review exists */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded-full">
              <Icon name="CheckBadgeIcon" size={14} className="text-accent" variant="solid" />
              <span className="text-xs font-medium text-accent">Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>{dateFormatted}</span>
            {/* Service type not in Review schema yet, omitting or mocking */}
            {/* <span>•</span><span>Service</span> */}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
      </div>

      <p className="text-sm text-text-primary leading-relaxed mb-4">{review.comment}</p>

      {/* Technician response not in schema yet */}
    </div>
  );
};

export default ReviewCard;
