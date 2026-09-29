'use client';

import React from 'react';
import { Lock, EyeOff, ShieldCheck, DatabaseZap } from 'lucide-react';

export function PrivacySection() {
  const privacyPillars = [
    {
      icon: EyeOff,
      title: 'Person A cannot see Person B’s conversation',
      description:
        'Person A’s intake channel is strictly isolated from Person B. Even after mediation is generated, Person B cannot read what Person A wrote during their private session.',
    },
    {
      icon: Lock,
      title: 'Person B cannot see Person A’s conversation',
      description:
        'Person B’s intake channel is completely confidential. Raw emotional venting, accusations, or insecurities remain locked to their individual view.',
    },
    {
      icon: ShieldCheck,
      title: 'Raw emotional venting is never forwarded',
      description:
        'Reconcile is not a messaging app that blindly sends messages across. The only text both people see is the neutral, consented Mediation Bridge.',
    },
    {
      icon: DatabaseZap,
      title: 'Private data is used only for mediation',
      description:
        'Your conversations are used solely to generate mutual understanding for your active session. We do not sell user data or train public commercial models on your private relationships.',
    },
  ];

  return (
    <section id="privacy" className="py-20 md:py-28 bg-[#F5F4F0] border-t border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            <span>Cryptographic Privacy Boundaries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
            Your raw words stay private.
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            Confidentiality is not an option in Reconcile. It is the architectural boundary that makes
            honesty possible. You can say what you really feel without fear of making things worse.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {privacyPillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-2xs space-y-3.5 hover:border-stone-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 border border-stone-200/60">
                <pillar.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-stone-900 leading-snug">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Precise Architecture Note */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200/80 text-xs sm:text-sm text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-semibold text-stone-900 block">Strict Data Isolation (Server-Enforced):</span>
            <p className="text-stone-500">
              Each session segregates data into <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono text-xs">PRIVATE_A</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono text-xs">PRIVATE_B</code>, and <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono text-xs">SHARED</code>. Raw transcripts are never leaked across endpoints.
            </p>
          </div>
          <span className="text-xs font-mono uppercase font-semibold text-stone-500 shrink-0">
            Zero Tracking &bull; Zero Selling
          </span>
        </div>
      </div>
    </section>
  );
}
