import Icon from '@/components/ui/AppIcon';

interface ComparisonRow {
  feature: string;
  traditional: string;
  platform: string;
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
}

export default function ComparisonTable({ rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface border-b-2 border-border">
            <th className="text-left p-4 text-text-primary font-semibold">Feature</th>
            <th className="text-left p-4 text-text-primary font-semibold">Traditional Method</th>
            <th className="text-left p-4 text-text-primary font-semibold">KitchenServices Platform</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-border hover:bg-surface/50 transition-smooth">
              <td className="p-4 font-medium text-text-primary">{row.feature}</td>
              <td className="p-4 text-text-secondary">
                <div className="flex items-start gap-2">
                  <Icon name="XMarkIcon" size={16} className="text-error mt-1 flex-shrink-0" />
                  <span>{row.traditional}</span>
                </div>
              </td>
              <td className="p-4 text-text-secondary">
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircleIcon" size={16} className="text-accent mt-1 flex-shrink-0" />
                  <span>{row.platform}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}