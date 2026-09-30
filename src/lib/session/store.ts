import {
  MediationSession,
  SafeSessionView,
  ParticipantRole,
  ChatMessage,
  NeutralInvitation,
  MediationBridge,
  RelationshipType,
  ExtractedInsight,
  SupportedLanguage
} from '@/lib/types';
import { DEMO_SESSIONS } from '@/lib/demo/scenarios';
import { getGreetingForLanguage } from '@/lib/i18n/translations';

// In-memory store for alpha sessions
const sessionsMap = new Map<string, MediationSession>();

// Initialize with demo sessions
export function initializeDemoSessions() {
  for (const session of Object.values(DEMO_SESSIONS)) {
    sessionsMap.set(session.id, JSON.parse(JSON.stringify(session)));
  }
}

// Auto-init
initializeDemoSessions();

export function createSession(
  relationship: RelationshipType = 'parent',
  topic?: string,
  language: SupportedLanguage = 'en'
): MediationSession {
  const id = `session-${Math.random().toString(36).substring(2, 9)}`;
  const now = Date.now();
  const greeting = getGreetingForLanguage(language, relationship);

  const session: MediationSession = {
    id,
    relationship,
    language,
    topic: topic || (relationship === 'parent' ? 'Studies and Trust' : 'Communication Misunderstanding'),
    status: 'intake_a',
    personA: {
      label: 'You',
      messages: [
        {
          id: `msg-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'reconcile',
          role: 'a',
          text: greeting.text,
          timestamp: now,
          privacy: 'PRIVATE_A',
          quickReplies: greeting.quickReplies,
          reassuranceNote: greeting.reassuranceNote
        }
      ]
    },
    createdAt: now,
    updatedAt: now
  };

  sessionsMap.set(id, session);
  return session;
}

export function getSession(id: string): MediationSession | null {
  return sessionsMap.get(id) || null;
}

// Strictly enforce privacy boundaries before returning data to client
export function getSafeSession(id: string, role: ParticipantRole): SafeSessionView | null {
  const session = sessionsMap.get(id);
  if (!session) return null;

  const isRoleA = role === 'a';
  const myParticipant = isRoleA ? session.personA : session.personB;

  // Filter messages: strictly only messages for this participant
  const myMessages = (myParticipant?.messages || []).filter((m) =>
    isRoleA ? m.privacy === 'PRIVATE_A' || m.privacy === 'SHARED' : m.privacy === 'PRIVATE_B' || m.privacy === 'SHARED'
  );

  return {
    id: session.id,
    relationship: session.relationship,
    topic: session.topic,
    language: session.language || 'en',
    status: session.status,
    currentRole: role,
    myMessages,
    myInsight: myParticipant?.insight,
    invitation: session.invitation,
    bridge: session.bridge,
    isReadyForMediation: session.status === 'mediation_ready' || session.status === 'completed'
  };
}

export function setSession(session: MediationSession): void {
  session.updatedAt = Date.now();
  sessionsMap.set(session.id, session);
}

export function updateSessionInsight(
  id: string,
  role: ParticipantRole,
  insight: ExtractedInsight
): MediationSession | null {
  const session = sessionsMap.get(id);
  if (!session) return null;

  if (role === 'a') {
    session.personA.insight = insight;
    if (insight.readyToInvite && session.status === 'intake_a') {
      session.status = 'invite_created';
    }
  } else if (session.personB) {
    session.personB.insight = insight;
    if (insight.readyToInvite && session.status === 'intake_b') {
      session.status = 'mediation_ready';
    }
  }

  session.updatedAt = Date.now();
  sessionsMap.set(id, session);
  return session;
}

export function createInvitationForSession(id: string): NeutralInvitation | null {
  const session = sessionsMap.get(id);
  if (!session) return null;

  const relationship = session.relationship;
  const isParent = relationship === 'parent';

  const neutralSummary = isParent
    ? "Reconcile noticed a communication gap between you and your child about how conversations around studies and schoolwork are landing. There seem to be strong feelings on both sides — and understanding each perspective could help you both feel heard."
    : "Reconcile noticed a communication gap between you and someone who cares about your relationship. There seem to be strong feelings on both sides — and understanding each perspective could bring clarity.";

  const invitation: NeutralInvitation = {
    inviteCode: session.id,
    senderLabel: isParent ? 'Your child' : 'Someone close to you',
    recipientLabel: isParent ? 'Parent' : 'Friend',
    relationship: session.relationship,
    topic: session.topic || 'Communication Misunderstanding',
    neutralSummary,
    invitationMessage: isParent
      ? "Reconcile noticed a communication gap between you and your child. We'd love to hear your side before drawing any conclusions."
      : "Reconcile noticed a communication gap between you and someone close to you. We'd love to hear your side before drawing any conclusions.",
    accepted: false
  };

  session.invitation = invitation;
  session.status = 'invite_created';
  session.updatedAt = Date.now();
  sessionsMap.set(id, session);
  return invitation;
}

export function initializePersonB(id: string): MediationSession | null {
  const session = sessionsMap.get(id);
  if (!session) return null;

  if (!session.personB) {
    const isParent = session.relationship === 'parent';
    const now = Date.now();
    session.personB = {
      label: isParent ? 'Parent' : 'Friend',
      messages: [
        {
          id: `msg-b-intro-${now}`,
          sender: 'reconcile',
          role: 'b',
          text: isParent
            ? "Hey. Reconcile noticed there might be a disconnect between you and your child around studies and schoolwork. We're not here to take sides — we just want to understand how things have felt from your end. How have things been going?"
            : "Hey. Reconcile noticed there might be a disconnect between you and someone you're close to. We're not here to take sides — we just want to understand your perspective. What's been on your mind?",
          timestamp: now,
          privacy: 'PRIVATE_B',
          quickReplies: isParent
            ? [
                "I ask because I'm worried about their future",
                "I just see them on their phone instead of studying",
                "I love them and want them to succeed",
                "I didn't realize it bothered them so much"
              ]
            : [
                "I was swamped with exams and personal stuff",
                "I didn't mean to ignore them at all",
                "I thought they knew I was busy",
                "I've been feeling overwhelmed lately"
              ],
          reassuranceNote: "You don't have to defend yourself. Your words stay private with Reconcile."
        }
      ]
    };
    if (session.invitation) {
      session.invitation.accepted = true;
    }
    session.status = 'intake_b';
    session.updatedAt = now;
    sessionsMap.set(id, session);
  }

  return session;
}
