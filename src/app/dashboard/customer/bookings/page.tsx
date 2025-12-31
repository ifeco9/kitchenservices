'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import { bookingService } from '@/services/bookingService';

interface Booking {
  id: string;
  applianceType: string;
  technicianName: string;
  technicianPhone: string;
  serviceDate: string;
  serviceTime: string;
  totalAmount: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function CustomerBookingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user || user.profile?.role !== 'customer') {
      if (!user) {
        router.push('/auth/signin');
      } else {
        router.push('/auth/role-selection');
      }
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await bookingService.getBookingsByCustomer(user.id);
        // Map DB structure to UI structure if needed, or update UI to match DB
        // The DB returns: { id, status, total_amount, scheduled_date, services: { name }, technicians: { full_name } }
        // The UI expects: { id, status, totalAmount, serviceDate, serviceTime, applianceType, technicianName }
        const mappedBookings = data.map((b: any) => ({
          id: b.id,
          status: b.status,
          totalAmount: b.total_amount,
          serviceDate: b.scheduled_date,
          serviceTime: new Date(b.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          applianceType: b.services?.name || 'Service',
          technicianName: b.technicians?.full_name || 'Technician',
          technicianPhone: 'N/A',
          createdAt: b.created_at
        }));
        setBookings(mappedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user, loading, router]);

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="ArrowPathIcon" size={32} className="text-text-secondary mx-auto animate-spin" />
          <p className="mt-4 text-text-secondary">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (!user || user.profile?.role !== 'customer') {
    return null;
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'scheduled': return 'bg-warning/10 text-warning';
      case 'cancelled': return 'bg-error/10 text-error';
      default: return 'bg-muted text-text-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">My Bookings</h1>
            <p className="text-text-secondary">Manage and track your service appointments</p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="CalendarIcon" size={64} className="text-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No bookings yet</h3>
              <p className="text-text-secondary mb-6">
                You haven't booked any services yet. Start by booking a service.
              </p>
              <button
                onClick={() => router.push('/book-a-service')}
                className="px-6 py-3 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta transition-smooth"
              >
                Book a Service
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-text-primary">Recent Bookings</h2>
              </div>

              <div className="divide-y divide-border">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-medium text-text-primary">{booking.applianceType} Repair</h3>
                        <p className="text-sm text-text-secondary">with {booking.technicianName}</p>
                        <p className="text-sm text-text-secondary">
                          {formatDate(booking.serviceDate)} at {booking.serviceTime}
                        </p>
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className="font-semibold text-text-primary">£{booking.totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="flex space-x-2">
                          <button className="px-3 py-1.5 text-xs font-medium text-accent bg-surface hover:bg-muted rounded-lg transition-smooth">
                            View Details
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium text-accent-foreground bg-accent hover:bg-success rounded-lg transition-smooth">
                            Contact Technician
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}