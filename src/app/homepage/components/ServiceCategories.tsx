import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
}

const ServiceCategories = () => {
  const categories: ServiceCategory[] = [
    {
      id: '1',
      title: 'Emergency Repair',
      description: 'Urgent appliance failures requiring immediate attention with same-day service availability',
      icon: 'BoltIcon',
      href: '/book-a-service',
      badge: '24/7 Available'
    },
    {
      id: '2',
      title: 'Planned Maintenance',
      description: 'Scheduled servicing to keep your appliances running efficiently and prevent breakdowns',
      icon: 'CalendarDaysIcon',
      href: '/book-a-service'
    },
    {
      id: '3',
      title: 'Appliance Installation',
      description: 'Professional installation services for new kitchen appliances with warranty protection',
      icon: 'WrenchScrewdriverIcon',
      href: '/book-a-service'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            How Can We Help You Today?
          </h2>
          <p className="text-lg text-text-secondary">
            Choose the service that matches your needs and connect with verified technicians instantly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group bg-white border border-border rounded-xl p-6 hover:border-accent transition-smooth block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-surface group-hover:bg-accent rounded-lg transition-smooth flex-shrink-0">
                  <Icon
                    name={category.icon as any}
                    size={24}
                    className="text-primary group-hover:text-accent-foreground transition-smooth"
                  />
                </div>
                {category.badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                    {category.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-smooth">
                {category.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{category.description}</p>

              <div className="flex items-center text-accent text-sm font-medium group-hover:translate-x-1 transition-smooth">
                <span>Book Now</span>
                <Icon name="ArrowRightIcon" size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;