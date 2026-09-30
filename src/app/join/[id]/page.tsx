'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Shield, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SafeSessionView, SupportedLanguage } from '@/lib/types';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/landing/Navbar';

export default function JoinSessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [session, setSession] = useState<SafeSessionView | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
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
        if (data.language) setLanguage(data.language);
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
        body: JSON.stringify({ action: 'join' }),
      });

      // Redirect to main session view with role=b and selected language
      router.push(`/?session=${id}&role=b&lang=${language}`);
    } catch (err) {
      console.error(err);
      router.push(`/?session=${id}&role=b&lang=${language}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="flex items-center gap-2.5 text-stone-700 font-medium text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-900 animate-pulse" />
          <span>Opening private invitation...</span>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans">
        <Navbar onStartClick={() => router.push('/')} onHomeClick={() => router.push('/')} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center bg-white shadow-2xs space-y-4 border border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">Invitation Not Found</h2>
            <p className="text-sm text-stone-600">{error || 'This session link is invalid.'}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              Go to Reconcile Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans">
      <Navbar
        onStartClick={() => router.push('/')}
        onHomeClick={() => router.push('/')}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full space-y-6 text-center animate-fade-in-up">
          {/* Header pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            Confidential Invitation
          </span>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Someone wants to talk.
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-md mx-auto">
              Reconcile is an AI mediator helping bridge a communication disconnect without arguments or blame.
            </p>
          </div>

          <Card className="p-6 sm:p-8 bg-white border border-stone-200 shadow-2xs text-left space-y-5">
            {/* Preferred Language Choice */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="text-xs text-stone-600 font-medium">Choose language / भाषा:</span>
              <div className="inline-flex items-center p-0.5 rounded-lg bg-stone-200/60 border border-stone-200/80">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code)}
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer",
                      language === l.code
                        ? "bg-white text-stone-900 font-semibold shadow-2xs"
                        : "text-stone-600 hover:text-stone-900"
                    )}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                What to Expect
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span><strong>You don’t have to agree.</strong> We’re here to understand, not judge.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span><strong>You don’t have to defend yourself.</strong> Your side matters just as much.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span>
                    Your conversation with Reconcile is <strong>completely private</strong>. Your raw words are never forwarded.
                  </span>
                </li>
              </ul>
            </div>

            {session.invitation?.neutralSummary && (
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200/80 text-xs sm:text-sm text-stone-800 italic leading-relaxed">
                &ldquo;{session.invitation.neutralSummary}&rdquo;
              </div>
            )}

            <div className="pt-2">
              <Button
                size="lg"
                onClick={handleStartTalk}
                className="w-full py-3.5 text-sm font-medium shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter Your Private Room</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          <p className="text-xs text-stone-400">
            Reconcile AI &bull; “Understanding someone doesn’t mean agreeing with them.”
          </p>
        </div>
      </main>
    </div>
  );
}
