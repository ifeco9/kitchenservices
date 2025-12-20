import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HowItWorksInteractive from './components/HowItWorksInteractive';

export const metadata: Metadata = {
  title: 'How It Works - KitchenServices',
  description: 'Learn how KitchenServices connects homeowners with verified kitchen appliance technicians through our transparent platform. Discover the complete journey for both customers seeking services and technicians growing their business.',
};

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <HowItWorksInteractive />
    </>
  );
}