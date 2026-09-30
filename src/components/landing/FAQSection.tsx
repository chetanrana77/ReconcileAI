'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';

interface FAQSectionProps {
  language?: SupportedLanguage;
}

export function FAQSection({ language = 'en' }: FAQSectionProps) {
  const lt = getLandingTranslations(language);
  const faq = lt.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
          {faq.badge}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
          {faq.title}
        </h2>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          {faq.subtitle}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faq.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
              >
                <span className="text-base sm:text-lg font-semibold text-stone-900">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 font-normal">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
