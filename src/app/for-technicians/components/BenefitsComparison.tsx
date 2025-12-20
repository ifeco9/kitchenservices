'use client';

import Icon from '@/components/ui/AppIcon';

interface ComparisonRow {
  feature: string;
  independent: string | boolean;
  platform: string | boolean;
  highlight?: boolean;
}

const BenefitsComparison = () => {
  const comparisonData: ComparisonRow[] = [
    {
      feature: "Lead Generation",
      independent: "Self-managed marketing",
      platform: "Automated customer matching",
      highlight: true
    },
    {
      feature: "Payment Security",
      independent: "Cash/invoice risk",
      platform: "Guaranteed payment protection",
      highlight: true
    },
    {
      feature: "Administrative Support",
      independent: "Manual booking management",
      platform: "Automated scheduling & reminders"
    },
    {
      feature: "Marketing Costs",
      independent: "£200-500/month",
      platform: "£0 - Commission based"
    },
    {
      feature: "Customer Trust",
      independent: "Build from scratch",
      platform: "Instant verification badge",
      highlight: true
    },
    {
      feature: "Booking Management",
      independent: "Phone calls & spreadsheets",
      platform: "Real-time calendar sync"
    },
    {
      feature: "Payment Processing",
      independent: "Manual invoicing",
      platform: "Automated with instant payout"
    },
    {
      feature: "Insurance Verification",
      independent: "Customer responsibility",
      platform: "Platform verified & displayed"
    },
    {
      feature: "Dispute Resolution",
      independent: "Handle independently",
      platform: "Mediation support included"
    },
    {
      feature: "Business Analytics",
      independent: "Manual tracking",
      platform: "Real-time dashboard insights"
    }
  ];

  const platformBenefits = [
    {
      icon: "UserGroupIcon",
      title: "Instant Customer Access",
      description: "Connect with 50,000+ homeowners actively searching for verified technicians in your area."
    },
    {
      icon: "ShieldCheckIcon",
      title: "Trust & Credibility",
      description: "Our verification badge instantly builds customer confidence, eliminating the trust barrier."
    },
    {
      icon: "CurrencyPoundIcon",
      title: "Guaranteed Payments",
      description: "Secure payment processing with automatic invoicing and fast payouts directly to your account."
    },
    {
      icon: "ChartBarIcon",
      title: "Business Growth Tools",
      description: "Access market insights, pricing benchmarks, and demand forecasting to optimize your business."
    },
    {
      icon: "CalendarDaysIcon",
      title: "Smart Scheduling",
      description: "Automated booking management with calendar sync and customer reminder notifications."
    },
    {
      icon: "ChatBubbleLeftRightIcon",
      title: "Customer Communication",
      description: "Built-in messaging system with templates for professional customer interactions."
    }
  ];

  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <Icon name="ScaleIcon" size={20} className="text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Platform vs Independent</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Why Join KitchenServices?
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Compare the advantages of working through our platform versus operating independently. See how we help you grow faster with less effort.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-16">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Independent Operation</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold bg-accent">
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="CheckBadgeIcon" size={20} />
                      <span>KitchenServices Platform</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonData.map((row, index) => (
                  <tr key={index} className={row.highlight ? 'bg-accent/5' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-primary">
                      {row.feature}
                      {row.highlight && (
                        <Icon name="StarIcon" size={16} className="inline-block ml-2 text-accent" variant="solid" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.independent === 'boolean' ? (
                        row.independent ? (
                          <Icon name="CheckIcon" size={20} className="text-success mx-auto" />
                        ) : (
                          <Icon name="XMarkIcon" size={20} className="text-error mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-text-secondary">{row.independent}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center bg-accent/5">
                      {typeof row.platform === 'boolean' ? (
                        row.platform ? (
                          <Icon name="CheckIcon" size={20} className="text-success mx-auto" />
                        ) : (
                          <Icon name="XMarkIcon" size={20} className="text-error mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-primary">{row.platform}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformBenefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-smooth">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
                <Icon name={benefit.icon as any} size={24} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">{benefit.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#registration"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
          >
            Start Your Registration
            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BenefitsComparison;