'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  serviceRadius: string;
  specializations: string[];
  gasRegNumber: string;
  insuranceProvider: string;
  yearsExperience: string;
}

interface UploadedFile {
  name: string;
  size: string;
  type: string;
}

const RegistrationForm = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    postcode: '',
    serviceRadius: '10',
    specializations: [],
    gasRegNumber: '',
    insuranceProvider: '',
    yearsExperience: '1-3'
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const specializationOptions = [
    'Gas Cookers & Hobs',
    'Electric Ovens',
    'Dishwashers',
    'Washing Machines',
    'Refrigerators & Freezers',
    'Microwaves',
    'Range Cookers',
    'Extractor Fans'
  ];

  const documentTypes = [
    { id: 'gas-safe', label: 'Gas Safe Certificate', icon: 'DocumentCheckIcon' },
    { id: 'insurance', label: 'Insurance Certificate', icon: 'ShieldCheckIcon' },
    { id: 'photo-id', label: 'Photo ID', icon: 'IdentificationIcon' },
    { id: 'proof-address', label: 'Proof of Address', icon: 'HomeIcon' }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (!isHydrated) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (spec: string) => {
    if (!isHydrated) return;
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handleFileUpload = (docType: string) => {
    if (!isHydrated) return;
    setUploadedFiles(prev => ({
      ...prev,
      [docType]: {
        name: `${docType}-document.pdf`,
        size: '2.4 MB',
        type: 'PDF'
      }
    }));
  };

  const handleNextStep = () => {
    if (!isHydrated) return;
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (!isHydrated) return;
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHydrated) return;
    alert('Registration submitted successfully! Our team will review your application within 24-48 hours.');
  };

  const progress = (currentStep / 3) * 100;

  return (
    <section id="registration" className="bg-surface py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <Icon name="RocketLaunchIcon" size={20} className="text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Start Your Journey</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Technician Registration
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Complete your registration in three simple steps. All information is securely encrypted and verified.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">Step {currentStep} of 3</span>
            <span className="text-sm text-text-secondary">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-4">
            <div className={`text-xs font-medium ${currentStep >= 1 ? 'text-accent' : 'text-text-secondary'}`}>
              Personal Info
            </div>
            <div className={`text-xs font-medium ${currentStep >= 2 ? 'text-accent' : 'text-text-secondary'}`}>
              Qualifications
            </div>
            <div className={`text-xs font-medium ${currentStep >= 3 ? 'text-accent' : 'text-text-secondary'}`}>
              Documents
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary mb-6">Personal Information</h3>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                  placeholder="John Smith"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    placeholder="07700 900000"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-primary mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => handleInputChange('postcode', e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    placeholder="SW1A 1AA"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="serviceRadius" className="block text-sm font-medium text-primary mb-2">
                    Service Radius (miles) *
                  </label>
                  <select
                    id="serviceRadius"
                    value={formData.serviceRadius}
                    onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    required
                  >
                    <option value="5">5 miles</option>
                    <option value="10">10 miles</option>
                    <option value="15">15 miles</option>
                    <option value="20">20 miles</option>
                    <option value="30">30 miles</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-3">
                  Specializations * (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {specializationOptions.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleSpecializationToggle(spec)}
                      disabled={!isHydrated}
                      className={`flex items-center justify-between px-4 py-3 border-2 rounded-lg transition-smooth focus-ring ${
                        formData.specializations.includes(spec)
                          ? 'border-accent bg-accent/5 text-accent' :'border-border hover:border-accent/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{spec}</span>
                      {formData.specializations.includes(spec) && (
                        <Icon name="CheckCircleIcon" size={20} variant="solid" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Qualifications */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary mb-6">Professional Qualifications</h3>

              <div>
                <label htmlFor="gasRegNumber" className="block text-sm font-medium text-primary mb-2">
                  Gas Safe Registration Number *
                </label>
                <input
                  type="text"
                  id="gasRegNumber"
                  value={formData.gasRegNumber}
                  onChange={(e) => handleInputChange('gasRegNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                  placeholder="123456"
                  required
                />
                <p className="text-xs text-text-secondary mt-1">
                  Enter your 6-digit Gas Safe registration number
                </p>
              </div>

              <div>
                <label htmlFor="insuranceProvider" className="block text-sm font-medium text-primary mb-2">
                  Insurance Provider *
                </label>
                <input
                  type="text"
                  id="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                  placeholder="ABC Insurance Ltd"
                  required
                />
                <p className="text-xs text-text-secondary mt-1">
                  Minimum £2 million public liability coverage required
                </p>
              </div>

              <div>
                <label htmlFor="yearsExperience" className="block text-sm font-medium text-primary mb-2">
                  Years of Experience *
                </label>
                <select
                  id="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                  required
                >
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="InformationCircleIcon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-1">Verification Process</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      All qualifications will be verified with the relevant authorities. This process typically takes 24-48 hours. You&apos;ll receive email updates on your verification status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary mb-6">Document Upload</h3>

              <div className="space-y-4">
                {documentTypes.map((doc) => (
                  <div key={doc.id} className="border-2 border-border rounded-lg p-4 hover:border-accent/50 transition-smooth">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
                          <Icon name={doc.icon as any} size={20} className="text-accent" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-primary">{doc.label}</h4>
                          <p className="text-xs text-text-secondary">PDF, JPG, or PNG (Max 5MB)</p>
                        </div>
                      </div>
                      {uploadedFiles[doc.id] ? (
                        <div className="flex items-center space-x-2 text-success">
                          <Icon name="CheckCircleIcon" size={20} variant="solid" />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFileUpload(doc.id)}
                          disabled={!isHydrated}
                          className="px-4 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition-smooth focus-ring"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                    {uploadedFiles[doc.id] && (
                      <div className="flex items-center justify-between bg-surface rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Icon name="DocumentIcon" size={16} className="text-text-secondary" />
                          <span className="text-xs text-text-secondary">{uploadedFiles[doc.id].name}</span>
                        </div>
                        <span className="text-xs text-text-secondary">{uploadedFiles[doc.id].size}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="ExclamationTriangleIcon" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-1">Document Requirements</h4>
                    <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                      <li>All documents must be clear and legible</li>
                      <li>Certificates must be current and not expired</li>
                      <li>Photo ID must show your full name and date of birth</li>
                      <li>Proof of address must be dated within the last 3 months</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={!isHydrated || currentStep === 1}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-smooth focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronLeftIcon" size={20} className="mr-2" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isHydrated}
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
              >
                Next Step
                <Icon name="ChevronRightIcon" size={20} className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isHydrated}
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
              >
                Submit Registration
                <Icon name="CheckIcon" size={20} className="ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;