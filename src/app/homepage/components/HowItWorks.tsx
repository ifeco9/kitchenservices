import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

const HowItWorks = () => {
  const steps: Step[] = [
    {
      id: '1',
      number: '01',
      title: 'Search & Compare',
      description: 'Enter your location and service needs to find verified technicians with real-time availability',
      icon: 'MagnifyingGlassIcon'
    },
    {
      id: '2',
      number: '02',
      title: 'Book Instantly',
      description: 'Choose your preferred technician, select a time slot, and receive instant confirmation',
      icon: 'CalendarIcon'
    },
    {
      id: '3',
      number: '03',
      title: 'Get Expert Service',
      description: 'Your verified technician arrives on time with transparent pricing and guaranteed quality',
      icon: 'CheckCircleIcon'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Getting Help Is Simple
          </h2>
          <p className="text-lg text-text-secondary">
            From search to service completion in three easy steps
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative pl-8 border-l-2 border-border">
            {steps.map((step, index) => (
              <div key={step.id} className="relative mb-12 last:mb-0">
                {/* Timeline Dot */}
                <div className="absolute -left-11 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">{step.number.replace('0', '')}</span>
                </div>
                
                <div className="bg-white border border-border rounded-xl p-6 shadow-card hover:shadow-lg transition-smooth">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                      <Icon name={step.icon as any} size={20} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">{step.title}</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/how-it-works"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
          >
            <span>Learn More About Our Process</span>
            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;