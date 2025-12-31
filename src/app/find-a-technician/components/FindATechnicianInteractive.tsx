'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import FilterSidebar, { type FilterState } from './FilterSidebar';
import SearchBar from './SearchBar';
import ViewToggle from './ViewToggle';
import SortDropdown from './SortDropdown';
import TechnicianCard from './TechnicianCard';
import ComparisonPanel from './ComparisonPanel';
import MapView from './MapView';
import { Technician } from '@/types';
import { profileService } from '@/services/profileService';



const FindATechnicianInteractive = () => {
  const searchParams = useSearchParams();
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize state from URL params
  const initialQuery = searchParams.get('query') || '';
  const initialLocation = searchParams.get('location') || '';

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'map'>('grid');
  const [currentSort, setCurrentSort] = useState('recommended');

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [postcode, setPostcode] = useState(initialLocation);

  const [filters, setFilters] = useState<FilterState>({
    applianceTypes: [],
    availability: [],
    locationRadius: 10,
    priceRange: [0, 200],
    certifications: []
  });

  const [comparedTechnicians, setComparedTechnicians] = useState<string[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
    // If params changed, we might want to refetch or just rely on local filter
    if (initialQuery || initialLocation) {
      // Option A: Set state (done above)
      // Option B: Trigger fetch with these params if fetchTechnicians accepts them
    }
    fetchTechnicians();
  }, [searchParams]); // Add searchParams dependency or keep empty if initial only. 
  // Better to just init state and let the filter logic handle it if it's client side.
  // displayedTechnicians uses searchQuery, so setting it initally works.

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      // In a real app we'd pass filters to the service
      const data = await profileService.getTechnicians(50);
      setTechnicians(data);
    } catch (error) {
      console.error("Failed to fetch technicians", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string, postcodeValue: string) => {
    setSearchQuery(query);
    setPostcode(postcodeValue);
    // Trigger refetch or filter locally
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

  // Filter logic (client-side for prototype)
  const displayedTechnicians = technicians.filter(tech => {
    // Basic text search
    if (searchQuery && !tech.full_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filter checks can be added here
    return true;
  });

  const comparedTechnicianData = technicians.filter((tech) =>
    comparedTechnicians.includes(tech.id)
  );

  if (!isHydrated || loading) {
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
                    isComparing={comparedTechnicians.includes(technician.id)}
                    distance={0} // Mock distance since it's hard to calculate without user loc
                  />

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
