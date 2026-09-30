'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, MessageSquare, Heart, Shield, Lock, X } from 'lucide-react';
import { RelationshipType, SupportedLanguage } from '@/lib/types';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ConversationHubProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onStartSolo: () => void;
  onStartRelationship: (relationship: RelationshipType, topic?: string) => void;
  onJoinWithCode: (codeOrUrl: string) => void;
  onBackToLanding: () => void;
}

export function ConversationHub({
  language,
  onLanguageChange,
  onStartSolo,
  onStartRelationship,
  onJoinWithCode,
  onBackToLanding,
}: ConversationHubProps) {
  const [view, setView] = useState<'main' | 'who' | 'code'>('main');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [showCrisisHelp, setShowCrisisHelp] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'hi') {
      if (hour < 12) return 'सुप्रभात';
      if (hour < 17) return 'नमस्ते';
      return 'शुभ संध्या';
    }
    if (language === 'mr') {
      if (hour < 12) return 'शुभ सकाळ';
      if (hour < 17) return 'नमस्कार';
      return 'शुभ संध्याकाळ';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inviteCodeInput.trim();
    if (!clean) return;
    onJoinWithCode(clean);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col min-h-[calc(100vh-140px)] justify-between animate-fade-in-up">
      {/* Top Bar: Navigation & Language Pills */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => {
              if (view === 'who' || view === 'code') {
                setView('main');
              } else {
                onBackToLanding();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer p-1 -ml-1 rounded-lg hover:bg-stone-200/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{view === 'main' ? (language === 'hi' ? 'मुख्य पृष्ठ' : language === 'mr' ? 'मुख्य पान' : 'Home') : (language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back')}</span>
          </button>

          {/* Language Selector */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-stone-200/60 border border-stone-200/80">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => onLanguageChange(l.code)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium select-none",
                  language === l.code
                    ? "bg-white text-stone-900 shadow-2xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                )}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>

        {/* VIEW 1: Main Dashboard ("What would help right now?") */}
        {view === 'main' && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs sm:text-sm font-medium text-stone-500">
                {getGreeting()}, Chetan.
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                {language === 'hi'
                  ? 'अभी आप किस बात में मदद चाहते हैं?'
                  : language === 'mr'
                  ? 'सध्या तुम्हाला कशासाठी मदत हवी आहे?'
                  : 'What would help right now?'}
              </h1>
            </div>

            {/* Primary Action Card: Forest Pine Aesthetic */}
            <div
              onClick={() => setView('who')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#24392E] p-6 sm:p-7 text-white shadow-md transition-all hover:bg-[#1C2E24] hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  {/* Two Interlocking Circles Emblem (Dual Perspectives) */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#B0795B]" />
                    <span className="w-4 h-4 rounded-full bg-[#7BA18C] -ml-2 opacity-90" />
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#FAF6EE]">
                      {language === 'hi'
                        ? 'बातचीत शुरू करें'
                        : language === 'mr'
                        ? 'संवाद सुरू करा'
                        : 'Start a conversation'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#C9D6C5] mt-1 font-normal leading-relaxed">
                      {language === 'hi'
                        ? 'अपने किसी करीबी के साथ, या केवल आप और Reconcile।'
                        : language === 'mr'
                        ? 'तुमच्या जवळच्या व्यक्तीसोबत, किंवा फक्त तुम्ही आणि Reconcile.'
                        : 'With someone in your life, or just you and Reconcile.'}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1 transition-transform group-hover:translate-x-1">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Secondary Action: Have an invite code? */}
            <div
              onClick={() => setView('code')}
              className="group cursor-pointer rounded-2xl bg-white border border-stone-200/90 p-4 sm:p-5 shadow-2xs hover:border-stone-300 hover:bg-stone-50/70 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {language === 'hi'
                      ? 'क्या आपके पास आमंत्रण कोड है?'
                      : language === 'mr'
                      ? 'तुमच्याकडे निमंत्रण कोड आहे का?'
                      : 'Have an invite code?'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'hi'
                      ? 'किसी मौजूदा निजी बातचीत में शामिल हों'
                      : language === 'mr'
                      ? 'सध्या सुरू असलेल्या संवादात सामील व्हा'
                      : 'Join an existing private conversation'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        )}

        {/* VIEW 2: "Who's this with?" */}
        {view === 'who' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                {language === 'hi' ? 'नया संवाद' : language === 'mr' ? 'नवीन संवाद' : 'Start a conversation'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mt-1">
                {language === 'hi'
                  ? 'यह बातचीत किसके साथ है?'
                  : language === 'mr'
                  ? 'हा संवाद कोणासोबत आहे?'
                  : "Who's this with?"}
              </h2>
            </div>

            <div className="space-y-3 bg-white border border-stone-200 rounded-3xl p-3 shadow-xs">
              {/* Option 1: Just me (Solo reflection) */}
              <div
                onClick={onStartSolo}
                className="group cursor-pointer p-4 rounded-2xl hover:bg-stone-50 transition-colors flex items-center justify-between border-b border-stone-100"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-700/10 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    ●
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-stone-900">
                      {language === 'hi' ? 'केवल मेरे साथ (व्यक्तिगत सोच)' : language === 'mr' ? 'फक्त मी (वैयक्तिक विचार)' : 'Just me'}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {language === 'hi'
                        ? 'अपने विचारों को शांत करें और समझें कि वास्तव में क्या कहना है'
                        : language === 'mr'
                        ? 'मनातील विचार शांत करा आणि नक्की काय बोलायचे ते ठरवा'
                        : 'Solo reflection · untangle your thoughts & find what to say'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Two-Person Mediations */}
              <div className="px-4 pt-2 pb-1">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  {language === 'hi' ? 'किसी अन्य व्यक्ति के साथ' : language === 'mr' ? 'दुसऱ्या व्यक्तीसोबत' : 'With someone in your life'}
                </span>
              </div>

              {[
                {
                  id: 'parent' as RelationshipType,
                  title: language === 'hi' ? 'माता-पिता / परिवार' : language === 'mr' ? 'आई-बाबा / पालक' : 'Parent / Family',
                  desc: language === 'hi' ? 'पढ़ाई, अपेक्षाएं, आज़ादी और विश्वास' : language === 'mr' ? 'अभ्यास, अपेक्षा, स्वातंत्र्य आणि विश्वास' : 'Studies, expectations, independence & trust',
                  emoji: '🏠'
                },
                {
                  id: 'friend' as RelationshipType,
                  title: language === 'hi' ? 'मित्र / सखा' : language === 'mr' ? 'मित्र / मैत्रीण' : 'Friend',
                  desc: language === 'hi' ? 'अचानक चुप्पी, दूरी, या ग़लतफ़हमी' : language === 'mr' ? 'अचानक शांतता, दुरावा किंवा गैरसमज' : 'Sudden silence, distance, or misunderstanding',
                  emoji: '❤️'
                },
                {
                  id: 'partner' as RelationshipType,
                  title: language === 'hi' ? 'पार्टनर / जीवनसाथी' : language === 'mr' ? 'पार्टनर / जोडीदार' : 'Partner',
                  desc: language === 'hi' ? 'बार-बार होने वाली बहस या अनसुना महसूस होना' : language === 'mr' ? 'वारंवार होणारे वाद किंवा दुर्लक्ष झाल्याची भावना' : 'Recurring arguments or feeling unheard',
                  emoji: '💞'
                },
                {
                  id: 'sibling' as RelationshipType,
                  title: language === 'hi' ? 'भाई / बहन' : language === 'mr' ? 'भाऊ / बहीण' : 'Sibling',
                  desc: language === 'hi' ? 'सीमाएं, आदर और पुरानी बातें' : language === 'mr' ? 'मर्यादा, आदर आणि जुने वाद' : 'Boundaries, respect, and shared history',
                  emoji: '🧩'
                },
                {
                  id: 'other' as RelationshipType,
                  title: language === 'hi' ? 'कोई अन्य' : language === 'mr' ? 'इतर कोणी' : 'Someone else',
                  desc: language === 'hi' ? 'स्थिति थोड़ी पेचीदा है' : language === 'mr' ? 'परिस्थिती थोडी गुंतागुंतीची आहे' : "It's complicated",
                  emoji: '💬'
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => onStartRelationship(item.id, item.desc)}
                  className="group cursor-pointer p-3.5 rounded-2xl hover:bg-stone-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">{item.title}</h4>
                      <p className="text-xs text-stone-500">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: Enter Invite Code */}
        {view === 'code' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                {language === 'hi' ? 'निमंत्रण' : language === 'mr' ? 'आमंत्रण' : 'Invitation'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mt-1">
                {language === 'hi'
                  ? 'आमंत्रण कोड दर्ज करें'
                  : language === 'mr'
                  ? 'निमंत्रण कोड टाका'
                  : 'Enter invite code'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {language === 'hi'
                  ? 'यदि किसी ने आपको Reconcile पर बातचीत के लिए आमंत्रित किया है, तो कोड या लिंक यहाँ पेस्ट करें।'
                  : language === 'mr'
                  ? 'जर कोणी तुम्हाला Reconcile वर संवादासाठी आमंत्रित केले असेल, तर कोड किंवा लिंक येथे टाका.'
                  : 'If someone invited you to talk on Reconcile, paste their invite code or link below.'}
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'कोड या लिंक' : language === 'mr' ? 'कोड किंवा लिंक' : 'Code or Link'}
                </label>
                <input
                  type="text"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value)}
                  placeholder="e.g. session-qgyfgeg or paste link"
                  autoFocus
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900"
                />
              </div>

              <Button
                type="submit"
                disabled={!inviteCodeInput.trim()}
                className="w-full py-3 text-sm font-semibold rounded-2xl shadow-xs"
              >
                {language === 'hi' ? 'बातचीत में शामिल हों' : language === 'mr' ? 'संवादात सामील व्हा' : 'Join Private Conversation'}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Peaceful Reassurance & Ethical Wellness Footer */}
      <div className="pt-8 border-t border-stone-200/60 mt-12 text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span>AI mediator</span>
          <span>&bull;</span>
          <span>not therapy</span>
          <span>&bull;</span>
          <button
            type="button"
            onClick={() => setShowCrisisHelp(true)}
            className="text-stone-700 hover:text-stone-950 underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"
          >
            <Heart className="w-3 h-3 text-amber-600 inline" />
            <span>get crisis help</span>
          </button>
        </div>
        <p className="text-[11px] text-stone-400 font-normal">
          Your words remain confidential. Nothing is forwarded without mutual consent.
        </p>
      </div>

      {/* Compassionate Crisis Resources Modal */}
      {showCrisisHelp && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <Heart className="w-4 h-4 text-amber-600" />
                <span>Support & Crisis Resources</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCrisisHelp(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'यदि आप या आपका कोई परिचित अत्यधिक मानसिक तनाव, संकट, घरेलू हिंसा या असुरक्षा महसूस कर रहा है, तो कृपया भारत की इन निःशुल्क एवं 24/7 हेल्पलाइन पर तुरंत संपर्क करें:'
                : language === 'mr'
                ? 'जर तुम्ही किंवा तुमच्या ओळखीची व्यक्ती तीव्र मानसिक तणाव, संकट किंवा असुरक्षिततेचा सामना करत असेल, तर कृपया भारतातील या मोफत व 24/7 हेल्पलाइनशी संपर्क साधा:'
                : 'If you or someone you know is in immediate danger, acute distress, domestic violence, or crisis, please reach out to trusted free 24/7 helplines in India immediately:'}
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <p className="font-semibold text-stone-900">
                  {language === 'hi' ? 'Tele-MANAS (भारत सरकार की 24/7 राष्ट्रीय मानसिक स्वास्थ्य सेवा)' : language === 'mr' ? 'Tele-MANAS (भारत सरकारची 24/7 राष्ट्रीय मानसिक आरोग्य हेल्पलाइन)' : 'Tele-MANAS (Govt. of India 24/7 Free Helpline)'}
                </p>
                <p className="text-stone-600">
                  {language === 'hi' ? 'सभी भारतीय भाषाओं में निःशुल्क सहायता। कॉल करें: ' : language === 'mr' ? 'सर्व भारतीय भाषांमध्ये मोफत समुपदेशन. डायल करा: ' : 'Free support in all Indian languages. Dial '}
                  <a href="tel:14416" className="text-stone-900 font-bold underline">14416</a> or <a href="tel:18008914416" className="text-stone-900 font-bold underline">1800 891 4416</a>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <p className="font-semibold text-stone-900">
                  {language === 'hi' ? 'वांद्रेवाला फाउंडेशन (24/7 मानसिक स्वास्थ्य परामर्श)' : language === 'mr' ? 'वांद्रेवाला फाउंडेशन (24/7 मोफत मानसिक आरोग्य समुपदेशन)' : 'Vandrevala Foundation (24/7 Mental Health Helpline)'}
                </p>
                <p className="text-stone-600">
                  {language === 'hi' ? 'हिंदी, मराठी और अंग्रेजी में बात करें: ' : language === 'mr' ? 'हिंदी, मराठी आणि इंग्रजीत बोला: ' : 'Free counselling in Hindi, Marathi & English: '}
                  <a href="tel:+919999666555" className="text-stone-900 font-bold underline">+91 9999 666 555</a>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <p className="font-semibold text-stone-900">
                  {language === 'hi' ? 'AASRA (24 घंटे संकट हेल्पलाइन)' : language === 'mr' ? 'AASRA (24 तास मदत हेल्पलाइन)' : 'AASRA Suicide Prevention & Crisis Helpline'}
                </p>
                <p className="text-stone-600">
                  {language === 'hi' ? 'गोपनीय सहायता: ' : language === 'mr' ? 'गोपनीय मदत: ' : '24 Hours Helpline: '}
                  <a href="tel:+919820466726" className="text-stone-900 font-bold underline">+91 9820466726</a>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <p className="font-semibold text-stone-900">
                  {language === 'hi' ? 'राष्ट्रीय आपातकालीन सेवा (भारत)' : language === 'mr' ? 'राष्ट्रीय आणीबाणी सेवा (भारत)' : 'National Emergency Services (India)'}
                </p>
                <p className="text-stone-600">
                  {language === 'hi' ? 'पुलिस / चिकित्सा / आपातकालीन सहायता: ' : language === 'mr' ? 'पोलीस / वैद्यकीय / तात्काळ मदत: ' : 'Police, medical, or safety emergency: '}
                  <a href="tel:112" className="text-stone-900 font-bold underline">Dial 112</a>
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setShowCrisisHelp(false)}
              className="w-full mt-2"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
