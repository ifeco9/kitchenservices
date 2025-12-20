import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import FindATechnicianInteractive from './components/FindATechnicianInteractive';

export const metadata: Metadata = {
  title: 'Find a Technician - KitchenServices',
  description: 'Search and compare verified kitchen appliance technicians in your area. Filter by availability, specialization, pricing, and certifications to find the perfect professional for your needs.',
};

export default function FindATechnicianPage() {
  return (
    <>
      <Header />
      <FindATechnicianInteractive />
    </>
  );
}