'use client';

import React from 'react';
import { ArrowRight, Sparkles, Shield, Users, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface DemoSectionProps {
  onSelectDemoSession: (demoKey: string) => void;
}

const MEDIATION_DEMOS = [
  {
    key: 'demo-parent-child',
    title: 'Parent ↔ Child',
    subtitle: 'Studies, Independence & Trust',
    isFlagship: true,
    personAQuote: "My parents keep asking about my studies. I know they're worried, but it feels like they don't trust me.",
    personBQuote: "I'm terrified they'll fall behind in a tough world. I ask because I love them, not to control them.",
    bridgeInsight: "Anxious love colliding with emerging autonomy: The intent was care, but the impact was feeling scrutinized."
  },
  {
    key: 'demo-friend-friend',
    title: 'Friend ↔ Friend',
    subtitle: 'Silence After an Argument',
    isFlagship: false,
    personAQuote: "My friend hasn't replied to my messages for two days. I feel like they don't care about our friendship.",
    personBQuote: "I was completely swamped with exams and wanted to cool down so we wouldn't say things we'd regret.",
    bridgeInsight: "One person interpreted silence as apathy; the other person used silence as emotional damage control."
  },
  {
    key: 'demo-sibling-sibling',
    title: 'Sibling ↔ Sibling',
    subtitle: 'Boundaries & Borrowing Possessions',
    isFlagship: false,
    personAQuote: "My brother keeps taking my clothes and headphones without asking. It feels completely disrespectful.",
    personBQuote: "We're close brothers living under the same roof. I didn't think borrowing was an attack on boundaries.",
    bridgeInsight: "A standard of personal property colliding with an assumption of family informality."
  }
];

export function DemoSection({ onSelectDemoSession }: DemoSectionProps) {
  return (
    <section id="demo" className="py-20 px-4 max-w-7xl mx-auto bg-slate-50/70 border border-gray-100 rounded-3xl my-8">
      <div className="text-center mb-14 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Pre-built Interactive Scenarios
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Explore a Complete Mediation
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Experience how Reconcile privately consults with both parties, protects confidential words, and bridges the gap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {MEDIATION_DEMOS.map((demo, index) => (
          <Card
            key={demo.key}
            hoverable
            onClick={() => onSelectDemoSession(demo.key)}
            className={`p-6 sm:p-7 cursor-pointer flex flex-col justify-between h-full bg-white transition-all group relative overflow-hidden ${
              demo.isFlagship ? 'border-2 border-indigo-500 shadow-md' : 'border border-gray-200/90 shadow-2xs'
            }`}
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
          >
            {demo.isFlagship && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                ⭐ Flagship Event Demo
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                  {demo.title}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">{demo.subtitle}</h3>
              </div>

              {/* Both perspectives contrast */}
              <div className="space-y-3 pt-2">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                    Person A Felt:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 italic">
                    &ldquo;{demo.personAQuote}&rdquo;
                  </p>
                </div>

                <div className="bg-violet-50/50 p-3.5 rounded-xl border border-violet-100/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 block mb-1">
                    Person B Felt:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 italic">
                    &ldquo;{demo.personBQuote}&rdquo;
                  </p>
                </div>
              </div>

              {/* The Disconnect Summary */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                <strong className="text-gray-700">The Gap:</strong> {demo.bridgeInsight}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-4 h-4 text-indigo-500" />
                Experience Full Mediation Flow
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
