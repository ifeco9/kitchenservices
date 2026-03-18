'use client';

import { useEffect, useState } from 'react';
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
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function Homepage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0710' }}>
      <div style={{ backgroundColor: '#0a0710' }}>
        <Header />
      </div>
      <AuthRedirect />

      {/* ══════════════════════════════════════════════════════════════
          HERO — Asymmetric split with animated orbs + massive logo
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0a0710', minHeight: '100vh' }}>

        {/* ── Animated gradient orbs ──────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {/* Primary purple orb — top-right */}
          <div
            className="absolute rounded-full animate-float-slow"
            style={{
              width: '50vw', height: '50vw', maxWidth: '700px', maxHeight: '700px',
              top: '-10%', right: '-10%',
              background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(147,51,234,0.03) 50%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          {/* Secondary violet orb — bottom-left */}
          <div
            className="absolute rounded-full"
            style={{
              width: '35vw', height: '35vw', maxWidth: '500px', maxHeight: '500px',
              bottom: '5%', left: '-5%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 60%)',
              filter: 'blur(60px)',
              animation: 'float-slow 8s ease-in-out infinite reverse',
            }}
          />
          {/* Tiny accent orb — mid-left */}
          <div
            className="absolute rounded-full"
            style={{
              width: '15vw', height: '15vw', maxWidth: '200px', maxHeight: '200px',
              top: '40%', left: '20%',
              background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 60%)',
              filter: 'blur(30px)',
              animation: 'float-slow 6s ease-in-out 2s infinite',
            }}
          />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147,51,234,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147,51,234,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* ── Main hero content — asymmetric split ─────────── */}
        <div className="relative pt-28 lg:pt-36 pb-16 lg:pb-0" style={{ zIndex: 1 }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">

              {/* LEFT COLUMN — content */}
              <div className="flex-1 lg:pr-12">
                {/* Live pulse badge */}
                <div
                  className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-xs font-medium rounded-full"
                  style={{ backgroundColor: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.25)', color: '#a855f7', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '0.5px' }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#a855f7' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#9333ea' }} />
                  </span>
                  Available 24 / 7 — Emergency Response
                </div>

                {/* Headline — staggered lines */}
                <h1
                  className="leading-[0.9] mb-2"
                  style={{
                    fontSize: 'clamp(52px, 6.5vw, 96px)',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    letterSpacing: '-3px',
                    color: '#ffffff',
                  }}
                >
                  Kitchen
                </h1>
                <h1
                  className="leading-[0.9] mb-2"
                  style={{
                    fontSize: 'clamp(52px, 6.5vw, 96px)',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    letterSpacing: '-3px',
                    color: '#ffffff',
                  }}
                >
                  Experts<span style={{ color: '#9333ea' }}>.</span>
                </h1>
                <h1
                  className="leading-[0.9] mb-8"
                  style={{
                    fontSize: 'clamp(52px, 6.5vw, 96px)',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    letterSpacing: '-3px',
                    color: '#9333ea',
                  }}
                >
                  At Your Door.
                </h1>

                <p
                  className="mb-8 max-w-lg leading-relaxed"
                  style={{ fontSize: '16px', color: '#6b7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}
                >
                  Find verified appliance technicians for emergency repairs,
                  planned maintenance, and installations — with transparent pricing guaranteed.
                </p>

                {/* CTA row */}
                <div className="flex flex-wrap gap-3 mb-10">
                  <Link
                    href="/book-a-service"
                    className="group inline-flex items-center gap-2 px-7 py-4 font-semibold transition-all duration-300 hover:gap-3"
                    style={{ backgroundColor: '#9333ea', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px' }}
                  >
                    Book a Technician
                    <Icon name="ArrowRightIcon" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center px-7 py-4 font-medium transition-all duration-300 hover:bg-white/5"
                    style={{ border: '1px solid #2d1f44', color: '#9ca3af', fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px' }}
                  >
                    How It Works
                  </Link>
                </div>

              </div>

              {/* RIGHT COLUMN — massive logo + service ring */}
              <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: '480px' }}>

                {/* Rotating service ring */}
                <div
                  className="absolute"
                  style={{
                    width: '100%', height: '100%', maxWidth: '520px', maxHeight: '520px',
                    animation: 'spin 45s linear infinite',
                    opacity: 0.4,
                  }}
                >
                  {['🔧', '🍳', '❄️', '🔥', '🧊', '⚡'].map((emoji, i) => {
                    const angle = (i * 60) * (Math.PI / 180);
                    const radius = 44;
                    return (
                      <div
                        key={i}
                        className="absolute flex items-center justify-center w-12 h-12 rounded-full text-lg"
                        style={{
                          left: `${50 + radius * Math.cos(angle)}%`,
                          top: `${50 + radius * Math.sin(angle)}%`,
                          transform: 'translate(-50%,-50%)',
                          backgroundColor: '#0e0a1a',
                          border: '1px solid #2d1f44',
                          animation: `spin 45s linear infinite reverse`,
                        }}
                      >
                        {emoji}
                      </div>
                    );
                  })}
                </div>

                {/* Glowing ring behind logo */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: '62.5%', height: '62.5%',
                    border: '2px solid rgba(147,51,234,0.15)',
                    boxShadow: '0 0 80px 20px rgba(147,51,234,0.08), inset 0 0 80px 20px rgba(147,51,234,0.05)',
                  }}
                />

                {/* The massive logo itself */}
                <img
                  src="/assets/images/logo.png"
                  alt="KitchenServices"
                  className="relative object-contain animate-float-slow"
                  style={{
                    width: '62.5%', height: '62.5%', maxWidth: '400px', maxHeight: '400px',
                    filter: 'drop-shadow(0 0 40px rgba(147,51,234,0.2))',
                    zIndex: 2,
                  }}
                />
              </div>
            </div>

            {/* ── Search bar — spans full width below the split ── */}
            <div className="mt-4 lg:-mt-8 pb-12 relative" style={{ zIndex: 2 }}>
              <HeroSearch />
            </div>
          </div>
        </div>

        {/* ── Bottom divider — angled gradient ───────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, #0a0710, transparent)',
            zIndex: 1,
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          EXISTING FUNCTIONAL SECTIONS
          ══════════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: '#0a0710' }}>
        <section className="scroll-animate">
          <HowItWorks />
        </section>

        <section className="scroll-animate">
          <ServiceCategories />
        </section>

        <section className="scroll-animate">
          <FeaturedTechnicians />
        </section>

        <section className="scroll-animate">
          <Testimonials />
        </section>

        <section className="scroll-animate">
          <TrustIndicators />
        </section>

        <section className="scroll-animate">
          <EmergencyCTA />
        </section>

        <Footer />
      </div>
    </div>
  );
}