'use client';

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Handshake,
  Copy,
  CheckCircle2,
  ArrowRight,
  Shield,
  Lightbulb,
  ArrowLeft,
  RotateCcw
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
  onReset,
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

  const isRoleA = currentRole === 'a';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-14 animate-fade-in-up">
      <button
        type="button"
        onClick={onBackToPrivateChat}
        className="flex items-center text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Back to your private conversation
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold tracking-wide uppercase">
          <Shield className="w-3.5 h-3.5 text-stone-500" />
          The Neutral Mediation Bridge
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Don&apos;t pick a side. Understand both.
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-normal">
          Both participants have spoken privately with Reconcile. Here is the shared picture without
          defensiveness or blame.
        </p>
      </div>

      {/* SECTION 1: Both Perspectives Validated */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-stone-900" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            1. Perspectives From Both Sides
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Side A */}
          <Card className="p-6 md:p-7 border border-stone-200 bg-white shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center text-xs font-semibold text-stone-700 uppercase tracking-wider bg-stone-100 px-2.5 py-0.5 rounded-md">
                {isRoleA ? 'Your Perspective' : 'Their Perspective'}
              </span>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-normal">
                {bridge.personASideNeutral}
              </p>
            </div>
            <p className="text-xs text-stone-500 pt-2 border-t border-stone-100 font-normal">
              Underlying need: Autonomy, trust, and validation
            </p>
          </Card>

          {/* Side B */}
          <Card className="p-6 md:p-7 border border-stone-200 bg-white shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center text-xs font-semibold text-stone-700 uppercase tracking-wider bg-stone-100 px-2.5 py-0.5 rounded-md">
                {isRoleA ? 'Their Perspective' : 'Your Perspective'}
              </span>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-normal">
                {bridge.personBSideNeutral}
              </p>
            </div>
            <p className="text-xs text-stone-500 pt-2 border-t border-stone-100 font-normal">
              Underlying need: Protective love, connection, and peace of mind
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION 2: Intention vs Impact (The Disconnect) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            The Core Insight
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Here&apos;s where things got crossed.
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-normal">
            Intention and impact are often completely out of sync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              How It Was Experienced (Impact)
            </span>
            <p className="text-base sm:text-lg text-stone-900 font-normal italic leading-relaxed">
              &ldquo;{bridge.disconnectAnalysis.personAInterpretation}&rdquo;
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              How It Was Intended (Intention)
            </span>
            <p className="text-base sm:text-lg text-stone-900 font-normal italic leading-relaxed">
              &ldquo;{bridge.disconnectAnalysis.personBInterpretation}&rdquo;
            </p>
          </div>
        </div>

        {/* The Actual Gap */}
        <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-stone-200/90 text-center max-w-2xl mx-auto shadow-2xs space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">The Actual Disconnect</p>
          <p className="text-sm sm:text-base text-stone-800 font-medium leading-relaxed">
            {bridge.disconnectAnalysis.theGap}
          </p>
        </div>
      </section>

      {/* SECTION 3: Common Ground */}
      <section className="space-y-5">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-stone-900 mb-1">
            You actually want the same thing.
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-normal">Core commonalities beneath the conflict</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {bridge.commonGround.map((point, idx) => (
            <Card key={idx} className="p-5 flex flex-col items-center text-center bg-white border border-stone-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                {idx === 0 ? <Heart className="w-4 h-4" /> : idx === 1 ? <MessageCircle className="w-4 h-4" /> : <Handshake className="w-4 h-4" />}
              </div>
              <p className="text-xs sm:text-sm font-medium text-stone-800 leading-snug">
                {point}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 4: Ready to Talk Directly (Practical Messages) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Actionable Language
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
            A better conversation to start with.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-normal">
            Personalized starter messages designed to open dialogue without defensiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Message for Person A */}
          <Card className="overflow-hidden border border-stone-200 bg-white shadow-2xs flex flex-col justify-between p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  {isRoleA ? 'Your Starter Message' : 'Their Starter Message'}
                </span>
                <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  Ready to send
                </span>
              </div>
              <p className="text-sm sm:text-base text-stone-900 italic font-normal leading-relaxed">
                &ldquo;{bridge.suggestedSharedMessage.fromAtoB}&rdquo;
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyA}
              className="w-full text-xs font-medium cursor-pointer"
            >
              {copiedA ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span>Message Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                  <span>Copy Message</span>
                </>
              )}
            </Button>
          </Card>

          {/* Message for Person B */}
          <Card className="overflow-hidden border border-stone-200 bg-white shadow-2xs flex flex-col justify-between p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  {!isRoleA ? 'Your Starter Message' : 'Their Starter Message'}
                </span>
                <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  Ready to send
                </span>
              </div>
              <p className="text-sm sm:text-base text-stone-900 italic font-normal leading-relaxed">
                &ldquo;{bridge.suggestedSharedMessage.fromBtoA}&rdquo;
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyB}
              className="w-full text-xs font-medium cursor-pointer"
            >
              {copiedB ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span>Message Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                  <span>Copy Message</span>
                </>
              )}
            </Button>
          </Card>
        </div>
      </section>

      {/* Completion & Next Steps */}
      <div className="text-center pt-6 pb-12 border-t border-stone-200 space-y-4">
        <p className="text-xs text-stone-500 font-normal">
          “Understanding someone doesn’t mean agreeing with them.”
        </p>
        <Button
          size="md"
          onClick={onReset}
          className="text-xs font-medium cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          <span>Start Another Conversation</span>
        </Button>
      </div>
    </div>
  );
}
