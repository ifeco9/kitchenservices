'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ChecklistStep {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
  icon: string;
  required: boolean;
}

const OnboardingChecklist = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const checklistSteps: ChecklistStep[] = [
    {
      id: 1,
      title: "Create Your Account",
      description: "Sign up with your email and create a secure password. Verify your email address to activate your account.",
      estimatedTime: "5 minutes",
      icon: "UserPlusIcon",
      required: true
    },
    {
      id: 2,
      title: "Upload Certifications",
      description: "Provide copies of your Gas Safe registration, electrical qualifications, and any appliance-specific certifications.",
      estimatedTime: "10 minutes",
      icon: "DocumentCheckIcon",
      required: true
    },
    {
      id: 3,
      title: "Insurance Verification",
      description: "Upload your public liability insurance certificate (minimum £2 million coverage required).",
      estimatedTime: "5 minutes",
      icon: "ShieldCheckIcon",
      required: true
    },
    {
      id: 4,
      title: "Identity Confirmation",
      description: "Submit a valid photo ID (passport or driving license) and proof of address for background verification.",
      estimatedTime: "5 minutes",
      icon: "IdentificationIcon",
      required: true
    },
    {
      id: 5,
      title: "Complete Your Profile",
      description: "Add your service areas, specializations, availability, and pricing. Upload a professional photo and write your bio.",
      estimatedTime: "15 minutes",
      icon: "UserCircleIcon",
      required: true
    },
    {
      id: 6,
      title: "Set Up Payment Details",
      description: "Connect your bank account for secure payment processing and automatic payouts.",
      estimatedTime: "5 minutes",
      icon: "CreditCardIcon",
      required: true
    },
    {
      id: 7,
      title: "Review Platform Policies",
      description: "Read and accept our terms of service, cancellation policy, and quality standards agreement.",
      estimatedTime: "10 minutes",
      icon: "DocumentTextIcon",
      required: true
    },
    {
      id: 8,
      title: "Verification Review",
      description: "Our team will review your documents and credentials. This typically takes 24-48 hours.",
      estimatedTime: "24-48 hours",
      icon: "ClockIcon",
      required: true
    }
  ];

  const toggleStep = (stepId: number) => {
    if (!isHydrated) return;
    
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const progress = isHydrated ? (completedSteps.length / checklistSteps.length) * 100 : 0;
  const totalEstimatedTime = "55-75 minutes + verification";

  return (
    <section id="onboarding" className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <Icon name="ClipboardDocumentCheckIcon" size={20} className="text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Simple 8-Step Process</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Your Onboarding Journey
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Follow our straightforward verification process to start accepting bookings. Most technicians complete registration in under an hour.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-surface rounded-xl p-6 mb-8 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-1">Registration Progress</h3>
              <p className="text-sm text-text-secondary">
                {isHydrated ? completedSteps.length : 0} of {checklistSteps.length} steps completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">{Math.round(progress)}%</div>
              <p className="text-xs text-text-secondary">Total time: {totalEstimatedTime}</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist Steps */}
        <div className="space-y-4">
          {checklistSteps.map((step, index) => {
            const isCompleted = isHydrated && completedSteps.includes(step.id);
            
            return (
              <div
                key={step.id}
                className={`bg-white border-2 rounded-xl p-6 transition-smooth ${
                  isCompleted 
                    ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Step Number/Icon */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleStep(step.id)}
                      disabled={!isHydrated}
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-smooth focus-ring ${
                        isCompleted
                          ? 'bg-accent text-white' :'bg-surface text-text-secondary hover:bg-accent/10'
                      }`}
                      aria-label={`Toggle step ${step.id}`}
                    >
                      {isCompleted ? (
                        <Icon name="CheckIcon" size={24} />
                      ) : (
                        <Icon name={step.icon as any} size={24} />
                      )}
                    </button>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-lg font-semibold ${
                          isCompleted ? 'text-accent' : 'text-primary'
                        }`}>
                          {step.title}
                        </h3>
                        {step.required && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-error/10 text-error text-xs font-medium rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-text-secondary">
                        <Icon name="ClockIcon" size={16} />
                        <span>{step.estimatedTime}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary to-slate-800 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
          <p className="text-slate-300 mb-6">
            Join thousands of verified technicians growing their business with KitchenServices
          </p>
          <a
            href="#registration"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary bg-white rounded-lg hover:bg-slate-100 shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring"
          >
            Begin Registration
            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default OnboardingChecklist;