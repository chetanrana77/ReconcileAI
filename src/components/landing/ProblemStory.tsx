'use client';

import React from 'react';
import { SupportedLanguage } from '@/lib/types';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';

interface ProblemStoryProps {
  language?: SupportedLanguage;
}

export function ProblemStory({ language = 'en' }: ProblemStoryProps) {
  const lt = getLandingTranslations(language);
  const ps = lt.problemStory;

  return (
    <section className="py-20 md:py-28 border-t border-stone-200/70 bg-[#F5F4F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Headline & Opening Premise */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
            {ps.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
            {ps.headline}
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            {ps.subtitle}
          </p>
        </div>

        {/* The Emotional Disconnect Matrix */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
            {ps.sectionTitle}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ps.disconnects.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                    {ps.whatWasSaid}
                  </span>
                  <p className="text-sm font-medium text-stone-900 leading-snug">
                    {item.spoken}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <div className="rounded-xl bg-stone-50 p-3 border border-stone-200/60">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-0.5">
                      {ps.whatWasHeard}
                    </span>
                    <p className="text-xs text-stone-700 italic leading-relaxed">
                      {item.perceived}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#FAF9F6] p-3 border border-stone-200/60">
                    <span className="text-[10px] font-semibold text-stone-700 uppercase tracking-wider block mb-0.5">
                      {ps.whatWasMeant}
                    </span>
                    <p className="text-xs text-stone-900 font-medium leading-relaxed">
                      {item.intended}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How Reconcile Breaks the Defensive Loop */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-10 shadow-2xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
              {ps.loopTitle}
            </h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {ps.loopSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {ps.pillars.map((pillar) => (
              <div key={pillar.num} className="space-y-2.5">
                <span className="text-xs font-mono font-bold text-stone-400">{pillar.num}</span>
                <h4 className="text-sm font-semibold text-stone-900">{pillar.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
