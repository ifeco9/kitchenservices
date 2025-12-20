'use client';

import Icon from '@/components/ui/AppIcon';

interface ViewToggleProps {
  currentView: 'grid' | 'list' | 'map';
  onViewChange: (view: 'grid' | 'list' | 'map') => void;
}

const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center space-x-2 bg-surface rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`px-3 py-2 rounded-md transition-smooth ${
          currentView === 'grid' ?'bg-accent text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
        }`}
        aria-label="Grid view"
      >
        <Icon name="Squares2X2Icon" size={20} />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`px-3 py-2 rounded-md transition-smooth ${
          currentView === 'list' ?'bg-accent text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
        }`}
        aria-label="List view"
      >
        <Icon name="ListBulletIcon" size={20} />
      </button>
      <button
        onClick={() => onViewChange('map')}
        className={`px-3 py-2 rounded-md transition-smooth ${
          currentView === 'map' ?'bg-accent text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
        }`}
        aria-label="Map view"
      >
        <Icon name="MapIcon" size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;