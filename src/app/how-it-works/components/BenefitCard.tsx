import Icon from '@/components/ui/AppIcon';

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-smooth">
      <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
        <Icon name={icon as any} size={24} className="text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );
}