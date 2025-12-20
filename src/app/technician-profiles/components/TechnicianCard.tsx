import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Certification {
  name: string;
  issuer: string;
  verified: boolean;
}

interface TechnicianCardData {
  id: number;
  name: string;
  image: string;
  alt: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  yearsExperience: number;
  certifications: Certification[];
  hourlyRate: number;
  callOutFee: number;
  responseTime: string;
  availability: 'available' | 'limited' | 'booked';
}

interface TechnicianCardProps {
  technician: TechnicianCardData;
  onViewProfile: (id: number) => void;
  onBookNow: (id: number) => void;
}

const TechnicianCard = ({ technician, onViewProfile, onBookNow }: TechnicianCardProps) => {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-accent text-accent-foreground';
      case 'limited':
        return 'bg-warning text-warning-foreground';
      case 'booked':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available Today';
      case 'limited':
        return 'Limited Availability';
      case 'booked':
        return 'Fully Booked';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-card hover:shadow-lg transition-smooth overflow-hidden border border-border">
      <div className="relative h-64 overflow-hidden">
        <AppImage
          src={technician.image}
          alt={technician.alt}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold ${getAvailabilityColor(technician.availability)}`}>
          {getAvailabilityText(technician.availability)}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-text-primary mb-1">{technician.name}</h3>
            <p className="text-sm text-text-secondary">{technician.specialization}</p>
          </div>
          {technician.certifications.some(cert => cert.verified) && (
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-full">
              <Icon name="CheckBadgeIcon" size={24} className="text-accent" variant="solid" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1">
            <Icon name="StarIcon" size={18} className="text-warning" variant="solid" />
            <span className="text-sm font-semibold text-text-primary">{technician.rating.toFixed(1)}</span>
            <span className="text-sm text-text-secondary">({technician.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Icon name="BriefcaseIcon" size={16} className="text-text-secondary" />
            <span>{technician.completedJobs} jobs</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Icon name="ClockIcon" size={16} className="text-text-secondary" />
            <span>{technician.yearsExperience}+ years</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Hourly Rate:</span>
            <span className="font-semibold text-text-primary">£{technician.hourlyRate}/hr</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Call-out Fee:</span>
            <span className="font-semibold text-text-primary">£{technician.callOutFee}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Response Time:</span>
            <span className="font-semibold text-text-primary">{technician.responseTime}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onViewProfile(technician.id)}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-primary bg-surface border border-border rounded-lg hover:bg-muted transition-smooth focus-ring"
          >
            View Profile
          </button>
          <button
            onClick={() => onBookNow(technician.id)}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;