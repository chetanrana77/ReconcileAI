'use client';

import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SupportedLanguage } from '@/lib/types';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';

interface ClosingCTAProps {
  onStart: () => void;
  onExploreDemo: () => void;
  language?: SupportedLanguage;
}

export function ClosingCTA({ onStart, onExploreDemo, language = 'en' }: ClosingCTAProps) {
  const lt = getLandingTranslations(language);
  const cta = lt.closingCta;

  return (
    <section className="py-20 md:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 md:p-16 shadow-xs space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-stone-500" />
          <span>{cta.badge}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
          {cta.title}
        </h2>

        <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed font-normal">
          {cta.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-medium rounded-xl shadow-xs hover:shadow"
          >
            <span>{cta.ctaPrimary}</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-medium rounded-xl text-stone-700"
          >
            <span>{cta.ctaSecondary}</span>
          </Button>
        </div>

        <p className="text-xs text-stone-400 pt-2 font-normal">
          {cta.trustProof}
        </p>
      </div>
    </section>
  );
}
