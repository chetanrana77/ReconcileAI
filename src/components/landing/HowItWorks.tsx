'use client';

import React from 'react';
import { MessageSquare, Heart, MailCheck, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';

interface HowItWorksProps {
  language?: SupportedLanguage;
}

export function HowItWorks({ language = 'en' }: HowItWorksProps) {
  const lt = getLandingTranslations(language);
  const hw = lt.howItWorks;

  const icons = [MessageSquare, Heart, MailCheck, Sparkles];

  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-stone-200/70 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
            {hw.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
            {hw.title}
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            {hw.subtitle}
          </p>
        </div>

        {/* Visual Step Progression */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {hw.steps.map((step, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={step.number}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 flex flex-col justify-between shadow-2xs space-y-6 relative group hover:border-stone-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-stone-400">
                      STEP {step.number}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {step.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200/60">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-stone-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-500 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    {step.microExample}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
