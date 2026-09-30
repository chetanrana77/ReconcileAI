'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, CheckCircle2, AlertCircle, X, RefreshCw, Sparkles, Server } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiStatus: {
    status: 'connected' | 'fallback';
    activeProvider: string;
    modelName: string;
    message: string;
    latencyMs?: number;
  } | null;
  onKeyUpdated: () => void;
}

export function AIKeyModal({ isOpen, onClose, aiStatus, onKeyUpdated }: AIKeyModalProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Clean up any legacy localStorage key to ensure absolute zero client exposure
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('reconcile_gemini_key')) {
      localStorage.removeItem('reconcile_gemini_key');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunDiagnostics = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/ai-status', {
        method: 'POST'
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setTestResult({
          ok: true,
          message: `Server connected live to ${data.modelName || 'Google Gemini 3.8 Flash'} (${data.latencyMs || 0}ms)`
        });
      } else {
        setTestResult({
          ok: false,
          message: data.error || 'Server Gemini check was unable to reach the model. Reconcile is running in Local Mode.'
        });
      }
      onKeyUpdated();
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err?.message || 'Network error while contacting the server diagnostics endpoint.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const isGeminiConnected = aiStatus?.status === 'connected' && aiStatus?.activeProvider === 'gemini';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-[#FAF9F6] border-b border-stone-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-2xs">
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">AI Engine Status & Diagnostics</h3>
              <p className="text-[11px] text-stone-500 font-normal">Server-side Gemini 3.8 Flash connectivity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Current Live Status Pill */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-600">Current AI Engine:</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
                  isGeminiConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-stone-200/80 text-stone-700 border-stone-300'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isGeminiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-stone-500'
                  )}
                />
                {isGeminiConnected
                  ? 'AI Engine: Gemini connected'
                  : 'AI Engine: Local mode'}
              </span>
            </div>

            <div className="text-xs text-stone-600 leading-relaxed font-normal space-y-1">
              <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                <Server className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  {isGeminiConnected
                    ? `Google Gemini 3.8 Flash (${aiStatus?.latencyMs || 0}ms)`
                    : 'Reconcile Local Multilingual Engine'}
                </span>
              </div>
              <p className="text-stone-500 text-[11px]">
                {isGeminiConnected
                  ? 'Active and answering live via Google Gemini 3.8 Flash server integration.'
                  : 'Running on Reconcile’s built-in conversational mediator. Safe, private, and works offline.'}
              </p>
            </div>
          </div>

          {/* Test Server Connection Button */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleRunDiagnostics}
                disabled={isTesting}
                className="rounded-xl text-xs font-medium px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing Server Connection...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Test & Verify Server Connection</span>
                  </>
                )}
              </Button>
            </div>

            {testResult && (
              <div
                className={cn(
                  'p-3 rounded-xl border text-xs flex items-start gap-2 animate-fade-in',
                  testResult.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-stone-100 border-stone-200 text-stone-800'
                )}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed font-normal">{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Strict Server-Side Security Guarantee */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Zero Client Exposure & Public Repository Security</span>
            </div>
            <p className="font-normal">
              Your <code className="bg-amber-100/70 px-1 py-0.5 rounded font-mono text-[10px]">GEMINI_API_KEY</code> is loaded strictly server-side via environment variables (<code className="font-mono text-[10px]">process.env.GEMINI_API_KEY</code>). It is never exposed in browser JavaScript, client-side requests, or <code className="font-mono text-[10px]">localStorage</code>, ensuring total safety on public GitHub and Vercel.
            </p>
          </div>

          {/* Vercel and Local Setup Reference */}
          <div className="border-t border-stone-200/80 pt-4 space-y-2 text-xs text-stone-600">
            <h4 className="font-semibold text-stone-900 text-xs">Configuration:</h4>
            <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc list-inside font-normal">
              <li>
                <strong>Vercel Production:</strong> Set <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">GEMINI_API_KEY</code> in Vercel Dashboard → Project Settings → Environment Variables.
              </li>
              <li>
                <strong>Local Development:</strong> Set <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">GEMINI_API_KEY</code> in <code className="font-mono">.env.local</code> (gitignored).
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF9F6] border-t border-stone-200/80 px-6 py-3 flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-xs text-stone-700 rounded-xl cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
