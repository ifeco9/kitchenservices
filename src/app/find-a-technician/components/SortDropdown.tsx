'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

const SortDropdown = ({ currentSort, onSortChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'availability', label: 'Available Now' },
  ];

  const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || 'Sort By';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-text-primary bg-surface hover:bg-muted border border-border rounded-lg transition-smooth focus-ring"
      >
        <Icon name="BarsArrowDownIcon" size={18} className="text-text-secondary" />
        <span>{currentLabel}</span>
        <Icon
          name={isOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'}
          size={16}
          className="text-text-secondary"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-smooth ${
                  currentSort === option.value
                    ? 'bg-accent/10 text-accent font-semibold' :'text-text-primary hover:bg-surface'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;