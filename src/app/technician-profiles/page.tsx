import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import TechnicianProfilesInteractive from './components/TechnicianProfilesInteractive';

export const metadata: Metadata = {
  title: 'Technician Profiles - KitchenServices',
  description: 'View comprehensive professional profiles of verified kitchen appliance technicians with certifications, customer reviews, live availability, and transparent pricing across the UK.',
};

export default function TechnicianProfilesPage() {
  return (
    <>
      <Header />
      <TechnicianProfilesInteractive />
    </>
  );
}