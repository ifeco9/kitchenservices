import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  alt: string;
  quote: string;
  rating: number;
}

export default function TestimonialCard({ name, role, image, alt, quote, rating }: TestimonialCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <AppImage
            src={image}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-text-primary">{name}</h4>
          <p className="text-sm text-text-secondary">{role}</p>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Icon
                key={index}
                name="StarIcon"
                variant={index < rating ? 'solid' : 'outline'}
                size={14}
                className={index < rating ? 'text-warning' : 'text-muted'}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed italic">&quot;{quote}&quot;</p>
    </div>
  );
}