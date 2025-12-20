'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileHeader from './ProfileHeader';
import ReviewCard from './ReviewCard';
import AvailabilityCalendar from './AvailabilityCalendar';
import PricingTable from './PricingTable';
import QuoteRequestForm from './QuoteRequestForm';
import WorkGallery from './WorkGallery';
import ServiceAreaMap from './ServiceAreaMap';
import Icon from '@/components/ui/AppIcon';

interface Certification {
  name: string;
  issuer: string;
  verified: boolean;
  renewalDate: string;
}

interface ProfileData {
  name: string;
  image: string;
  alt: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  yearsExperience: number;
  certifications: Certification[];
  responseRate: number;
  repeatCustomerRate: number;
  availability: 'available' | 'limited' | 'booked';
}

interface Review {
  id: number;
  customerName: string;
  rating: number;
  date: string;
  serviceType: string;
  comment: string;
  verified: boolean;
  technicianResponse?: string;
  responseDate?: string;
}

interface ServicePrice {
  service: string;
  description: string;
  price: string;
  icon: string;
}

interface PricingData {
  hourlyRate: number;
  callOutFee: number;
  emergencyRate: number;
  services: ServicePrice[];
}

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  title: string;
  category: string;
}

interface ServiceArea {
  postcode: string;
  area: string;
  travelFee: number;
}

interface QuoteFormData {
  applianceType: string;
  issueDescription: string;
  urgency: string;
  preferredDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const TechnicianProfilesInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability' | 'pricing'>('overview');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const profileData: ProfileData = {
    name: "James Mitchell",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cc799725-1763296945986.png",
    alt: "Professional headshot of middle-aged Caucasian man with short grey hair wearing navy blue work uniform with company logo",
    specialization: "Gas Safe Registered Engineer - Kitchen Appliance Specialist",
    rating: 4.9,
    reviewCount: 247,
    completedJobs: 1842,
    yearsExperience: 15,
    certifications: [
    { name: "Gas Safe Register", issuer: "Gas Safe Register", verified: true, renewalDate: "15/08/2025" },
    { name: "City & Guilds Level 3", issuer: "City & Guilds", verified: true, renewalDate: "22/11/2024" },
    { name: "Public Liability Insurance", issuer: "Aviva Insurance", verified: true, renewalDate: "01/03/2025" },
    { name: "Electrical Installation", issuer: "NICEIC", verified: true, renewalDate: "10/06/2025" }],

    responseRate: 98,
    repeatCustomerRate: 76,
    availability: 'available'
  };

  const reviews: Review[] = [
  {
    id: 1,
    customerName: "Sarah Thompson",
    rating: 5,
    date: "12/12/2024",
    serviceType: "Oven Repair",
    comment: "James was absolutely brilliant! My oven stopped working completely and he diagnosed the issue within minutes. He had the part in his van and fixed it on the spot. Very professional, clean, and explained everything clearly. Highly recommend!",
    verified: true,
    technicianResponse: "Thank you so much for your kind words, Sarah! I'm delighted I could get your oven working again quickly. It's always satisfying when I have the right part on hand. Please don't hesitate to contact me if you need anything else.",
    responseDate: "13/12/2024"
  },
  {
    id: 2,
    customerName: "Michael Chen",
    rating: 5,
    date: "08/12/2024",
    serviceType: "Dishwasher Installation",
    comment: "Excellent service from start to finish. James arrived on time, installed our new dishwasher perfectly, and even gave us tips on maintaining it. The price was very reasonable too. Will definitely use again.",
    verified: true,
    technicianResponse: "Thanks Michael! Glad I could help with the installation. Those maintenance tips should keep your dishwasher running smoothly for years. Enjoy!",
    responseDate: "09/12/2024"
  },
  {
    id: 3,
    customerName: "Emma Roberts",
    rating: 5,
    date: "03/12/2024",
    serviceType: "Gas Cooker Service",
    comment: "James provided an annual service for our gas cooker. He was thorough, professional, and took the time to check everything carefully. Great value for money and peace of mind knowing it's been done properly.",
    verified: true
  },
  {
    id: 4,
    customerName: "David Wilson",
    rating: 4,
    date: "28/11/2024",
    serviceType: "Refrigerator Repair",
    comment: "Good service overall. James identified the problem with our fridge and ordered the part. Came back a few days later to fit it. Only minor issue was communication about the return visit could have been clearer, but the repair itself was excellent.",
    verified: true,
    technicianResponse: "Thank you for the feedback, David. I apologize for any confusion about the follow-up visit. I've since improved my communication system to ensure customers are kept fully informed. Glad your fridge is working well now!",
    responseDate: "29/11/2024"
  }];


  const pricingData: PricingData = {
    hourlyRate: 65,
    callOutFee: 45,
    emergencyRate: 95,
    services: [
    {
      service: "Oven Repair",
      description: "Diagnosis and repair of electric and gas ovens",
      price: "From £85",
      icon: "FireIcon"
    },
    {
      service: "Dishwasher Service",
      description: "Installation, repair, and maintenance",
      price: "From £75",
      icon: "WrenchScrewdriverIcon"
    },
    {
      service: "Gas Safety Check",
      description: "Annual gas appliance safety inspection",
      price: "£120",
      icon: "ShieldCheckIcon"
    },
    {
      service: "Cooker Installation",
      description: "Professional installation of gas or electric cookers",
      price: "From £150",
      icon: "CogIcon"
    },
    {
      service: "Appliance Maintenance",
      description: "Preventive maintenance and servicing",
      price: "From £60",
      icon: "WrenchIcon"
    },
    {
      service: "Emergency Callout",
      description: "Same-day emergency repair service",
      price: "From £140",
      icon: "BoltIcon"
    }]

  };

  const galleryImages: GalleryImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1710498174500-d9d86543c34e",
    alt: "Before and after comparison of restored stainless steel oven interior showing clean heating elements",
    title: "Oven Deep Clean & Repair",
    category: "oven"
  },
  {
    id: 2,
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1fbff1cfc-1766004800157.png",
    alt: "Technician hands installing new dishwasher control panel with visible wiring connections",
    title: "Dishwasher Control Panel Replacement",
    category: "dishwasher"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1610528599036-3f5d7104d96e",
    alt: "Close-up of gas cooker burner being tested with blue flame showing proper installation",
    title: "Gas Cooker Installation",
    category: "cooker"
  },
  {
    id: 4,
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_178c24b82-1764666199774.png",
    alt: "Open refrigerator showing replaced compressor unit with new copper piping connections",
    title: "Refrigerator Compressor Replacement",
    category: "refrigerator"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1722152250510-711fed3f29b2",
    alt: "Modern kitchen with newly installed built-in oven and microwave combination unit",
    title: "Built-in Oven Installation",
    category: "oven"
  },
  {
    id: 6,
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_114c05179-1764831645746.png",
    alt: "Technician performing gas safety check with digital testing equipment on kitchen cooker",
    title: "Annual Gas Safety Inspection",
    category: "maintenance"
  }];


  const serviceAreas: ServiceArea[] = [
  { postcode: "SW1", area: "Westminster", travelFee: 0 },
  { postcode: "SW3", area: "Chelsea", travelFee: 0 },
  { postcode: "SW7", area: "South Kensington", travelFee: 0 },
  { postcode: "W1", area: "West End", travelFee: 10 },
  { postcode: "W2", area: "Paddington", travelFee: 10 },
  { postcode: "NW1", area: "Camden", travelFee: 15 },
  { postcode: "SE1", area: "Southwark", travelFee: 15 },
  { postcode: "E1", area: "Whitechapel", travelFee: 20 }];


  const handleSlotSelect = (date: string, time: string) => {
    if (!isHydrated) return;
    alert(`Selected slot: ${date} at ${time}\n\nIn a production environment, this would redirect to the booking page with pre-filled information.`);
  };

  const handleQuoteSubmit = (formData: QuoteFormData) => {
    if (!isHydrated) return;
    alert(`Quote request submitted!\n\nAppliance: ${formData.applianceType}\nUrgency: ${formData.urgency}\nContact: ${formData.contactName}\n\nIn a production environment, this would be sent to the technician and you would receive a confirmation email.`);
  };

  const handleBookNow = () => {
    router.push('/book-a-service');
  };

  const handleContactTechnician = () => {
    if (!isHydrated) return;
    alert('Contact options:\n\nPhone: 07XXX XXXXXX\nEmail: james.mitchell@kitchenservices.co.uk\n\nIn a production environment, this would open a messaging interface or initiate a phone call.');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="w-full px-4 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="w-full px-4 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <ProfileHeader profile={profileData} />

          <div className="bg-card rounded-lg shadow-card border border-border p-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${
                activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary hover:bg-muted'}`
                }>

                <Icon name="UserIcon" size={18} className="inline-block mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${
                activeTab === 'reviews' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary hover:bg-muted'}`
                }>

                <Icon name="StarIcon" size={18} className="inline-block mr-2" />
                Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${
                activeTab === 'availability' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary hover:bg-muted'}`
                }>

                <Icon name="CalendarIcon" size={18} className="inline-block mr-2" />
                Availability
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${
                activeTab === 'pricing' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary hover:bg-muted'}`
                }>

                <Icon name="CurrencyPoundIcon" size={18} className="inline-block mr-2" />
                Pricing
              </button>
            </div>
          </div>

          {activeTab === 'overview' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-card rounded-lg shadow-card border border-border p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">About {profileData.name}</h3>
                  <p className="text-text-primary leading-relaxed mb-4">
                    With over {profileData.yearsExperience} years of experience in kitchen appliance repair and maintenance, I pride myself on delivering exceptional service to homeowners across London. As a Gas Safe registered engineer, I specialize in the installation, repair, and servicing of all major kitchen appliances including ovens, cookers, dishwashers, and refrigerators.
                  </p>
                  <p className="text-text-primary leading-relaxed mb-4">
                    My approach is simple: arrive on time, diagnose the problem accurately, explain the issue clearly, and fix it right the first time. I carry a comprehensive range of parts in my van, which means most repairs can be completed during the initial visit, saving you time and hassle.
                  </p>
                  <p className="text-text-primary leading-relaxed">
                    Customer satisfaction is my top priority, which is reflected in my {profileData.repeatCustomerRate}% repeat customer rate. I offer transparent pricing with no hidden fees, and all work is guaranteed. Whether it's an emergency repair or planned maintenance, I'm here to help keep your kitchen running smoothly.
                  </p>
                </div>

                <WorkGallery images={galleryImages} />
                <ServiceAreaMap baseLocation="Westminster, London" serviceAreas={serviceAreas} />
              </div>

              <div className="space-y-8">
                <div className="bg-card rounded-lg shadow-card border border-border p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                    onClick={handleBookNow}
                    className="w-full px-6 py-3 text-base font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring">

                      <Icon name="CalendarIcon" size={20} className="inline-block mr-2" />
                      Book Now
                    </button>
                    <button
                    onClick={handleContactTechnician}
                    className="w-full px-6 py-3 text-base font-semibold text-primary bg-surface border border-border rounded-lg hover:bg-muted transition-smooth focus-ring">

                      <Icon name="ChatBubbleLeftRightIcon" size={20} className="inline-block mr-2" />
                      Contact Technician
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Typical Response:</span>
                      <span className="font-semibold text-text-primary">Within 2 hours</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Average Rating:</span>
                      <span className="font-semibold text-text-primary">{profileData.rating}/5.0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Jobs Completed:</span>
                      <span className="font-semibold text-text-primary">{profileData.completedJobs.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {activeTab === 'reviews' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-lg shadow-card border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-text-primary">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <Icon name="StarIcon" size={24} className="text-warning" variant="solid" />
                      <span className="text-2xl font-bold text-text-primary">{profileData.rating}</span>
                      <span className="text-sm text-text-secondary">({profileData.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {[5, 4, 3, 2, 1].map((stars) =>
                  <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">{stars}</span>
                        <Icon name="StarIcon" size={14} className="text-warning" variant="solid" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                        className="h-full bg-warning"
                        style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : stars === 3 ? 2 : stars === 2 ? 1 : 0}%` }} />

                        </div>
                      </div>
                  )}
                  </div>
                </div>

                {reviews.map((review) =>
              <ReviewCard key={review.id} review={review} />
              )}
              </div>

              <div className="space-y-8">
                <QuoteRequestForm technicianName={profileData.name} onSubmit={handleQuoteSubmit} />
              </div>
            </div>
          }

          {activeTab === 'availability' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AvailabilityCalendar onSlotSelect={handleSlotSelect} />
              </div>

              <div className="space-y-8">
                <div className="bg-card rounded-lg shadow-card border border-border p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Booking Information</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Icon name="ClockIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-text-primary mb-1">Standard Appointments</p>
                        <p className="text-text-secondary">Available Monday to Friday, 9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="BoltIcon" size={20} className="text-error flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-text-primary mb-1">Emergency Service</p>
                        <p className="text-text-secondary">Same-day appointments available for urgent repairs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="CalendarIcon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-text-primary mb-1">Weekend Bookings</p>
                        <p className="text-text-secondary">Saturday appointments available at standard rates</p>
                      </div>
                    </div>
                  </div>
                </div>

                <QuoteRequestForm technicianName={profileData.name} onSubmit={handleQuoteSubmit} />
              </div>
            </div>
          }

          {activeTab === 'pricing' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PricingTable pricing={pricingData} />
              </div>

              <div className="space-y-8">
                <div className="bg-card rounded-lg shadow-card border border-border p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                      <Icon name="CreditCardIcon" size={24} className="text-primary" />
                      <span className="text-sm text-text-primary">Credit/Debit Cards</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                      <Icon name="BanknotesIcon" size={24} className="text-primary" />
                      <span className="text-sm text-text-primary">Cash</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                      <Icon name="DevicePhoneMobileIcon" size={24} className="text-primary" />
                      <span className="text-sm text-text-primary">Bank Transfer</span>
                    </div>
                  </div>
                </div>

                <QuoteRequestForm technicianName={profileData.name} onSubmit={handleQuoteSubmit} />
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

};

export default TechnicianProfilesInteractive;