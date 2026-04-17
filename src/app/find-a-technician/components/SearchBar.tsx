'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Service Search */}
        <div className="flex-1 relative">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by appliance or service..."
            className="w-full pl-12 pr-4 py-3.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
          />
        </div>

        {/* Postcode Search */}
        <div className="lg:w-64 relative">
          <Icon
            name="MapPinIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter state or city (e.g., Lagos, Abuja)"
            className="w-full pl-12 pr-4 py-3.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="lg:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-accent hover:bg-success rounded-lg shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
        >
          <span className="flex items-center justify-center space-x-2">
            <Icon name="MagnifyingGlassIcon" size={18} />
            <span>Search</span>
          </span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;