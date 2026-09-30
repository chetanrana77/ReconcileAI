'use client';

import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, X, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
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
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [savedKeyExists, setSavedKeyExists] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('reconcile_gemini_key') || '' : '';
      setApiKey(stored);
      setSavedKeyExists(!!stored);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setTestResult({ ok: false, message: 'Please enter a Gemini API Key to test.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/ai-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: cleanKey })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        localStorage.setItem('reconcile_gemini_key', cleanKey);
        setSavedKeyExists(true);
        setTestResult({
          ok: true,
          message: `Connected successfully! Model: ${data.modelName || 'Gemini 1.5 Flash'} (${data.latencyMs || 0}ms)`
        });
        onKeyUpdated();
      } else {
        setTestResult({
          ok: false,
          message: data.error || 'Failed to verify API key with Google Gemini.'
        });
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err?.message || 'Network error while testing API key.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('reconcile_gemini_key');
    setApiKey('');
    setSavedKeyExists(false);
    setTestResult({ ok: true, message: 'Key removed. Reconcile is now using the Local Conversational Engine.' });
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-[#FAF9F6] border-b border-stone-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-2xs">
              <Key className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">AI Connection & Gemini Key</h3>
              <p className="text-[11px] text-stone-500 font-normal">Check live AI status and configure Google Gemini</p>
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
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-600">Current AI Engine:</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
                  aiStatus?.status === 'connected'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-stone-200/80 text-stone-700 border-stone-300'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    aiStatus?.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-500'
                  )}
                />
                {aiStatus?.status === 'connected'
                  ? aiStatus?.modelName || 'Google Gemini 1.5 Flash'
                  : 'Local Conversational Engine'}
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-normal">
              {aiStatus?.status === 'connected'
                ? `⚡ Answering live with Google Gemini. Real-time reasoning and multilingual empathy active.`
                : `🌱 Running on Reconcile's built-in multilingual conversational engine. Safe, private, and works offline.`}
            </p>
          </div>

          {/* Form to enter / test Gemini key */}
          <form onSubmit={handleTestAndSave} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-stone-800 mb-1.5">
                Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={cn(
                  'p-3 rounded-xl border text-xs flex items-start gap-2 animate-fade-in',
                  testResult.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                )}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed font-normal">{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                disabled={isTesting || !apiKey.trim()}
                className="rounded-xl text-xs font-medium px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing Key...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Test & Connect Live</span>
                  </>
                )}
              </Button>

              {savedKeyExists && (
                <button
                  type="button"
                  onClick={handleRemoveKey}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Disconnect Key
                </button>
              )}
            </div>
          </form>

          {/* Privacy & Public GitHub Guarantee */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Security & Public GitHub Protection</span>
            </div>
            <p className="font-normal">
              Because your GitHub repository is public, keys entered here are stored <strong>strictly on your local device (in browser localStorage)</strong>. They are never committed to GitHub, never logged, and never visible to other users.
            </p>
          </div>

          {/* Instructions on where to get keys & Vercel deployment */}
          <div className="border-t border-stone-200/80 pt-4 space-y-2.5 text-xs text-stone-600">
            <h4 className="font-semibold text-stone-900 text-xs">How to connect:</h4>
            <ul className="space-y-2 text-[11px] leading-relaxed list-disc list-inside font-normal">
              <li>
                <strong>Get a free Gemini API key:</strong> Visit{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-900 underline font-medium inline-flex items-center gap-0.5"
                >
                  Google AI Studio <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                </a>{' '}
                and generate a key in seconds.
              </li>
              <li>
                <strong>Connect in Local Dev:</strong> Add <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">GEMINI_API_KEY=your_key</code> in your <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">.env.local</code> file (this file is already in <code className="font-mono">.gitignore</code> and never uploaded to GitHub).
              </li>
              <li>
                <strong>Connect on Vercel:</strong> Go to Vercel Dashboard → Project Settings → <strong>Environment Variables</strong> → Add <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">GEMINI_API_KEY</code>. Vercel encrypts it securely.
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
