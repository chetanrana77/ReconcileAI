'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Lock,
  HeartHandshake,
  MessageSquareQuote,
  RefreshCw,
  Play,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  onStart: () => void;
  onSelectDemo?: (demoKey: string) => void;
}

interface ScenarioData {
  id: string;
  demoKey: string;
  label: string;
  tag: string;
  image: string;
  imageAlt: string;
  personA: {
    name: string;
    role: string;
    avatarBg: string;
    feeling: string;
    quote: string;
  };
  personB: {
    name: string;
    role: string;
    avatarBg: string;
    feeling: string;
    quote: string;
  };
  bridge: {
    intent: string;
    perceivedImpact: string;
    readyMessage: string;
  };
}

const SCENARIOS: ScenarioData[] = [
  {
    id: 'parent-child',
    demoKey: 'demo-parent-child',
    label: 'Parent & Teen',
    tag: 'Most Popular',
    image: '/images/hero-conversation.jpg',
    imageAlt: 'A mother and daughter sitting together having a calm, heartfelt conversation over coffee',
    personA: {
      name: 'Maya',
      role: 'Daughter, 19',
      avatarBg: 'bg-indigo-600',
      feeling: 'Feels controlled',
      quote: '"Mom asks about my grades every single day. I know she cares, but it makes me feel like she doesn\'t believe in me at all."'
    },
    personB: {
      name: 'Elena',
      role: 'Mom',
      avatarBg: 'bg-violet-600',
      feeling: 'Scared of failing her',
      quote: '"I gave up my career so she could have better opportunities. I just don\'t want her to struggle the way I did."'
    },
    bridge: {
      intent: 'Love — she asks because she\'s scared, not because she doubts',
      perceivedImpact: 'Control — it feels like "you\'re not good enough" every day',
      readyMessage: '"Mom, I know you ask because my future matters to you. But when it\'s every day, it starts to feel like you don\'t trust me. What if we did a Sunday check-in instead? I\'d actually look forward to it."'
    }
  },
  {
    id: 'friend-friend',
    demoKey: 'demo-friend-friend',
    label: 'Two Friends',
    tag: 'Common Situation',
    image: '/images/hero-friends.jpg',
    imageAlt: 'Two close friends sitting on a park bench having a real conversation during golden hour',
    personA: {
      name: 'Sarah',
      role: 'Best friend',
      avatarBg: 'bg-rose-500',
      feeling: 'Feels forgotten',
      quote: '"I told her something really personal. Then nothing. Three days, zero response. It\'s like I don\'t matter."'
    },
    personB: {
      name: 'Chloe',
      role: 'Best friend',
      avatarBg: 'bg-amber-600',
      feeling: 'Drowning in burnout',
      quote: '"I saw the message. I started typing twice. But work destroyed me this week and I had nothing left to give anyone."'
    },
    bridge: {
      intent: 'She cares deeply — the silence was exhaustion, not rejection',
      perceivedImpact: 'It felt like "you and your feelings don\'t matter to me"',
      readyMessage: '"Hey — no pressure to reply right now. I know things have been brutal at work. Just wanted you to know I\'m here whenever you\'re ready. No rush."'
    }
  }
];

export function Hero({ onStart, onSelectDemo }: HeroProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('parent-child');
  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLaunchScenarioDemo = (demoKey: string) => {
    if (onSelectDemo) {
      onSelectDemo(demoKey);
    } else {
      onStart();
    }
  };

  return (
    <section className="relative w-full pt-10 pb-16 md:pt-16 md:pb-24 flex flex-col items-center justify-center overflow-hidden text-center">
      {/* Ambient background glow accents */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 pointer-events-none">
        <div
          className="w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/40 to-pink-100/30 rounded-full blur-3xl mix-blend-multiply animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div
          className="w-[500px] h-[500px] bg-gradient-to-br from-violet-200/40 via-indigo-100/40 to-emerald-100/20 rounded-full blur-3xl mix-blend-multiply animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* Social proof micro-badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-100 shadow-xs text-xs font-semibold text-indigo-700 mx-auto animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Stop arguing. Start understanding.</span>
        </div>

        {/* PRIMARY HEADLINE — Problem + Solution in 5th-grade words */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08] animate-fade-in-up">
          You know what you feel.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 mt-2">
            We help you say it right.
          </span>
        </h1>

        {/* SUBHEAD — Specific, concrete, human. Not corporate. */}
        <p
          className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-normal text-balance"
          style={{ animationDelay: '100ms' }}
        >
          When you&apos;re hurt, angry, or confused — and talking would only make it worse — talk to Reconcile first. We listen to both sides privately, find where things got crossed, and give you the exact words to fix it.
        </p>

        {/* CTAs — Clear action, zero friction */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 animate-fade-in-up"
          style={{ animationDelay: '180ms' }}
        >
          <Button
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto rounded-full px-8 py-4 text-base font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all group cursor-pointer"
          >
            Tell Me What Happened
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={scrollToDemo}
            className="w-full sm:w-auto rounded-full px-7 py-4 text-base font-medium border border-gray-200/80 bg-white/60 hover:bg-white hover:border-indigo-200 transition-all cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
            <span>Watch a 60-Second Example</span>
          </Button>
        </div>

        {/* Trust line — Addresses the #1 objection immediately */}
        <div
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-white/80 backdrop-blur-xs px-4 py-2 rounded-full border border-gray-100 shadow-2xs animate-fade-in-up"
          style={{ animationDelay: '220ms' }}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Free. No signup. Nothing you say is ever shared with the other person.</span>
        </div>

        {/* ========================================================= */}
        {/* HERO VISUAL: Show the product working, not just an image  */}
        {/* ========================================================= */}
        <div
          className="pt-6 sm:pt-8 w-full max-w-5xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '280ms' }}
        >
          {/* Scenario tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                See it in action:
              </span>
              <div className="inline-flex p-1 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200/80 shadow-2xs">
                {SCENARIOS.map((s) => {
                  const isActive = s.id === activeScenarioId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveScenarioId(s.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                      }`}
                    >
                      <span>{s.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleLaunchScenarioDemo(activeScenario.demoKey)}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 transition-colors cursor-pointer group"
            >
              <span>Try the full conversation</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Visual showcase frame */}
          <div className="relative rounded-3xl overflow-hidden border border-indigo-100/80 shadow-2xl bg-slate-900 group">
            <div className="relative w-full h-[460px] sm:h-[540px] md:h-[620px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeScenario.image}
                alt={activeScenario.imageAlt}
                className="w-full h-full object-cover object-center filter brightness-[0.93] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />

              {/* Cinematic overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-900/10 pointer-events-none" />
              <div className="absolute inset-0 bg-indigo-950/15 mix-blend-color pointer-events-none" />

              {/* Top badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Both sides are 100% private</span>
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/85 backdrop-blur-md border border-indigo-400/30 text-white text-[11px] font-medium">
                  <Sparkles className="w-3 h-3 text-indigo-200" />
                  <span>{activeScenario.tag}</span>
                </div>
              </div>

              {/* DESKTOP: Floating perspective cards */}
              <div className="hidden md:block">
                {/* Person A card */}
                <div className="absolute top-16 left-6 max-w-[290px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 text-left transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full ${activeScenario.personA.avatarBg} text-white flex items-center justify-center text-xs font-bold shadow-xs`}
                      >
                        A
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">
                          {activeScenario.personA.name}
                        </p>
                        <p className="text-[10px] text-gray-500">{activeScenario.personA.role}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <Lock className="w-2.5 h-2.5 text-emerald-600" />
                      Private
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    {activeScenario.personA.quote}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center text-[10px] text-gray-400">
                    <span>{activeScenario.personA.feeling}</span>
                  </div>
                </div>

                {/* Person B card */}
                <div className="absolute top-16 right-6 max-w-[290px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 text-left transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full ${activeScenario.personB.avatarBg} text-white flex items-center justify-center text-xs font-bold shadow-xs`}
                      >
                        B
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">
                          {activeScenario.personB.name}
                        </p>
                        <p className="text-[10px] text-gray-500">{activeScenario.personB.role}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <Lock className="w-2.5 h-2.5 text-emerald-600" />
                      Private
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    {activeScenario.personB.quote}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center text-[10px] text-gray-400">
                    <span>{activeScenario.personB.feeling}</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM: The Bridge — this is the product's magic moment */}
              <div className="absolute bottom-5 left-4 right-4 md:left-6 md:right-6 max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-2xl border border-indigo-100/90 text-left transition-all duration-300">
                  {/* Bridge header */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        Here&apos;s where things got crossed
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                      What they meant vs. how it felt
                    </span>
                  </div>

                  {/* The gap — simple, clear language */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2.5 rounded-xl bg-violet-50/70 border border-violet-100/80">
                      <p className="text-[10px] font-bold text-violet-900 uppercase tracking-wider mb-0.5">
                        What they actually meant
                      </p>
                      <p className="text-gray-700 leading-snug">{activeScenario.bridge.intent}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100/80">
                      <p className="text-[10px] font-bold text-rose-900 uppercase tracking-wider mb-0.5">
                        But how it felt
                      </p>
                      <p className="text-gray-700 leading-snug">
                        {activeScenario.bridge.perceivedImpact}
                      </p>
                    </div>
                  </div>

                  {/* The words to say */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-indigo-50/90 border border-indigo-200/70">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-indigo-900">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Copy this. Send it. Start a real conversation.</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 italic leading-relaxed">
                      {activeScenario.bridge.readyMessage}
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="mt-3 flex items-center justify-between pt-1">
                    <span className="text-[11px] text-gray-500 hidden sm:inline">
                      No blame. No sides. Just clarity.
                    </span>
                    <button
                      onClick={() => handleLaunchScenarioDemo(activeScenario.demoKey)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      <span>Try this yourself</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE: Compact preview */}
            <div className="md:hidden bg-slate-900/95 border-t border-white/10 p-4 text-left space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-white">What they each said privately:</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Never shared with each other
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  <span className="font-bold text-indigo-300">{activeScenario.personA.name}:</span> {activeScenario.personA.quote}
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  <span className="font-bold text-violet-300">{activeScenario.personB.name}:</span> {activeScenario.personB.quote}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* THREE VALUE PROPS — Problem → Solution in plain English   */}
        {/* ========================================================= */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-gray-100 shadow-xs hover:border-indigo-100 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Say it ugly. We clean it up.</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Vent everything — the anger, the hurt, the messy parts. We figure out what you actually need to say. Your raw words never reach the other person.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-gray-100 shadow-xs hover:border-indigo-100 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">See why they did it.</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Most fights aren&apos;t about bad people. They&apos;re about good people who misread each other. We show you the gap between what they meant and how it landed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-gray-100 shadow-xs hover:border-indigo-100 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Get the exact words to send.</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Not therapy-speak. Not a script. A real message that sounds like you — but opens a door instead of starting another fight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
