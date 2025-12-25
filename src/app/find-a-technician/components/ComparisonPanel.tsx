'use client';

import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import type { Technician } from '@/types';

interface ComparisonPanelProps {
  technicians: Technician[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ComparisonPanel = ({ technicians, onRemove, onClear }: ComparisonPanelProps) => {
  if (technicians.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="ScaleIcon" size={24} className="text-accent" />
            <h3 className="text-lg font-semibold text-text-primary">
              Compare Technicians ({technicians.length}/3)
            </h3>
          </div>
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-md transition-smooth"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <div key={tech.id} className="relative bg-surface rounded-lg p-4 border border-border">
              <button
                onClick={() => onRemove(tech.id)}
                className="absolute top-2 right-2 p-1.5 bg-background hover:bg-error/10 rounded-full transition-smooth"
              >
                <Icon name="XMarkIcon" size={16} className="text-error" />
              </button>

              <div className="flex items-start space-x-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <AppImage
                    src={tech.avatar_url || 'https://via.placeholder.com/150'}
                    alt={tech.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-text-primary truncate mb-1">
                    {tech.full_name}
                  </h4>
                  <div className="flex items-center space-x-1 mb-2">
                    <Icon name="StarIcon" size={14} variant="solid" className="text-warning" />
                    <span className="text-xs font-semibold text-text-primary">
                      {tech.rating?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-xs text-text-secondary">({tech.review_count || 0})</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Hourly Rate</span>
                      <span className="font-semibold text-primary">£{tech.hourly_rate}</span>
                    </div>
                    {/* Distance is not available in Technician type yet */}
                    {/* <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Distance</span>
                      <span className="font-semibold text-text-primary">{tech.distance} mi</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {[...Array(3 - technicians.length)].map((_, index) => (
            <div
              key={`empty-${index}`}
              className="bg-muted rounded-lg p-4 border-2 border-dashed border-border flex items-center justify-center"
            >
              <div className="text-center">
                <Icon name="PlusCircleIcon" size={32} className="text-text-secondary mx-auto mb-2" />
                <p className="text-xs text-text-secondary">Add technician to compare</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonPanel;