'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TrustMetric {
  id: string;
  value: string;
  label: string;
  icon: string;
}

const TrustIndicators = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trustMetrics.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHydrated]);

  const trustMetrics: TrustMetric[] = [
    {
      id: '1',
      value: '15,000+',
      label: 'Jobs Completed',
      icon: 'CheckBadgeIcon'
    },
    {
      id: '2',
      value: '98%',
      label: 'Customer Satisfaction',
      icon: 'StarIcon'
    },
    {
      id: '3',
      value: '500+',
      label: 'Verified Technicians',
      icon: 'ShieldCheckIcon'
    },
    {
      id: '4',
      value: '24/7',
      label: 'Emergency Support',
      icon: 'PhoneIcon'
    }
  ];

  if (!isHydrated) {
    return (
      <div className="bg-surface py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-white rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-8 bg-white rounded w-24 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-white rounded w-32 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Scrolling Carousel */}
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-8 min-w-max">
            {trustMetrics.map((metric) => (
              <div key={metric.id} className="flex-shrink-0 text-center w-48">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-accent rounded-full mb-3 mx-auto">
                  <Icon name={metric.icon as any} size={24} className="text-accent-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{metric.value}</div>
                <div className="text-sm text-text-secondary">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center space-x-2">
              <Icon name="ShieldCheckIcon" size={20} className="text-accent" />
              <span className="text-sm text-text-secondary">Gas Safe Registered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="DocumentCheckIcon" size={20} className="text-accent" />
              <span className="text-sm text-text-secondary">Fully Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="StarIcon" size={20} className="text-accent" />
              <span className="text-sm text-text-secondary">Verified Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;