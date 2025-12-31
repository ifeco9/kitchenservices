'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import ReviewModal from '@/components/common/ReviewModal';
import { bookingService } from '@/services/bookingService';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { user, loading, signOut } = useAuth();

  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    favorites: 0 // Placeholder as we don't have favorites table yet
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const userBookings = await bookingService.getBookingsByCustomer(user.id);
          setBookings(userBookings);

          // Calculate stats
          const active = userBookings.filter((b: any) => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length;
          const upcoming = userBookings.filter((b: any) =>
            ['pending', 'confirmed'].includes(b.status) && new Date(b.scheduled_date) > new Date()
          ).length;

          setStats({
            active,
            upcoming,
            favorites: 0
          });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();
    }
  }, [user]);

  // Combined loading state
  if (loading || (user && loadingData)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="mb-8 animate-pulse">
              <div className="h-8 bg-surface rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-surface rounded w-1/4"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card p-6 rounded-xl border border-border animate-pulse">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-surface rounded-lg"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-surface rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-surface rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-4 bg-surface rounded w-1/3"></div>
                </div>
              ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card p-6 rounded-xl border border-border h-96 animate-pulse"></div>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border h-96 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.profile?.role !== 'customer') {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin');
      } else {
        router.push('/auth/role-selection');
      }
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
            <h1 className="text-3xl font-bold text-text-primary">Welcome back, {user.profile?.full_name?.split(' ')[0] || 'Customer'}!</h1>
            <p className="text-text-secondary">Here's what's happening with your account</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Booking Summary Card */}
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-subtle transition-smooth">
              <div className="flex items-center">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Icon name="CalendarIcon" size={24} className="text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Active Bookings</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.active}</p>
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
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-subtle transition-smooth">
              <div className="flex items-center">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Icon name="ClockIcon" size={24} className="text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Upcoming Service</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.upcoming}</p>
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
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-subtle transition-smooth">
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="HeartIcon" size={24} className="text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Favorite Technicians</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.favorites}</p>
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
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-surface/50 transition-smooth rounded-lg">
                      <div>
                        <h3 className="font-medium text-text-primary">{booking.services?.name || 'Service'}</h3>
                        <p className="text-sm text-text-secondary">with {booking.technicians?.full_name || 'Technician'}</p>
                        <p className="text-sm text-text-secondary">
                          {new Date(booking.scheduled_date).toLocaleDateString()} at {new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${booking.status === 'completed' ? 'bg-success/10 text-success' :
                            booking.status === 'confirmed' ? 'bg-accent/10 text-accent' :
                              booking.status === 'cancelled' ? 'bg-error/10 text-error' :
                                'bg-warning/10 text-warning'
                          }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => {
                              setSelectedBooking({
                                id: booking.id,
                                technicianId: booking.technician_id,
                                technicianName: booking.technicians?.full_name
                              });
                              setIsReviewOpen(true);
                            }}
                            className="text-xs font-semibold text-accent hover:underline"
                          >
                            Write a Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <div className="text-center py-8 text-text-secondary">
                      No bookings found. <br />
                      <button onClick={() => router.push('/book-a-service')} className="text-accent hover:underline mt-2">Book your first service!</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-bold text-text-primary mb-6">Account Actions</h2>

                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/book-a-service')}
                    className="w-full py-3 px-4 text-left text-text-primary hover:bg-surface rounded-lg transition-smooth border border-transparent hover:border-border"
                  >
                    <div className="flex items-center">
                      <Icon name="PlusCircleIcon" size={20} className="text-accent mr-3" />
                      <span>Book New Service</span>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/find-a-technician')}
                    className="w-full py-3 px-4 text-left text-text-primary hover:bg-surface rounded-lg transition-smooth border border-transparent hover:border-border"
                  >
                    <div className="flex items-center">
                      <Icon name="MagnifyingGlassIcon" size={20} className="text-accent mr-3" />
                      <span>Find a Technician</span>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/customer')}
                    className="w-full py-3 px-4 text-left text-text-primary hover:bg-surface rounded-lg transition-smooth border border-transparent hover:border-border"
                  >
                    <div className="flex items-center">
                      <Icon name="UserCircleIcon" size={20} className="text-accent mr-3" />
                      <span>Profile Settings</span>
                    </div>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 px-4 text-left text-error hover:bg-error/5 rounded-lg transition-smooth border border-transparent hover:border-error/20"
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

      {user && (
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          bookingId={selectedBooking?.id || ''}
          technicianId={selectedBooking?.technicianId || ''}
          technicianName={selectedBooking?.technicianName || ''}
          customerId={user.id}
        />
      )}
    </div>
  );
}