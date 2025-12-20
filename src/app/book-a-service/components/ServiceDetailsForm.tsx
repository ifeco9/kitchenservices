'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ServiceDetailsFormProps {
  onNext: (data: ServiceDetails) => void;
}

interface ServiceDetails {
  applianceType: string;
  brand: string;
  modelNumber: string;
  problemDescription: string;
  isEmergency: boolean;
}

const ServiceDetailsForm = ({ onNext }: ServiceDetailsFormProps) => {
  const [formData, setFormData] = useState<ServiceDetails>({
    applianceType: '',
    brand: '',
    modelNumber: '',
    problemDescription: '',
    isEmergency: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ServiceDetails, string>>>({});
  const maxDescriptionLength = 500;

  const applianceTypes = [
    'Oven',
    'Dishwasher',
    'Refrigerator',
    'Washing Machine',
    'Dryer',
    'Microwave',
    'Cooker Hood',
    'Hob',
    'Freezer',
    'Range Cooker',
  ];

  const brands = [
    'Bosch',
    'Siemens',
    'Miele',
    'AEG',
    'Hotpoint',
    'Beko',
    'Samsung',
    'LG',
    'Whirlpool',
    'Zanussi',
    'Indesit',
    'Neff',
    'Smeg',
    'Other',
  ];

  const handleInputChange = (field: keyof ServiceDetails, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceDetails, string>> = {};

    if (!formData.applianceType) {
      newErrors.applianceType = 'Please select an appliance type';
    }
    if (!formData.brand) {
      newErrors.brand = 'Please select a brand';
    }
    if (!formData.problemDescription.trim()) {
      newErrors.problemDescription = 'Please describe the problem';
    } else if (formData.problemDescription.trim().length < 20) {
      newErrors.problemDescription = 'Please provide at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Emergency Toggle */}
      <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
            <Icon name="BoltIcon" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Emergency Service</h3>
            <p className="text-xs text-text-secondary">Priority booking within 2 hours</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleInputChange('isEmergency', !formData.isEmergency)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring ${
            formData.isEmergency ? 'bg-error' : 'bg-muted'
          }`}
          aria-label="Toggle emergency service"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              formData.isEmergency ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Appliance Type */}
      <div>
        <label htmlFor="applianceType" className="block text-sm font-medium text-text-primary mb-2">
          Appliance Type <span className="text-error">*</span>
        </label>
        <div className="relative">
          <select
            id="applianceType"
            value={formData.applianceType}
            onChange={(e) => handleInputChange('applianceType', e.target.value)}
            className={`w-full px-4 py-3 pr-10 bg-background border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
              errors.applianceType ? 'border-error' : 'border-border'
            }`}
          >
            <option value="">Select appliance type</option>
            {applianceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Icon
            name="ChevronDownIcon"
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
        </div>
        {errors.applianceType && <p className="mt-1 text-xs text-error">{errors.applianceType}</p>}
      </div>

      {/* Brand */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-text-primary mb-2">
          Brand <span className="text-error">*</span>
        </label>
        <div className="relative">
          <select
            id="brand"
            value={formData.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            className={`w-full px-4 py-3 pr-10 bg-background border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
              errors.brand ? 'border-error' : 'border-border'
            }`}
          >
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <Icon
            name="ChevronDownIcon"
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
        </div>
        {errors.brand && <p className="mt-1 text-xs text-error">{errors.brand}</p>}
      </div>

      {/* Model Number */}
      <div>
        <label htmlFor="modelNumber" className="block text-sm font-medium text-text-primary mb-2">
          Model Number <span className="text-xs text-text-secondary">(Optional)</span>
        </label>
        <input
          type="text"
          id="modelNumber"
          value={formData.modelNumber}
          onChange={(e) => handleInputChange('modelNumber', e.target.value)}
          placeholder="e.g., WAT28371GB"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
        />
      </div>

      {/* Problem Description */}
      <div>
        <label htmlFor="problemDescription" className="block text-sm font-medium text-text-primary mb-2">
          Problem Description <span className="text-error">*</span>
        </label>
        <textarea
          id="problemDescription"
          value={formData.problemDescription}
          onChange={(e) => handleInputChange('problemDescription', e.target.value)}
          placeholder="Please describe the issue in detail. Include any error codes, unusual sounds, or symptoms you've noticed..."
          rows={5}
          maxLength={maxDescriptionLength}
          className={`w-full px-4 py-3 bg-background border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
            errors.problemDescription ? 'border-error' : 'border-border'
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.problemDescription ? (
            <p className="text-xs text-error">{errors.problemDescription}</p>
          ) : (
            <p className="text-xs text-text-secondary">Minimum 20 characters</p>
          )}
          <p className="text-xs text-text-secondary">
            {formData.problemDescription.length}/{maxDescriptionLength}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
      >
        Continue to Technician Selection
        <Icon name="ArrowRightIcon" size={20} className="ml-2" />
      </button>
    </form>
  );
};

export default ServiceDetailsForm;