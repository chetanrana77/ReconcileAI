'use client';

import React, { useState } from 'react';
import { Lock, ArrowRight, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SupportedLanguage } from '@/lib/types';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';

interface DemoSectionProps {
  onSelectDemoSession: (demoKey: string) => void;
  language?: SupportedLanguage;
}

export function DemoSection({ onSelectDemoSession, language = 'en' }: DemoSectionProps) {
  const lt = getLandingTranslations(language);
  const ds = lt.demoSection;
  const [activeTab, setActiveTab] = useState<string>('demo-parent-child');
  const [copied, setCopied] = useState<boolean>(false);

  const currentScenario =
    ds.tabs.find((s) => s.key === activeTab) || ds.tabs[0];

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
          {ds.eyebrow}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
          {ds.title}
        </h2>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          {ds.subtitle}
        </p>
      </div>

      {/* Scenario Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-200 pb-4">
        {ds.tabs.map((scenario) => {
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
              {currentScenario.tag}
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
            <span>{ds.tryLiveSession}</span>
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Phase 1: Two Private Intakes */}
        <div className="space-y-3">
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
                  {ds.privateThoughtsA}
                </span>
              </div>

              <p className="text-sm text-stone-800 italic leading-relaxed">
                {currentScenario.personA.quote}
              </p>

              <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600">
                <strong className="text-stone-900">{ds.coreNeedLabel}:</strong> {currentScenario.personA.coreNeed}
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
                  {ds.privateThoughtsB}
                </span>
              </div>

              <p className="text-sm text-stone-800 italic leading-relaxed">
                {currentScenario.personB.quote}
              </p>

              <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600">
                <strong className="text-stone-900">{ds.coreNeedLabel}:</strong> {currentScenario.personB.coreNeed}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2: The Reconcile Mediation Bridge */}
        <div className="space-y-4 pt-2">
          <div className="rounded-2xl border border-stone-300 bg-stone-50/50 p-6 sm:p-8 space-y-6">
            {/* The Disconnect Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  {ds.intentBadge}:
                </span>
                <p className="text-sm text-stone-900 font-medium leading-relaxed">
                  {currentScenario.reconcileAnalysis.intent}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  {ds.feltBadge}:
                </span>
                <p className="text-sm text-stone-900 font-medium leading-relaxed">
                  {currentScenario.reconcileAnalysis.impact}
                </p>
              </div>
            </div>

            {/* Identified Common Ground */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  {ds.commonGroundLabel}:
                </span>
                <p className="text-sm text-stone-900 leading-relaxed">
                  {currentScenario.reconcileAnalysis.commonGround}
                </p>
              </div>
            </div>

            {/* Ready-to-Send Opener */}
            <div className="p-5 rounded-2xl bg-[#24392E] text-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#A2C7B5]">
                  {ds.readyToSendMessage}
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ds.copiedText}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{ds.copyButton}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm sm:text-base font-normal text-[#FAF6EE] italic leading-relaxed">
                {currentScenario.reconcileAnalysis.readyOpener}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
