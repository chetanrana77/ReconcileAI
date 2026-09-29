'use client';

import React from 'react';
import { MessageSquare, Heart, MailCheck, Sparkles, Lock } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'You talk. We listen.',
      description:
        'Tell Reconcile what happened in your own words. Be as messy, angry, or blunt as you need to be. This intake is strictly confidential — nobody else will ever read this raw text.',
      tag: '100% Confidential',
      microExample: '“I felt like they didn’t care at all and completely ignored me.”',
    },
    {
      number: '02',
      title: 'We find what you actually mean.',
      description:
        'Underneath reactive anger is almost always an unspoken vulnerability: the need to be trusted, respected, or heard. Reconcile untangles your true intent from the frustration.',
      tag: 'Emotional Intelligence',
      microExample: 'Identified Core Need: Desires recognition and emotional safety.',
    },
    {
      number: '03',
      title: 'We invite the other side.',
      description:
        'We send a neutral, respectful invitation to the other person. No accusations, no guilt trips, and zero forwarded messages. They are invited to share their side in confidence too.',
      tag: 'Zero Hostility Forwarding',
      microExample: 'Neutral Invitation: “Reconcile noticed a communication gap. We’d love to hear your perspective.”',
    },
    {
      number: '04',
      title: 'Both sides finally make sense.',
      description:
        'Once both perspectives are heard, Reconcile reveals the Mediation Bridge: the exact gap between what was intended and what was felt, and gives both of you language to heal the rift.',
      tag: 'The Resolution Bridge',
      microExample: 'Ready to Send: De-escalating conversation starter crafted for connection.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-stone-200/70 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
            How Reconcile Mediates
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
            From defensive silence to a conversation that works.
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            Four thoughtful steps designed to protect your emotional safety and restore genuine connection.
          </p>
        </div>

        {/* Visual Step Progression */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl border border-stone-200/90 p-6 flex flex-col justify-between shadow-2xs space-y-6 relative group hover:border-stone-300 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-400">
                    STEP {step.number}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-stone-900 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              {/* Micro-preview box */}
              <div className="pt-3 border-t border-stone-100">
                <p className="text-[11px] text-stone-500 italic bg-[#FAFAF8] p-2.5 rounded-xl border border-stone-200/60 leading-relaxed">
                  {step.microExample}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
