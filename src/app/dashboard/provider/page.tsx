'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types';

// ...

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && user.role === 'provider' || user?.role === 'technician') { // Normalized role check
        try {
          const data = await bookingService.getBookingsByTechnician(user.id);
          setBookings(data as any); // Type assertion if needed based on join result

          // Calculate stats
          const total = data.reduce((acc, b) => acc + (b.total_amount || 0), 0);
          setEarnings(total);

          const today = new Date().toISOString().split('T')[0];
          const todayBookings = data.filter(b => b.scheduled_date.startsWith(today));
          setTodayCount(todayBookings.length);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingStats(false);
        }
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  const handleStatusUpdate = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
    const confirmMessage = `Are you sure you want to change this booking status to "${newStatus}"?`;
    if (!confirm(confirmMessage)) return;

    setUpdatingStatus(bookingId);
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);

      // Refresh bookings list
      if (user) {
        const data = await bookingService.getBookingsByTechnician(user.id);
        setBookings(data as any);
      }
    } catch (error: any) {
      console.error('Failed to update status:', error);
      alert(error.message || 'Failed to update booking status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: Record<string, string> = {
      'pending': 'confirmed',
      'confirmed': 'in_progress',
      'in_progress': 'completed'
    };
    return statusFlow[currentStatus] || null;
  };

  // Redirect if user is not authenticated or not a technician
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="ArrowPathIcon" size={32} className="text-text-secondary mx-auto animate-spin" />
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.profile?.role !== 'technician' && user.profile?.role !== 'provider')) {
    // Redirect to appropriate page if not authorized
    if (!user) {
      router.push('/auth/signin');
    } else {
      router.push('/auth/role-selection');
    }
    return null;
  }

  // ... (auth checks)

  // ...

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-text-primary mb-2">
              Welcome back, <span className="gradient-text bg-gradient-animated">{user?.profile?.full_name || user?.email || 'Provider'}</span>!
            </h1>
            <p className="text-text-secondary font-heading text-lg">Here's what's happening with your service profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Today's Bookings Card */}
            <div className="bg-gradient-ocean p-6 rounded-2xl shadow-xl magnetic-hover tilt-3d overflow-hidden relative animate-staggered-fade-in">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl float-gentle">
                    <Icon name="CalendarIcon" size={24} className="text-white" />
                  </div>
                  <div className="text-white/60 text-xs font-accent">TODAY</div>
                </div>
                <p className="text-white/80 text-sm font-heading mb-1">Today's Bookings</p>
                <p className="text-5xl font-display font-bold text-white mb-2">{loadingStats ? '...' : todayCount}</p>
                <div className="h-1 w-16 bg-white/30 rounded-full"></div>
              </div>
            </div>

            {/* Total Earnings Card */}
            <div className="bg-gradient-emerald p-6 rounded-2xl shadow-xl magnetic-hover tilt-3d overflow-hidden relative animate-staggered-fade-in delay-1">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl float-gentle">
                    <Icon name="CurrencyPoundIcon" size={24} className="text-white" />
                  </div>
                  <div className="text-white/60 text-xs font-accent">EARNINGS</div>
                </div>
                <p className="text-white/80 text-sm font-heading mb-1">Total Earnings</p>
                <p className="text-5xl font-display font-bold text-white mb-2">£{loadingStats ? '...' : earnings.toFixed(2)}</p>
                <div className="h-1 w-16 bg-white/30 rounded-full"></div>
              </div>
            </div>

            {/* Total Bookings Card */}
            <div className="bg-gradient-sunset p-6 rounded-2xl shadow-xl magnetic-hover tilt-3d overflow-hidden relative animate-staggered-fade-in delay-2">
              <div className="absolute top-0 left-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl float-gentle">
                    <Icon name="ClipboardDocumentCheckIcon" size={24} className="text-white" />
                  </div>
                  <div className="text-white/60 text-xs font-accent">ALL TIME</div>
                </div>
                <p className="text-white/80 text-sm font-heading mb-1">Total Bookings</p>
                <p className="text-5xl font-display font-bold text-white mb-2">{loadingStats ? '...' : bookings.length}</p>
                <div className="h-1 w-16 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="ClockIcon" size={24} className="text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-text-secondary text-sm">Availability</p>
              <p className="text-2xl font-bold text-text-primary">Open</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/provider/availability')}
            className="mt-4 text-accent hover:underline text-sm font-medium"
          >
            Update schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-primary">Upcoming Bookings</h2>
              <button
                onClick={() => router.push('/dashboard/provider/bookings')}
                className="text-accent hover:underline text-sm font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-4">
              {loadingStats ? (
                <p>Loading bookings...</p>
              ) : bookings.length > 0 ? (
                bookings.slice(0, 5).map((booking: any) => (
                  <div key={booking.id} className="p-4 border-b border-border last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{booking.services?.name || 'Service'}</h3>
                        <p className="text-sm text-text-secondary">{booking.profiles?.full_name || 'Customer'}</p>
                        <p className="text-sm text-text-secondary">
                          {new Date(booking.scheduled_date).toLocaleDateString()} at {new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${booking.status === 'completed' ? 'bg-success/10 text-success' :
                        booking.status === 'in_progress' ? 'bg-accent/10 text-accent' :
                          booking.status === 'confirmed' ? 'bg-info/10 text-info' :
                            booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                              'bg-error/10 text-error'
                        }`}>
                        {booking.status.replace('_', ' ').charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="flex gap-2">
                      {getNextStatus(booking.status) && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, getNextStatus(booking.status) as any)}
                          disabled={updatingStatus === booking.id}
                          className="px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 hover:bg-accent/20 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === booking.id ? 'Updating...' : `Mark as ${getNextStatus(booking.status)?.replace('_', ' ')}`}
                        </button>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          disabled={updatingStatus === booking.id}
                          className="px-3 py-1.5 text-xs font-medium text-error bg-error/10 hover:bg-error/20 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-text-secondary">No upcoming bookings found.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-bold text-text-primary mb-6">Service Actions</h2>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/provider/services')}
                className="w-full py-3 px-4 text-left text-text-primary hover:bg-surface rounded-lg transition-smooth"
              >
                <div className="flex items-center">
                  <Icon name="WrenchScrewdriverIcon" size={20} className="text-accent mr-3" />
                  <span>Manage Services</span>
                </div>
              </button>

              <button
                onClick={() => router.push('/dashboard/provider/availability')}
                className="w-full py-3 px-4 text-left text-text-primary hover:bg-surface rounded-lg transition-smooth"
              >
                <div className="flex items-center">
                  <Icon name="CalendarDaysIcon" size={20} className="text-accent mr-3" />
                  <span>Update Availability</span>
                </div>
              </button>

              <button
                onClick={() => router.push('/onboarding/provider')}
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
  );
}