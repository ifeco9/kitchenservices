'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { Technician } from '@/types';
import { profileService } from '@/services/profileService';

const FeaturedTechnicians = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await profileService.getTechnicians(3);
        setTechnicians(data);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-96 bg-muted rounded-xl md:row-span-2"></div>
              <div className="h-48 bg-muted rounded-xl"></div>
              <div className="h-48 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback if no technicians found (or during initial dev before seeding)
  if (technicians.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Meet Our Top-Rated Technicians
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl">
              Verified professionals with proven track records and excellent customer reviews
            </p>
          </div>
          <Link
            href="/find-a-technician"
            className="inline-flex items-center text-accent font-semibold hover:text-success transition-smooth mt-4 lg:mt-0">

            <span>View All Technicians</span>
            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Technician Card */}
          {technicians[0] && (
            <Link
              href={`/technician-profiles?id=${technicians[0].id}`}
              className="group md:row-span-2 bg-white rounded-xl overflow-hidden border border-border hover:border-accent transition-smooth block relative">
              <div className="relative h-80 md:h-full overflow-hidden">
                <AppImage
                  src={technicians[0].avatar_url || 'https://via.placeholder.com/400'}
                  alt={technicians[0].full_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Technician info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold">{technicians[0].full_name}</h3>
                    {technicians[0].is_verified && (
                      <div className="inline-flex items-center px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full shadow-lg">
                        <Icon name="CheckBadgeIcon" size={16} className="mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-white/90 mb-2">{technicians[0].specializations?.join(', ')}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Icon name="StarIcon" size={18} className="text-warning mr-1" variant="solid" />
                      <span>{technicians[0].rating || 'New'} ({technicians[0].review_count || 0} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="MapPinIcon" size={16} className="mr-1" />
                      <span>{technicians[0].address || 'London'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center text-sm text-text-secondary">
                    <Icon name="ClockIcon" size={16} className="mr-1" />
                    Response: Usually within 1 hour
                  </div>
                  <div className="flex items-center text-accent font-medium">
                    <span>View Profile</span>
                    <Icon name="ArrowRightIcon" size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Secondary Technician Cards */}
          <div className="grid grid-cols-1 gap-6">
            {technicians.slice(1).map((tech) => (
              <Link
                key={tech.id}
                href={`/technician-profiles?id=${tech.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-border hover:border-accent transition-smooth block relative">

                <div className="flex">
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                    <AppImage
                      src={tech.avatar_url || 'https://via.placeholder.com/150'}
                      alt={tech.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                    {tech.is_verified && (
                      <div className="absolute top-1 right-1 inline-flex items-center bg-accent text-accent-foreground text-xs font-semibold rounded-full p-1 shadow-lg">
                        <Icon name="CheckBadgeIcon" size={12} />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-primary group-hover:text-accent transition-smooth text-sm">
                        {tech.full_name}
                      </h3>
                    </div>

                    <p className="text-text-secondary text-xs mb-2">{tech.specializations?.join(', ')}</p>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <Icon name="StarIcon" size={14} className="text-warning" variant="solid" />
                        <span className="text-xs font-semibold text-primary">{tech.rating || 'New'}</span>
                        <span className="text-text-secondary text-xs">({tech.review_count || 0})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-text-secondary text-xs">
                        <Icon name="MapPinIcon" size={12} className="mr-1" />
                        {tech.address || 'London'}
                      </div>
                      <div className="text-accent text-xs font-medium flex items-center">
                        <span>View</span>
                        <Icon name="ArrowRightIcon" size={12} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>);

};

export default FeaturedTechnicians;
