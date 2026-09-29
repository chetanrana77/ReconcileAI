'use client';

import React, { useState } from 'react';
import { Lock, ArrowRight, Check, Copy, MessageSquareQuote, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DemoSectionProps {
  onSelectDemoSession: (demoKey: string) => void;
}

interface InteractiveScenario {
  key: string;
  tag: string;
  title: string;
  subtitle: string;
  personA: {
    name: string;
    role: string;
    quote: string;
    coreNeed: string;
  };
  personB: {
    name: string;
    role: string;
    quote: string;
    coreNeed: string;
  };
  reconcileAnalysis: {
    intent: string;
    impact: string;
    commonGround: string;
    readyOpener: string;
  };
}

const INTERACTIVE_SCENARIOS: InteractiveScenario[] = [
  {
    key: 'demo-parent-child',
    tag: 'Flagship Scenario',
    title: 'Parent & Teen',
    subtitle: 'Studies, Independence & Fear of Failure',
    personA: {
      name: 'Maya',
      role: 'Daughter (19)',
      quote: '“They ask about my grades and exam prep every single day. I know they care, but it makes me feel like they have zero faith in my ability to handle my life.”',
      coreNeed: 'Needs autonomy, trust, and to feel respected as an adult.',
    },
    personB: {
      name: 'Elena',
      role: 'Mother',
      quote: '“I sacrificed so much for her opportunities. When I ask, it is because I worry constantly about her future. I don’t want her to struggle or face regret.”',
      coreNeed: 'Needs emotional reassurance that her child will be secure and happy.',
    },
    reconcileAnalysis: {
      intent: 'Love, protection, and anxiety for her child’s future well-being.',
      impact: 'Experienced as suffocating surveillance and a perceived lack of trust.',
      commonGround: 'Both deeply value Maya’s long-term success and emotional peace.',
      readyOpener: '“Mom, I know you ask because you care deeply about my future, but when it’s every day, I feel doubted. Can we agree on a Sunday check-in instead? That way I can update you with less stress.”',
    },
  },
  {
    key: 'demo-friend-friend',
    tag: 'Popular Scenario',
    title: 'Best Friends',
    subtitle: 'Unanswered Text & Disappearing After Vulnerability',
    personA: {
      name: 'Sarah',
      role: 'Friend A',
      quote: '“I opened up about something really heavy that happened, and she just disappeared for three days. It feels like our friendship is completely one-sided.”',
      coreNeed: 'Needs reciprocity, validation, and emotional reliability.',
    },
    personB: {
      name: 'Chloe',
      role: 'Friend B',
      quote: '“Work destroyed me this week and I had an emotional breakdown. I started typing a reply twice, but I didn’t have the mental capacity to give her the care she deserved.”',
      coreNeed: 'Needs space to recover from acute exhaustion without guilt.',
    },
    reconcileAnalysis: {
      intent: 'Protecting the friendship by waiting until she had the capacity to respond properly.',
      impact: 'The silence was experienced as emotional abandonment and cold neglect.',
      commonGround: 'Both cherish the intimacy of the friendship and want to support each other.',
      readyOpener: '“Hey — zero pressure to reply right away! I know life can be overwhelming. I just wanted to make sure you’re okay whenever you have the energy to talk.”',
    },
  },
  {
    key: 'demo-sibling-sibling',
    tag: 'Family Scenario',
    title: 'Siblings',
    subtitle: 'Borrowing Belongings & Disrespected Boundaries',
    personA: {
      name: 'Riley',
      role: 'Older Sibling',
      quote: '“My brother keeps taking my headphones and jackets without asking. I don’t mind sharing, but it feels like my personal boundaries don’t exist in this house.”',
      coreNeed: 'Needs basic courtesy, respect for personal space, and consent.',
    },
    personB: {
      name: 'Casey',
      role: 'Younger Sibling',
      quote: '“We live in the same house and we’re close. I always put it back. When they get furious over a borrowed hoodie, it feels like they treat me like an enemy.”',
      coreNeed: 'Needs familial warmth, informality, and to feel close rather than judged.',
    },
    reconcileAnalysis: {
      intent: 'Comfortable family informality and casual closeness.',
      impact: 'Experienced as entitled intrusion and disregard for personal space.',
      commonGround: 'Both value their closeness and living peacefully under the same roof.',
      readyOpener: '“I’m happy to share my stuff with you, but when it’s taken without asking, I feel disrespected. Just shoot me a quick text before grabbing it and it’s all good.”',
    },
  },
];

export function DemoSection({ onSelectDemoSession }: DemoSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('demo-parent-child');
  const [copied, setCopied] = useState<boolean>(false);

  const currentScenario =
    INTERACTIVE_SCENARIOS.find((s) => s.key === activeTab) || INTERACTIVE_SCENARIOS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentScenario.reconcileAnalysis.readyOpener);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demonstration" className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl space-y-4 mb-12">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
          Interactive Product Demonstration
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
          How two private perspectives become one understanding.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          Explore real conflict scenarios below. Switch between archetypes to see how Reconcile
          identifies the disconnect and generates actionable resolution.
        </p>
      </div>

      {/* Scenario Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-200 pb-4">
        {INTERACTIVE_SCENARIOS.map((scenario) => {
          const isActive = scenario.key === activeTab;
          return (
            <button
              key={scenario.key}
              onClick={() => {
                setActiveTab(scenario.key);
                setCopied(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
              }`}
            >
              <span>{scenario.title}</span>
              <span className="ml-2 text-[10px] opacity-70 hidden sm:inline">({scenario.tag})</span>
            </button>
          );
        })}
      </div>

      {/* Main Miniature Product Experience */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 md:p-10 space-y-8">
        {/* Scenario Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-stone-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-1">
              Active Scenario
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-stone-900">
              {currentScenario.title}: {currentScenario.subtitle}
            </h3>
          </div>
          <Button
            size="sm"
            onClick={() => onSelectDemoSession(currentScenario.key)}
            className="self-start sm:self-auto font-medium text-xs px-4"
          >
            <span>Try in Live Mediator</span>
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Phase 1: Two Private Intakes */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
            Phase 1 &bull; Two Confidential Private Consultations
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Person A Card */}
            <div className="rounded-2xl border border-stone-200 bg-[#FAFAF8] p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                    A
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {currentScenario.personA.name} ({currentScenario.personA.role})
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded-md">
                  <Lock className="w-3 h-3 text-stone-400" />
                  Private to Person A
                </span>
              </div>

              <p className="text-sm text-stone-800 italic leading-relaxed">
                {currentScenario.personA.quote}
              </p>

              <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600">
                <strong className="text-stone-900">Core Need:</strong> {currentScenario.personA.coreNeed}
              </div>
            </div>

            {/* Person B Card */}
            <div className="rounded-2xl border border-stone-200 bg-[#FAFAF8] p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-700 text-white text-xs font-bold flex items-center justify-center">
                    B
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {currentScenario.personB.name} ({currentScenario.personB.role})
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded-md">
                  <Lock className="w-3 h-3 text-stone-400" />
                  Private to Person B
                </span>
              </div>

              <p className="text-sm text-stone-800 italic leading-relaxed">
                {currentScenario.personB.quote}
              </p>

              <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600">
                <strong className="text-stone-900">Core Need:</strong> {currentScenario.personB.coreNeed}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2: The Reconcile Mediation Bridge */}
        <div className="space-y-4 pt-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
            Phase 2 &bull; The Mediation Bridge (Shared Resolution)
          </span>

          <div className="rounded-2xl border border-stone-300 bg-stone-50/50 p-6 sm:p-8 space-y-6">
            {/* The Disconnect Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  What was actually intended:
                </span>
                <p className="text-sm text-stone-900 font-medium leading-relaxed">
                  {currentScenario.reconcileAnalysis.intent}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  How it was emotionally felt:
                </span>
                <p className="text-sm text-stone-900 font-medium leading-relaxed">
                  {currentScenario.reconcileAnalysis.impact}
                </p>
              </div>
            </div>

            {/* Common Ground Highlight */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-700 flex items-start gap-2.5">
              <HeartHandshake className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Recognized Common Ground:</strong>{' '}
                {currentScenario.reconcileAnalysis.commonGround}
              </div>
            </div>

            {/* Practical Suggested Message */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                  <MessageSquareQuote className="w-4 h-4 text-stone-700" />
                  <span>Practical Language to Send:</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 px-2.5 py-1 rounded-md border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm sm:text-base text-stone-900 font-normal italic leading-relaxed">
                {currentScenario.reconcileAnalysis.readyOpener}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
