import Icon from '@/components/ui/AppIcon';

interface ServicePrice {
  service: string;
  description: string;
  price: string;
  icon: string;
}

interface PricingTableData {
  hourlyRate: number;
  callOutFee: number;
  emergencyRate: number;
  services: ServicePrice[];
}

interface PricingTableProps {
  pricing: PricingTableData;
}

const PricingTable = ({ pricing }: PricingTableProps) => {
  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-6">Pricing & Services</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-surface rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="ClockIcon" size={20} className="text-primary" />
            <span className="text-sm font-medium text-text-secondary">Hourly Rate</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">£{pricing.hourlyRate}/hr</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TruckIcon" size={20} className="text-primary" />
            <span className="text-sm font-medium text-text-secondary">Call-out Fee</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">£{pricing.callOutFee}</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="BoltIcon" size={20} className="text-error" />
            <span className="text-sm font-medium text-text-secondary">Emergency Rate</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">£{pricing.emergencyRate}/hr</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-text-primary">Common Services</h4>
        {pricing.services.map((service, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-surface rounded-lg border border-border hover:shadow-subtle transition-smooth">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
              <Icon name={service.icon as any} size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h5 className="text-base font-semibold text-text-primary mb-1">{service.service}</h5>
              <p className="text-sm text-text-secondary">{service.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-text-primary">{service.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-start gap-3">
          <Icon name="InformationCircleIcon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm text-text-primary">
            <p className="font-semibold mb-1">Pricing Information</p>
            <p className="text-text-secondary">All prices are estimates and may vary based on the complexity of the job, parts required, and travel distance. Final quotes will be provided after initial assessment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;