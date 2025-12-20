'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import ServiceDetailsForm from './ServiceDetailsForm';
import TechnicianSelectionCard from './TechnicianSelectionCard';
import SchedulingCalendar from './SchedulingCalendar';
import PricingBreakdown from './PricingBreakdown';
import PaymentForm from './PaymentForm';
import BookingConfirmation from './BookingConfirmation';

interface ServiceDetails {
  applianceType: string;
  brand: string;
  modelNumber: string;
  problemDescription: string;
  isEmergency: boolean;
}

interface Technician {
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
}

interface PaymentData {
  method: 'card' | 'wallet' | 'bank';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

const BookingInteractive = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  const mockTechnicians: Technician[] = [
  {
    id: 1,
    name: 'James Mitchell',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_137ad5a3e-1765083592272.png",
    alt: 'Professional male technician in blue work uniform with tool belt smiling at camera',
    rating: 4.9,
    reviewCount: 127,
    specializations: ['Ovens', 'Dishwashers', 'Cookers'],
    responseTime: '< 2 hours',
    completedJobs: 342,
    verified: true,
    callOutFee: 45.0,
    hourlyRate: 65.0,
    availability: 'Available Today'
  },
  {
    id: 2,
    name: 'Sarah Thompson',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_114ac8752-1765411898682.png",
    alt: 'Female technician with short brown hair in grey work shirt holding clipboard',
    rating: 4.8,
    reviewCount: 98,
    specializations: ['Washing Machines', 'Dryers', 'Refrigerators'],
    responseTime: '< 3 hours',
    completedJobs: 276,
    verified: true,
    callOutFee: 40.0,
    hourlyRate: 60.0,
    availability: 'Available Tomorrow'
  },
  {
    id: 3,
    name: 'David Chen',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1400c8def-1764831644737.png",
    alt: 'Asian male technician in navy blue uniform with safety glasses around neck',
    rating: 4.9,
    reviewCount: 156,
    specializations: ['All Appliances', 'Emergency Repairs'],
    responseTime: '< 1 hour',
    completedJobs: 421,
    verified: true,
    callOutFee: 50.0,
    hourlyRate: 70.0,
    availability: 'Available Now'
  }];


  const steps = [
  { number: 1, label: 'Service Details', icon: 'ClipboardDocumentListIcon' },
  { number: 2, label: 'Select Technician', icon: 'UserIcon' },
  { number: 3, label: 'Schedule', icon: 'CalendarIcon' },
  { number: 4, label: 'Payment', icon: 'CreditCardIcon' },
  { number: 5, label: 'Confirmation', icon: 'CheckCircleIcon' }];


  const handleServiceDetailsSubmit = (data: ServiceDetails) => {
    setServiceDetails(data);
    setCurrentStep(2);
  };

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
  };

  const handleScheduleSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handlePaymentSubmit = (paymentData: PaymentData) => {
    // Generate booking reference
    const reference = `KS${Date.now().toString().slice(-8)}`;
    setBookingReference(reference);
    setCurrentStep(5);
  };

  const canProceedToSchedule = selectedTechnician !== null;
  const canProceedToPayment = selectedDate && selectedTime;

  const calculateTotal = (): number => {
    if (!selectedTechnician) return 0;
    const estimatedHours = 2;
    const partsEstimate = 50.0;
    const emergencySurcharge = serviceDetails?.isEmergency ? 25.0 : 0;
    const subtotal =
    selectedTechnician.callOutFee +
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
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-smooth ${
                  currentStep >= step.number ?
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
                    className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-text-primary' : 'text-text-secondary'}`
                    }>

                        {step.label}
                      </p>
                    </div>
                  </div>
                  {index < 3 &&
              <div
                className={`flex-1 h-0.5 mx-4 transition-smooth ${
                currentStep > step.number ? 'bg-accent' : 'bg-border'}`
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

        {/* Step 2: Technician Selection */}
        {currentStep === 2 &&
        <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Select Your Technician</h1>
              <p className="text-base text-text-secondary">
                Choose from our verified professionals available for {serviceDetails?.applianceType} repairs
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {mockTechnicians.map((technician) =>
            <TechnicianSelectionCard
              key={technician.id}
              technician={technician}
              isSelected={selectedTechnician?.id === technician.id}
              onSelect={() => handleTechnicianSelect(technician)} />

            )}
            </div>
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary bg-surface rounded-lg hover:bg-muted transition-smooth focus-ring">

                <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                Back
              </button>
              <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={!canProceedToSchedule}
              className={`inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${
              canProceedToSchedule ?
              'text-accent-foreground bg-accent hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5' :
              'text-text-secondary bg-muted cursor-not-allowed opacity-50'}`
              }>

                Continue to Schedule
                <Icon name="ArrowRightIcon" size={20} className="ml-2" />
              </button>
            </div>
          </div>
        }

        {/* Step 3: Scheduling */}
        {currentStep === 3 &&
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
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary bg-surface rounded-lg hover:bg-muted transition-smooth focus-ring">

                <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                Back
              </button>
              <button
              type="button"
              onClick={() => setCurrentStep(4)}
              disabled={!canProceedToPayment}
              className={`inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${
              canProceedToPayment ?
              'text-accent-foreground bg-accent hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5' :
              'text-text-secondary bg-muted cursor-not-allowed opacity-50'}`
              }>

                Continue to Payment
                <Icon name="ArrowRightIcon" size={20} className="ml-2" />
              </button>
            </div>
          </div>
        }

        {/* Step 4: Payment */}
        {currentStep === 4 &&
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

        {/* Step 5: Confirmation */}
        {currentStep === 5 && selectedTechnician &&
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