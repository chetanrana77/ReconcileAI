'use client';

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Handshake,
  Copy,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Lightbulb,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { MediationBridge, ParticipantRole } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MediationBridgeViewProps {
  bridge: MediationBridge;
  currentRole: ParticipantRole;
  onBackToPrivateChat: () => void;
  onReset: () => void;
}

export function MediationBridgeView({
  bridge,
  currentRole,
  onBackToPrivateChat,
  onReset
}: MediationBridgeViewProps) {
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const handleCopyA = () => {
    navigator.clipboard.writeText(bridge.suggestedSharedMessage.fromAtoB);
    setCopiedA(true);
    setTimeout(() => setCopiedA(false), 2000);
  };

  const handleCopyB = () => {
    navigator.clipboard.writeText(bridge.suggestedSharedMessage.fromBtoA);
    setCopiedB(true);
    setTimeout(() => setCopiedB(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-16 animate-fade-in-up">
      <button
        type="button"
        onClick={onBackToPrivateChat}
        className="flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to your private conversation
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          The Neutral Bridge
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Don&apos;t pick a side. Understand both.
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Both participants have spoken privately with Reconcile. Here is the shared picture without the raw anger.
        </p>
      </div>

      {/* SECTION 1: Here's What I'm Hearing (Both Perspectives) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900">
            1. Here&apos;s What I&apos;m Hearing From Both Sides
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Person A side */}
          <Card className="p-6 md:p-7 border-l-4 border-l-indigo-500 bg-white shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md mb-2">
                Person A (Child / Alex)
              </div>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal">
                {bridge.personASideNeutral}
              </p>
            </div>
            <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              Underlying need: Autonomy, trust, and validation
            </p>
          </Card>

          {/* Person B side */}
          <Card className="p-6 md:p-7 border-l-4 border-l-violet-500 bg-white shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 uppercase tracking-wider bg-violet-50 px-2.5 py-0.5 rounded-md mb-2">
                Person B (Parent / Morgan)
              </div>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal">
                {bridge.personBSideNeutral}
              </p>
            </div>
            <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              Underlying need: Protective love, connection, and peace of mind
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION 2: Intention vs Impact (The Aha Moment) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            The Aha Moment
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Here&apos;s where things got crossed.
          </h2>
          <p className="text-sm text-gray-500">
            Intention and impact are often completely out of sync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-indigo-100 relative">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-3">
              How It Was Experienced (Impact)
            </span>
            <p className="text-lg text-gray-900 font-medium italic leading-relaxed">
              &ldquo;{bridge.disconnectAnalysis.personAInterpretation}&rdquo;
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-violet-100 relative">
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider block mb-3">
              How It Was Intended (Intention)
            </span>
            <p className="text-lg text-gray-900 font-medium italic leading-relaxed">
              &ldquo;{bridge.disconnectAnalysis.personBInterpretation}&rdquo;
            </p>
          </div>
        </div>

        {/* The Actual Gap */}
        <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-violet-50 rounded-2xl p-6 sm:p-7 border border-indigo-100/70 text-center max-w-2xl mx-auto shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 mb-2">The Actual Disconnect</p>
          <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed">
            {bridge.disconnectAnalysis.theGap}
          </p>
        </div>
      </section>

      {/* SECTION 3: Common Ground */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            You may actually want the same thing.
          </h2>
          <p className="text-sm text-gray-500">Core commonalities beneath the conflict</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {bridge.commonGround.map((point, idx) => (
            <Card key={idx} className="p-5 flex flex-col items-center text-center bg-emerald-50/40 border border-emerald-100 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600 mb-3">
                {idx === 0 ? <Heart className="w-5 h-5" /> : idx === 1 ? <MessageCircle className="w-5 h-5" /> : <Handshake className="w-5 h-5" />}
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
                {point}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 4: A Better Way to Say It (Ready-to-send messages) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Ready to Talk Directly
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            A better conversation to start with.
          </h2>
          <p className="text-sm text-gray-600">
            Personalized starter messages designed to open dialogue without defensiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Message for Person A */}
          <Card className="overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
            <div className="bg-slate-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">For Person A (Child) to say</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyA}
                className="text-xs font-medium h-8"
              >
                {copiedA ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-6">
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed italic">
                &ldquo;{bridge.suggestedSharedMessage.fromAtoB}&rdquo;
              </p>
            </div>
          </Card>

          {/* Message for Person B */}
          <Card className="overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
            <div className="bg-slate-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">For Person B (Parent) to say</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyB}
                className="text-xs font-medium h-8"
              >
                {copiedB ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-6">
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed italic">
                &ldquo;{bridge.suggestedSharedMessage.fromBtoA}&rdquo;
              </p>
            </div>
          </Card>
        </div>

        {/* Proposed Next Step Agreement */}
        {bridge.proposedNextStep && (
          <div className="bg-emerald-50/60 border border-emerald-100/90 rounded-2xl p-5 flex items-start gap-3 max-w-2xl mx-auto shadow-2xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                Suggested Shared Agreement
              </p>
              <p className="text-sm sm:text-base text-emerald-950 font-medium leading-relaxed">
                {bridge.proposedNextStep}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Completion Actions */}
      <div className="pt-8 border-t border-gray-100 text-center space-y-4">
        <p className="text-xs text-gray-400 italic">
          &ldquo;Remember: understanding someone doesn&apos;t mean agreeing with everything they do.&rdquo;
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={onReset} className="w-full sm:w-auto rounded-full px-8">
            <RotateCcw className="w-4 h-4 mr-2" />
            Start another conversation
          </Button>
        </div>
      </div>
    </div>
  );
}
