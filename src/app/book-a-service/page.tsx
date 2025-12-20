import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BookingInteractive from './components/BookingInteractive';

export const metadata: Metadata = {
  title: 'Book a Service - KitchenServices',
  description: 'Schedule your appliance repair with verified technicians. Transparent pricing, instant confirmation, and flexible scheduling for all kitchen and household appliances across the UK.',
};

export default function BookAServicePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <BookingInteractive />
      </main>
    </>
  );
}