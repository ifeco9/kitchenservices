import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Homepage - KitchenServices',
  description: 'Connect with verified kitchen appliance technicians across the UK for emergency repairs, planned maintenance, and professional installations with transparent pricing and instant availability.'
};

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthRedirect />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 z-0 bg-gradient-midnight">
          {/* Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-mesh-warm opacity-60"></div>

          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-sunset opacity-20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-ocean opacity-20 rounded-full blur-3xl float-gentle"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-emerald opacity-15 rounded-full blur-2xl animate-float"></div>

          {/* Noise Texture */}
          <div className="noise-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mb-12 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight animate-staggered-fade-in">
              <span className="gradient-text bg-gradient-animated">Expert Kitchen</span>
              <br />
              <span className="text-white">Appliance Technicians</span>
              <br />
              <span className="text-white/90">Near You</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8 animate-staggered-fade-in delay-1 font-heading">
              Verified professionals available <span className="font-semibold text-white">24/7</span> for emergency repairs, planned maintenance, and installations with <span className="gradient-text-ocean">transparent pricing</span>
            </p>
          </div>

          {/* Glassmorphism Search Card */}
          <div className="animate-fade-in delay-200 glass-dark rounded-2xl p-6 lg:p-8 shadow-2xl magnetic-hover">
            <HeroSearch />
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap gap-6 items-center animate-fade-in delay-300">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-emerald rounded-full flex items-center justify-center shimmer">
                <Icon name="CheckBadgeIcon" size={20} className="text-white" />
              </div>
              <span className="text-white/90 text-sm font-heading">1000+ Verified Technicians</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-sunset rounded-full flex items-center justify-center shimmer">
                <Icon name="ClockIcon" size={20} className="text-white" />
              </div>
              <span className="text-white/90 text-sm font-heading">24/7 Emergency Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-ocean rounded-full flex items-center justify-center shimmer">
                <Icon name="StarIcon" size={20} className="text-white" />
              </div>
              <span className="text-white/90 text-sm font-heading">4.9 Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <div className="animate-fade-in">
        <HowItWorks />
      </div>

      {/* Service Categories */}
      <div className="animate-fade-in delay-100">
        <ServiceCategories />
      </div>

      {/* Featured Technicians */}
      <div className="animate-fade-in delay-200">
        <FeaturedTechnicians />
      </div>

      {/* Testimonials */}
      <div className="animate-fade-in delay-300">
        <Testimonials />
      </div>

      {/* Emergency CTA */}
      <div className="animate-fade-in delay-400">
        <EmergencyCTA />
      </div>

      {/* Footer */}
      <Footer />
    </div>);
}