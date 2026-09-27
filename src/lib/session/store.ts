import {
  MediationSession,
  SafeSessionView,
  ParticipantRole,
  ChatMessage,
  NeutralInvitation,
  MediationBridge,
  RelationshipType,
  ExtractedInsight
} from '@/lib/types';
import { DEMO_SESSIONS } from '@/lib/demo/scenarios';

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

export function createSession(relationship: RelationshipType = 'parent', topic?: string): MediationSession {
  const id = `session-${Math.random().toString(36).substring(2, 9)}`;
  const now = Date.now();

  const session: MediationSession = {
    id,
    relationship,
    topic: topic || (relationship === 'parent' ? 'Studies and Trust' : 'Communication Misunderstanding'),
    status: 'intake_a',
    personA: {
      label: relationship === 'parent' ? 'You' : 'You',
      messages: [
        {
          id: `msg-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'reconcile',
          role: 'a',
          text: "Hey, I'm here. What's going on?",
          timestamp: now,
          privacy: 'PRIVATE_A',
          quickReplies: [
            relationship === 'parent' ? "My parents keep asking about my studies" : "My friend hasn't replied for two days",
            "We had a huge argument yesterday",
            "It feels like they don't trust me",
            "I don't know how to bring this up directly"
          ],
          reassuranceNote: "Your words stay private with Reconcile. Nothing is forwarded without your consent."
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
    ? "Your child asked me to help explain something that has been difficult to say directly. They're feeling increasingly overwhelmed by frequent check-ins on schoolwork and grades, and underneath that frustration, they want to show they can handle responsibility while still knowing that you care about them."
    : "Someone close to you asked me to help explain something that has been hard to bring up directly without tension. They value your connection, but felt a disconnect during your recent communication and want to understand your side before making assumptions.";

  const invitation: NeutralInvitation = {
    inviteCode: session.id,
    senderLabel: isParent ? 'Your child' : 'Your friend',
    recipientLabel: isParent ? 'Parent' : 'Friend',
    relationship: session.relationship,
    topic: session.topic || 'Communication Misunderstanding',
    neutralSummary,
    invitationMessage: isParent
      ? "Someone wants to talk with you. Reconcile is helping them explain something that has been difficult to say directly."
      : "Someone wants to talk with you. Reconcile is helping explain something that has been hard to bring up directly.",
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
            ? "Hey. Your child asked me to help explain something that's been difficult to say directly without tension. Before I explain anything, I'd really like to hear your perspective. How have things felt from your side regarding their studies?"
            : "Hey. A friend asked me to help explain something that's been awkward to say directly. Before we look at anything else, I'd really like to hear your side. What happened from your perspective?",
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
