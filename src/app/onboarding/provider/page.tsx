'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { profileService } from '@/services/profileService';
import Header from '@/components/common/Header';
import { onboardingService } from '@/services/onboardingService';
import { supabase } from '@/lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';

export default function ProviderOnboardingPage() {
  const [businessName, setBusinessName] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [calloutFee, setCalloutFee] = useState('');
  const [serviceRadius, setServiceRadius] = useState('10');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  useNavigationGuard();

  // Get browser location
  const handleGetLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.success('Location captured successfully!');
          setLocationLoading(false);
        },
        (error) => {
          toast.error('Unable to get location. Please enter address manually.');
          setLocationLoading(false);
        }
      );
    } else {
      toast.error('Geolocation not supported by browser');
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (specializations.length === 0) {
      toast.error('Please select at least one specialization');
      return;
    }

    if (parseInt(hourlyRate) < 10) {
      toast.error('Hourly rate must be at least £10');
      return;
    }

    setIsLoading(true);

    try {
      if (!user) throw new Error('User not authenticated');

      // First update profile with phone and address
      await profileService.updateProfile(user.id, {
        phone,
        address: `${address}, ${city}, ${postcode}`,
        city,
        postcode
      });

      // Map certifications string[] to Certification[] structure
      const certObjects = certifications.map(name => ({
        name,
        issuer: 'Self Reported',
        verified: false
      }));

      // Create technician profile
      await onboardingService.completeTechnicianProfile(user.id, {
        bio: businessName,
        specializations,
        certifications: certObjects,
        years_experience: parseInt(yearsExperience) || 0,
        hourly_rate: parseFloat(hourlyRate),
        callout_fee: parseFloat(calloutFee) || 0,
        service_radius_miles: parseInt(serviceRadius),
        address: `${address}, ${city}, ${postcode}`
        // location_lat and location_lng are optional and omitted
      });

      await refreshProfile();
      toast.success('Profile created successfully!');

      // Redirect to availability setup
      setTimeout(() => {
        router.push('/dashboard/provider/availability');
      }, 1000);

    } catch (err: any) {
      console.error('Provider onboarding error:', err);
      toast.error(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          router.push('/dashboard/provider');
        }
      } catch (err) {
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
      <Toaster position="top-right" />
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Set Up Your Service Profile</h1>
            <p className="text-text-secondary mb-8">Complete your professional profile to start receiving bookings</p>

            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="mb-8 p-6 bg-surface rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Contact Information</h2>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-text-secondary mb-2">
                      Street Address *
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                      placeholder="Enter street address"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-text-secondary mb-2">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="postcode" className="block text-sm font-medium text-text-secondary mb-2">
                    Postcode *
                  </label>
                  <input
                    id="postcode"
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                    placeholder="Enter postcode"
                    required
                  />
                </div>
              </div>

              {/* Business Information */}
              <div className="mb-8">
                <label htmlFor="businessName" className="block text-sm font-medium text-text-secondary mb-2">
                  Business Name / Bio *
                </label>
                <textarea
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                  placeholder="Tell customers about your business (min 50 characters)"
                  rows={4}
                  minLength={50}
                  required
                />
                <p className="text-xs text-text-secondary mt-1">{businessName.length}/50 characters minimum</p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Specializations * (select at least one)
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
                      <span className="ml-2 text-text-primary text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Certifications (optional)
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
                      <span className="ml-2 text-text-primary text-sm">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label htmlFor="yearsExperience" className="block text-sm font-medium text-text-secondary mb-2">
                    Years Experience *
                  </label>
                  <input
                    id="yearsExperience"
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                    placeholder="e.g., 5"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-text-secondary mb-2">
                    Hourly Rate (£) *
                  </label>
                  <input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                    placeholder="e.g., 65"
                    min="10"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="calloutFee" className="block text-sm font-medium text-text-secondary mb-2">
                    Callout Fee (£) *
                  </label>
                  <input
                    id="calloutFee"
                    type="number"
                    value={calloutFee}
                    onChange={(e) => setCalloutFee(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                    placeholder="e.g., 45"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="serviceRadius" className="block text-sm font-medium text-text-secondary mb-2">
                  Service Radius (miles) *
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
                  <option value="50">50 miles</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full pyp-3.5 px-6 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Profile...' : 'Complete Profile & Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}