'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import FilterSidebar, { type FilterState } from './FilterSidebar';
import SearchBar from './SearchBar';
import ViewToggle from './ViewToggle';
import SortDropdown from './SortDropdown';
import TechnicianCard, { type Technician } from './TechnicianCard';
import ComparisonPanel from './ComparisonPanel';
import MapView from './MapView';

const FindATechnicianInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'map'>('grid');
  const [currentSort, setCurrentSort] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [postcode, setPostcode] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    applianceTypes: [],
    availability: [],
    locationRadius: 10,
    priceRange: [0, 200],
    certifications: []
  });
  const [comparedTechnicians, setComparedTechnicians] = useState<string[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'James Mitchell',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_137ad5a3e-1765083592272.png",
    alt: 'Professional male technician in blue work uniform with tool belt standing in modern kitchen',
    rating: 4.9,
    reviewCount: 247,
    specializations: ['Washing Machine', 'Dishwasher', 'Oven'],
    availability: 'available',
    availabilityText: 'Available Now',
    hourlyRate: 65,
    calloutFee: 35,
    distance: 2.3,
    certifications: ['Gas Safe', 'NICEIC', 'City & Guilds'],
    yearsExperience: 12,
    completedJobs: 1850,
    responseTime: '15 mins',
    location: 'Central London'
  },
  {
    id: '2',
    name: 'Sarah Thompson',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_17b8ff88b-1763299133729.png",
    alt: 'Female technician with short brown hair in grey work shirt holding tablet in residential setting',
    rating: 4.8,
    reviewCount: 189,
    specializations: ['Refrigerator', 'Microwave', 'Cooker Hood'],
    availability: 'limited',
    availabilityText: 'Today 2-5 PM',
    hourlyRate: 70,
    calloutFee: 40,
    distance: 3.7,
    certifications: ['Manufacturer Certified', 'NVQ Level 3'],
    yearsExperience: 8,
    completedJobs: 1240,
    responseTime: '30 mins',
    location: 'West London'
  },
  {
    id: '3',
    name: 'David Chen',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff09c345-1764769536232.png",
    alt: 'Asian male technician with black hair in navy blue uniform smiling while holding repair tools',
    rating: 4.9,
    reviewCount: 312,
    specializations: ['Hob', 'Tumble Dryer', 'Washing Machine'],
    availability: 'available',
    availabilityText: 'Available Now',
    hourlyRate: 60,
    calloutFee: 30,
    distance: 1.8,
    certifications: ['Gas Safe', 'Manufacturer Certified'],
    yearsExperience: 15,
    completedJobs: 2100,
    responseTime: '10 mins',
    location: 'East London'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c176732f-1764745320390.png",
    alt: 'Professional female technician with blonde hair in white work shirt examining appliance with diagnostic tool',
    rating: 4.7,
    reviewCount: 156,
    specializations: ['Dishwasher', 'Oven', 'Refrigerator'],
    availability: 'limited',
    availabilityText: 'Tomorrow AM',
    hourlyRate: 68,
    calloutFee: 38,
    distance: 4.2,
    certifications: ['NICEIC', 'City & Guilds'],
    yearsExperience: 10,
    completedJobs: 980,
    responseTime: '45 mins',
    location: 'North London'
  },
  {
    id: '5',
    name: 'Michael Brown',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16f306813-1765268043368.png",
    alt: 'Male technician with beard in red work shirt holding clipboard in modern kitchen environment',
    rating: 4.8,
    reviewCount: 203,
    specializations: ['Washing Machine', 'Tumble Dryer', 'Microwave'],
    availability: 'available',
    availabilityText: 'Available Now',
    hourlyRate: 62,
    calloutFee: 32,
    distance: 2.9,
    certifications: ['Gas Safe', 'NVQ Level 3'],
    yearsExperience: 11,
    completedJobs: 1560,
    responseTime: '20 mins',
    location: 'South London'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_114c05179-1764831645746.png",
    alt: 'Female technician with dark hair in blue work uniform holding repair equipment in residential kitchen',
    rating: 4.9,
    reviewCount: 278,
    specializations: ['Oven', 'Hob', 'Cooker Hood'],
    availability: 'unavailable',
    availabilityText: 'Next Week',
    hourlyRate: 72,
    calloutFee: 42,
    distance: 5.1,
    certifications: ['Gas Safe', 'Manufacturer Certified', 'NICEIC'],
    yearsExperience: 14,
    completedJobs: 1920,
    responseTime: '1 hour',
    location: 'West London'
  }];


  const [displayedTechnicians, setDisplayedTechnicians] = useState(mockTechnicians);

  const handleSearch = (query: string, postcodeValue: string) => {
    setSearchQuery(query);
    setPostcode(postcodeValue);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleCompareToggle = (id: string) => {
    setComparedTechnicians((prev) => {
      if (prev.includes(id)) {
        return prev.filter((techId) => techId !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleClearComparison = () => {
    setComparedTechnicians([]);
  };

  const comparedTechnicianData = mockTechnicians.filter((tech) =>
  comparedTechnicians.includes(tech.id)
  );

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="MagnifyingGlassIcon" size={48} className="text-text-secondary mx-auto mb-4 animate-pulse" />
          <p className="text-text-secondary">Loading technicians...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-12 overflow-hidden">
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-100">Find Your Perfect Technician</h1>
            <p className="text-lg opacity-90 mb-8 text-gray-100">
              Search from over 500 verified professionals in your area. Compare ratings, availability, and pricing to make the best choice.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex">
        {/* Filter Sidebar */}
        <FilterSidebar
          onFilterChange={handleFilterChange}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)} />


        {/* Results Section */}
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            {/* Results Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-text-primary bg-surface hover:bg-muted border border-border rounded-lg transition-smooth">

                  <Icon name="AdjustmentsHorizontalIcon" size={18} />
                  <span>Filters</span>
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {displayedTechnicians.length} Technicians Found
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Within {filters.locationRadius} miles of your location
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
                <SortDropdown currentSort={currentSort} onSortChange={setCurrentSort} />
              </div>
            </div>

            {/* Active Filters */}
            {(filters.applianceTypes.length > 0 ||
            filters.availability.length > 0 ||
            filters.certifications.length > 0) &&
            <div className="mb-6 p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-text-primary">Active Filters</h3>
                  <button
                  onClick={() =>
                  setFilters({
                    applianceTypes: [],
                    availability: [],
                    locationRadius: 10,
                    priceRange: [0, 200],
                    certifications: []
                  })
                  }
                  className="text-xs font-medium text-error hover:underline">

                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...filters.applianceTypes, ...filters.availability, ...filters.certifications].map(
                  (filter) =>
                  <span
                    key={filter}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-accent/10 rounded-full border border-accent/20">

                        <span>{filter}</span>
                        <button className="hover:text-error transition-smooth">
                          <Icon name="XMarkIcon" size={14} />
                        </button>
                      </span>

                )}
                </div>
              </div>
            }

            {/* Results Grid/List/Map */}
            {currentView === 'map' ?
            <MapView technicians={displayedTechnicians} centerLat={51.5074} centerLng={-0.1278} /> :

            <div
              className={
              currentView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'
              }>

                {displayedTechnicians.map((technician) =>
              <TechnicianCard
                key={technician.id}
                technician={technician}
                onCompare={handleCompareToggle}
                isComparing={comparedTechnicians.includes(technician.id)} />

              )}
              </div>
            }

            {/* Empty State */}
            {displayedTechnicians.length === 0 &&
            <div className="text-center py-16">
                <Icon name="MagnifyingGlassIcon" size={64} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">No Technicians Found</h3>
                <p className="text-text-secondary mb-6">
                  Try adjusting your filters or search criteria to find more results.
                </p>
                <button
                onClick={() =>
                setFilters({
                  applianceTypes: [],
                  availability: [],
                  locationRadius: 10,
                  priceRange: [0, 200],
                  certifications: []
                })
                }
                className="px-6 py-3 text-sm font-semibold text-white bg-accent hover:bg-success rounded-lg shadow-cta transition-smooth">

                  Clear All Filters
                </button>
              </div>
            }
          </div>
        </main>
      </div>

      {/* Comparison Panel */}
      <ComparisonPanel
        technicians={comparedTechnicianData}
        onRemove={handleCompareToggle}
        onClear={handleClearComparison} />

    </div>);

};

export default FindATechnicianInteractive;