'use client';

import Icon from '@/components/ui/AppIcon';

interface PricingBreakdownProps {
  callOutFee: number;
  hourlyRate: number;
  estimatedHours: number;
  partsEstimate: number;
  isEmergency: boolean;
}

const PricingBreakdown = ({ callOutFee, hourlyRate, estimatedHours, partsEstimate, isEmergency }: PricingBreakdownProps) => {
  const emergencySurcharge = isEmergency ? 25.0 : 0;
  const labourCost = hourlyRate * estimatedHours;
  const subtotal = callOutFee + labourCost + partsEstimate + emergencySurcharge;
  const vat = subtotal * 0.2; // 20% VAT
  const total = subtotal + vat;

  const priceItems = [
    { label: 'Call-out Fee', value: callOutFee, icon: 'TruckIcon' },
    { label: `Labour (${estimatedHours}h @ £${hourlyRate.toFixed(2)}/hr)`, value: labourCost, icon: 'WrenchScrewdriverIcon' },
    { label: 'Parts Estimate', value: partsEstimate, icon: 'CubeIcon' },
  ];

  if (isEmergency) {
    priceItems.push({ label: 'Emergency Service Surcharge', value: emergencySurcharge, icon: 'BoltIcon' });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Pricing Breakdown</h3>

      {/* Price Items */}
      <div className="space-y-3 mb-4">
        {priceItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-surface rounded-lg">
                <Icon name={item.icon as any} size={16} className="text-text-secondary" />
              </div>
              <span className="text-sm text-text-secondary">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-text-primary">£{item.value.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between py-3 border-t border-border">
        <span className="text-sm font-medium text-text-primary">Subtotal</span>
        <span className="text-sm font-medium text-text-primary">£{subtotal.toFixed(2)}</span>
      </div>

      {/* VAT */}
      <div className="flex items-center justify-between py-3 border-t border-border">
        <span className="text-sm text-text-secondary">VAT (20%)</span>
        <span className="text-sm font-medium text-text-primary">£{vat.toFixed(2)}</span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-4 border-t-2 border-border">
        <span className="text-base font-semibold text-text-primary">Total</span>
        <span className="text-2xl font-bold text-accent">£{total.toFixed(2)}</span>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-4 bg-info/10 border border-info/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-info flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-text-primary">
              <strong>Final cost may vary</strong> based on actual time spent and parts required. You'll receive a detailed
              invoice after service completion.
            </p>
          </div>
        </div>
      </div>

      {/* No Hidden Charges Badge */}
      <div className="mt-4 flex items-center justify-center space-x-2 py-3 bg-success/10 rounded-lg">
        <Icon name="ShieldCheckIcon" size={20} className="text-success" />
        <span className="text-sm font-medium text-success">No Hidden Charges</span>
      </div>
    </div>
  );
};

export default PricingBreakdown;