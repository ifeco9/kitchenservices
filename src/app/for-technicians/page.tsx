import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HeroSection from './components/HeroSection';
import BenefitsComparison from './components/BenefitsComparison';
import OnboardingChecklist from './components/OnboardingChecklist';
import RegistrationForm from './components/RegistrationForm';
import ResourceLibrary from './components/ResourceLibrary';
import PerformanceDashboard from './components/PerformanceDashboard';
import SuccessStories from './components/SuccessStories';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'For Technicians - KitchenServices',
  description: 'Join the UK\'s most trusted platform for kitchen and appliance technicians. Get verified once, get booked consistently. Access business growth tools, automated booking management, and guaranteed payment protection.',
};

export default function ForTechniciansPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <HeroSection />
        <BenefitsComparison />
        <OnboardingChecklist />
        <RegistrationForm />
        <PerformanceDashboard />
        <ResourceLibrary />
        <SuccessStories />
        <Footer />
      </div>
    </main>
  );
}