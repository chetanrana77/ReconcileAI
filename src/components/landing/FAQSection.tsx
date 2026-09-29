'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Will the other person know I used Reconcile?',
    answer:
      'Yes, transparency is essential for rebuilding trust. When you choose to invite the other person, Reconcile sends a calm, neutral invitation introducing itself as an AI communication mediator that helps both people understand each other without arguments. Nothing is done behind their back.',
  },
  {
    question: 'What if the other person refuses to participate?',
    answer:
      'Even if the other person chooses not to join, Reconcile is deeply useful. Your private intake helps you untangle your own feelings, explore their likely pressures and intentions, and gives you a ready-to-send message you can text them directly on your own terms.',
  },
  {
    question: 'Can the other person read what I typed during my private intake?',
    answer:
      'Never. Reconcile strictly isolates private intake channels. The only content both participants ever see is the neutral Mediation Bridge, which contains agreed-upon common ground and de-escalating language.',
  },
  {
    question: 'Is Reconcile a replacement for therapy or counseling?',
    answer:
      'No. Reconcile is a focused communication tool for everyday misunderstandings between people who care about each other. It is not psychotherapy, medical care, or crisis intervention. If a conversation involves domestic violence, self-harm, or abuse, our safety protocol immediately redirects to certified crisis resources.',
  },
  {
    question: 'How does Reconcile make sure it doesn’t take sides?',
    answer:
      'Reconcile is engineered with strict neutrality rules: validate emotions, but never validate hostile assumptions; avoid blaming or labeling either person as “toxic”; separate intent from impact; and always seek constructive common ground.',
  },
  {
    question: 'Do I need to create an account or pay?',
    answer:
      'No account or password is required. You can start a conversation immediately. Reconcile is currently free to use in Alpha MVP with no paywalls or advertising.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
          Questions & Answers
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
          Frequently asked questions.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          Clear, straightforward answers about privacy, the mediation process, and how Reconcile works.
        </p>
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-stone-200 border-y border-stone-200">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="py-5">
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-medium text-stone-900 group-hover:text-stone-700 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-stone-800' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pt-3 pr-8 text-sm sm:text-base text-stone-600 leading-relaxed font-normal animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
