'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ProcessStep from './ProcessStep';
import BenefitCard from './BenefitCard';
import VerificationTimeline from './VerificationTimeline';
import ComparisonTable from './ComparisonTable';
import TestimonialCard from './TestimonialCard';
import FAQAccordion from './FAQAccordion';

interface CustomerStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface TechnicianStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface TimelineStage {
  stage: string;
  title: string;
  duration: string;
  requirements: string[];
  icon: string;
}

interface ComparisonRow {
  feature: string;
  traditional: string;
  platform: string;
}

interface Testimonial {
  name: string;
  role: string;
  image: string;
  alt: string;
  quote: string;
  rating: number;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function HowItWorksInteractive() {
  const [activeTab, setActiveTab] = useState<'customers' | 'technicians'>('customers');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const customerSteps: CustomerStep[] = [
  {
    number: '1',
    title: 'Search & Discover',
    description: 'Enter your location and appliance type to find verified technicians instantly with real-time availability.',
    icon: '🔍'
  },
  {
    number: '2',
    title: 'Compare & Select',
    description: 'Review technician profiles, certifications, customer reviews, and transparent pricing to make an informed choice.',
    icon: '⚖️'
  },
  {
    number: '3',
    title: 'Book Service',
    description: 'Choose your preferred time slot and receive instant confirmation with technician contact details.',
    icon: '📅'
  },
  {
    number: '4',
    title: 'Service Completion',
    description: 'Technician arrives on time, completes the work professionally, and you receive a detailed service report.',
    icon: '✅'
  }];


  const technicianSteps: TechnicianStep[] = [
  {
    number: '1',
    title: 'Register & Verify',
    description: 'Complete our comprehensive verification process including background checks, certification validation, and insurance confirmation.',
    icon: '📝'
  },
  {
    number: '2',
    title: 'Build Profile',
    description: 'Create your professional showcase with services offered, pricing, availability, and showcase your expertise.',
    icon: '👤'
  },
  {
    number: '3',
    title: 'Receive Bookings',
    description: 'Get matched with customers in your service area based on your skills, availability, and customer preferences.',
    icon: '📲'
  },
  {
    number: '4',
    title: 'Grow Business',
    description: 'Build your reputation through customer reviews, expand your service area, and access business analytics.',
    icon: '📈'
  }];


  const customerBenefits: Benefit[] = [
  {
    icon: 'ShieldCheckIcon',
    title: 'Verified Quality',
    description: 'Every technician undergoes rigorous background checks, certification validation, and insurance verification before joining our platform.'
  },
  {
    icon: 'CurrencyPoundIcon',
    title: 'Transparent Pricing',
    description: 'See upfront pricing with no hidden fees. Compare rates across technicians and choose the best value for your needs.'
  },
  {
    icon: 'ClockIcon',
    title: 'Real-Time Availability',
    description: 'View live technician availability and book appointments instantly. No more waiting for callbacks or playing phone tag.'
  },
  {
    icon: 'StarIcon',
    title: 'Guaranteed Service',
    description: 'All work is backed by our quality guarantee. If you\'re not satisfied, we\'ll make it right or provide a full refund.'
  },
  {
    icon: 'ChatBubbleLeftRightIcon',
    title: 'Direct Communication',
    description: 'Message technicians directly through our platform. Get quick responses to questions before and after booking.'
  },
  {
    icon: 'DocumentTextIcon',
    title: 'Service Records',
    description: 'Access complete service history, invoices, and warranty information all in one place for easy reference.'
  }];


  const technicianBenefits: Benefit[] = [
  {
    icon: 'UserGroupIcon',
    title: 'Customer Acquisition',
    description: 'Get matched with customers actively seeking your services. No more expensive advertising or cold calling.'
  },
  {
    icon: 'CalendarIcon',
    title: 'Schedule Management',
    description: 'Manage your availability, bookings, and calendar in one centralized dashboard with automated reminders.'
  },
  {
    icon: 'BanknotesIcon',
    title: 'Secure Payments',
    description: 'Receive payments quickly and securely through our platform. Track earnings and manage invoices effortlessly.'
  },
  {
    icon: 'ChartBarIcon',
    title: 'Business Analytics',
    description: 'Access detailed insights on your performance, customer satisfaction, and revenue trends to grow your business.'
  },
  {
    icon: 'AcademicCapIcon',
    title: 'Professional Development',
    description: 'Access training resources, certification programs, and industry updates to enhance your skills and credentials.'
  },
  {
    icon: 'TrophyIcon',
    title: 'Reputation Building',
    description: 'Build your professional reputation through verified customer reviews and showcase your expertise to attract more clients.'
  }];


  const verificationStages: TimelineStage[] = [
  {
    stage: 'Stage 1',
    title: 'Initial Application',
    duration: '24-48 hours',
    requirements: [
    'Complete online registration form with business details',
    'Submit proof of qualifications and certifications',
    'Provide valid insurance documentation',
    'Upload professional identification documents'],

    icon: 'DocumentTextIcon'
  },
  {
    stage: 'Stage 2',
    title: 'Background Verification',
    duration: '3-5 business days',
    requirements: [
    'DBS (Disclosure and Barring Service) check completion',
    'Professional reference verification from previous clients',
    'Trade association membership validation',
    'Credit and business history review'],

    icon: 'ShieldCheckIcon'
  },
  {
    stage: 'Stage 3',
    title: 'Skills Assessment',
    duration: '1-2 business days',
    requirements: [
    'Technical competency evaluation for claimed specializations',
    'Customer service and communication assessment',
    'Safety protocol and compliance knowledge verification',
    'Platform training and onboarding completion'],

    icon: 'AcademicCapIcon'
  },
  {
    stage: 'Stage 4',
    title: 'Final Approval',
    duration: '24 hours',
    requirements: [
    'Profile review and optimization recommendations',
    'Service area and pricing structure confirmation',
    'Platform agreement and terms acceptance',
    'Account activation and welcome package delivery'],

    icon: 'CheckBadgeIcon'
  }];


  const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Technician Verification',
    traditional: 'No verification process, rely on word-of-mouth or online reviews',
    platform: 'Comprehensive background checks, certification validation, and insurance verification'
  },
  {
    feature: 'Pricing Transparency',
    traditional: 'Hidden fees, unclear pricing, surprise charges after service',
    platform: 'Upfront pricing displayed before booking with no hidden fees'
  },
  {
    feature: 'Availability',
    traditional: 'Call multiple technicians, wait for callbacks, limited scheduling options',
    platform: 'Real-time availability calendar with instant booking confirmation'
  },
  {
    feature: 'Service Guarantee',
    traditional: 'No platform protection, difficult dispute resolution',
    platform: 'Quality guarantee backed by platform with structured dispute resolution'
  },
  {
    feature: 'Communication',
    traditional: 'Phone tag, missed calls, no message history',
    platform: 'Direct messaging through platform with complete conversation history'
  },
  {
    feature: 'Payment Security',
    traditional: 'Cash or check payments, no payment protection',
    platform: 'Secure online payments with buyer and seller protection'
  }];


  const testimonials: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    role: 'Homeowner, London',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1af7ed335-1764908799246.png",
    alt: 'Professional woman with long brown hair smiling warmly at camera in bright indoor setting',
    quote: 'My dishwasher broke on a Sunday evening, and I had guests coming the next day. I found a verified technician through KitchenServices who came the very next morning. The transparent pricing and instant booking saved me so much stress!',
    rating: 5
  },
  {
    name: 'James Thompson',
    role: 'Appliance Technician, Manchester',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_116d13f35-1765612681795.png",
    alt: 'Middle-aged man with short grey hair in blue work shirt smiling confidently outdoors',
    quote: 'Joining KitchenServices transformed my business. I went from struggling to find clients to having a steady stream of bookings. The platform handles all the admin work, so I can focus on what I do best - fixing appliances.',
    rating: 5
  },
  {
    name: 'Emma Roberts',
    role: 'Property Manager, Birmingham',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f8f896f2-1763299689286.png",
    alt: 'Young professional woman with blonde hair in business attire smiling in modern office',
    quote: 'Managing 50+ rental properties means appliance issues are constant. KitchenServices gives me access to verified technicians across the city with transparent pricing. It\'s made my job so much easier and my tenants happier.',
    rating: 5
  }];


  const faqs: FAQItem[] = [
  {
    question: 'How does the verification process work for technicians?',
    answer: 'Our comprehensive verification includes DBS background checks, certification validation, insurance verification, professional reference checks, and skills assessment. The entire process takes 7-10 business days and ensures only qualified professionals join our platform.',
    category: 'Verification'
  },
  {
    question: 'What happens if I\'m not satisfied with the service?',
    answer: 'All services are backed by our quality guarantee. If you\'re not satisfied, contact our support team within 48 hours. We\'ll work with the technician to resolve the issue or arrange a re-service. If the issue cannot be resolved, you\'ll receive a full refund.',
    category: 'Service Guarantee'
  },
  {
    question: 'How is pricing determined on the platform?',
    answer: 'Technicians set their own rates based on their experience, certifications, and market conditions. All pricing is displayed upfront before booking with no hidden fees. You can compare rates across multiple technicians to find the best value for your needs.',
    category: 'Pricing'
  },
  {
    question: 'Can I book emergency services outside normal hours?',
    answer: 'Yes! Many of our technicians offer emergency services with 24/7 availability. Use the emergency service filter when searching to find technicians available for immediate assistance. Emergency rates may apply for out-of-hours services.',
    category: 'Booking'
  },
  {
    question: 'What types of appliances do technicians service?',
    answer: 'Our technicians service all major kitchen and household appliances including ovens, dishwashers, refrigerators, washing machines, dryers, microwaves, and more. Each technician\'s profile lists their specific areas of expertise and supported brands.',
    category: 'Services'
  },
  {
    question: 'How do I become a verified technician on the platform?',
    answer: 'Start by completing our online registration form with your qualifications, certifications, and insurance details. You\'ll then undergo our verification process including background checks and skills assessment. Once approved, you can start receiving bookings immediately.',
    category: 'For Technicians'
  },
  {
    question: 'What insurance coverage is required for technicians?',
    answer: 'All technicians must maintain valid public liability insurance (minimum £2 million coverage) and professional indemnity insurance. We verify insurance documentation during the verification process and require annual renewal confirmation.',
    category: 'Verification'
  },
  {
    question: 'How are payments processed and when do technicians get paid?',
    answer: 'Customers pay securely through our platform at the time of booking. Technicians receive payment within 2-3 business days after service completion and customer confirmation. All transactions are protected by our secure payment system.',
    category: 'Pricing'
  },
  {
    question: 'Can I reschedule or cancel a booking?',
    answer: 'Yes, you can reschedule or cancel bookings through your account dashboard. Free cancellation is available up to 24 hours before the scheduled service. Cancellations within 24 hours may incur a cancellation fee as specified in the booking terms.',
    category: 'Booking'
  },
  {
    question: 'What certifications do technicians need to have?',
    answer: 'Required certifications vary by specialization. Gas appliance technicians must be Gas Safe registered. Electrical appliance technicians need relevant electrical qualifications. All certifications are verified during our onboarding process and must be kept current.',
    category: 'Verification'
  },
  {
    question: 'How does the review system work?',
    answer: 'After each service, customers can leave a detailed review including ratings for quality, professionalism, and value. Reviews are verified to ensure authenticity. Technicians can respond to reviews, and consistently high ratings improve their visibility on the platform.',
    category: 'Service Guarantee'
  },
  {
    question: 'What support is available if I have issues during a booking?',
    answer: 'Our customer support team is available via phone, email, and live chat during business hours. For urgent issues during a service, use the in-app emergency contact feature to reach our support team immediately for assistance.',
    category: 'Service Guarantee'
  }];


  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16" />
        <div className="animate-pulse">
          <div className="h-96 bg-muted" />
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="h-8 bg-muted rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) =>
              <div key={i} className="h-48 bg-muted rounded-lg" />
              )}
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground pt-32 pb-20 overflow-hidden">
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-100">
            How KitchenServices Works
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-8">
            Connecting homeowners with verified kitchen appliance technicians through a transparent, efficient, and trustworthy platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-a-technician"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth">

              <Icon name="MagnifyingGlassIcon" size={20} className="mr-2" />
              Find a Technician
            </Link>
            <Link
              href="/for-technicians"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-surface shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth">

              <Icon name="BriefcaseIcon" size={20} className="mr-2" />
              Join as Technician
            </Link>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-surface border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4 py-6">
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-smooth ${
              activeTab === 'customers' ? 'bg-primary text-primary-foreground shadow-cta' : 'bg-white text-text-secondary hover:bg-muted'}`
              }>

              <Icon name="HomeIcon" size={20} />
              For Customers
            </button>
            <button
              onClick={() => setActiveTab('technicians')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-smooth ${
              activeTab === 'technicians' ? 'bg-primary text-primary-foreground shadow-cta' : 'bg-white text-text-secondary hover:bg-muted'}`
              }>

              <Icon name="WrenchScrewdriverIcon" size={20} />
              For Technicians
            </button>
          </div>
        </div>
      </section>

      {/* Customer Journey */}
      {activeTab === 'customers' &&
      <>
          {/* Process Steps */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Your Journey to Quality Service
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  From search to service completion, we make finding and booking verified technicians simple and stress-free
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                {customerSteps.map((step, index) =>
              <ProcessStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isLast={index === customerSteps.length - 1} />

              )}
              </div>
            </div>
          </section>

          {/* Customer Benefits */}
          <section className="py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Why Choose KitchenServices
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Experience the difference of a platform built around trust, transparency, and quality service
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customerBenefits.map((benefit, index) =>
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description} />

              )}
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Platform vs Traditional Methods
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  See how KitchenServices transforms the technician finding experience
                </p>
              </div>
              <div className="bg-card rounded-lg shadow-card overflow-hidden">
                <ComparisonTable rows={comparisonRows} />
              </div>
            </div>
          </section>

          {/* Customer Testimonials */}
          <section className="py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  What Our Customers Say
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Real experiences from homeowners who found quality service through our platform
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.filter((t) => t.role.includes('Homeowner') || t.role.includes('Property Manager')).map((testimonial, index) =>
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                image={testimonial.image}
                alt={testimonial.alt}
                quote={testimonial.quote}
                rating={testimonial.rating} />

              )}
              </div>
            </div>
          </section>
        </>
      }

      {/* Technician Journey */}
      {activeTab === 'technicians' &&
      <>
          {/* Process Steps */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Your Path to Business Growth
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  From registration to thriving business, we support your professional journey every step of the way
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                {technicianSteps.map((step, index) =>
              <ProcessStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isLast={index === technicianSteps.length - 1} />

              )}
              </div>
            </div>
          </section>

          {/* Verification Timeline */}
          <section className="py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Verification Process Timeline
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Our comprehensive verification ensures only qualified professionals join the platform
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <VerificationTimeline stages={verificationStages} />
              </div>
            </div>
          </section>

          {/* Technician Benefits */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Platform Benefits for Technicians
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Grow your business with tools and support designed for professional success
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technicianBenefits.map((benefit, index) =>
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description} />

              )}
              </div>
            </div>
          </section>

          {/* Technician Testimonial */}
          <section className="py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Success Stories from Our Technicians
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Hear from professionals who transformed their business through our platform
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                {testimonials.filter((t) => t.role.includes('Technician')).map((testimonial, index) =>
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                image={testimonial.image}
                alt={testimonial.alt}
                quote={testimonial.quote}
                rating={testimonial.rating} />

              )}
              </div>
            </div>
          </section>
        </>
      }

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Find answers to common questions about our platform, services, and processes
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            {activeTab === 'customers' ? 'Find a verified technician for your appliance needs today' : 'Join our network of professional technicians and grow your business'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {activeTab === 'customers' ?
            <>
                <Link
                href="/find-a-technician"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth">

                  <Icon name="MagnifyingGlassIcon" size={20} className="mr-2" />
                  Find a Technician
                </Link>
                <Link
                href="/book-a-service"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-surface shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth">

                  <Icon name="CalendarIcon" size={20} className="mr-2" />
                  Book Emergency Service
                </Link>
              </> :

            <>
                <Link
                href="/for-technicians"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth">

                  <Icon name="UserPlusIcon" size={20} className="mr-2" />
                  Register as Technician
                </Link>
                <button
                onClick={() => setActiveTab('customers')}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-surface shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth">

                  <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                  View Customer Journey
                </button>
              </>
            }
          </div>
        </div>
      </section>
    </div>);

}