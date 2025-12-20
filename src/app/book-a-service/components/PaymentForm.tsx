'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentFormProps {
  onSubmit: (paymentData: PaymentData) => void;
  totalAmount: number;
}

interface PaymentData {
  method: 'card' | 'wallet' | 'bank';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

const PaymentForm = ({ onSubmit, totalAmount }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'bank'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: 'CreditCardIcon' },
    { id: 'wallet', label: 'Digital Wallet', icon: 'DevicePhoneMobileIcon' },
    { id: 'bank', label: 'Bank Transfer', icon: 'BuildingLibraryIcon' },
  ];

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return;
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    if (paymentMethod !== 'card') return true;

    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        method: paymentMethod,
        ...(paymentMethod === 'card' && formData),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id as any)}
              className={`flex items-center justify-center space-x-3 px-4 py-3 border-2 rounded-lg transition-smooth focus-ring ${
                paymentMethod === method.id
                  ? 'border-accent bg-accent/5' :'border-border bg-card hover:border-muted'
              }`}
            >
              <Icon name={method.icon as any} size={20} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">{method.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-text-primary mb-2">
              Card Number <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className={`w-full pl-12 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.cardNumber ? 'border-error' : 'border-border'
                }`}
              />
              <Icon
                name="CreditCardIcon"
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
              />
            </div>
            {errors.cardNumber && <p className="mt-1 text-xs text-error">{errors.cardNumber}</p>}
          </div>

          {/* Cardholder Name */}
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-text-primary mb-2">
              Cardholder Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="cardName"
              value={formData.cardName}
              onChange={(e) => handleInputChange('cardName', e.target.value)}
              placeholder="John Smith"
              className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors.cardName ? 'border-error' : 'border-border'
              }`}
            />
            {errors.cardName && <p className="mt-1 text-xs text-error">{errors.cardName}</p>}
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-text-primary mb-2">
                Expiry Date <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                placeholder="MM/YY"
                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.expiryDate ? 'border-error' : 'border-border'
                }`}
              />
              {errors.expiryDate && <p className="mt-1 text-xs text-error">{errors.expiryDate}</p>}
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-text-primary mb-2">
                CVV <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="cvv"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="123"
                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.cvv ? 'border-error' : 'border-border'
                }`}
              />
              {errors.cvv && <p className="mt-1 text-xs text-error">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Digital Wallet Info */}
      {paymentMethod === 'wallet' && (
        <div className="p-6 bg-surface border border-border rounded-lg text-center">
          <Icon name="DevicePhoneMobileIcon" size={48} className="mx-auto mb-4 text-text-secondary" />
          <h4 className="text-base font-semibold text-text-primary mb-2">Digital Wallet Payment</h4>
          <p className="text-sm text-text-secondary mb-4">
            You'll be redirected to complete payment using Apple Pay, Google Pay, or PayPal
          </p>
        </div>
      )}

      {/* Bank Transfer Info */}
      {paymentMethod === 'bank' && (
        <div className="p-6 bg-surface border border-border rounded-lg text-center">
          <Icon name="BuildingLibraryIcon" size={48} className="mx-auto mb-4 text-text-secondary" />
          <h4 className="text-base font-semibold text-text-primary mb-2">Bank Transfer Payment</h4>
          <p className="text-sm text-text-secondary mb-4">
            Bank details will be provided after booking confirmation. Service will be scheduled upon payment verification.
          </p>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 py-3 bg-success/10 border border-success/20 rounded-lg">
        <Icon name="LockClosedIcon" size={20} className="text-success" />
        <span className="text-sm font-medium text-success">Secure SSL Encrypted Payment</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
      >
        <Icon name="LockClosedIcon" size={20} className="mr-2" />
        Pay £{totalAmount.toFixed(2)} &amp; Confirm Booking
      </button>
    </form>
  );
};

export default PaymentForm;