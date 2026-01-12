'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileService } from '@/services/profileService';

import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabaseClient';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'provider' | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user, loading, refreshProfile } = useAuth();

  // Use the guard
  useNavigationGuard();

  // Redirect if not authenticated (Guard handles this redirect, but we return null to prevent flash)
  if (!user && !loading) return null;

  const handleRoleSelect = (role: 'customer' | 'provider') => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !user) return;

    setIsLoading(true);
    try {
      // Map 'provider' to 'technician' for database compatibility
      const dbRole = selectedRole === 'provider' ? 'technician' : selectedRole;
      await profileService.updateProfile(user.id, { role: dbRole });
      await refreshProfile();

      if (selectedRole === 'customer') {
        router.push('/onboarding/customer');
      } else {
        router.push('/onboarding/provider');
      }
    } catch (err: any) {
      console.error('Role selection error:', err);
      setError(err.message || 'Failed to update role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome to KitchenServices!</h1>
            <p className="text-text-secondary mb-8">Are you looking for services or providing them?</p>

            {error && (
              <div className="mb-6 p-3 bg-error/10 text-error rounded-lg border border-error/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Customer Card */}
                <div
                  onClick={() => handleRoleSelect('customer')}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-smooth ${selectedRole === 'customer'
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                    }`}
                >
                  <div className="flex items-center mb-4">
                    <Icon
                      name={selectedRole === 'customer' ? 'UserIcon' : 'UserIcon'}
                      size={24}
                      className={selectedRole === 'customer' ? 'text-accent' : 'text-text-secondary'}
                    />
                    <h3 className="text-xl font-semibold text-text-primary ml-3">I need services</h3>
                  </div>
                  <p className="text-text-secondary ml-9">
                    Book kitchen appliance repairs, maintenance, and installations
                  </p>
                </div>

                {/* Provider Card */}
                <div
                  onClick={() => handleRoleSelect('provider')}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-smooth ${selectedRole === 'provider'
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                    }`}
                >
                  <div className="flex items-center mb-4">
                    <Icon
                      name={selectedRole === 'provider' ? 'WrenchScrewdriverIcon' : 'WrenchScrewdriverIcon'}
                      size={24}
                      className={selectedRole === 'provider' ? 'text-accent' : 'text-text-secondary'}
                    />
                    <h3 className="text-xl font-semibold text-text-primary ml-3">I provide services</h3>
                  </div>
                  <p className="text-text-secondary ml-9">
                    Offer your expertise as a kitchen appliance technician
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !selectedRole}
                className={`w-full py-3.5 px-6 text-sm font-semibold rounded-lg transition-smooth ${selectedRole
                  ? 'text-accent-foreground bg-accent hover:bg-success shadow-cta hover:shadow-lg'
                  : 'text-text-secondary bg-muted cursor-not-allowed opacity-50'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Icon name="ArrowPathIcon" size={18} className="animate-spin mr-2" />
                    {selectedRole ? 'Setting up profile...' : 'Processing...'}
                  </span>
                ) : 'Continue'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                Need to change your account type?{' '}
                <button
                  onClick={() => router.push('/auth/signout')}
                  className="text-accent hover:underline font-medium"
                >
                  Sign out
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}