'use client';

import React from 'react';
import { Lock, EyeOff, ShieldCheck, DatabaseZap } from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';

interface PrivacySectionProps {
  language?: SupportedLanguage;
}

export function PrivacySection({ language = 'en' }: PrivacySectionProps) {
  const lt = getLandingTranslations(language);
  const pr = lt.privacy;

  const icons = [EyeOff, Lock, ShieldCheck, DatabaseZap];

  return (
    <section id="privacy" className="py-20 md:py-28 bg-[#F5F4F0] border-t border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            <span>{pr.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
            {pr.title}
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            {pr.subtitle}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pr.pillars.map((pillar, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-2xs space-y-3.5 hover:border-stone-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 border border-stone-200/60">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
