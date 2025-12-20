'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  service: string;
  image: string;
  alt: string;
}

const Testimonials = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Emma Richardson',
    location: 'London',
    rating: 5,
    comment: 'My oven broke down on Christmas Eve and I was panicking. Found a technician through KitchenServices within 30 minutes who came out the same day. Absolutely brilliant service and very reasonable pricing.',
    service: 'Emergency Oven Repair',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1104c87ff-1765607754886.png",
    alt: 'Smiling woman with long blonde hair in casual blue sweater in bright modern home'
  },
  {
    id: '2',
    name: 'Michael O\'Brien',
    location: 'Manchester',
    rating: 5,
    comment: 'As a landlord managing multiple properties, KitchenServices has been a game-changer. Verified technicians, transparent pricing, and quick response times. Highly recommend for property managers.',
    service: 'Dishwasher Installation',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_12ef1a455-1763296313102.png",
    alt: 'Professional man with short dark hair in navy business suit smiling confidently'
  },
  {
    id: '3',
    name: 'Priya Patel',
    location: 'Birmingham',
    rating: 5,
    comment: 'The booking process was so straightforward and the technician was incredibly professional. Fixed my washing machine in under an hour and explained everything clearly. Will definitely use again.',
    service: 'Washing Machine Repair',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f953953d-1763294126115.png",
    alt: 'South Asian woman with long dark hair in professional attire smiling warmly'
  }];


  const handlePrevious = () => {
    if (isHydrated) {
      setCurrentIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
    }
  };

  const handleNext = () => {
    if (isHydrated) {
      setCurrentIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1);
    }
  };

  if (!isHydrated) {
    return (
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-white rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-white rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 animate-pulse">
            <div className="h-32 bg-surface rounded"></div>
          </div>
        </div>
      </section>);

  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-text-secondary">
            Real experiences from homeowners who trust KitchenServices
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-card p-8 lg:p-12 relative">
            {/* Large Quote Mark */}
            <div className="absolute top-6 right-6 text-accent opacity-10 text-8xl font-serif leading-none">
              &ldquo;
            </div>
            
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) =>
              <Icon
                key={i}
                name="StarIcon"
                size={24}
                variant="solid"
                className={i < currentTestimonial.rating ? 'text-warning' : 'text-border'} />

              )}
            </div>

            <blockquote className="text-xl text-text-primary leading-relaxed mb-8 relative z-10">
              &ldquo;{currentTestimonial.comment}&rdquo;
            </blockquote>

            <div className="flex items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                <AppImage
                  src={currentTestimonial.image}
                  alt={currentTestimonial.alt}
                  className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-semibold text-primary">{currentTestimonial.name}</div>
                <div className="text-sm text-text-secondary">{currentTestimonial.location}</div>
                <div className="text-xs text-accent font-medium mt-1">
                  {currentTestimonial.service}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-accent hover:text-accent-foreground rounded-full transition-smooth focus-ring"
                  aria-label="Previous testimonial">
                  <Icon name="ChevronLeftIcon" size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-accent hover:text-accent-foreground rounded-full transition-smooth focus-ring"
                  aria-label="Next testimonial">
                  <Icon name="ChevronRightIcon" size={20} />
                </button>
              </div>
              
              <div className="text-sm text-text-secondary">
                {currentIndex + 1} of {testimonials.length}
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.filter((_, index) => index !== currentIndex).slice(0, 2).map((testimonial) => (
            <div key={testimonial.id} className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) =>
                  <Icon
                    key={i}
                    name="StarIcon"
                    size={16}
                    variant="solid"
                    className={i < testimonial.rating ? 'text-warning' : 'text-border'} />
                )}
              </div>
              <p className="text-text-primary text-sm mb-4 line-clamp-3">
                &ldquo;{testimonial.comment}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <AppImage
                    src={testimonial.image}
                    alt={testimonial.alt}
                    className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium text-primary text-sm">{testimonial.name}</div>
                  <div className="text-xs text-text-secondary">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>);

};

export default Testimonials;