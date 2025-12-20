'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export interface Technician {
  id: string;
  name: string;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  availability: 'available' | 'limited' | 'unavailable';
  availabilityText: string;
  hourlyRate: number;
  calloutFee: number;
  distance: number;
  certifications: string[];
  yearsExperience: number;
  completedJobs: number;
  responseTime: string;
  location: string;
}

interface TechnicianCardProps {
  technician: Technician;
  onCompare: (id: string) => void;
  isComparing: boolean;
}

const TechnicianCard = ({ technician, onCompare, isComparing }: TechnicianCardProps) => {
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
            src={technician.image}
            alt={technician.alt}
            className="w-full h-full object-cover"
          />
          {/* Availability Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full flex items-center space-x-1.5 ${availabilityColors[technician.availability]}`}>
            <Icon
              name={availabilityIcons[technician.availability] as any}
              size={16}
              variant="solid"
            />
            <span className="text-xs font-semibold">{technician.availabilityText}</span>
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
            <span className="text-sm font-semibold">{technician.rating.toFixed(1)}</span>
            <span className="text-xs opacity-80">({technician.reviewCount})</span>
          </div>
          <div className="flex items-center space-x-1 text-white">
            <Icon name="MapPinIcon" size={16} />
            <span className="text-sm">{technician.distance} miles</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Technician Name & Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-text-primary mb-1">{technician.name}</h3>
          <p className="text-sm text-text-secondary flex items-center space-x-1">
            <Icon name="MapPinIcon" size={14} />
            <span>{technician.location}</span>
          </p>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {technician.specializations.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="px-2.5 py-1 text-xs font-medium text-primary bg-surface rounded-md"
              >
                {spec}
              </span>
            ))}
            {technician.specializations.length > 3 && (
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
              <p className="text-sm font-semibold text-text-primary">{technician.yearsExperience} years</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckBadgeIcon" size={16} className="text-accent" />
            <div>
              <p className="text-xs text-text-secondary">Jobs Done</p>
              <p className="text-sm font-semibold text-text-primary">{technician.completedJobs}+</p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="ShieldCheckIcon" size={16} className="text-accent" />
            <span className="text-xs font-semibold text-text-primary">Certifications</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {technician.certifications.map((cert) => (
              <span
                key={cert}
                className="px-2 py-0.5 text-xs text-accent bg-accent/10 rounded border border-accent/20"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-surface rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Hourly Rate</span>
            <span className="text-lg font-bold text-primary">£{technician.hourlyRate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Callout Fee</span>
            <span className="text-sm font-semibold text-text-primary">£{technician.calloutFee}</span>
          </div>
        </div>

        {/* Response Time */}
        <div className="mb-4 flex items-center space-x-2 text-sm">
          <Icon name="ClockIcon" size={16} className="text-text-secondary" />
          <span className="text-text-secondary">Responds in</span>
          <span className="font-semibold text-accent">{technician.responseTime}</span>
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