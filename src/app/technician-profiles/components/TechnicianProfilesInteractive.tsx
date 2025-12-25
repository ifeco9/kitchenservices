'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfileHeader from './ProfileHeader';
import ReviewCard from './ReviewCard';
import AvailabilityCalendar from './AvailabilityCalendar';
import PricingTable from './PricingTable';
import QuoteRequestForm from './QuoteRequestForm';
import WorkGallery from './WorkGallery';
import ServiceAreaMap from './ServiceAreaMap';
import Icon from '@/components/ui/AppIcon';
import { Technician, Review } from '@/types';
import { profileService } from '@/services/profileService';
import { reviewService } from '@/services/reviewService';

// Extended interface for joined data (matching ReviewCard expectation)
interface ReviewWithCustomer extends Review {
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
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
  categoryName?: string; // Optional if needed
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
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability' | 'pricing'>('overview');

  const [profileData, setProfileData] = useState<Technician | null>(null);
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
    if (id) {
      fetchTechnicianData(id);
    } else {
      // Handle missing ID (maybe redirect or show error, for prototype just load first/mock logic if needed)
      // For now we'll try to fetch a default one or just show loading
      fetchTechnicianData('1'); // Generic fallback if no ID provided for demo
    }
  }, [id]);

  const fetchTechnicianData = async (techId: string) => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      // Note: If ID is '1', '2' etc from mocks, it won't exist in Supabase usually unless seeded.
      // We should handle if getTechnicianProfile fails (returns null/error).
      // Since we just migrated, we likely have UUIDs. 
      // If techId is not UUID, it might fail. 

      const tech = await profileService.getTechnicianProfile(techId);
      setProfileData(tech);

      // 2. Fetch Reviews
      const reviewsData = await reviewService.getReviewsByTechnicianId(techId);
      setReviews(reviewsData as any); // Cast for now as service returns generic data structure

    } catch (error) {
      console.error("Error fetching technician details:", error);
      // Fallback or error state
    } finally {
      setLoading(false);
    }
  };

  // Mock Pricing Data (Not in DB yet)
  const pricingData: PricingData = {
    hourlyRate: profileData?.hourly_rate || 65,
    callOutFee: profileData?.callout_fee || 45,
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
      }]
  };

  // Mock Gallery (Not in DB yet)
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
    }
  ];

  const serviceAreas: ServiceArea[] = [
    { postcode: "SW1", area: "Westminster", travelFee: 0 },
    { postcode: "SW3", area: "Chelsea", travelFee: 0 }
  ];


  const handleSlotSelect = (date: string, time: string) => {
    if (!isHydrated) return;
    alert(`Selected slot: ${date} at ${time}`);
  };

  const handleQuoteSubmit = (formData: QuoteFormData) => {
    if (!isHydrated) return;
    alert(`Quote request submitted for ${profileData?.full_name}!`);
  };

  const handleBookNow = () => {
    router.push(`/book-a-service?technician=${profileData?.id}`);
  };

  const handleContactTechnician = () => {
    if (!isHydrated) return;
    alert('Contact options:\n\nPhone: 07XXX XXXXXX\nEmail: technician@kitchenservices.co.uk');
  };

  if (!isHydrated || loading) {
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

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Technician Not Found</h2>
          <p>We couldn't find the technician you were looking for.</p>
        </div>
      </div>
    );
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
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary hover:bg-muted'}`
                }>

                <Icon name="UserIcon" size={18} className="inline-block mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${activeTab === 'reviews' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary hover:bg-muted'}`
                }>

                <Icon name="StarIcon" size={18} className="inline-block mr-2" />
                Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${activeTab === 'availability' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary hover:bg-muted'}`
                }>

                <Icon name="CalendarIcon" size={18} className="inline-block mr-2" />
                Availability
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-lg transition-smooth focus-ring ${activeTab === 'pricing' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary hover:bg-muted'}`
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
                  <h3 className="text-xl font-semibold text-text-primary mb-4">About {profileData.full_name}</h3>
                  <p className="text-text-primary leading-relaxed mb-4">
                    {profileData.bio || `With years of experience in kitchen appliance repair and maintenance, I pride myself on delivering exceptional service. As a professional engineer, I specialize in the installation, repair, and servicing of all major kitchen appliances.`}
                  </p>
                  <p className="text-text-primary leading-relaxed mb-4">
                    My approach is simple: arrive on time, diagnose the problem accurately, explain the issue clearly, and fix it right the first time.
                  </p>
                </div>

                <WorkGallery images={galleryImages} />
                <ServiceAreaMap baseLocation={profileData.address || "London"} serviceAreas={serviceAreas} />
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
                      <span className="font-semibold text-text-primary">{profileData.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Jobs Completed:</span>
                      <span className="font-semibold text-text-primary">150+</span>
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
                      <span className="text-2xl font-bold text-text-primary">{profileData.rating?.toFixed(1) || 0}</span>
                      <span className="text-sm text-text-secondary">({profileData.review_count || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                {reviews.map((review) =>
                  <ReviewCard key={review.id} review={review} />
                )}
                {reviews.length === 0 && (
                  <p className="text-text-secondary italic">No reviews yet.</p>
                )}
              </div>

              <div className="space-y-8">
                <QuoteRequestForm technicianName={profileData.full_name} onSubmit={handleQuoteSubmit} />
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
                    {/* Consistent booking info content */}
                    <div className="flex items-start gap-3">
                      <Icon name="ClockIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-text-primary mb-1">Standard Appointments</p>
                        <p className="text-text-secondary">Available Monday to Friday, 9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <QuoteRequestForm technicianName={profileData.full_name} onSubmit={handleQuoteSubmit} />
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
                  </div>
                </div>

                <QuoteRequestForm technicianName={profileData.full_name} onSubmit={handleQuoteSubmit} />
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

};

export default TechnicianProfilesInteractive;
