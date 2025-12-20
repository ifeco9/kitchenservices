'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuoteRequestFormProps {
  technicianName: string;
  onSubmit: (formData: QuoteFormData) => void;
}

interface QuoteFormData {
  applianceType: string;
  issueDescription: string;
  urgency: string;
  preferredDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const QuoteRequestForm = ({ technicianName, onSubmit }: QuoteRequestFormProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    applianceType: '',
    issueDescription: '',
    urgency: 'standard',
    preferredDate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
          <Icon name="DocumentTextIcon" size={24} className="text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Request a Quote</h3>
          <p className="text-sm text-text-secondary">Get a personalized quote from {technicianName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="applianceType" className="block text-sm font-medium text-text-primary mb-2">
            Appliance Type *
          </label>
          <select
            id="applianceType"
            name="applianceType"
            value={formData.applianceType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            <option value="">Select appliance</option>
            <option value="oven">Oven</option>
            <option value="dishwasher">Dishwasher</option>
            <option value="refrigerator">Refrigerator</option>
            <option value="washing-machine">Washing Machine</option>
            <option value="cooker">Cooker</option>
            <option value="microwave">Microwave</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="issueDescription" className="block text-sm font-medium text-text-primary mb-2">
            Issue Description *
          </label>
          <textarea
            id="issueDescription"
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Please describe the issue you're experiencing..."
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
          />
        </div>

        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-text-primary mb-2">
            Urgency Level *
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            <option value="standard">Standard (Within 3-5 days)</option>
            <option value="urgent">Urgent (Within 24 hours)</option>
            <option value="emergency">Emergency (Same day)</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-text-primary mb-2">
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-text-primary mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              placeholder="John Smith"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-text-primary mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              placeholder="07XXX XXXXXX"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-text-primary mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            placeholder="john.smith@example.com"
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 text-base font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
        >
          <Icon name="PaperAirplaneIcon" size={20} className="inline-block mr-2" />
          Submit Quote Request
        </button>
      </form>
    </div>
  );
};

export default QuoteRequestForm;