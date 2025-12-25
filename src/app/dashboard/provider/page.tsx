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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">Welcome back, {user?.profile?.full_name || user?.email || 'Provider'}!</h1>
            <p className="text-text-secondary">Here's what's happening with your service profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Today's Bookings Card */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Icon name="CalendarIcon" size={24} className="text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Today's Bookings</p>
                  <p className="text-2xl font-bold text-text-primary">{loadingStats ? '...' : todayCount}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/provider/bookings')}
                className="mt-4 text-accent hover:underline text-sm font-medium"
              >
                View all bookings
              </button>
            </div>

            {/* Earnings Card */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Icon name="CurrencyPoundIcon" size={24} className="text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-text-primary">£{loadingStats ? '...' : earnings.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/provider')}
                className="mt-4 text-accent hover:underline text-sm font-medium"
              >
                View earnings
              </button>
            </div>

            {/* Availability Card */}
            <div className="bg-card p-6 rounded-xl border border-border">
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
                      <div key={booking.id} className="flex items-center justify-between p-4 border-b border-border last:border-0">
                        <div>
                          <h3 className="font-medium text-text-primary">{booking.services?.name || 'Service'}</h3>
                          <p className="text-sm text-text-secondary">{booking.profiles?.full_name || 'Customer'}</p>
                          <p className="text-sm text-text-secondary">
                            {new Date(booking.scheduled_date).toLocaleDateString()} at {new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                            booking.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-surface text-text-secondary'
                          }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
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
                    onClick={() => router.push('/dashboard/provider')}
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