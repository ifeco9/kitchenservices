'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export interface FilterState {
  applianceTypes: string[];
  availability: string[];
  locationRadius: number;
  priceRange: [number, number];
  certifications: string[];
}

const FilterSidebar = ({ onFilterChange, isMobileOpen, onMobileClose }: FilterSidebarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    applianceTypes: [],
    availability: [],
    locationRadius: 10,
    priceRange: [0, 200],
    certifications: [],
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    appliance: true,
    availability: true,
    location: true,
    price: true,
    certifications: true,
  });

  const applianceOptions = [
    'Washing Machine',
    'Dishwasher',
    'Oven',
    'Refrigerator',
    'Microwave',
    'Cooker Hood',
    'Hob',
    'Tumble Dryer',
  ];

  const availabilityOptions = [
    'Available Now',
    'Today',
    'Tomorrow',
    'This Week',
    'Next Week',
  ];

  const certificationOptions = [
    'Gas Safe Registered',
    'NICEIC Approved',
    'Manufacturer Certified',
    'City & Guilds',
    'NVQ Level 3',
  ];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleApplianceToggle = (appliance: string) => {
    const newAppliances = filters.applianceTypes.includes(appliance)
      ? filters.applianceTypes.filter((a) => a !== appliance)
      : [...filters.applianceTypes, appliance];
    
    const newFilters = { ...filters, applianceTypes: newAppliances };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAvailabilityToggle = (availability: string) => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter((a) => a !== availability)
      : [...filters.availability, availability];
    
    const newFilters = { ...filters, availability: newAvailability };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCertificationToggle = (certification: string) => {
    const newCertifications = filters.certifications.includes(certification)
      ? filters.certifications.filter((c) => c !== certification)
      : [...filters.certifications, certification];
    
    const newFilters = { ...filters, certifications: newCertifications };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRadiusChange = (radius: number) => {
    const newFilters = { ...filters, locationRadius: radius };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters: FilterState = {
      applianceTypes: [],
      availability: [],
      locationRadius: 10,
      priceRange: [0, 200],
      certifications: [],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = 
    filters.applianceTypes.length + 
    filters.availability.length + 
    filters.certifications.length;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-primary/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-24 left-0 h-[calc(100vh-6rem)] w-80 bg-background border-r border-border overflow-y-auto z-40 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Icon name="AdjustmentsHorizontalIcon" size={24} className="text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-accent rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 hover:bg-surface rounded-md transition-smooth"
            >
              <Icon name="XMarkIcon" size={20} className="text-text-secondary" />
            </button>
          </div>

          {/* Clear All */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="w-full mb-4 px-4 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-md transition-smooth"
            >
              Clear All Filters
            </button>
          )}

          {/* Appliance Type */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('appliance')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="text-base font-semibold text-text-primary">Appliance Type</h3>
              <Icon
                name={expandedSections.appliance ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                size={20}
                className="text-text-secondary"
              />
            </button>
            {expandedSections.appliance && (
              <div className="space-y-2">
                {applianceOptions.map((appliance) => (
                  <label key={appliance} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.applianceTypes.includes(appliance)}
                      onChange={() => handleApplianceToggle(appliance)}
                      className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-smooth">
                      {appliance}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="mb-6 pb-6 border-b border-border">
            <button
              onClick={() => toggleSection('availability')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="text-base font-semibold text-text-primary">Availability</h3>
              <Icon
                name={expandedSections.availability ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                size={20}
                className="text-text-secondary"
              />
            </button>
            {expandedSections.availability && (
              <div className="space-y-2">
                {availabilityOptions.map((availability) => (
                  <label key={availability} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes(availability)}
                      onChange={() => handleAvailabilityToggle(availability)}
                      className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-smooth">
                      {availability}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Location Radius */}
          <div className="mb-6 pb-6 border-b border-border">
            <button
              onClick={() => toggleSection('location')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="text-base font-semibold text-text-primary">Location Radius</h3>
              <Icon
                name={expandedSections.location ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                size={20}
                className="text-text-secondary"
              />
            </button>
            {expandedSections.location && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Within</span>
                  <span className="text-sm font-semibold text-primary">{filters.locationRadius} miles</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="5"
                  value={filters.locationRadius}
                  onChange={(e) => handleRadiusChange(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>5 mi</span>
                  <span>10 mi</span>
                  <span>15 mi</span>
                  <span>25 mi</span>
                </div>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6 pb-6 border-b border-border">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="text-base font-semibold text-text-primary">Price Range</h3>
              <Icon
                name={expandedSections.price ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                size={20}
                className="text-text-secondary"
              />
            </button>
            {expandedSections.price && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">£{filters.priceRange[0]}</span>
                  <span className="text-sm text-text-secondary">to</span>
                  <span className="text-sm font-semibold text-primary">£{filters.priceRange[1]}</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('certifications')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="text-base font-semibold text-text-primary">Certifications</h3>
              <Icon
                name={expandedSections.certifications ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                size={20}
                className="text-text-secondary"
              />
            </button>
            {expandedSections.certifications && (
              <div className="space-y-2">
                {certificationOptions.map((certification) => (
                  <label key={certification} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.certifications.includes(certification)}
                      onChange={() => handleCertificationToggle(certification)}
                      className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-smooth">
                      {certification}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;