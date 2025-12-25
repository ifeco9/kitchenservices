'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="ArrowPathIcon" size={32} className="text-text-secondary mx-auto animate-spin" />
          <p className="mt-4 text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.profile?.role !== 'customer') {
    if (!user) {
      router.push('/auth/signin');
    } else {
      router.push('/auth/role-selection');
    }
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">Welcome back, {user.profile?.full_name || user.email || 'Customer'}!</h1>
            <p className="text-text-secondary">Here's what's happening with your account</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Booking Summary Card */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Icon name="CalendarIcon" size={24} className="text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Active Bookings</p>
                  <p className="text-2xl font-bold text-text-primary">2</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/customer/bookings')}
                className="mt-4 text-accent hover:underline text-sm font-medium"
              >
                View all bookings
              </button>
            </div>

            {/* Upcoming Service Card */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Icon name="ClockIcon" size={24} className="text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Upcoming Service</p>
                  <p className="text-2xl font-bold text-text-primary">1</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/customer/bookings')}
                className="mt-4 text-accent hover:underline text-sm font-medium"
              >
                View details
              </button>
            </div>

            {/* Favorites Card */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="HeartIcon" size={24} className="text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Favorite Technicians</p>
                  <p className="text-2xl font-bold text-text-primary">3</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/find-a-technician')}
                className="mt-4 text-accent hover:underline text-sm font-medium"
              >
                Browse technicians
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-text-primary">Recent Bookings</h2>
                  <button
                    onClick={() => router.push('/dashboard/customer/bookings')}
                    className="text-accent hover:underline text-sm font-medium"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-b border-border last:border-0">
                    <div>
                      <h3 className="font-medium text-text-primary">Dishwasher Repair</h3>
                      <p className="text-sm text-text-secondary">Booked with James Mitchell</p>
                      <p className="text-sm text-text-secondary">Dec 20, 2025 at 2:00 PM</p>
                    </div>
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      Completed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 border-b border-border last:border-0">
                    <div>
                      <h3 className="font-medium text-text-primary">Oven Cleaning</h3>
                      <p className="text-sm text-text-secondary">Booked with Sarah Thompson</p>
                      <p className="text-sm text-text-secondary">Dec 25, 2025 at 10:00 AM</p>
                    </div>
                    <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-bold text-text-primary mb-6">Account Actions</h2>

                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/book-a-service')}
                    className="w-full py-3 px-4 text-left text-text-primary hover:bg-surface rounded-lg transition-smooth"
                  >
                    <div className="flex items-center">
                      <Icon name="PlusCircleIcon" size={20} className="text-accent mr-3" />
                      <span>Book New Service</span>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/find-a-technician')}
                    className="w-full py-3 px-4 text-left text-text-primary hover:bg-surface rounded-lg transition-smooth"
                  >
                    <div className="flex items-center">
                      <Icon name="MagnifyingGlassIcon" size={20} className="text-accent mr-3" />
                      <span>Find a Technician</span>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/customer')}
                    className="w-full py-3 px-4 text-left text-text-primary hover:bg-surface rounded-lg transition-smooth"
                  >
                    <div className="flex items-center">
                      <Icon name="UserCircleIcon" size={20} className="text-accent mr-3" />
                      <span>Profile Settings</span>
                    </div>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 px-4 text-left text-error hover:bg-error/5 rounded-lg transition-smooth"
                  >
                    <div className="flex items-center">
                      <Icon name="ArrowRightStartOnRectangleIcon" size={20} className="text-error mr-3" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}