'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface BookingConfirmationProps {
  bookingReference: string;
  technicianName: string;
  technicianImage: string;
  technicianAlt: string;
  technicianPhone: string;
  serviceDate: string;
  serviceTime: string;
  applianceType: string;
  totalAmount: number;
}

const BookingConfirmation = ({
  bookingReference,
  technicianName,
  technicianImage,
  technicianAlt,
  technicianPhone,
  serviceDate,
  serviceTime,
  applianceType,
  totalAmount,
}: BookingConfirmationProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setIsHydrated(true);

    // Save booking to user's account if authenticated
    if (user && isHydrated) {
      saveBookingToUserAccount();
    }
  }, [user, isHydrated]);

  const saveBookingToUserAccount = () => {
    if (!user) return;

    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem(`kitchenpro_bookings_${user.id}`) || '[]');

    // Create new booking object
    const newBooking = {
      id: bookingReference,
      applianceType,
      technicianName,
      technicianPhone,
      serviceDate,
      serviceTime,
      totalAmount,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    // Add new booking to existing bookings
    const updatedBookings = [newBooking, ...existingBookings];

    // Save back to localStorage
    localStorage.setItem(`kitchenpro_bookings_${user.id}`, JSON.stringify(updatedBookings));
  };

  const formatDate = (dateString: string): string => {
    if (!isHydrated) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const preparationChecklist = [
    'Clear access to the appliance',
    'Have model number and purchase date ready',
    'Note any error codes displayed',
    'Ensure someone over 18 is present',
    'Have payment method ready if additional work needed',
  ];

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-surface rounded-lg animate-pulse" />
        <div className="h-96 bg-surface rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-4">
          <Icon name="CheckCircleIcon" size={48} variant="solid" className="text-success" />
        </div>
        <h2 className="text-3xl font-bold text-text-primary mb-2">Booking Confirmed!</h2>
        <p className="text-base text-text-secondary">Your service has been successfully scheduled</p>
      </div>

      {/* Booking Reference */}
      <div className="bg-accent/10 border-2 border-accent rounded-lg p-6 text-center">
        <p className="text-sm font-medium text-text-secondary mb-2">Booking Reference</p>
        <p className="text-2xl font-bold text-accent font-mono">{bookingReference}</p>
      </div>

      {/* Technician Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Your Technician</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-surface flex-shrink-0">
            <AppImage src={technicianImage} alt={technicianAlt} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-text-primary">{technicianName}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <Icon name="ShieldCheckIcon" size={16} className="text-accent" />
              <span className="text-sm text-text-secondary">Verified Professional</span>
            </div>
          </div>
        </div>
        <a
          href={`tel:${technicianPhone}`}
          className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-success transition-smooth focus-ring"
        >
          <Icon name="PhoneIcon" size={20} />
          <span className="font-medium">{technicianPhone}</span>
        </a>
      </div>

      {/* Service Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Service Details</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="CalendarIcon" size={20} className="text-text-secondary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">{formatDate(serviceDate)}</p>
              <p className="text-xs text-text-secondary">at {serviceTime}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="WrenchScrewdriverIcon" size={20} className="text-text-secondary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">{applianceType} Repair</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="CurrencyPoundIcon" size={20} className="text-text-secondary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">£{totalAmount.toFixed(2)}</p>
              <p className="text-xs text-text-secondary">Including VAT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Checklist */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Before Your Appointment</h3>
        <ul className="space-y-3">
          {preparationChecklist.map((item, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Icon name="CheckCircleIcon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm text-text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar Integration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-surface border border-border rounded-lg hover:bg-muted transition-smooth focus-ring"
        >
          <Icon name="CalendarIcon" size={20} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">Add to Calendar</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-surface border border-border rounded-lg hover:bg-muted transition-smooth focus-ring"
        >
          <Icon name="EnvelopeIcon" size={20} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">Email Confirmation</span>
        </button>
      </div>

      {/* View in Dashboard */}
      {user && (
        <button
          type="button"
          onClick={() => {
            if (user.role === 'technician') {
              router.push('/dashboard/provider/bookings');
            } else {
              router.push('/dashboard/customer/bookings');
            }
          }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-success transition-smooth focus-ring"
        >
          <Icon name="EyeIcon" size={20} />
          <span className="text-sm font-medium">View in Dashboard</span>
        </button>
      )}

      {/* Support Info */}
      <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-primary">
              <strong>Need to reschedule?</strong> Contact us at least 24 hours before your appointment to avoid
              cancellation fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;