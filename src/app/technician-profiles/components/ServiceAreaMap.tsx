'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ServiceArea {
  postcode: string;
  area: string;
  travelFee: number;
}

interface ServiceAreaMapProps {
  baseLocation: string;
  serviceAreas: ServiceArea[];
}

const ServiceAreaMap = ({ baseLocation, serviceAreas }: ServiceAreaMapProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
          <Icon name="MapPinIcon" size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Service Area Coverage</h3>
          <p className="text-sm text-text-secondary">Based in {baseLocation}</p>
        </div>
      </div>

      <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6 border border-border">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Service Area Map"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=51.5074,-0.1278&z=10&output=embed"
          className="w-full h-full"
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-text-primary">Coverage Areas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {serviceAreas.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Icon name="MapPinIcon" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">{area.area}</p>
                  <p className="text-xs text-text-secondary">{area.postcode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-text-primary">
                  {area.travelFee === 0 ? 'Free' : `£${area.travelFee}`}
                </p>
                <p className="text-xs text-text-secondary">Travel fee</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start gap-3">
          <Icon name="InformationCircleIcon" size={20} className="text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm text-text-primary">
            <p className="font-semibold mb-1">Service Area Information</p>
            <p className="text-text-secondary">Travel fees may apply for locations outside the primary service area. Contact the technician for areas not listed above.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaMap;