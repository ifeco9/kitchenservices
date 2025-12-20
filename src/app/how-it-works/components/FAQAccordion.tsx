'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth ${
                selectedCategory === category
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-surface text-text-secondary hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <Icon name="QuestionMarkCircleIcon" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No questions found matching your search.</p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface transition-smooth"
              >
                <span className="font-semibold text-text-primary pr-4">{faq.question}</span>
                <Icon
                  name="ChevronDownIcon"
                  size={20}
                  className={`text-text-secondary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 pt-2 text-text-secondary text-sm leading-relaxed border-t border-border">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}