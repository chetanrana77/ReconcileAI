'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Lock, Send, UserPlus, Users, ArrowRight, Globe } from 'lucide-react';
import { ChatMessage, ExtractedInsight, ParticipantRole, SupportedLanguage } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES, I18N_STRINGS } from '@/lib/i18n/translations';

interface PrivateChatProps {
  role: ParticipantRole;
  participantLabel: string;
  topic?: string;
  messages: ChatMessage[];
  insight?: ExtractedInsight;
  isSending: boolean;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onSendMessage: (text: string, language?: SupportedLanguage) => void;
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
  language = 'en',
  onLanguageChange,
  onSendMessage,
  onOpenInvite,
  onOpenMediation,
}: PrivateChatProps) {
  const [inputText, setInputText] = useState('');
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (language && language !== activeLang) {
      setActiveLang(language);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setActiveLang(lang);
    onLanguageChange?.(lang);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim(), activeLang);
    setInputText('');
  };

  const isRoleA = role === 'a';
  const t = I18N_STRINGS[activeLang] || I18N_STRINGS.en;
  const lastMsg = messages[messages.length - 1];
  const quickReplies = lastMsg?.quickReplies && lastMsg.quickReplies.length > 0
    ? lastMsg.quickReplies
    : t.defaultQuickReplies;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden animate-fade-in-up">
      {/* Confidentiality & Channel Header */}
      <div className="bg-[#FAF9F6] border-b border-stone-200/80 px-4 sm:px-7 py-3.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-stone-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="12" r="5" stroke="currentColor" fill="none" />
              <circle cx="15" cy="12" r="5" stroke="currentColor" fill="none" opacity="0.6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-stone-900 tracking-tight">
                {isRoleA ? t.titleA : t.titleB}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-200/60 text-stone-700">
                <Lock className="w-3 h-3 text-stone-400" />
                {t.confidential}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-normal">
              {topic ? topic : 'Untangling what matters before talking directly'}
            </p>
          </div>
        </div>

        {/* Right side: Action Button */}
        <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
          {isRoleA ? (
            <Button
              size="sm"
              onClick={onOpenInvite}
              className="rounded-xl text-xs px-3.5 py-1.5 font-medium shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.inviteButton}</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onOpenMediation}
              className="rounded-xl text-xs px-3.5 py-1.5 font-medium shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.viewBridge}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F6]/40">
        {/* Understated Privacy Reassurance Banner */}
        <div className="max-w-md mx-auto text-center py-2 px-3.5 rounded-xl bg-stone-100/70 border border-stone-200/60 text-[11px] text-stone-600 leading-relaxed font-normal">
          <Lock className="w-3 h-3 inline mr-1 text-stone-400" />
          <span>{t.banner}</span>
        </div>

        {messages.map((msg) => {
          const isReconcile = msg.sender === 'reconcile';

          return (
            <div
              key={msg.id}
              className={cn(
                'flex flex-col max-w-[90%] sm:max-w-[82%]',
                isReconcile ? 'mr-auto items-start' : 'ml-auto items-end'
              )}
            >
              {isReconcile ? (
                <div className="bg-white border border-stone-200/90 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-2xs text-stone-800 text-sm sm:text-base leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                    <span>Reconcile</span>
                  </div>
                  <p className="whitespace-pre-wrap font-normal">{msg.text}</p>
                </div>
              ) : (
                <div className="bg-stone-900 text-white rounded-2xl rounded-tr-sm p-4 sm:p-5 shadow-2xs text-sm sm:text-base leading-relaxed">
                  <p className="whitespace-pre-wrap font-normal">{msg.text}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isSending && (
          <div className="flex items-center gap-2 mr-auto bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-2xs text-xs text-stone-500 animate-fade-in">
            <span className="w-2 h-2 bg-stone-700 rounded-full animate-pulse" />
            <span>{t.thinking}</span>
          </div>
        )}

        {/* Clean, Non-Intrusive Invitation Suggestion (Only when ready) */}
        {insight?.readyToInvite && (
          <div className="p-4 rounded-2xl bg-white border border-stone-300 shadow-2xs text-xs sm:text-sm text-stone-800 animate-fade-in space-y-3">
            <p className="font-medium text-stone-900">
              {isRoleA ? t.readyToInviteA : t.readyToBridgeB}
            </p>
            {isRoleA ? (
              <Button
                size="sm"
                onClick={onOpenInvite}
                className="w-full sm:w-auto text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <span>{t.createInvitation}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onOpenMediation}
                className="w-full sm:w-auto text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <span>{t.viewBridge}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Replies */}
      {quickReplies.length > 0 && !isSending && (
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-stone-400 font-medium whitespace-nowrap">{t.suggested}</span>
          {quickReplies.map((reply, i) => (
            <button
              type="button"
              key={i}
              onClick={() => onSendMessage(reply, activeLang)}
              className="text-xs bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-full px-3.5 py-1 whitespace-nowrap transition-colors cursor-pointer shadow-2xs font-normal"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-white border-t border-stone-200/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isRoleA ? t.placeholderA : t.placeholderB}
          disabled={isSending}
          className="flex-1 bg-stone-50 hover:bg-stone-100/70 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm sm:text-base px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 transition-all font-normal"
        />
        <Button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="rounded-2xl px-5 h-12 disabled:opacity-40 cursor-pointer shadow-xs shrink-0"
        >
          <Send className="w-4 h-4 mr-1 sm:mr-1.5" />
          <span className="hidden sm:inline">{t.send}</span>
        </Button>
      </form>
    </div>
  );
}
