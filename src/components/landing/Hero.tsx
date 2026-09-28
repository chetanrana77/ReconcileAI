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
    label: 'Parent ↔ Child',
    tag: 'Flagship Event Scenario',
    image: '/images/hero-conversation.jpg',
    imageAlt: 'Mother and daughter having a calm, heartfelt conversation with empathy and mutual relief',
    personA: {
      name: 'Maya',
      role: 'Child (19)',
      avatarBg: 'bg-indigo-600',
      feeling: 'Overwhelmed & Doubted',
      quote: '“They ask about my exams and study hours every day. It feels like they have zero faith in me.”'
    },
    personB: {
      name: 'Elena',
      role: 'Parent',
      avatarBg: 'bg-violet-600',
      feeling: 'Anxious Love & Protection',
      quote: '“I sacrificed so much for her opportunities. I worry constantly and don’t want her to have regrets.”'
    },
    bridge: {
      intent: 'Deep love, protection, and worry about future security',
      perceivedImpact: 'Feels like micromanagement and lack of trust',
      readyMessage: '“I know you ask because you care deeply about my future, but when it’s every day, I feel overwhelmed. Can we agree on a calm Sunday check-in instead?”'
    }
  },
  {
    id: 'friend-friend',
    demoKey: 'demo-friend-friend',
    label: 'Friend ↔ Friend',
    tag: 'Popular Scenario',
    image: '/images/hero-friends.jpg',
    imageAlt: 'Two close friends smiling and sharing an honest, comforting conversation in nature',
    personA: {
      name: 'Sarah',
      role: 'Friend A',
      avatarBg: 'bg-rose-500',
      feeling: 'Hurt & Wondering if it matters',
      quote: '“She didn’t text back for three days after I shared something personal. I felt completely ignored.”'
    },
    personB: {
      name: 'Chloe',
      role: 'Friend B',
      avatarBg: 'bg-amber-600',
      feeling: 'Exhausted & Paralyzed by burnout',
      quote: '“Work completely overwhelmed me this week. I started typing a reply twice but didn’t have the energy.”'
    },
    bridge: {
      intent: 'Valuing the deep friendship, but coping with acute burnout',
      perceivedImpact: 'Silence was perceived as indifference or abandonment',
      readyMessage: '“Hey, zero pressure to reply right away! I know life gets overwhelming. Just wanted to check in and let you know I’m thinking of you.”'
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
        {/* Top Badges & Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-100 shadow-xs text-xs font-semibold text-indigo-700 mx-auto animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Communication Mediator</span>
          <span className="w-1 h-1 rounded-full bg-indigo-300" />
          <span className="text-gray-500 font-medium">Confidential &bull; Neutral &bull; Empathetic</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08] animate-fade-in-up">
          Some things are easier to say
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 mt-2">
            with someone in the middle.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p
          className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-normal text-balance"
          style={{ animationDelay: '100ms' }}
        >
          Reconcile is the AI you talk to when you don&apos;t know how to talk to them. Untangle what
          you&apos;re feeling privately, bridge the misunderstanding, and connect without starting an
          argument.
        </p>

        {/* Action CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 animate-fade-in-up"
          style={{ animationDelay: '180ms' }}
        >
          <Button
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto rounded-full px-8 py-4 text-base font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all group cursor-pointer"
          >
            Talk to Reconcile
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={scrollToDemo}
            className="w-full sm:w-auto rounded-full px-7 py-4 text-base font-medium border border-gray-200/80 bg-white/60 hover:bg-white hover:border-indigo-200 transition-all cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
            <span>See How It Works</span>
          </Button>
        </div>

        {/* Trust Guarantee */}
        <div
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-white/80 backdrop-blur-xs px-4 py-2 rounded-full border border-gray-100 shadow-2xs animate-fade-in-up"
          style={{ animationDelay: '220ms' }}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your words stay private. We help the other person understand what you mean.</span>
        </div>

        {/* ========================================================= */}
        {/* HERO VISUAL SHOWCASE: Editorial Imagery + Live Mediation  */}
        {/* ========================================================= */}
        <div
          className="pt-6 sm:pt-8 w-full max-w-5xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '280ms' }}
        >
          {/* Interactive Scenario Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Live Scenario Preview:
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
              <span>Explore full interactive mediation</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Master Visual Frame */}
          <div className="relative rounded-3xl overflow-hidden border border-indigo-100/80 shadow-2xl bg-slate-900 group">
            {/* The High-Quality Editorial Image */}
            <div className="relative w-full h-[460px] sm:h-[540px] md:h-[620px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeScenario.image}
                alt={activeScenario.imageAlt}
                className="w-full h-full object-cover object-center filter brightness-[0.93] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />

              {/* Rich cinematic vignette and contrast gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-900/10 pointer-events-none" />
              <div className="absolute inset-0 bg-indigo-950/15 mix-blend-color pointer-events-none" />

              {/* Top Meta Header Inside Image */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Confidential Mediation Session</span>
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/85 backdrop-blur-md border border-indigo-400/30 text-white text-[11px] font-medium">
                  <Sparkles className="w-3 h-3 text-indigo-200" />
                  <span>{activeScenario.tag}</span>
                </div>
              </div>

              {/* DESKTOP / TABLET: Floating Glassmorphism Dialogue Cards */}
              <div className="hidden md:block">
                {/* Person A Floating Card (Top Left) */}
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
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Perceived: {activeScenario.personA.feeling}</span>
                  </div>
                </div>

                {/* Person B Floating Card (Top Right) */}
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
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Underlying: {activeScenario.personB.feeling}</span>
                  </div>
                </div>
              </div>

              {/* CENTER-BOTTOM: Reconcile AI Mediation Bridge Card */}
              <div className="absolute bottom-5 left-4 right-4 md:left-6 md:right-6 max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-2xl border border-indigo-100/90 text-left transition-all duration-300">
                  {/* Bridge Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        Reconcile Joint Mediation Bridge
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                      Intention vs. Impact
                    </span>
                  </div>

                  {/* Intention vs Impact Two-Column Split */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2.5 rounded-xl bg-violet-50/70 border border-violet-100/80">
                      <p className="text-[10px] font-bold text-violet-900 uppercase tracking-wider mb-0.5">
                        True Intention
                      </p>
                      <p className="text-gray-700 leading-snug">{activeScenario.bridge.intent}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100/80">
                      <p className="text-[10px] font-bold text-rose-900 uppercase tracking-wider mb-0.5">
                        Felt Impact
                      </p>
                      <p className="text-gray-700 leading-snug">
                        {activeScenario.bridge.perceivedImpact}
                      </p>
                    </div>
                  </div>

                  {/* Ready-to-Send Opener Callout */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-indigo-50/90 border border-indigo-200/70">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-indigo-900">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ready-to-Send De-escalating Opener</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 italic leading-relaxed">
                      {activeScenario.bridge.readyMessage}
                    </p>
                  </div>

                  {/* Launch Trigger Button */}
                  <div className="mt-3 flex items-center justify-between pt-1">
                    <span className="text-[11px] text-gray-500 hidden sm:inline">
                      Neither person is blamed &bull; Both perspectives honored
                    </span>
                    <button
                      onClick={() => handleLaunchScenarioDemo(activeScenario.demoKey)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      <span>Try this full mediation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE ONLY: Quick Side-by-Side Preview drawer */}
            <div className="md:hidden bg-slate-900/95 border-t border-white/10 p-4 text-left space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-white">Private Intakes:</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Never forwarded raw
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  <span className="font-bold text-indigo-300">Person A:</span> {activeScenario.personA.quote}
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  <span className="font-bold text-violet-300">Person B:</span> {activeScenario.personB.quote}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TRUST PILLARS / HIGHLIGHTS: Why Reconcile Works            */}
        {/* ========================================================= */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-gray-100 shadow-xs hover:border-indigo-100 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">100% Private Intakes</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Speak freely without defense. Reconcile untangles what you mean without ever forwarding
              your unfiltered words.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-gray-100 shadow-xs hover:border-indigo-100 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Intention vs. Impact</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Most conflict isn&apos;t ill-intent. We identify the exact gap between what was meant and
              what was emotionally received.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-gray-100 shadow-xs hover:border-indigo-100 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Joint Mediation Bridge</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Reveals shared values and provides ready-to-send messages that invite conversation
              instead of reigniting the argument.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
