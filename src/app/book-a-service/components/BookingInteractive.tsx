'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import ServiceDetailsForm from './ServiceDetailsForm';
import AddressForm, { AddressData } from './AddressForm';
import TechnicianSelectionCard from './TechnicianSelectionCard';
import SchedulingCalendar from './SchedulingCalendar';
import PricingBreakdown from './PricingBreakdown';
import PaymentForm from './PaymentForm';
import BookingConfirmation from './BookingConfirmation';
import { profileService } from '@/services/profileService';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { serviceService } from '@/services/serviceService';

interface ServiceDetails {
  applianceType: string;
  brand: string;
  modelNumber: string;
  problemDescription: string;
  isEmergency: boolean;
}

// Extension of the global Technician type for UI purposes if needed,
// but for now we try to map to what the UI expects or update the UI to use the global type.
// However, the UI components (TechnicianSelectionCard) might expect specific props.
// Let's assume we pass the global Technician (with some extensions if needed)
interface UITechnician {
  id: number;
  name: string;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  responseTime: string;
  completedJobs: number;
  verified: boolean;
  callOutFee: number;
  hourlyRate: number;
  availability: string;
  originalId?: string;
}

const BookingInteractive = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<UITechnician | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  const [technicians, setTechnicians] = useState<UITechnician[]>([]);
  const [loadingTechs, setLoadingTechs] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Fetch technicians when component mounts
    const fetchTechnicians = async () => {
      setLoadingTechs(true);
      try {
        const data = await profileService.getTechnicians();
        // Map global Technician type to UITechnician
        const mappedTechnicians: UITechnician[] = data.map(tech => ({
          id: parseInt(tech.id) || Math.floor(Math.random() * 1000),
          originalId: tech.id,
          name: tech.full_name,
          image: tech.avatar_url || '/assets/images/technicians/default.jpg',
          alt: tech.full_name,
          rating: tech.rating || 0,
          reviewCount: tech.review_count || 0,
          specializations: tech.specializations,
          responseTime: 'Contact for availability', // Not in DB schema yet
          completedJobs: 0, // Not in DB schema yet
          verified: tech.is_verified,
          callOutFee: tech.callout_fee,
          hourlyRate: tech.hourly_rate,
          availability: tech.availability_status
        }));
        setTechnicians(mappedTechnicians);
      } catch (error) {
        console.error('Failed to fetch technicians', error);
      } finally {
        setLoadingTechs(false);
      }
    };

    fetchTechnicians();
  }, []);

  const steps = [
    { number: 1, label: 'Service Details', icon: 'ClipboardDocumentListIcon' },
    { number: 2, label: 'Address', icon: 'MapPinIcon' },
    { number: 3, label: 'Select Technician', icon: 'UserIcon' },
    { number: 4, label: 'Schedule', icon: 'CalendarIcon' },
    { number: 5, label: 'Payment', icon: 'CreditCardIcon' },
    { number: 6, label: 'Confirmation', icon: 'CheckCircleIcon' }];


  const handleServiceDetailsSubmit = (data: ServiceDetails) => {
    setServiceDetails(data);
    setCurrentStep(2);
  };

  const handleAddressSubmit = (data: AddressData) => {
    setAddress(data);
    setCurrentStep(3);
  };

  const handleTechnicianSelect = (technician: UITechnician) => {
    setSelectedTechnician(technician);
  };

  const handleScheduleSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    if (!user || !selectedTechnician || !serviceDetails) {
      // Handle unauthenticated case or missing data
      // For now, valid user required
      if (!user) {
        alert('Please sign in to complete your booking');
        return;
      }
      return;
    }

    try {
      // Get service based on appliance type
      const service = await serviceService.getServiceByApplianceType(serviceDetails.applianceType);

      if (!service) {
        alert('Service not available for this appliance type. Please contact support.');
        return;
      }

      const booking = await bookingService.createBooking({
        customer_id: user.id,
        technician_id: selectedTechnician.originalId || '',
        service_id: service.id,
        status: 'confirmed',
        scheduled_date: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
        total_amount: calculateTotal(),
        description: `${serviceDetails.applianceType} - ${serviceDetails.problemDescription}`,
        address: address ? `${address.addressLine1}, ${address.addressLine2 ? address.addressLine2 + ', ' : ''}${address.city}, ${address.postcode}` : 'Address not provided',
      });

      setBookingReference(booking.id.slice(0, 8).toUpperCase());
      setCurrentStep(6);
    } catch (error: any) {
      console.error('Booking failed', error);
      alert(error.message || 'Booking failed. Please try again.');
    }
  };

  const canProceedToSchedule = selectedTechnician !== null;
  const canProceedToPayment = selectedDate && selectedTime;

  const calculateTotal = (): number => {
    if (!selectedTechnician) return 0;
    const estimatedHours = 2;
    const partsEstimate = 50.0;
    const emergencySurcharge = serviceDetails?.isEmergency ? 25.0 : 0;
    const subtotal =
      selectedTechnician.callOutFee + // Note: ensure types match (camelCase vs snake_case mapping might be needed if not done in service)
      selectedTechnician.hourlyRate * estimatedHours +
      partsEstimate +
      emergencySurcharge;
    const vat = subtotal * 0.2;
    return subtotal + vat;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Steps */}
      {currentStep < 5 &&
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              {steps.slice(0, 4).map((step, index) =>
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-smooth ${currentStep >= step.number ?
                        'bg-accent text-accent-foreground' :
                        'bg-surface text-text-secondary'}`
                      }>

                      {currentStep > step.number ?
                        <Icon name="CheckIcon" size={20} /> :

                        <Icon name={step.icon as any} size={20} />
                      }
                    </div>
                    <div className="hidden sm:block">
                      <p
                        className={`text-sm font-medium ${currentStep >= step.number ? 'text-text-primary' : 'text-text-secondary'}`
                        }>

                        {step.label}
                      </p>
                    </div>
                  </div>
                  {index < 3 &&
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-smooth ${currentStep > step.number ? 'bg-accent' : 'bg-border'}`
                      } />

                  }
                </div>
              )}
            </div>
          </div>
        </div>
      }

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Service Details */}
        {currentStep === 1 &&
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Service Details</h1>
              <p className="text-base text-text-secondary">Tell us about your appliance and the issue you're experiencing</p>
            </div>
            <ServiceDetailsForm onNext={handleServiceDetailsSubmit} />
          </div>
        }

        {/* Step 2: Address */}
        {currentStep === 2 &&
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Service Address</h1>
              <p className="text-base text-text-secondary">Where should the technician visit?</p>
            </div>
            <AddressForm
              onNext={handleAddressSubmit}
              onBack={() => setCurrentStep(1)}
              initialAddress={address || undefined}
            />
          </div>
        }

        {/* Step 3: Technician Selection */}
        {currentStep === 3 &&
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Select Your Technician</h1>
              <p className="text-base text-text-secondary">
                Choose from our verified professionals available for {serviceDetails?.applianceType} repairs
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {loadingTechs ? (
                <div className="col-span-2 text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-text-secondary">Loading available technicians...</p>
                </div>
              ) : technicians.length > 0 ? (
                technicians.map((technician) =>
                  <TechnicianSelectionCard
                    key={technician.id}
                    technician={technician}
                    isSelected={selectedTechnician?.id === technician.id}
                    onSelect={() => handleTechnicianSelect(technician)} />
                )
              ) : (
                <div className="col-span-2 text-center py-8 bg-surface rounded-lg">
                  <p className="text-text-secondary">No technicians found. Please try again later.</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary bg-surface rounded-lg hover:bg-muted transition-smooth focus-ring">

                <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                disabled={!canProceedToSchedule}
                className={`inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${canProceedToSchedule ?
                  'text-accent-foreground bg-accent hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5' :
                  'text-text-secondary bg-muted cursor-not-allowed opacity-50'}`
                }>

                Continue to Schedule
                <Icon name="ArrowRightIcon" size={20} className="ml-2" />
              </button>
            </div>
          </div>
        }

        {/* Step 4: Scheduling */}
        {currentStep === 4 &&
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Schedule Your Service</h1>
              <p className="text-base text-text-secondary">Select your preferred date and time slot</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <SchedulingCalendar
                  onSelectSlot={handleScheduleSelect}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime} />

              </div>
              <div className="lg:col-span-1">
                {selectedTechnician &&
                  <PricingBreakdown
                    callOutFee={selectedTechnician.callOutFee}
                    hourlyRate={selectedTechnician.hourlyRate}
                    estimatedHours={2}
                    partsEstimate={50.0}
                    isEmergency={serviceDetails?.isEmergency || false} />

                }
              </div>
            </div>
            <div className="flex items-center justify-between max-w-2xl mx-auto mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary bg-surface rounded-lg hover:bg-muted transition-smooth focus-ring">

                <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                disabled={!canProceedToPayment}
                className={`inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${canProceedToPayment ?
                  'text-accent-foreground bg-accent hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5' :
                  'text-text-secondary bg-muted cursor-not-allowed opacity-50'}`
                }>

                Continue to Payment
                <Icon name="ArrowRightIcon" size={20} className="ml-2" />
              </button>
            </div>
          </div>
        }

        {/* Step 5: Payment */}
        {currentStep === 5 &&
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Payment Details</h1>
              <p className="text-base text-text-secondary">Secure payment to confirm your booking</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PaymentForm onSubmit={handlePaymentSubmit} totalAmount={calculateTotal()} />
              </div>
              <div className="lg:col-span-1">
                {selectedTechnician &&
                  <PricingBreakdown
                    callOutFee={selectedTechnician.callOutFee}
                    hourlyRate={selectedTechnician.hourlyRate}
                    estimatedHours={2}
                    partsEstimate={50.0}
                    isEmergency={serviceDetails?.isEmergency || false} />

                }
              </div>
            </div>
            <div className="flex items-center justify-start max-w-2xl mx-auto mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary bg-surface rounded-lg hover:bg-muted transition-smooth focus-ring">

                <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                Back
              </button>
            </div>
          </div>
        }

        {/* Step 6: Confirmation */}
        {currentStep === 6 && selectedTechnician &&
          <div className="max-w-2xl mx-auto">
            <BookingConfirmation
              bookingReference={bookingReference}
              technicianName={selectedTechnician.name}
              technicianImage={selectedTechnician.image}
              technicianAlt={selectedTechnician.alt}
              technicianPhone="+44 7700 900123"
              serviceDate={selectedDate}
              serviceTime={selectedTime}
              applianceType={serviceDetails?.applianceType || ''}
              totalAmount={calculateTotal()} />

          </div>
        }
      </div>
    </div>);

};

export default BookingInteractive;