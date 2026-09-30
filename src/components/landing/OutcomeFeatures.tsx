'use client';

import React from 'react';
import { SupportedLanguage } from '@/lib/types';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';

interface OutcomeFeaturesProps {
  language?: SupportedLanguage;
}

export function OutcomeFeatures({ language = 'en' }: OutcomeFeaturesProps) {
  const lt = getLandingTranslations(language);
  const oc = lt.outcomes;

  return (
    <section id="outcomes" className="py-20 md:py-28 border-t border-stone-200/70 bg-[#F5F4F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
            {oc.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
            {oc.title}
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            {oc.subtitle}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {oc.cards.map((card) => (
            <div
              key={card.number}
              className="bg-white rounded-2xl border border-stone-200/90 p-7 sm:p-8 shadow-2xs space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-400">
                    {card.number}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    {card.eyebrow}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>

              {/* Visual example box */}
              <div className="pt-2">
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-stone-100/70 border border-stone-200">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      {card.rawLabel}
                    </span>
                    <p className="text-stone-700 italic">
                      {card.rawText}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                    <span className="text-[10px] font-semibold text-stone-700 uppercase tracking-wider block mb-1">
                      {card.insightLabel}
                    </span>
                    <p className="text-stone-900 font-medium">
                      {card.insightText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
