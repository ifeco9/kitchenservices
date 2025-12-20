'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  alt: string;
  earnings: string;
  growth: string;
  quote: string;
}

const HeroSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "James Mitchell",
    location: "Manchester",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_137ad5a3e-1765083592272.png",
    alt: "Professional male technician in blue work uniform holding toolkit in modern kitchen",
    earnings: "£4,200/month",
    growth: "+180% in 6 months",
    quote: "KitchenServices transformed my business. I went from struggling to find clients to having a fully booked calendar within three months."
  },
  {
    id: 2,
    name: "Sarah Thompson",
    location: "Birmingham",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eade9a84-1765963301821.png",
    alt: "Female technician in grey work shirt smiling while holding repair tools in residential setting",
    earnings: "£3,800/month",
    growth: "+150% in 4 months",
    quote: "The platform handles all the admin work, so I can focus on what I do best - fixing appliances and building customer relationships."
  },
  {
    id: 3,
    name: "David Chen",
    location: "London",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff09c345-1764769536232.png",
    alt: "Asian male technician in navy uniform examining kitchen appliance with professional tools",
    earnings: "£5,100/month",
    growth: "+220% in 8 months",
    quote: "I doubled my income and cut my marketing costs to zero. The verification badge gives customers instant confidence in my services."
  }];


  const stats = [
  { label: "Active Technicians", value: "2,500+", icon: "UserGroupIcon" },
  { label: "Average Monthly Earnings", value: "£3,900", icon: "CurrencyPoundIcon" },
  { label: "Customer Satisfaction", value: "98%", icon: "StarIcon" },
  { label: "Jobs Completed", value: "45,000+", icon: "CheckBadgeIcon" }];


  const handleNext = () => {
    if (!isHydrated) return;
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (!isHydrated) return;
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section className="relative bg-gradient-to-br from-primary via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-accent/20 border border-accent/30 rounded-full">
              <Icon name="SparklesIcon" size={20} className="text-accent mr-2" />
              <span className="text-sm font-medium text-accent">Join 2,500+ Verified Technicians</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Grow Your Business with{' '}
              <span className="text-accent">Verified Customers</span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-300 leading-relaxed">
              Stop chasing leads and start accepting bookings. Join the UK&apos;s most trusted platform for kitchen and appliance technicians. Get verified once, get booked consistently.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat, index) =>
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={stat.icon as any} size={20} className="text-accent" />
                    <span className="text-2xl lg:text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-slate-300">{stat.label}</p>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#registration"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring">

                Start Registration
                <Icon name="ArrowRightIcon" size={20} className="ml-2" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-smooth focus-ring">

                <Icon name="PlayCircleIcon" size={20} className="mr-2" />
                Watch Demo
              </a>
            </div>
          </div>

          {/* Right Content - Testimonial Carousel */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) =>
                  <Icon key={i} name="StarIcon" size={20} className="text-yellow-400" variant="solid" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrev}
                    disabled={!isHydrated}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-smooth focus-ring disabled:opacity-50"
                    aria-label="Previous testimonial">

                    <Icon name="ChevronLeftIcon" size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isHydrated}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-smooth focus-ring disabled:opacity-50"
                    aria-label="Next testimonial">

                    <Icon name="ChevronRightIcon" size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-accent">
                  <AppImage
                    src={currentTestimonial.image}
                    alt={currentTestimonial.alt}
                    className="w-full h-full object-cover" />

                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{currentTestimonial.name}</h3>
                  <p className="text-sm text-slate-300 mb-2">{currentTestimonial.location}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="CurrencyPoundIcon" size={16} className="text-accent" />
                      <span className="text-sm font-semibold text-accent">{currentTestimonial.earnings}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="ArrowTrendingUpIcon" size={16} className="text-success" />
                      <span className="text-sm font-semibold text-success">{currentTestimonial.growth}</span>
                    </div>
                  </div>
                </div>
              </div>

              <blockquote className="text-base leading-relaxed text-slate-200 italic">
                &quot;{currentTestimonial.quote}&quot;
              </blockquote>

              <div className="flex items-center justify-center space-x-2 mt-6">
                {testimonials.map((_, index) =>
                <button
                  key={index}
                  onClick={() => isHydrated && setActiveTestimonial(index)}
                  disabled={!isHydrated}
                  className={`w-2 h-2 rounded-full transition-smooth ${
                  index === activeTestimonial ? 'bg-accent w-8' : 'bg-white/30'}`
                  }
                  aria-label={`Go to testimonial ${index + 1}`} />

                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;