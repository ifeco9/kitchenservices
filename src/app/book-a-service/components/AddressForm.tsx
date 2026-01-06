'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AddressFormProps {
    onNext: (address: AddressData) => void;
    onBack: () => void;
    initialAddress?: AddressData;
}

export interface AddressData {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
}

const AddressForm = ({ onNext, onBack, initialAddress }: AddressFormProps) => {
    const [formData, setFormData] = useState<AddressData>(
        initialAddress || {
            addressLine1: '',
            addressLine2: '',
            city: '',
            postcode: '',
        }
    );

    const [errors, setErrors] = useState<Partial<Record<keyof AddressData, string>>>({});

    const handleInputChange = (field: keyof AddressData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof AddressData, string>> = {};

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address is required';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!formData.postcode.trim()) {
            newErrors.postcode = 'Postcode is required';
        } else if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i.test(formData.postcode.trim())) {
            newErrors.postcode = 'Invalid UK postcode format';
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
            <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-text-primary mb-2">
                    Address Line 1 <span className="text-error">*</span>
                </label>
                <input
                    type="text"
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    placeholder="123 Main Street"
                    className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${errors.addressLine1 ? 'border-error' : 'border-border'
                        }`}
                />
                {errors.addressLine1 && <p className="mt-1 text-xs text-error">{errors.addressLine1}</p>}
            </div>

            <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-text-primary mb-2">
                    Address Line 2 <span className="text-xs text-text-secondary">(Optional)</span>
                </label>
                <input
                    type="text"
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    placeholder="Apartment, suite, etc."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-text-primary mb-2">
                        City <span className="text-error">*</span>
                    </label>
                    <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="London"
                        className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${errors.city ? 'border-error' : 'border-border'
                            }`}
                    />
                    {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
                </div>

                <div>
                    <label htmlFor="postcode" className="block text-sm font-medium text-text-primary mb-2">
                        Postcode <span className="text-error">*</span>
                    </label>
                    <input
                        type="text"
                        id="postcode"
                        value={formData.postcode}
                        onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())}
                        placeholder="SW1A 1AA"
                        className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${errors.postcode ? 'border-error' : 'border-border'
                            }`}
                    />
                    {errors.postcode && <p className="mt-1 text-xs text-error">{errors.postcode}</p>}
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary bg-surface rounded-lg hover:bg-muted transition-smooth focus-ring"
                >
                    <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                    Back
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
                >
                    Continue to Technician Selection
                    <Icon name="ArrowRightIcon" size={20} className="ml-2" />
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
