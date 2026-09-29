'use client';

import React from 'react';
import { ArrowRight, ShieldAlert, CheckCircle2, Split, ArrowDown } from 'lucide-react';

export function ProblemStory() {
  const disconnectExamples = [
    {
      spoken: '“Can we talk about this tomorrow?”',
      perceived: '“You don’t care about what I’m feeling and want to brush this under the rug.”',
      intended: '“I’m overwhelmed right now and afraid of saying something I’ll regret.”',
    },
    {
      spoken: '“I just don’t want you to fall behind.”',
      perceived: '“I don’t believe in your intelligence or trust your judgment.”',
      intended: '“I love you and I’m terrified of seeing you struggle the way I did.”',
    },
    {
      spoken: '“Fine. Do whatever you want.”',
      perceived: '“You’ve given up on this relationship.”',
      intended: '“I feel completely powerless and hurt, and don’t know what else to say.”',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-stone-200/70 bg-[#F5F4F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Headline & Opening Premise */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
            The Psychology of Conflict
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
            “When you&apos;re hurt, every explanation sounds like an excuse.”
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            Most arguments between people who care about each other aren&apos;t caused by a lack of
            love. They are caused by a translation failure: what was intended is almost never what was
            received.
          </p>
        </div>

        {/* The Emotional Disconnect Matrix */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
            Why conversations get stuck:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {disconnectExamples.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                    What was said:
                  </span>
                  <p className="text-sm font-medium text-stone-900 leading-snug">
                    {item.spoken}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <div className="rounded-xl bg-stone-50 p-3 border border-stone-200/60">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-0.5">
                      What was heard:
                    </span>
                    <p className="text-xs text-stone-700 italic leading-relaxed">
                      {item.perceived}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#FAF9F6] p-3 border border-stone-200/60">
                    <span className="text-[10px] font-semibold text-stone-700 uppercase tracking-wider block mb-0.5">
                      What was actually meant:
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
              How Reconcile breaks the defensive loop
            </h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              When two people try to talk while defensive, their nervous systems are in fight-or-flight.
              Reconcile introduces a confidential mediator in the middle to restore emotional safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-stone-400">01</span>
              <h4 className="text-sm font-semibold text-stone-900">Unfiltered Venting</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                You can be angry, messy, and blunt. Your raw words remain strictly private with Reconcile.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-stone-400">02</span>
              <h4 className="text-sm font-semibold text-stone-900">Neutral Translation</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Reconcile extracts the underlying vulnerability and core need, discarding the hostile accusations.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-stone-400">03</span>
              <h4 className="text-sm font-semibold text-stone-900">Two-Sided Perspective</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                The other person shares their side without fear of blame. Both sides are validated neutrally.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-stone-400">04</span>
              <h4 className="text-sm font-semibold text-stone-900">Practical Next Words</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                You receive de-escalating openers that invite connection without sacrificing your boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
