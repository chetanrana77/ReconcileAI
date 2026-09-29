'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle2, Shield, ArrowRight, UserCheck, ArrowLeft, MessageCircle } from 'lucide-react';
import { NeutralInvitation } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface InvitationCardProps {
  invitation: NeutralInvitation;
  sessionId: string;
  onSimulateJoin: () => void;
  onBackToChat: () => void;
}

export function InvitationCard({
  invitation,
  sessionId,
  onSimulateJoin,
  onBackToChat,
}: InvitationCardProps) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const joinUrl = `${origin}/join/${sessionId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey, I started a confidential conversation on Reconcile AI so we can talk through things calmly without any arguments or blame. You can join your private side here: ${joinUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 animate-fade-in-up space-y-6">
      <button
        type="button"
        onClick={onBackToChat}
        className="flex items-center text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Back to your private conversation
      </button>

      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-stone-500" />
          Neutral Invitation Ready
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          Help them understand your perspective.
        </h1>
        <p className="text-stone-600 text-sm max-w-lg mx-auto font-normal">
          We never forward raw words. Reconcile translates the underlying need into a neutral,
          respectful invitation that invites dialogue instead of defensiveness.
        </p>
      </div>

      {/* What Person B will see (Transparent Preview) */}
      <Card className="p-6 sm:p-7 border border-stone-200 bg-white shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            What {invitation.recipientLabel} Will See
          </span>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Neutral &amp; Filtered
          </span>
        </div>

        <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-stone-200/80">
          <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-normal italic">
            &ldquo;{invitation.neutralSummary}&rdquo;
          </p>
        </div>

        <div className="pt-2 text-xs text-stone-500 flex items-start gap-2">
          <Shield className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>
            <strong>Privacy Guarantee:</strong> {invitation.recipientLabel} enters their own
            confidential chat with Reconcile first. They will never see your private chat history.
          </span>
        </div>
      </Card>

      {/* Sharing options: WhatsApp + Link */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-stone-900">
          Send Invitation to {invitation.recipientLabel}&apos;s Phone
        </h3>

        {/* WhatsApp direct button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            size="md"
            onClick={handleWhatsAppShare}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 rounded-xl shadow-2xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send on WhatsApp</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleCopyLink}
            className="w-full text-xs sm:text-sm flex items-center justify-center gap-2 rounded-xl cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-400" />
                <span>Copy Invite Link</span>
              </>
            )}
          </Button>
        </div>

        {/* Link display */}
        <div className="pt-2">
          <input
            type="text"
            readOnly
            value={joinUrl}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-600 select-all font-mono"
          />
        </div>

        {/* Presentation Fast-Forward for Judges / Live Demo */}
        <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            <strong>Presenting on one screen?</strong> Switch to the other side instantly:
          </div>
          <Button
            size="sm"
            onClick={onSimulateJoin}
            className="w-full sm:w-auto text-xs font-medium cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1.5" />
            Step into {invitation.recipientLabel}&apos;s Room
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
