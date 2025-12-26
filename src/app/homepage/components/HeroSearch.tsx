'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface HeroSearchProps {
  onSearch?: (location: string, service: string) => void;
}

interface ServiceSuggestion {
  id: string;
  name: string;
  category: string;
}

const HeroSearch = ({ onSearch }: HeroSearchProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const locationSuggestions = [
    'London',
    'Manchester',
    'Birmingham',
    'Leeds',
    'Glasgow',
    'Liverpool',
    'Newcastle',
    'Sheffield'
  ];

  const serviceSuggestions: ServiceSuggestion[] = [
    { id: '1', name: 'Oven Repair', category: 'Emergency' },
    { id: '2', name: 'Dishwasher Installation', category: 'Installation' },
    { id: '3', name: 'Refrigerator Maintenance', category: 'Maintenance' },
    { id: '4', name: 'Washing Machine Repair', category: 'Emergency' },
    { id: '5', name: 'Microwave Repair', category: 'Repair' },
    { id: '6', name: 'Cooker Hood Installation', category: 'Installation' }
  ];

  const handleSearch = () => {
    if (isHydrated && onSearch) {
      onSearch(location, service);
    }
  };

  const handleLocationSelect = (selectedLocation: string) => {
    if (isHydrated) {
      setLocation(selectedLocation);
      setShowLocationSuggestions(false);
    }
  };

  const handleServiceSelect = (selectedService: string) => {
    if (isHydrated) {
      setService(selectedService);
      setShowServiceSuggestions(false);
    }
  };

  if (!isHydrated) {
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="relative">
            <div className="h-14 bg-surface rounded-lg animate-pulse"></div>
          </div>
          <div className="relative">
            <div className="h-14 bg-surface rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-14 bg-accent rounded-lg animate-pulse"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Location Input */}
        <div className="relative lg:col-span-2 animate-slide-in-left">
          <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-2">
            Your Location
          </label>
          <div className="relative">
            <Icon
              name="MapPinIcon"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowLocationSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowLocationSuggestions(location.length > 0)}
              placeholder="Enter postcode or city"
              className="w-full h-12 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-smooth text-sm font-heading"
            />
          </div>
          {showLocationSuggestions && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {locationSuggestions
                .filter((loc) => loc.toLowerCase().includes(location.toLowerCase()))
                .map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocationSelect(loc)}
                    className="w-full px-3 py-2 text-left hover:bg-surface transition-smooth flex items-center space-x-2 text-sm"
                  >
                    <Icon name="MapPinIcon" size={14} className="text-text-secondary" />
                    <span className="text-text-primary">{loc}</span>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex items-end animate-slide-in-right">
          <button
            onClick={handleSearch}
            className="w-full h-12 bg-gradient-sunset text-white font-semibold rounded-lg shadow-cta hover:shadow-lg magnetic-hover glow-pulse focus-ring flex items-center justify-center space-x-2 text-sm font-heading"
          >
            <Icon name="MagnifyingGlassIcon" size={18} />
            <span className="hidden sm:inline">Find Technicians</span>
            <span className="sm:hidden">Search</span>
          </button>
        </div>
      </div>

      {/* Service Input */}
      <div className="relative mt-3 animate-fade-in">
        <label htmlFor="service" className="block text-sm font-medium text-text-secondary mb-2">
          Service Needed
        </label>
        <div className="relative">
          <Icon
            name="WrenchScrewdriverIcon"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            id="service"
            type="text"
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setShowServiceSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowServiceSuggestions(service.length > 0)}
            placeholder="e.g., Oven repair, Dishwasher installation"
            className="w-full h-12 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-smooth text-sm font-heading"
          />
        </div>
        {showServiceSuggestions && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {serviceSuggestions
              .filter((svc) => svc.name.toLowerCase().includes(service.toLowerCase()))
              .map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => handleServiceSelect(svc.name)}
                  className="w-full px-3 py-2 text-left hover:bg-surface transition-smooth text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-text-primary">{svc.name}</span>
                    <span className="text-xs text-text-secondary bg-surface px-2 py-1 rounded">
                      {svc.category}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-4 flex flex-wrap gap-2 animate-fade-in delay-100">
        <button className="text-xs text-white hover:text-white transition-smooth px-3 py-2 bg-white/10 hover:bg-gradient-sunset rounded-lg backdrop-blur-sm animate-staggered-fade-in magnetic-hover border border-white/20">
          🚨 Emergency Repair
        </button>
        <button className="text-xs text-white hover:text-white transition-smooth px-3 py-2 bg-white/10 hover:bg-gradient-ocean rounded-lg backdrop-blur-sm animate-staggered-fade-in delay-1 magnetic-hover border border-white/20">
          🔧 Planned Maintenance
        </button>
        <button className="text-xs text-white hover:text-white transition-smooth px-3 py-2 bg-white/10 hover:bg-gradient-emerald rounded-lg backdrop-blur-sm animate-staggered-fade-in delay-2 magnetic-hover border border-white/20">
          ⚡ Installation Services
        </button>
      </div>
    </>
  );
};

export default HeroSearch;