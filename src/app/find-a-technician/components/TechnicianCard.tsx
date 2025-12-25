'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { Technician } from '@/types';

interface TechnicianCardProps {
  technician: Technician;
  onCompare: (id: string) => void;
  isComparing: boolean;
  // Computed fields passed from parent or calculated
  distance?: number;
}

const TechnicianCard = ({ technician, onCompare, isComparing, distance }: TechnicianCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const availabilityColors = {
    available: 'bg-accent text-white',
    limited: 'bg-warning text-white',
    unavailable: 'bg-muted text-text-secondary',
  };

  const availabilityIcons = {
    available: 'CheckCircleIcon',
    limited: 'ClockIcon',
    unavailable: 'XCircleIcon',
  };

  const status = technician.availability_status || 'unavailable';
  const availabilityText = status === 'available' ? 'Available Today' : status === 'limited' ? 'Limited Availability' : 'Unavailable';

  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-smooth"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Technician Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <AppImage
            src={technician.avatar_url || 'https://via.placeholder.com/400'}
            alt={technician.full_name}
            className="w-full h-full object-cover"
          />
          {/* Availability Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full flex items-center space-x-1.5 ${availabilityColors[status]}`}>
            <Icon
              name={availabilityIcons[status] as any}
              size={16}
              variant="solid"
            />
            <span className="text-xs font-semibold">{availabilityText}</span>
          </div>
          {/* Compare Checkbox */}
          <div className="absolute top-4 left-4">
            <label className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer hover:bg-white transition-smooth">
              <input
                type="checkbox"
                checked={isComparing}
                onChange={() => onCompare(technician.id)}
                className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent"
              />
              <span className="text-xs font-medium text-text-primary">Compare</span>
            </label>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-overlay backdrop-blur-sm px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-white">
            <Icon name="StarIcon" size={16} variant="solid" className="text-warning" />
            <span className="text-sm font-semibold">{technician.rating?.toFixed(1) || 'N/A'}</span>
            <span className="text-xs opacity-80">({technician.review_count || 0})</span>
          </div>
          <div className="flex items-center space-x-1 text-white">
            <Icon name="MapPinIcon" size={16} />
            <span className="text-sm">{distance || 0} miles</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Technician Name & Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-text-primary mb-1">{technician.full_name}</h3>
          <p className="text-sm text-text-secondary flex items-center space-x-1">
            <Icon name="MapPinIcon" size={14} />
            <span>{technician.address || 'London'}</span>
          </p>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {technician.specializations?.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="px-2.5 py-1 text-xs font-medium text-primary bg-surface rounded-md"
              >
                {spec}
              </span>
            ))}
            {technician.specializations?.length > 3 && (
              <span className="px-2.5 py-1 text-xs font-medium text-text-secondary bg-muted rounded-md">
                +{technician.specializations.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="BriefcaseIcon" size={16} className="text-text-secondary" />
            <div>
              <p className="text-xs text-text-secondary">Experience</p>
              <p className="text-sm font-semibold text-text-primary">{technician.years_experience} years</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckBadgeIcon" size={16} className="text-accent" />
            <div>
              <p className="text-xs text-text-secondary">Verified</p>
              <p className="text-sm font-semibold text-text-primary">{technician.is_verified ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Certifications - Simplified display */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="ShieldCheckIcon" size={16} className="text-accent" />
            <span className="text-xs font-semibold text-text-primary">Certifications</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {technician.certifications?.map((cert) => (
              <span
                key={cert.name}
                className="px-2 py-0.5 text-xs text-accent bg-accent/10 rounded border border-accent/20"
              >
                {cert.name}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-surface rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Hourly Rate</span>
            <span className="text-lg font-bold text-primary">£{technician.hourly_rate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Callout Fee</span>
            <span className="text-sm font-semibold text-text-primary">£{technician.callout_fee}</span>
          </div>
        </div>

        {/* Response Time - Mocked/Default since not in schema yet */}
        <div className="mb-4 flex items-center space-x-2 text-sm">
          <Icon name="ClockIcon" size={16} className="text-text-secondary" />
          <span className="text-text-secondary">Responds in</span>
          <span className="font-semibold text-accent">~1 hour</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            href={`/technician-profiles?id=${technician.id}`}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-primary bg-surface hover:bg-muted rounded-lg transition-smooth text-center"
          >
            View Profile
          </Link>
          <Link
            href={`/book-a-service?technician=${technician.id}`}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-success rounded-lg shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth text-center"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;
