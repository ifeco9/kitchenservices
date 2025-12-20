import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const EmergencyCTA = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6 animate-pulse-availability">
            <Icon name="BoltIcon" size={24} className="text-accent-foreground" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Need Emergency Appliance Repair?
          </h2>
          <p className="text-lg text-primary-foreground opacity-90 max-w-2xl mx-auto mb-8">
            Our verified technicians are available 24/7 for urgent repairs. Get connected with a professional in your area within minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/book-a-service"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
            >
              <Icon name="PhoneIcon" size={20} className="mr-2" />
              Book Emergency Service
            </Link>
            <Link
              href="/find-a-technician"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-surface shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
            >
              <Icon name="MagnifyingGlassIcon" size={20} className="mr-2" />
              Find a Technician
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-primary-foreground opacity-80">
            <div className="flex items-center space-x-2">
              <Icon name="ClockIcon" size={18} />
              <span className="text-sm font-medium">Response: &lt; 2 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="ShieldCheckIcon" size={18} />
              <span className="text-sm font-medium">Verified technicians</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CurrencyPoundIcon" size={18} />
              <span className="text-sm font-medium">Transparent pricing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyCTA;