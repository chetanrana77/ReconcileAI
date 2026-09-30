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

// Resilient store for serverless environments
const globalStore = (globalThis as any).__reconcileSessionsMap as Map<string, MediationSession> | undefined;
const sessionsMap: Map<string, MediationSession> = globalStore || new Map<string, MediationSession>();
if (!globalStore) {
  (globalThis as any).__reconcileSessionsMap = sessionsMap;
}

// Initialize with demo sessions
export function initializeDemoSessions() {
  for (const session of Object.values(DEMO_SESSIONS)) {
    if (!sessionsMap.has(session.id)) {
      sessionsMap.set(session.id, JSON.parse(JSON.stringify(session)));
    }
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
  const existing = sessionsMap.get(id);
  if (existing) return existing;

  if (id.startsWith('demo-')) {
    const baseKey = id.split('-').slice(0, 3).join('-');
    const demoTemplate = DEMO_SESSIONS[baseKey];
    if (demoTemplate) {
      const cloned: MediationSession = JSON.parse(JSON.stringify(demoTemplate));
      cloned.id = id;
      sessionsMap.set(id, cloned);
      return cloned;
    }
  }

  if (id.startsWith('session-')) {
    const recovered = createSession('parent', 'Studies and Trust');
    recovered.id = id;
    sessionsMap.set(id, recovered);
    return recovered;
  }

  return null;
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

function getRelationshipLabels(relationship: RelationshipType) {
  switch (relationship) {
    case 'parent':
      return { senderLabel: 'Your child', recipientLabel: 'Parent' };
    case 'sibling':
      return { senderLabel: 'Your sibling', recipientLabel: 'Sibling' };
    case 'partner':
      return { senderLabel: 'Your partner', recipientLabel: 'Partner' };
    case 'classmate':
      return { senderLabel: 'Your classmate', recipientLabel: 'Classmate' };
    case 'friend':
      return { senderLabel: 'Your friend', recipientLabel: 'Friend' };
    default:
      return { senderLabel: 'Someone close to you', recipientLabel: 'Someone close' };
  }
}

export function createInvitationForSession(id: string): NeutralInvitation | null {
  const session = sessionsMap.get(id);
  if (!session) return null;

  const relationship = session.relationship;
  const labels = getRelationshipLabels(relationship);

  let neutralSummary = '';
  if (relationship === 'parent') {
    neutralSummary =
      'Reconcile noticed a communication disconnect between you and your child about studies and daily expectations. There seem to be strong feelings on both sides — and understanding each perspective could help you both feel heard.';
  } else if (relationship === 'sibling') {
    neutralSummary =
      'Reconcile noticed a communication disconnect between you and your sibling. Understanding each perspective could help clear the air peacefully.';
  } else if (relationship === 'partner') {
    neutralSummary =
      "Reconcile noticed a communication disconnect between you and your partner. Understanding each other's point of view could bring clarity and closeness.";
  } else if (relationship === 'friend') {
    neutralSummary =
      'Reconcile noticed a communication disconnect between you and your friend. Understanding each perspective could help you make up peacefully.';
  } else {
    neutralSummary =
      'Reconcile noticed a communication disconnect between you and someone close to you. Understanding each perspective could bring clarity and mutual peace.';
  }

  const invitation: NeutralInvitation = {
    inviteCode: session.id,
    senderLabel: labels.senderLabel,
    recipientLabel: labels.recipientLabel,
    relationship: session.relationship,
    topic: session.topic || 'Communication Misunderstanding',
    neutralSummary,
    invitationMessage: `Reconcile noticed a communication gap between you and ${labels.senderLabel.toLowerCase()}. We'd love to hear your side with total privacy before drawing any conclusions.`,
    accepted: false
  };

  session.invitation = invitation;
  session.status = 'invite_created';
  session.updatedAt = Date.now();
  sessionsMap.set(id, session);
  return invitation;
}

export function initializePersonB(id: string, language?: SupportedLanguage): MediationSession | null {
  const session = sessionsMap.get(id);
  if (!session) return null;

  if (!session.personB) {
    const relationship = session.relationship;
    const isParent = relationship === 'parent';
    const labels = getRelationshipLabels(relationship);
    const now = Date.now();
    const lang = language || session.language || 'en';

    let introText = '';
    let quickReplies: string[] = [];
    let reassuranceNote = '';

    if (lang === 'hi') {
      reassuranceNote = 'आपकी बातें Reconcile के पास पूरी तरह 100% गोपनीय रहेंगी।';
      if (isParent) {
        introText =
          'नमस्ते। आपके बच्चे ने आपसे शांति से बात करने के लिए Reconcile के माध्यम से आमंत्रित किया है। हम किसी का पक्ष नहीं लेते — हम केवल आपकी बात और फिक्र को निष्पक्ष रूप से समझना चाहते हैं। आपके नज़रिए से हाल के दिनों में क्या चल रहा है?';
        quickReplies = [
          'मुझे हर समय उनके भविष्य की चिंता रहती है',
          'मैं केवल उनके भले के लिए समझाता/समझाती हूँ',
          'मुझे नहीं पता था कि उन्हें यह दबाव लगता है',
          'हम बिना लड़े प्यार से बात कैसे कर सकते हैं?'
        ];
      } else {
        introText =
          'नमस्ते। आपके किसी करीबी ने आपसे शांति से बात सुलझाने के लिए Reconcile के ज़रिए आमंत्रित किया है। हम पूरी तरह निष्पक्ष हैं और किसी का पक्ष नहीं लेते। आपकी बातें यहाँ 100% गोपनीय रहेंगी। आपके नज़रिए से हाल में क्या स्थिति रही है?';
        quickReplies = [
          'मुझे यहाँ क्यों बुलाया गया है?',
          'उन्होंने क्या कहा?',
          'हाल ही में हमारे बीच थोड़ी दूरी या तनाव था',
          'मैं बिना लड़े शांति से बात करना चाहता हूँ'
        ];
      }
    } else if (lang === 'mr') {
      reassuranceNote = 'तुमचे बोलणे Reconcile कडे १००% खाजगी आणि सुरक्षित राहील.';
      if (isParent) {
        introText =
          'नमस्कार. तुमच्या मुलाने/मुलीने शांततेने संवाद साधण्यासाठी Reconcile द्वारे तुम्हाला आमंत्रित केले आहे. आम्ही कोणाचीही बाजू घेत नाही — आम्हाला फक्त तुमची बाजू आणि काळजी समजून घ्यायची आहे. तुमच्या दृष्टीने अलीकडे काय चालले आहे?';
        quickReplies = [
          'मला सतत त्यांच्या भविष्याची काळजी वाटते',
          'मी फक्त त्यांच्या चांगल्यासाठीच बोलतो/बोलते',
          'त्यांना याचा एवढा त्रास होतोय हे मला ठाऊक नव्हते',
          'आम्ही वाद न घालता एकत्र कसे बोलू शकतो?'
        ];
      } else {
        introText =
          'नमस्कार. तुमच्या एका जवळच्या व्यक्तीने वाद न घालता संवाद साधण्यासाठी तुम्हाला येथे आमंत्रित केले आहे. Reconcile पूर्णपणे निष्पक्ष आहे आणि तुमचे बोलणे १००% खाजगी राहील. तुमच्या दृष्टीने अलीकडे काय घडले आहे?';
        quickReplies = [
          'मला येथे का आमंत्रित केले आहे?',
          'ते नक्की काय म्हणाले?',
          'अलीकडे आमच्यात थोडा तणाव नक्कीच जाणवत होता',
          'मला फक्त वाद न घालता शांततेने मार्ग काढायचा आहे'
        ];
      }
    } else {
      reassuranceNote = "You don't have to defend yourself. Your words stay 100% private with Reconcile.";
      if (isParent) {
        introText =
          "Hello. Your child invited you to connect here so you two can understand each other peacefully. We don't take sides — we genuinely want to understand your perspective and care. How have things felt from your end lately?";
        quickReplies = [
          'I worry about their future constantly',
          'I only want what is best for them',
          'I did not realize it felt like suffocating pressure',
          'How can we talk calmly without arguing?'
        ];
      } else {
        introText =
          "Hello. Someone who cares about you invited you to talk here so you two can clear the air peacefully. We don't take sides, and everything you say stays 100% private. How have things felt from your perspective lately?";
        quickReplies = [
          'Why was I invited here?',
          'What did they say?',
          'Things have felt a bit tense lately',
          'I want us to talk through this peacefully'
        ];
      }
    }

    session.personB = {
      label: labels.recipientLabel,
      messages: [
        {
          id: `msg-b-intro-${now}`,
          sender: 'reconcile',
          role: 'b',
          text: introText,
          timestamp: now,
          privacy: 'PRIVATE_B',
          quickReplies,
          reassuranceNote
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
