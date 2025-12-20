'use client';

import Icon from '@/components/ui/AppIcon';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'guide' | 'calculator' | 'template';
  icon: string;
  downloadSize: string;
  category: string;
}

const ResourceLibrary = () => {
  const resources: Resource[] = [
    {
      id: 1,
      title: "Business Growth Guide",
      description: "Comprehensive strategies for expanding your service offerings and increasing revenue through the platform.",
      type: "guide",
      icon: "ChartBarIcon",
      downloadSize: "2.4 MB",
      category: "Business Development"
    },
    {
      id: 2,
      title: "Pricing Calculator",
      description: "Interactive tool to help you set competitive rates based on your location, experience, and service type.",
      type: "calculator",
      icon: "CalculatorIcon",
      downloadSize: "1.2 MB",
      category: "Pricing Strategy"
    },
    {
      id: 3,
      title: "Customer Communication Templates",
      description: "Pre-written email and SMS templates for booking confirmations, follow-ups, and service reminders.",
      type: "template",
      icon: "ChatBubbleLeftRightIcon",
      downloadSize: "850 KB",
      category: "Customer Service"
    },
    {
      id: 4,
      title: "Marketing Best Practices",
      description: "Proven techniques to optimize your profile, improve search rankings, and attract more customers.",
      type: "guide",
      icon: "MegaphoneIcon",
      downloadSize: "3.1 MB",
      category: "Marketing"
    },
    {
      id: 5,
      title: "Service Area Optimizer",
      description: "Tool to analyze demand patterns and optimize your service radius for maximum booking potential.",
      type: "calculator",
      icon: "MapIcon",
      downloadSize: "1.8 MB",
      category: "Business Development"
    },
    {
      id: 6,
      title: "Invoice Templates",
      description: "Professional invoice templates with automatic calculation and VAT handling for UK businesses.",
      type: "template",
      icon: "DocumentTextIcon",
      downloadSize: "650 KB",
      category: "Financial Management"
    },
    {
      id: 7,
      title: "Customer Retention Guide",
      description: "Strategies to build long-term relationships and generate repeat bookings from satisfied customers.",
      type: "guide",
      icon: "UserGroupIcon",
      downloadSize: "2.8 MB",
      category: "Customer Service"
    },
    {
      id: 8,
      title: "Seasonal Demand Planner",
      description: "Calendar-based tool showing peak demand periods for different appliance types throughout the year.",
      type: "calculator",
      icon: "CalendarDaysIcon",
      downloadSize: "1.5 MB",
      category: "Business Planning"
    },
    {
      id: 9,
      title: "Review Response Templates",
      description: "Professional templates for responding to customer reviews, both positive and constructive feedback.",
      type: "template",
      icon: "StarIcon",
      downloadSize: "720 KB",
      category: "Customer Service"
    }
  ];

  const categories = Array.from(new Set(resources.map(r => r.category)));

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'calculator':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'template':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <Icon name="BookOpenIcon" size={20} className="text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Free Business Resources</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Resource Library
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Access our comprehensive collection of guides, calculators, and templates designed to help you grow your business and serve customers better.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg shadow-sm hover:bg-success transition-smooth focus-ring">
            All Resources
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:border-accent hover:text-accent transition-smooth focus-ring"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-surface border border-border rounded-xl p-6 hover:border-accent hover:shadow-lg transition-smooth group"
            >
              {/* Resource Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-smooth">
                  <Icon name={resource.icon as any} size={24} className="text-accent" />
                </div>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded ${getTypeColor(resource.type)}`}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
              </div>

              {/* Resource Content */}
              <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-smooth">
                {resource.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {resource.description}
              </p>

              {/* Resource Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-4 text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="FolderIcon" size={14} />
                    <span>{resource.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="ArrowDownTrayIcon" size={14} />
                    <span>{resource.downloadSize}</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button className="w-full mt-4 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition-smooth focus-ring">
                <Icon name="ArrowDownTrayIcon" size={18} className="mr-2" />
                Download
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-accent to-success rounded-2xl p-8 lg:p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Need Personalized Business Advice?
            </h3>
            <p className="text-lg text-white/90 mb-6">
              Our business development team is here to help you maximize your success on the platform. Schedule a free consultation to discuss your growth strategy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-accent bg-white rounded-lg hover:bg-slate-100 shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
              >
                <Icon name="CalendarDaysIcon" size={20} className="mr-2" />
                Schedule Consultation
              </a>
              <a
                href="#support"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-smooth focus-ring"
              >
                <Icon name="ChatBubbleLeftRightIcon" size={20} className="mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceLibrary;