'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Technician } from '@/types';

interface MapViewProps {
  technicians: Technician[];
  centerLat: number;
  centerLng: number;
}

const MapView = ({ technicians, centerLat, centerLng }: MapViewProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Icon name="MapIcon" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-background rounded-lg overflow-hidden border border-border">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        title="Technician Locations Map"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${centerLat},${centerLng}&z=12&output=embed`}
        className="w-full h-full"
      />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Availability Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="text-xs text-text-secondary">Available Now</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-xs text-text-secondary">Limited Availability</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded-full border border-border" />
            <span className="text-xs text-text-secondary">Unavailable</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-text-secondary">
            Showing {technicians.length} technicians in your area
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapView;