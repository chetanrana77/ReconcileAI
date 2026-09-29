'use client';

import React, { useState } from 'react';
import { ArrowRight, Lock, ArrowDown, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  onStart: () => void;
  onSelectDemo?: (demoKey: string) => void;
}

interface HeroScenario {
  id: string;
  demoKey: string;
  label: string;
  context: string;
  sideA: {
    name: string;
    role: string;
    rawText: string;
    felt: string;
  };
  sideB: {
    name: string;
    role: string;
    rawText: string;
    intent: string;
  };
  bridge: {
    disconnect: string;
    suggestedMessage: string;
  };
}

const HERO_SCENARIOS: HeroScenario[] = [
  {
    id: 'parent-teen',
    demoKey: 'demo-parent-child',
    label: 'Parent & Teen',
    context: 'Daily arguments around study hours and independence',
    sideA: {
      name: 'Maya',
      role: 'Daughter, 19',
      rawText: '“Mom asks about my exams every single morning. I know she cares, but it makes me feel like she has zero faith in my ability to manage my life.”',
      felt: 'Felt: Scrutinized & distrusted',
    },
    sideB: {
      name: 'Elena',
      role: 'Mother',
      rawText: '“I gave up my career so she could have better opportunities. I ask because I worry constantly and don’t want her to struggle the way I did.”',
      intent: 'Intent: Deep love & fear of future regret',
    },
    bridge: {
      disconnect: 'The intention was anxious protection; the emotional impact was feeling doubted.',
      suggestedMessage: '“Mom, I know you ask because my future matters to you. But when it’s every day, I feel doubted. Can we agree on a Sunday check-in instead?”',
    },
  },
  {
    id: 'friends-silence',
    demoKey: 'demo-friend-friend',
    label: 'Two Friends',
    context: 'Three days of silence after an emotional disagreement',
    sideA: {
      name: 'Sarah',
      role: 'Friend A',
      rawText: '“I opened up about something really vulnerable and she just went completely dark for three days. It feels like our friendship is one-sided.”',
      felt: 'Felt: Abandoned & unimportant',
    },
    sideB: {
      name: 'Chloe',
      role: 'Friend B',
      rawText: '“Work destroyed me this week and I broke down. I started drafting a reply twice, but I had zero emotional energy left to explain myself.”',
      intent: 'Intent: Coping with acute personal burnout',
    },
    bridge: {
      disconnect: 'The intention was self-preservation during burnout; the emotional impact was felt as cold neglect.',
      suggestedMessage: '“Hey — zero pressure to reply right away. I know work has been overwhelming. Just wanted you to know I care about you whenever you’re ready.”',
    },
  },
];

export function Hero({ onStart, onSelectDemo }: HeroProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('parent-teen');
  const activeScenario =
    HERO_SCENARIOS.find((s) => s.id === activeScenarioId) || HERO_SCENARIOS[0];

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLaunchDemo = (demoKey: string) => {
    if (onSelectDemo) {
      onSelectDemo(demoKey);
    } else {
      onStart();
    }
  };

  return (
    <section className="relative w-full pt-12 pb-20 md:pt-20 md:pb-28 flex flex-col items-center">
      {/* 1. Header & Value Proposition */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Understated Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/90 border border-stone-200/90 text-stone-700 text-xs font-semibold uppercase tracking-wider mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
          <span>Private AI for Hard Conversations</span>
        </div>

        {/* Primary Headline: Large, elegant, human */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-stone-900 leading-[1.08] text-balance">
          You know what you feel.
          <span className="block text-stone-700 font-normal">We help you say it right.</span>
        </h1>

        {/* Concise Supporting Explanation */}
        <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal text-balance">
          When a conversation feels impossible, Reconcile listens to both sides privately, finds where
          intent and impact got crossed, and gives you the exact words to fix it.
        </p>

        {/* Primary and Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Button
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-medium rounded-xl shadow-sm hover:shadow group"
          >
            <span>Tell Me What Happened</span>
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-medium rounded-xl text-stone-700"
          >
            <span>See How It Works</span>
          </Button>
        </div>

        {/* Trust Proof Line */}
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-1">
          <Lock className="w-3.5 h-3.5 text-stone-400" />
          <span>100% private. No account required. Your raw words are never forwarded.</span>
        </div>
      </div>

      {/* 2. Interactive Product Visualization: TWO SIDES → ONE UNDERSTANDING */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-14 md:pt-18">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 md:p-10 space-y-8">
          {/* Top Bar: Selector & Visual Promise */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Interactive Demonstration
              </span>
              <p className="text-sm font-medium text-stone-900">
                How Reconcile resolves a real misunderstanding:
              </p>
            </div>

            {/* Scenario Switcher Tabs */}
            <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200/60 self-start sm:self-center">
              {HERO_SCENARIOS.map((scenario) => {
                const isActive = scenario.id === activeScenarioId;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => setActiveScenarioId(scenario.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {scenario.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TWO SIDES GRID: Person A vs Person B Private Intakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 relative">
            {/* SIDE A: Private Perspective */}
            <div className="rounded-2xl border border-stone-200/80 bg-[#FAFAF8] p-5 sm:p-6 space-y-3.5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-semibold flex items-center justify-center">
                    A
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    {activeScenario.sideA.name} ({activeScenario.sideA.role})
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded-md">
                  <Lock className="w-3 h-3 text-stone-400" />
                  Private Intake
                </span>
              </div>

              <p className="text-sm text-stone-800 leading-relaxed italic">
                {activeScenario.sideA.rawText}
              </p>

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium text-stone-700">{activeScenario.sideA.felt}</span>
                <span className="text-[11px] text-stone-400">Never seen by {activeScenario.sideB.name}</span>
              </div>
            </div>

            {/* SIDE B: Private Perspective */}
            <div className="rounded-2xl border border-stone-200/80 bg-[#FAFAF8] p-5 sm:p-6 space-y-3.5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-700 text-white text-xs font-semibold flex items-center justify-center">
                    B
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    {activeScenario.sideB.name} ({activeScenario.sideB.role})
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded-md">
                  <Lock className="w-3 h-3 text-stone-400" />
                  Private Intake
                </span>
              </div>

              <p className="text-sm text-stone-800 leading-relaxed italic">
                {activeScenario.sideB.rawText}
              </p>

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium text-stone-700">{activeScenario.sideB.intent}</span>
                <span className="text-[11px] text-stone-400">Never seen by {activeScenario.sideA.name}</span>
              </div>
            </div>
          </div>

          {/* VISUAL TRANSITION: The Convergence Bridge */}
          <div className="pt-2">
            <div className="rounded-2xl border border-stone-300/80 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              {/* Bridge Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center">
                    <span className="text-xs font-bold">&bull;</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                    Reconcile Mediation Bridge &bull; Shared Resolution
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  What they meant vs. How it felt
                </span>
              </div>

              {/* The Disconnect Identified */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <span className="font-semibold text-stone-900 block mb-0.5">The Actual Disconnect:</span>
                {activeScenario.bridge.disconnect}
              </div>

              {/* Practical Language to Say */}
              <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">
                    A Better Conversation to Start With:
                  </span>
                  <span className="text-[11px] font-medium text-stone-500">Ready to send</span>
                </div>
                <p className="text-sm sm:text-base font-normal text-stone-900 italic leading-relaxed">
                  {activeScenario.bridge.suggestedMessage}
                </p>
              </div>

              {/* Action Link to try the demo in mediator */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
                <span>Both perspectives honored &bull; Zero defensive escalation</span>
                <button
                  onClick={() => handleLaunchDemo(activeScenario.demoKey)}
                  className="font-medium text-stone-900 hover:text-stone-700 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Experience this complete interactive flow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
