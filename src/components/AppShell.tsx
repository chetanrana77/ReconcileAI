'use client';

import React, { useState, useEffect } from 'react';
import {
  AppStep,
  ParticipantRole,
  SafeSessionView,
  RelationshipType,
  MediationBridge,
  SupportedLanguage
} from '@/lib/types';

// Landing Components
import { Hero } from '@/components/landing/Hero';
import { ProblemStory } from '@/components/landing/ProblemStory';
import { DemoSection } from '@/components/landing/DemoSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { OutcomeFeatures } from '@/components/landing/OutcomeFeatures';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { FAQSection } from '@/components/landing/FAQSection';
import { ClosingCTA } from '@/components/landing/ClosingCTA';
import { Footer } from '@/components/landing/Footer';
import { Navbar } from '@/components/landing/Navbar';

// Mediator Components
import { PrivateChat } from '@/components/mediator/PrivateChat';
import { InvitationCard } from '@/components/mediator/InvitationCard';
import { MediationBridgeView } from '@/components/mediator/MediationBridgeView';

// UI Feedback Components
import { ErrorState } from '@/components/ui/ErrorState';
import { SafetyNotice } from '@/components/ui/SafetyNotice';

export function AppShell() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [currentRole, setCurrentRole] = useState<ParticipantRole>('a');
  const [session, setSession] = useState<SafeSessionView | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSafetyFlag, setIsSafetyFlag] = useState<boolean>(false);
  const [safetyMessage, setSafetyMessage] = useState<string>('');

  // Check URL query on mount for direct join links (?session=...&role=b&lang=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlSessionId = searchParams.get('session');
      const urlRole = (searchParams.get('role') as ParticipantRole) || 'a';
      const urlLang = searchParams.get('lang') as SupportedLanguage;

      if (urlLang) {
        setLanguage(urlLang);
      }

      if (urlSessionId) {
        fetchSession(urlSessionId, urlRole);
      }
    }
  }, []);

  const fetchSession = async (id: string, role: ParticipantRole) => {
    try {
      const res = await fetch(`/api/session?id=${id}&role=${role}`);
      if (!res.ok) throw new Error('Session not found');
      const data: SafeSessionView = await res.json();
      setSession(data);
      if (data.language) setLanguage(data.language);
      setCurrentRole(role);
      setCurrentStep(role === 'a' ? 'chat_a' : 'chat_b');
    } catch (err) {
      console.error(err);
      setError("We couldn't load this conversation session.");
    }
  };

  // Start fresh intake conversation for Person A
  const handleStartTalk = async (relationship: RelationshipType = 'parent', topic?: string) => {
    setError(null);
    setIsSafetyFlag(false);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationship, topic, language })
      });
      if (!res.ok) throw new Error('Failed to create session');
      const data: SafeSessionView = await res.json();
      setSession(data);
      if (data.language) setLanguage(data.language);
      setCurrentRole('a');
      setCurrentStep('chat_a');
    } catch (err) {
      console.error(err);
      setError("Couldn't start the conversation right now. Please try again.");
    }
  };

  // Load one of the pre-built demo scenarios (e.g. Flagship: demo-parent-child)
  const handleLoadDemoSession = async (demoKey: string) => {
    setError(null);
    setIsSafetyFlag(false);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoKey, role: 'a', language })
      });
      if (!res.ok) throw new Error('Failed to load demo session');
      const data: SafeSessionView = await res.json();
      setSession(data);
      setCurrentRole('a');
      setCurrentStep('chat_a');
    } catch (err) {
      console.error(err);
      setError("Failed to load demo scenario.");
    }
  };

  // Send message in current participant's private chat
  const handleSendMessage = async (text: string, msgLang?: SupportedLanguage) => {
    if (!session || isSending) return;
    setIsSending(true);
    setError(null);
    setIsSafetyFlag(false);

    const activeLanguage = msgLang || language;
    if (msgLang && msgLang !== language) {
      setLanguage(msgLang);
    }

    try {
      const res = await fetch(`/api/session/${session.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, role: currentRole, language: activeLanguage })
      });

      const data = await res.json();

      if (data.safetyFlag) {
        setIsSafetyFlag(true);
        setSafetyMessage(data.message);
        setIsSending(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process message');
      }

      setSession(data);
    } catch (err) {
      console.error(err);
      setError("Hmm, I couldn't quite process that. Let's try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Person A opens neutral invitation preview
  const handleOpenInvite = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'a' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
        }
      }
      setCurrentStep('invite');
    } catch (err) {
      console.error(err);
      setCurrentStep('invite');
    }
  };

  // Simulate Person B joining (For 60-90s event demos)
  const handleSimulatePersonBJoin = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join' })
      });
      if (res.ok) {
        const data: SafeSessionView = await res.json();
        setSession(data);
        setCurrentRole('b');
        setCurrentStep('chat_b');
      }
    } catch (err) {
      console.error(err);
      setCurrentRole('b');
      setCurrentStep('chat_b');
    }
  };

  // Open Joint Mediation Bridge
  const handleOpenMediation = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.id}/bridge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: currentRole })
      });
      if (res.ok) {
        const data: SafeSessionView = await res.json();
        setSession(data);
      }
      setCurrentStep('mediation');
    } catch (err) {
      console.error(err);
      setCurrentStep('mediation');
    }
  };

  // Switch viewing role between Person A and Person B
  const handleSwitchRole = async (newRole: ParticipantRole) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session?id=${session.id}&role=${newRole}`);
      if (res.ok) {
        const data: SafeSessionView = await res.json();
        setSession(data);
        setCurrentRole(newRole);
        setCurrentStep(newRole === 'a' ? 'chat_a' : 'chat_b');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetToLanding = () => {
    setCurrentStep('landing');
    setSession(null);
    setCurrentRole('a');
    setError(null);
    setIsSafetyFlag(false);
  };

  return (
    <>
      <Navbar
        onStartClick={() => handleStartTalk('parent')}
        onHomeClick={resetToLanding}
        language={language}
        onLanguageChange={setLanguage}
      />

      {currentStep === 'landing' ? (
        <div key="landing" className="w-full flex flex-col">
          <Hero
            onStart={() => handleStartTalk('parent')}
            onSelectDemo={handleLoadDemoSession}
          />
          <ProblemStory />
          <DemoSection onSelectDemoSession={handleLoadDemoSession} />
          <HowItWorks />
          <OutcomeFeatures />
          <PrivacySection />
          <FAQSection />
          <ClosingCTA
            onStart={() => handleStartTalk('parent')}
            onExploreDemo={() => {
              const el = document.getElementById('demonstration');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <Footer />
        </div>
      ) : (
        <div className="flex-grow flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Safety Interception Notice */}
          {isSafetyFlag ? (
            <div className="w-full flex justify-center py-8">
              <SafetyNotice message={safetyMessage} onReset={resetToLanding} />
            </div>
          ) : error ? (
            <div className="w-full flex justify-center py-8">
              <ErrorState
                message={error}
                onRetry={() => setError(null)}
                onDemo={() => handleLoadDemoSession('demo-parent-child')}
              />
            </div>
          ) : (
            <div key={currentStep + currentRole} className="flex-grow flex flex-col">
              {/* 2. Person A Private Chat */}
              {currentStep === 'chat_a' && session && (
                <PrivateChat
                  role="a"
                  participantLabel="You"
                  topic={session.topic}
                  messages={session.myMessages}
                  insight={session.myInsight}
                  isSending={isSending}
                  language={language}
                  onLanguageChange={setLanguage}
                  onSendMessage={handleSendMessage}
                  onOpenInvite={handleOpenInvite}
                  onOpenMediation={handleOpenMediation}
                />
              )}

              {/* 3. Neutral Invitation Preview & Sharing */}
              {currentStep === 'invite' && session?.invitation && (
                <InvitationCard
                  invitation={session.invitation}
                  sessionId={session.id}
                  onSimulateJoin={handleSimulatePersonBJoin}
                  onBackToChat={() => setCurrentStep('chat_a')}
                />
              )}

              {/* 4. Person B Private Chat */}
              {currentStep === 'chat_b' && session && (
                <PrivateChat
                  role="b"
                  participantLabel="You"
                  topic={session.topic}
                  messages={session.myMessages}
                  insight={session.myInsight}
                  isSending={isSending}
                  language={language}
                  onLanguageChange={setLanguage}
                  onSendMessage={handleSendMessage}
                  onOpenInvite={handleOpenInvite}
                  onOpenMediation={handleOpenMediation}
                />
              )}

              {/* 5. The Mediation Bridge */}
              {currentStep === 'mediation' && session?.bridge && (
                <MediationBridgeView
                  bridge={session.bridge}
                  currentRole={currentRole}
                  onBackToPrivateChat={() => setCurrentStep(currentRole === 'a' ? 'chat_a' : 'chat_b')}
                  onReset={resetToLanding}
                />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
