'use client';

import React from 'react';
import { Lock, Eye, RefreshCw, MessageSquareQuote, Check } from 'lucide-react';

export function OutcomeFeatures() {
  const outcomes = [
    {
      number: '01',
      title: 'Say it ugly. We clean it up.',
      eyebrow: 'Unfiltered Emotional Intake',
      description:
        'When you’re angry or heartbroken, holding your tongue is impossible. Reconcile gives you a confidential container to vent everything without regret. We extract what you really mean and ensure your raw words never reach the other person.',
      visual: (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-100/70 border border-stone-200">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Your raw intake (Private):
            </span>
            <p className="text-stone-700 italic">
              “I’m sick of them ignoring my texts. It proves they don’t give a damn about me.”
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-[10px] font-semibold text-stone-700 uppercase tracking-wider block mb-1">
              What Reconcile identifies:
            </span>
            <p className="text-stone-900 font-medium">
              Core Need: Desires emotional reliability and to feel valued in the relationship.
            </p>
          </div>
        </div>
      ),
    },
    {
      number: '02',
      title: 'See what they may have meant.',
      eyebrow: 'Perspective Without Excuses',
      description:
        'Step out of defensive tunnel vision. Reconcile helps you understand the other person’s pressures, fears, or awkwardness — without excusing neglect or invalidating your genuine pain.',
      visual: (
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2 text-xs">
          <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
            Alternative explanations to explore:
          </span>
          <ul className="space-y-1.5 text-stone-700">
            <li className="flex items-start gap-1.5">
              <span className="text-stone-400 mt-0.5">&bull;</span>
              <span>They felt overwhelmed and postponed replying to avoid saying the wrong thing.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-stone-400 mt-0.5">&bull;</span>
              <span>They are experiencing external stress they haven’t found words to share yet.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      number: '03',
      title: 'Understand where things crossed.',
      eyebrow: 'Intent vs. Impact Translation',
      description:
        'The heart of our mediation engine. We pinpoint the exact moment where good intentions landed as emotional hurt, breaking the circular cycle of blame and defensive counter-attacks.',
      visual: (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-stone-200">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Their Intention:
            </span>
            <p className="text-stone-800 font-medium leading-snug">
              To prevent an escalation while exhausted.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-stone-200">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Felt Impact:
            </span>
            <p className="text-stone-800 font-medium leading-snug">
              Experienced as cold abandonment.
            </p>
          </div>
        </div>
      ),
    },
    {
      number: '04',
      title: 'Know what to say next.',
      eyebrow: 'Actionable De-escalating Language',
      description:
        'No therapy-speak. No robotic scripts. Reconcile crafts natural, de-escalating openers that sound authentically like you — designed to lower defensive walls and invite real conversation.',
      visual: (
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
              Generated message:
            </span>
            <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
              Ready to send
            </span>
          </div>
          <p className="text-stone-900 italic font-medium leading-relaxed">
            “Hey, I know things have been hectic. When you have ten minutes, I’d love to check in without any pressure.”
          </p>
        </div>
      ),
    },
  ];

  return (
    <section id="outcomes" className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Section Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
          Designed for Emotional Outcomes
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
          Tools built for clarity, not arguments.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          Every feature in Reconcile exists to turn confusion into clarity and helplessness into
          practical words.
        </p>
      </div>

      {/* Outcome Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {outcomes.map((outcome) => (
          <div
            key={outcome.number}
            className="bg-white rounded-3xl border border-stone-200/90 p-7 sm:p-8 flex flex-col justify-between shadow-2xs space-y-6 hover:border-stone-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-400">
                  OUTCOME {outcome.number}
                </span>
                <span className="text-[10px] uppercase font-semibold text-stone-500">
                  {outcome.eyebrow}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                {outcome.title}
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                {outcome.description}
              </p>
            </div>

            {/* Interactive Visual Preview */}
            <div className="pt-2">{outcome.visual}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
