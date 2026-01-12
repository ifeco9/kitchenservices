'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { profileService } from '@/services/profileService';
import Header from '@/components/common/Header';
import { onboardingService } from '@/services/onboardingService';
import { supabase } from '@/lib/supabaseClient';

export default function ProviderOnboardingPage() {
  const [businessName, setBusinessName] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [serviceRadius, setServiceRadius] = useState('10');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  // ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user) {
        // Map certifications string[] to Certification[] structure
        const certObjects = certifications.map(name => ({
          name,
          issuer: 'Self Reported',
          verified: false
        }));

        await onboardingService.completeTechnicianProfile(user.id, {
          years_experience: 1, // Defaulting as not in form
          bio: businessName, // Using business name as bio for now
          specializations,
          certifications: certObjects,
          hourly_rate: parseFloat(hourlyRate),
          callout_fee: 0, // Defaulting
          service_radius_miles: parseInt(serviceRadius),
        });

        router.push('/dashboard/provider');
      }
    } catch (err) {
      console.error('Provider onboarding error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  // Redirect if user is not authenticated or not a provider
  // Use the guard
  useNavigationGuard();

  // Redirect if user is not authenticated or not a provider (Handled by guard largely, but check technician logic)
  useEffect(() => {
    // Additional technician-specific checks can remain if strictly needed, 
    // but guard should handle the main flow: !role leads to role-select, !complete leads here
    // This effect might be redundant now, let's keep it minimal or remove if guard covers it.
    // Guard ensures: If role != technician -> redirect. If phone missing -> stay here.
    // So we can largely trust the guard.
  }, [user]);

  // Check if technician profile already exists
  useEffect(() => {
    const checkTechnicianProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('technicians')
          .select('id')
          .eq('id', user?.id)
          .single();

        if (data && !error) {
          // Technician profile already exists, redirect to dashboard
          router.push('/dashboard/provider');
        }
      } catch (err) {
        // Technician profile doesn't exist yet, allow onboarding
        console.log('Technician profile does not exist yet, proceeding with onboarding');
      }
    };

    if (user) {
      checkTechnicianProfile();
    }
  }, [user, router]);

  const availableSpecializations = [
    'Refrigerator', 'Washing Machine', 'Dishwasher', 'Oven',
    'Cooker Hood', 'Microwave', 'Tumble Dryer', 'Hob', 'All Appliances'
  ];

  const availableCertifications = [
    'Gas Safe', 'NICEIC', 'City & Guilds', 'NVQ Level 3',
    'Manufacturer Certified'
  ];

  const toggleSpecialization = (spec: string) => {
    if (specializations.includes(spec)) {
      setSpecializations(specializations.filter(s => s !== spec));
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  const toggleCertification = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter(c => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Set Up Your Service Profile</h1>
            <p className="text-text-secondary mb-8">Complete your professional profile to start receiving bookings</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label htmlFor="businessName" className="block text-sm font-medium text-text-secondary mb-2">
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                  placeholder="Enter your business or trade name"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Specializations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSpecializations.map((spec) => (
                    <label
                      key={spec}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-smooth ${specializations.includes(spec)
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={specializations.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="h-4 w-4 text-accent border-border focus:ring-accent"
                      />
                      <span className="ml-2 text-text-primary">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Certifications
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableCertifications.map((cert) => (
                    <label
                      key={cert}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-smooth ${certifications.includes(cert)
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={certifications.includes(cert)}
                        onChange={() => toggleCertification(cert)}
                        className="h-4 w-4 text-accent border-border focus:ring-accent"
                      />
                      <span className="ml-2 text-text-primary">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-text-secondary mb-2">
                    Hourly Rate (£)
                  </label>
                  <input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                    placeholder="e.g., 65"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="serviceRadius" className="block text-sm font-medium text-text-secondary mb-2">
                    Service Radius (miles)
                  </label>
                  <select
                    id="serviceRadius"
                    value={serviceRadius}
                    onChange={(e) => setServiceRadius(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                  >
                    <option value="5">5 miles</option>
                    <option value="10">10 miles</option>
                    <option value="15">15 miles</option>
                    <option value="20">20 miles</option>
                    <option value="25">25 miles</option>
                    <option value="30">30 miles</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Complete Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}