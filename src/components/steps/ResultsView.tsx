'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Handshake, Copy, CheckCircle2, RotateCcw, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReconcileResponse, RelationshipType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ResultsViewProps {
  response: ReconcileResponse;
  relationship: RelationshipType;
  onReset: () => void;
  onTryDifferent?: () => void;
  onToneChange?: (tone: string) => void;
}

type ToneType = 'original' | 'softer' | 'direct' | 'casual';

export function ResultsView({ response, relationship, onReset, onTryDifferent, onToneChange }: ResultsViewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTone, setActiveTone] = useState<ToneType>('original');

  // Compute tone variation based on original message
  const getMessageForTone = (tone: ToneType): string => {
    const base = response.reconciliationMessage;
    if (tone === 'original') return base;

    if (tone === 'softer') {
      return `Hey, no pressure to reply to this right away. I just wanted to gently share what's been on my mind because you mean a lot to me. I've been feeling a little hurt about what happened, but I know you might be carrying a lot right now too. Whenever you have the space, I'd really love to catch up and talk it through with no hard feelings.`;
    }

    if (tone === 'direct') {
      return `Hey, I want to be upfront because our relationship matters to me. When what happened went down, it really bothered me, and I'd rather address it honestly than let things sit. I want to understand where you were coming from and clear the air. Let me know when you have 10 minutes to talk.`;
    }

    if (tone === 'casual') {
      return `Hey! Honestly just wanted to check in real quick about earlier. Felt like things got a little crossed between us and I definitely didn't want any weird tension. Whenever you're free, let's catch up for a second so we're on the same page.`;
    }

    return base;
  };

  const currentMessage = getMessageForTone(activeTone);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToneSelect = (tone: ToneType) => {
    setActiveTone(tone);
    onToneChange?.(tone);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-20">
      
      {/* Narrative Progress Header */}
      <div className="text-center max-w-2xl mx-auto pt-2 pb-4 animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Perspective Bridge
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Let&apos;s look at this together.
        </h1>
        <p className="text-gray-600 mt-2 text-base sm:text-lg">
          Here is what might be happening beneath the surface.
        </p>
      </div>

      {/* Section 1: Your Side */}
      <section className="animate-fade-in-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary-500)]"></span>
          <p className="text-sm font-semibold tracking-wide uppercase text-[var(--color-primary-600)]">First, I hear your side.</p>
        </div>
        <Card className="p-6 md:p-8 border-l-4 border-l-[var(--color-primary-500)] bg-white shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">What you&apos;re probably experiencing</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 font-normal">
            {response.userPerspective.summary}
          </p>
          {response.userPerspective.feelings && response.userPerspective.feelings.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2.5">Emotions in play</p>
              <div className="flex flex-wrap gap-2">
                {response.userPerspective.feelings.map((feeling, i) => (
                  <span key={i} className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {feeling}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Section 2: Perspective Flip */}
      <section className="animate-fade-in-up" style={{ animationDelay: '350ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-violet-500"></span>
          <p className="text-sm font-semibold tracking-wide uppercase text-violet-700">Now let&apos;s flip the perspective.</p>
        </div>
        <p className="text-sm text-gray-500 mb-4 pl-4 border-l-2 border-transparent">
          This doesn&apos;t mean your feelings aren&apos;t valid. But there might be another explanation.
        </p>
        <Card className="p-6 md:p-8 border-l-4 border-l-violet-400 bg-violet-50/40 shadow-sm hover:shadow-md transition-shadow border-gray-100">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Their possible side</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/80 text-violet-700 border border-violet-100 shadow-2xs">
              Possible perspective — not a fact
            </span>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-5">
            {response.otherPerspective.summary}
          </p>
          {response.otherPerspective.possibleReasons && response.otherPerspective.possibleReasons.length > 0 && (
            <div className="bg-white/70 rounded-xl p-5 border border-violet-100/60">
              <p className="text-xs font-semibold text-violet-900 uppercase tracking-wider mb-3">What could explain this:</p>
              <ul className="space-y-2.5 text-gray-700">
                {response.otherPerspective.possibleReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base">
                    <span className="text-violet-500 font-bold leading-relaxed mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </section>

      {/* Section 3: The Aha Moment */}
      <section className="animate-fade-in-up" style={{ animationDelay: '550ms', animationFillMode: 'both' }}>
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">The Disconnect</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Here&apos;s where things may have got crossed.
          </h2>
        </div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-6">
          {/* YOU Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-indigo-100/80 relative flex flex-col justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider w-fit mb-4">
              <span>You Felt / Assumed</span>
            </div>
            <p className="text-lg sm:text-xl text-gray-900 font-medium italic leading-relaxed my-auto">
              &ldquo;{response.misunderstanding.userInterpretation}&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
              Your reaction to what happened
            </div>
          </div>
          
          {/* THEM Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-violet-100/80 relative flex flex-col justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg uppercase tracking-wider w-fit mb-4">
              <span>They Likely Intended</span>
            </div>
            <p className="text-lg sm:text-xl text-gray-900 font-medium italic leading-relaxed my-auto">
              &ldquo;{response.misunderstanding.possibleOtherInterpretation}&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
              Their internal framing
            </div>
          </div>
        </div>
        
        {/* The Actual Gap */}
        <div className="bg-gradient-to-r from-indigo-50/70 via-stone-50 to-violet-50/70 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto border border-indigo-100/60 shadow-2xs">
          <p className="text-xs text-indigo-700 font-bold uppercase tracking-widest mb-2.5">The Actual Gap</p>
          <p className="text-lg sm:text-xl text-gray-900 font-medium leading-relaxed">
            {response.misunderstanding.summary}
          </p>
        </div>
      </section>

      {/* Section 4: Common Ground */}
      <section className="animate-fade-in-up" style={{ animationDelay: '750ms', animationFillMode: 'both' }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            You may actually want the same thing.
          </h2>
          <p className="text-sm text-gray-500">Shared intentions often get lost in translation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {response.commonGround.map((ground, i) => (
            <Card key={i} className="p-6 flex flex-col items-center text-center bg-emerald-50/40 border border-emerald-100/80 shadow-2xs hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600 mb-4">
                {i === 0 ? <Heart className="w-6 h-6 text-emerald-600" /> : 
                 i === 1 ? <MessageCircle className="w-6 h-6 text-emerald-600" /> : 
                 <Handshake className="w-6 h-6 text-emerald-600" />}
              </div>
              <p className="text-gray-800 font-medium text-sm sm:text-base leading-snug">{ground}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 5: Reconciliation Message */}
      <section className="animate-fade-in-up" style={{ animationDelay: '950ms', animationFillMode: 'both' }}>
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">Next Steps</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Want to say something?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Here&apos;s a version that gets your point across without turning it into another argument.
          </p>
        </div>
        
        <Card className="overflow-hidden shadow-lg border border-indigo-100/80 bg-white">
          <div className="bg-slate-50/80 px-6 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-sm font-semibold text-gray-700">Recommended Message</span>
              {activeTone !== 'original' && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                  {activeTone} tone
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy} 
              className={cn(
                "rounded-full transition-all text-xs sm:text-sm font-medium",
                copied ? "text-emerald-700 bg-emerald-50" : "text-gray-600 hover:text-gray-900"
              )}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copy message
                </>
              )}
            </Button>
          </div>
          
          <div className="p-6 md:p-8 bg-white min-h-[140px] flex items-center">
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed font-normal whitespace-pre-wrap transition-opacity duration-200">
              &ldquo;{currentMessage}&rdquo;
            </p>
          </div>
          
          {/* Tone Adjustment Controls */}
          <div className="bg-gray-50/90 px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span>Tone:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleToneSelect('original')}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer",
                  activeTone === 'original'
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                )}
              >
                Balanced (Original)
              </button>
              <button
                type="button"
                onClick={() => handleToneSelect('softer')}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer",
                  activeTone === 'softer'
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                )}
              >
                Make it softer
              </button>
              <button
                type="button"
                onClick={() => handleToneSelect('direct')}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer",
                  activeTone === 'direct'
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                )}
              >
                Make it more direct
              </button>
              <button
                type="button"
                onClick={() => handleToneSelect('casual')}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer",
                  activeTone === 'casual'
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                )}
              >
                Make it sound like me
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 6: Completion */}
      <section className="animate-fade-in-up pt-10 pb-8 border-t border-gray-200 text-center space-y-6" style={{ animationDelay: '1150ms', animationFillMode: 'both' }}>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">That&apos;s a better conversation to start with.</h3>
          <p className="text-gray-500 italic max-w-lg mx-auto text-sm sm:text-base">
            &ldquo;Remember: understanding someone doesn&apos;t mean agreeing with them.&rdquo;
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button size="lg" onClick={onReset} className="w-full sm:w-auto rounded-full px-7">
            <RotateCcw className="w-4 h-4 mr-2" />
            Start another conversation
          </Button>
          {onTryDifferent && (
            <Button variant="secondary" size="lg" onClick={onTryDifferent} className="w-full sm:w-auto rounded-full px-7">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try a different situation
            </Button>
          )}
        </div>
      </section>

    </div>
  );
}
