'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  title: string;
  category: string;
}

interface WorkGalleryProps {
  images: GalleryImage[];
}

const WorkGallery = ({ images }: WorkGalleryProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categories = ['all', ...Array.from(new Set(images.map((img) => img.category)))];
  const filteredImages = selectedCategory === 'all' ? images : images.filter((img) => img.category === selectedCategory);

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">Work Gallery</h3>
        <div className="flex items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth focus-ring ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-text-secondary hover:bg-muted'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="relative aspect-square rounded-lg overflow-hidden group focus-ring"
          >
            <AppImage src={image.url} alt={image.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
              <Icon name="MagnifyingGlassPlusIcon" size={32} className="text-white" />
            </div>
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full bg-card rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full hover:bg-background transition-smooth focus-ring"
              aria-label="Close gallery"
            >
              <Icon name="XMarkIcon" size={24} className="text-text-primary" />
            </button>
            <div className="relative aspect-video">
              <AppImage src={selectedImage.url} alt={selectedImage.alt} className="w-full h-full object-contain" />
            </div>
            <div className="p-6 bg-surface">
              <h4 className="text-lg font-semibold text-text-primary mb-2">{selectedImage.title}</h4>
              <p className="text-sm text-text-secondary">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkGallery;