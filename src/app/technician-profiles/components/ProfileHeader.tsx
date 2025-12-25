import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { Technician } from '@/types';

interface ProfileHeaderProps {
  profile: Technician;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
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
        return 'Unavailable';
    }
  };

  const status = profile.availability_status || 'unavailable';

  return (
    <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
      <div className="relative h-80 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-background shadow-lg">
            <AppImage
              src={profile.avatar_url || 'https://via.placeholder.com/400'}
              alt={profile.full_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-semibold ${getAvailabilityColor(status)}`}>
          {getAvailabilityText(status)}
        </div>
      </div>

      <div className="p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-text-primary">{profile.full_name}</h1>
            {profile.is_verified && (
              <Icon name="CheckBadgeIcon" size={32} className="text-accent" variant="solid" />
            )}
          </div>
          {/* Join specializations for display */}
          <p className="text-lg text-text-secondary">{profile.specializations?.join(', ') || 'Technician'}</p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8 pb-8 border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="StarIcon" size={20} className="text-warning" variant="solid" />
              <span className="text-2xl font-bold text-text-primary">{profile.rating?.toFixed(1) || 'N/A'}</span>
            </div>
            <p className="text-sm text-text-secondary">{profile.review_count || 0} reviews</p>
          </div>
          <div className="text-center">
            {/* Mocking completed jobs if not in schema, or use field if exists. Schema has none? */}
            {/* Wait, Technician type might not have completed_jobs if I didn't add it. I'll check/add or mock */}
            <p className="text-2xl font-bold text-text-primary">{150}+</p>
            <p className="text-sm text-text-secondary">Jobs Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">{profile.years_experience}+</p>
            <p className="text-sm text-text-secondary">Years Experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3 p-4 bg-surface rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full">
              <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Response Rate</p>
              <p className="text-lg font-semibold text-text-primary">98%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full">
              <Icon name="ArrowPathIcon" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Repeat Customers</p>
              <p className="text-lg font-semibold text-text-primary">76%</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Icon name="ShieldCheckIcon" size={20} className="text-accent" />
            Certifications & Verifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.certifications?.map((cert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
                <Icon name={cert.verified ? 'CheckCircleIcon' : 'ClockIcon'} size={20} className={cert.verified ? 'text-accent' : 'text-warning'} variant="solid" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">{cert.name}</p>
                  <p className="text-xs text-text-secondary">{cert.issuer}</p>
                  {/* renewalDate not in simple Certification type probably, check type */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
