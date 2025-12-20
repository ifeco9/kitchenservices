'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Technician {
  id: number;
  name: string;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  responseTime: string;
  completedJobs: number;
  verified: boolean;
  callOutFee: number;
  hourlyRate: number;
  availability: string;
}

interface TechnicianSelectionCardProps {
  technician: Technician;
  isSelected: boolean;
  onSelect: () => void;
}

const TechnicianSelectionCard = ({ technician, isSelected, onSelect }: TechnicianSelectionCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 bg-card border-2 rounded-lg transition-smooth hover:shadow-card ${
        isSelected ? 'border-accent shadow-card' : 'border-border'
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Technician Image */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface">
            <AppImage
              src={imageError ? '/assets/images/no_image.png' : technician.image}
              alt={technician.alt}
              className="w-full h-full object-cover"
            />
          </div>
          {technician.verified && (
            <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-accent rounded-full border-2 border-card">
              <Icon name="CheckIcon" size={14} className="text-accent-foreground" />
            </div>
          )}
        </div>

        {/* Technician Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold text-text-primary truncate">{technician.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Icon name="StarIcon" size={16} variant="solid" className="text-warning" />
                  <span className="text-sm font-medium text-text-primary">{technician.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-text-secondary">({technician.reviewCount} reviews)</span>
              </div>
            </div>
            {isSelected && (
              <div className="flex items-center justify-center w-6 h-6 bg-accent rounded-full flex-shrink-0">
                <Icon name="CheckIcon" size={16} className="text-accent-foreground" />
              </div>
            )}
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1 mb-3">
            {technician.specializations.slice(0, 3).map((spec, index) => (
              <span key={index} className="px-2 py-1 text-xs font-medium text-text-secondary bg-surface rounded">
                {spec}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="ClockIcon" size={16} className="text-text-secondary" />
              <span className="text-xs text-text-secondary">{technician.responseTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="WrenchScrewdriverIcon" size={16} className="text-text-secondary" />
              <span className="text-xs text-text-secondary">{technician.completedJobs} jobs</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-xs text-text-secondary">Call-out fee</p>
              <p className="text-sm font-semibold text-text-primary">£{technician.callOutFee.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary">Hourly rate</p>
              <p className="text-sm font-semibold text-text-primary">£{technician.hourlyRate.toFixed(2)}/hr</p>
            </div>
          </div>

          {/* Availability */}
          <div className="mt-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse-availability" />
            <span className="text-xs font-medium text-accent">{technician.availability}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default TechnicianSelectionCard;