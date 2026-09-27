'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle2, Shield, ArrowRight, UserCheck, MessageSquare, ArrowLeft } from 'lucide-react';
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
  onBackToChat
}: InvitationCardProps) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const joinUrl = `${origin}/join/${sessionId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 animate-fade-in-up space-y-6">
      <button
        type="button"
        onClick={onBackToChat}
        className="flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to your private conversation
      </button>

      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          Neutral Translation Ready
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Help them understand your side.
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto">
          We never forward raw words. Reconcile translates the underlying need into a neutral, non-accusatory invitation.
        </p>
      </div>

      {/* What Person B will see (Transparent Preview) */}
      <Card className="p-6 sm:p-7 border border-indigo-100/90 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            What {invitation.recipientLabel} Will See
          </span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Filtered &amp; Neutral
          </span>
        </div>

        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100/80">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal italic">
            &ldquo;{invitation.neutralSummary}&rdquo;
          </p>
        </div>

        <div className="pt-2 text-xs text-gray-500 flex items-start gap-2">
          <Shield className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <span>
            <strong>Privacy Guarantee:</strong> Person B will be invited into their own confidential chat with Reconcile first. They will not see your private chat history.
          </span>
        </div>
      </Card>

      {/* Sharing link & Simulation Action */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Share Private Invitation Link</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={joinUrl}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-700 select-all font-mono"
          />
          <Button
            size="sm"
            onClick={handleCopyLink}
            className="rounded-xl px-4 text-xs font-medium cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        {/* Demo Fast-Forward Button for Event Judges */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            <strong>Demonstrating right now?</strong> Step into the other person's shoes instantly:
          </div>
          <Button
            size="sm"
            onClick={onSimulateJoin}
            className="w-full sm:w-auto rounded-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1.5" />
            Simulate {invitation.recipientLabel} Joining
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
