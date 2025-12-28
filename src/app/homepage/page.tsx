'use client';

import { useEffect } from 'react';
import Header from '@/components/common/Header';
import AuthRedirect from '@/components/common/AuthRedirect';
import HeroSearch from './components/HeroSearch';
import TrustIndicators from './components/TrustIndicators';
import ServiceCategories from './components/ServiceCategories';
import FeaturedTechnicians from './components/FeaturedTechnicians';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import EmergencyCTA from './components/EmergencyCTA';
import Footer from './components/Footer';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function Homepage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.getAttribute('data-scroll-animation');
          if (animation) {
            entry.target.classList.add('animate-' + animation);
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-scroll-animation]').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthRedirect />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Simple Dark Background */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/assets/images/logo.png"
              alt="KitchenServices Logo Background"
              className="w-1/2 h-1/2 md:w-3/4 md:h-3/4 object-contain opacity-30 rounded-full animate-float-slow"
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-staggered-fade-in">
              Expert Kitchen Appliance Technicians Near You
            </h1>
            <p className="text-xl text-white opacity-90 leading-relaxed mb-8 animate-staggered-fade-in delay-1">
              Verified professionals available 24/7 for emergency repairs, planned maintenance, and installations with transparent pricing
            </p>
          </div>

          {/* Hero Search Component */}
          <div className="animate-fade-in delay-200">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* How It Works - Fade Up */}
      <section data-scroll-animation="fade-up">
        <HowItWorks />
      </section>

      {/* Service Categories - Slide In Left */}
      <section data-scroll-animation="slide-left">
        <ServiceCategories />
      </section>

      {/* Featured Technicians - Zoom In */}
      <section data-scroll-animation="zoom-in">
        <FeaturedTechnicians />
      </section>

      {/* Testimonials - Slide In Right */}
      <section data-scroll-animation="slide-right">
        <Testimonials />
      </section>

      {/* Emergency CTA - Bounce In */}
      <section data-scroll-animation="bounce-in">
        <EmergencyCTA />
      </section>

      {/* Footer */}
      <Footer />
    </div>);
}