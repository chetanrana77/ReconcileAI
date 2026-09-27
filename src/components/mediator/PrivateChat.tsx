'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Lock, Send, Sparkles, UserPlus, Users, HeartHandshake, ShieldCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { ChatMessage, ExtractedInsight, ParticipantRole } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PrivateChatProps {
  role: ParticipantRole;
  participantLabel: string;
  topic?: string;
  messages: ChatMessage[];
  insight?: ExtractedInsight;
  isSending: boolean;
  onSendMessage: (text: string) => void;
  onOpenInvite: () => void;
  onOpenMediation: () => void;
}

export function PrivateChat({
  role,
  participantLabel,
  topic,
  messages,
  insight,
  isSending,
  onSendMessage,
  onOpenInvite,
  onOpenMediation
}: PrivateChatProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const isRoleA = role === 'a';
  const lastMsg = messages[messages.length - 1];
  const quickReplies = lastMsg?.quickReplies || [];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden animate-fade-in-up">
      {/* Confidentiality & Channel Header */}
      <div className="bg-slate-50/90 border-b border-gray-100 px-6 py-3.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                {isRoleA ? 'Your Private Space with Reconcile' : 'Person B Private Consultation'}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Lock className="w-3 h-3 text-emerald-600" />
                Confidential
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {topic ? `Topic: ${topic}` : 'Untangling what matters before talking directly'}
            </p>
          </div>
        </div>

        {/* Quick action button in header if ready */}
        {insight?.readyToInvite && (
          <div className="animate-fade-in">
            {isRoleA ? (
              <Button size="sm" onClick={onOpenInvite} className="rounded-full text-xs px-4 bg-indigo-600 hover:bg-indigo-700">
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                Invite them
              </Button>
            ) : (
              <Button size="sm" onClick={onOpenMediation} className="rounded-full text-xs px-4 bg-indigo-600 hover:bg-indigo-700">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                See Mediation Bridge
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-stone-50/50 to-white">
        {/* Reassurance Banner */}
        <div className="max-w-md mx-auto text-center py-2 px-4 rounded-xl bg-indigo-50/60 border border-indigo-100/50 text-[11px] text-indigo-900/80 leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-indigo-600" />
          <strong>Your raw words stay private.</strong> Reconcile helps explain your underlying perspective neutrally without forwarding angry messages.
        </div>

        {messages.map((msg) => {
          const isReconcile = msg.sender === 'reconcile';

          return (
            <div
              key={msg.id}
              className={cn(
                'flex flex-col max-w-[88%] sm:max-w-[80%]',
                isReconcile ? 'mr-auto items-start' : 'ml-auto items-end'
              )}
            >
              {isReconcile ? (
                <div className="bg-white border border-indigo-100/80 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xs text-gray-800 text-sm sm:text-base leading-relaxed">
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span>Reconcile</span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ) : (
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm p-4 sm:p-5 shadow-xs text-sm sm:text-base leading-relaxed">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isSending && (
          <div className="flex items-center gap-2 mr-auto bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-2xs text-xs text-gray-500 animate-fade-in">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            <span>Reconcile is reflecting on what you said...</span>
          </div>
        )}

        {/* Extracted Insight Card (Shown when Reconcile identifies underlying intent) */}
        {insight && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs sm:text-sm text-indigo-950 animate-fade-in-up">
            <div className="flex items-center gap-2 font-semibold text-indigo-700 uppercase tracking-wider text-[11px] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>What Reconcile Hears Beneath The Surface</span>
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <p>
                <strong className="text-indigo-900">Your Underlying Need:</strong> {insight.underlyingNeed}
              </p>
              {insight.emotions && insight.emotions.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-gray-500 text-xs font-medium">Emotions:</span>
                  {insight.emotions.map((emo, idx) => (
                    <span key={idx} className="bg-white/80 border border-indigo-200/80 px-2 py-0.5 rounded-full text-xs font-medium text-indigo-800">
                      {emo}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Involve other person proposal card */}
            {insight.readyToInvite && (
              <div className="mt-4 pt-3 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-indigo-800 font-medium">
                  {isRoleA
                    ? "Ready to help the other person understand your side without starting a fight?"
                    : "Both sides have spoken. Ready to see the mediation bridge?"}
                </p>
                {isRoleA ? (
                  <Button size="sm" onClick={onOpenInvite} className="w-full sm:w-auto rounded-full text-xs shadow-sm bg-indigo-600 hover:bg-indigo-700">
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    Invite them to Reconcile
                  </Button>
                ) : (
                  <Button size="sm" onClick={onOpenMediation} className="w-full sm:w-auto rounded-full text-xs shadow-sm bg-indigo-600 hover:bg-indigo-700">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    View Mediation Bridge
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Area */}
      {quickReplies.length > 0 && !isSending && (
        <div className="px-4 py-2 bg-slate-50 border-t border-gray-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">Suggested:</span>
          {quickReplies.map((reply, i) => (
            <button
              type="button"
              key={i}
              onClick={() => onSendMessage(reply)}
              className="text-xs bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-gray-700 border border-gray-200/90 rounded-full px-3 py-1 whitespace-nowrap transition-all cursor-pointer shadow-2xs"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isRoleA ? "Tell me what happened..." : "Share your perspective..."}
          disabled={isSending}
          className="flex-1 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-gray-900 placeholder:text-gray-400 text-sm sm:text-base px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
        />
        <Button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="rounded-2xl px-5 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4 mr-1 sm:mr-1.5" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
