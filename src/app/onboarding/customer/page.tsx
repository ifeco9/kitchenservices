'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import Header from '@/components/common/Header';
import { profileService } from '@/services/profileService';

export default function CustomerOnboardingPage() {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Save customer profile data to database
      await profileService.updateCustomerProfile(user.id, {
        phone,
        address,
        city,
        postcode,
        preferred_contact: preferredContact
      });

      setSuccess(true);

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard/customer');
      }, 1500);
    } catch (err: any) {
      console.error('Customer onboarding error:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use the guard
  useNavigationGuard();

  if (loading) return <div>Loading...</div>; // Simple loading for now as guard handles main logic


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Complete Your Profile</h1>
            <p className="text-text-secondary mb-8">Tell us a bit more about yourself to get started</p>

            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-success text-sm">Profile saved successfully! Redirecting...</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-medium text-text-secondary mb-2">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                  placeholder="Enter your street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-text-secondary mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                    placeholder="Enter your city"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-text-secondary mb-2">
                    Postcode
                  </label>
                  <input
                    id="postcode"
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                    placeholder="Enter your postcode"
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Preferred Contact Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contact"
                      checked={preferredContact === 'email'}
                      onChange={() => setPreferredContact('email')}
                      className="h-4 w-4 text-accent border-border focus:ring-accent"
                    />
                    <span className="ml-2 text-text-primary">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contact"
                      checked={preferredContact === 'phone'}
                      onChange={() => setPreferredContact('phone')}
                      className="h-4 w-4 text-accent border-border focus:ring-accent"
                    />
                    <span className="ml-2 text-text-primary">Phone</span>
                  </label>
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