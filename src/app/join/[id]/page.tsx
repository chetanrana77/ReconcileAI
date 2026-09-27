'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Shield, ArrowRight, HeartHandshake, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SafeSessionView } from '@/lib/types';
import { Navbar } from '@/components/landing/Navbar';

export default function JoinSessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [session, setSession] = useState<SafeSessionView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/session?id=${id}&role=b`)
      .then((res) => {
        if (!res.ok) throw new Error('Session not found');
        return res.json();
      })
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('This invitation could not be found or has expired.');
        setLoading(false);
      });
  }, [id]);

  const handleStartTalk = async () => {
    try {
      // Initialize Person B on server
      await fetch(`/api/session/${id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join' })
      });

      // Redirect to main session view with role=b parameter
      router.push(`/?session=${id}&role=b`);
    } catch (err) {
      console.error(err);
      router.push(`/?session=${id}&role=b`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
          <span>Opening private invitation...</span>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar onStartClick={() => router.push('/')} onHomeClick={() => router.push('/')} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center bg-white shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Invitation Not Found</h2>
            <p className="text-sm text-gray-600">{error || 'This session link is invalid.'}</p>
            <Button onClick={() => router.push('/')} className="rounded-full w-full">
              Go to Reconcile Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const isParent = session.relationship === 'parent';

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col font-sans">
      <Navbar onStartClick={() => router.push('/')} onHomeClick={() => router.push('/')} />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full space-y-6 text-center animate-fade-in-up">
          {/* Header pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Private Invitation
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Someone wants to talk.
            </h1>
            <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto">
              Reconcile is helping them explain something that has been difficult to say directly without starting an argument.
            </p>
          </div>

          <Card className="p-6 sm:p-8 bg-white border border-gray-200/90 shadow-sm text-left space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>What to Expect</span>
              </div>
              <ul className="space-y-2.5 text-sm text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span><strong>You don&apos;t have to agree with them.</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span><strong>You don&apos;t have to defend yourself.</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>
                    Your conversation with Reconcile is <strong>completely private</strong>. Your raw words are never forwarded.
                  </span>
                </li>
              </ul>
            </div>

            {session.invitation?.neutralSummary && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                &ldquo;{session.invitation.neutralSummary}&rdquo;
              </div>
            )}

            <div className="pt-2">
              <Button
                size="lg"
                onClick={handleStartTalk}
                className="w-full rounded-full py-4 text-base font-semibold shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                <span>Talk to Reconcile</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <p className="text-xs text-gray-400">
            Reconcile AI • &ldquo;Don&apos;t pick a side. Understand both.&rdquo;
          </p>
        </div>
      </main>
    </div>
  );
}
