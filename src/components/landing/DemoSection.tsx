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
    title: 'Parent & Teen',
    subtitle: '"They don\'t trust me" vs. "I\'m scared for their future"',
    isFlagship: true,
    personAQuote: "My parents ask about my grades every day. I'm not a kid anymore. Why can't they just trust me?",
    personBQuote: "I gave up my career for her future. I ask because I'm terrified she'll struggle the way I did.",
    bridgeInsight: "She hears doubt. Mom means love. Same conversation — completely different meanings."
  },
  {
    key: 'demo-friend-friend',
    title: 'Best Friends',
    subtitle: '"She ghosted me" vs. "I had nothing left to give"',
    isFlagship: false,
    personAQuote: "I opened up about something personal and she just... disappeared. Three days. Nothing.",
    personBQuote: "I saw her message. I wanted to respond properly. But work destroyed me and I froze.",
    bridgeInsight: "Sarah heard rejection. Chloe was drowning. The silence meant two completely different things."
  },
  {
    key: 'demo-sibling-sibling',
    title: 'Siblings',
    subtitle: '"He doesn\'t respect my stuff" vs. "We\'re family, why is this a big deal?"',
    isFlagship: false,
    personAQuote: "My brother takes my things without asking. My headphones, my clothes. I've told him a hundred times.",
    personBQuote: "We live in the same house. I didn't think borrowing a hoodie was a federal crime.",
    bridgeInsight: "One sees disrespect. The other sees family closeness. Neither is wrong — but neither feels heard."
  }
];

export function DemoSection({ onSelectDemoSession }: DemoSectionProps) {
  return (
    <section id="demo" className="py-20 px-4 max-w-7xl mx-auto bg-slate-50/70 border border-gray-100 rounded-3xl my-8">
      <div className="text-center mb-14 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Real Scenarios You Can Try Right Now
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Pick a fight. We&apos;ll fix it.
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          These are real-world conflicts people go through every day. Click any scenario to see how Reconcile finds the gap and gives you the words to close it.
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
                ⭐ Try This One First
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                  {demo.title}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 leading-snug">{demo.subtitle}</h3>
              </div>

              {/* Both perspectives */}
              <div className="space-y-3 pt-2">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                    One side:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 italic">
                    &ldquo;{demo.personAQuote}&rdquo;
                  </p>
                </div>

                <div className="bg-violet-50/50 p-3.5 rounded-xl border border-violet-100/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 block mb-1">
                    Other side:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 italic">
                    &ldquo;{demo.personBQuote}&rdquo;
                  </p>
                </div>
              </div>

              {/* The insight */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                <strong className="text-gray-700">The real problem:</strong> {demo.bridgeInsight}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-4 h-4 text-indigo-500" />
                Try the full mediation
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
