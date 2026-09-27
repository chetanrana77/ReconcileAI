'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col items-center justify-center overflow-hidden text-center px-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 pointer-events-none">
        <div className="w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="w-[450px] h-[450px] bg-violet-200/50 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDuration: '7s', animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-indigo-100 shadow-2xs text-xs font-semibold text-indigo-700 mx-auto animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Communication Mediator</span>
        </div>

        {/* Primary headline: Section 29 requirement */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08] animate-fade-in-up">
          Some things are easier to say
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 mt-1">
            with someone in the middle.
          </span>
        </h1>
        
        {/* Supporting copy */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-normal" style={{ animationDelay: '100ms' }}>
          Reconcile is the AI you talk to when you don&apos;t know how to talk to them. Untangle what you&apos;re feeling privately, bridge the misunderstanding, and connect without starting an argument.
        </p>

        {/* Trust Statement */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-white/70 backdrop-blur-xs px-4 py-1.5 rounded-full border border-gray-100 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your words stay private. We help the other person understand what you mean.</span>
        </div>
        
        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Button size="lg" onClick={onStart} className="w-full sm:w-auto rounded-full px-8 py-3.5 text-base shadow-md shadow-indigo-500/20 group cursor-pointer">
            Talk to Reconcile
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="ghost" size="lg" onClick={scrollToDemo} className="w-full sm:w-auto rounded-full px-8 py-3.5 text-base border border-transparent hover:border-gray-200 cursor-pointer">
            See How It Works
          </Button>
        </div>

        {/* Branded Visual: Person A ↔ Reconcile ↔ Person B */}
        <div className="pt-10 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="relative py-4 px-6 bg-white/80 backdrop-blur-md rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between gap-3 sm:gap-4">
            {/* Person A path */}
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Person A</p>
                <p className="text-[11px] text-gray-500">Shares raw feelings privately</p>
              </div>
            </div>

            {/* Reconcile AI Middle Bridge */}
            <div className="flex-1 flex flex-col items-center justify-center px-1">
              <div className="w-full h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 relative my-2">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-xs flex items-center gap-1 text-[10px] font-bold">
                  <span>Reconcile</span>
                </div>
              </div>
              <span className="text-[10px] text-indigo-700 font-medium">Neutral Mediator</span>
            </div>

            {/* Person B path */}
            <div className="flex items-center gap-2.5 text-right flex-row-reverse">
              <div className="w-3.5 h-3.5 rounded-full bg-violet-500 ring-4 ring-violet-100 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Person B</p>
                <p className="text-[11px] text-gray-500">Hears underlying intent &amp; shares side</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2.5">
            Two private consultations &rarr; One shared understanding
          </p>
        </div>

      </div>
    </section>
  );
}
