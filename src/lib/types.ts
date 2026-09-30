export type RelationshipType =
  | 'friend'
  | 'parent'
  | 'sibling'
  | 'partner'
  | 'classmate'
  | 'other';

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export type EmotionType =
  | 'hurt'
  | 'angry'
  | 'ignored'
  | 'confused'
  | 'disappointed'
  | 'frustrated'
  | 'sad'
  | 'left-out';

export type ParticipantRole = 'a' | 'b';

export type ContextPrivacy = 'PRIVATE_A' | 'PRIVATE_B' | 'SHARED' | 'AI_INTERNAL';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'reconcile';
  role: ParticipantRole;
  text: string;
  timestamp: number;
  privacy: ContextPrivacy;
  quickReplies?: string[];
  reassuranceNote?: string;
}

export interface ExtractedInsight {
  intent: string;
  emotions: string[];
  underlyingNeed: string;
  fearedOutcome?: string;
  assumptionsIdentified?: string[];
  intentionVsImpact?: string;
  readyToInvite?: boolean;
}

export interface MediationBridge {
  status: 'pending' | 'ready' | 'shared';
  personASideNeutral: string;
  personBSideNeutral: string;
  disconnectAnalysis: {
    personAInterpretation: string;
    personBInterpretation: string;
    theGap: string;
  };
  commonGround: string[];
  proposedNextStep: string;
  suggestedSharedMessage: {
    fromAtoB: string;
    fromBtoA: string;
  };
}

export interface NeutralInvitation {
  inviteCode: string;
  senderLabel: string; // e.g. "Your child" or "Alex"
  recipientLabel: string; // e.g. "Parent" or "Taylor"
  relationship: RelationshipType;
  topic: string;
  neutralSummary: string; // Neutral translation of Person A's concern without raw anger
  invitationMessage: string;
  accepted: boolean;
}

export interface MediationSession {
  id: string;
  relationship: RelationshipType;
  topic?: string;
  language?: SupportedLanguage;
  status: 'intake_a' | 'invite_created' | 'intake_b' | 'mediation_ready' | 'completed';
  personA: {
    label: string;
    messages: ChatMessage[];
    insight?: ExtractedInsight;
  };
  invitation?: NeutralInvitation;
  personB?: {
    label: string;
    messages: ChatMessage[];
    insight?: ExtractedInsight;
  };
  bridge?: MediationBridge;
  createdAt: number;
  updatedAt: number;
}

// Client-safe projection of session filtered by role
export interface SafeSessionView {
  id: string;
  relationship: RelationshipType;
  topic?: string;
  language?: SupportedLanguage;
  status: MediationSession['status'];
  currentRole: ParticipantRole;
  myMessages: ChatMessage[];
  myInsight?: ExtractedInsight;
  invitation?: NeutralInvitation;
  bridge?: MediationBridge;
  isReadyForMediation: boolean;
}

// Backwards-compatible analysis types
export interface ConflictInput {
  relationship: RelationshipType;
  story: string;
  emotions: EmotionType[];
}

export interface UserPerspective {
  summary: string;
  feelings: string[];
}

export interface OtherPerspective {
  summary: string;
  possibleReasons: string[];
}

export interface Misunderstanding {
  summary: string;
  userInterpretation: string;
  possibleOtherInterpretation: string;
}

export interface ReconcileResponse {
  userPerspective: UserPerspective;
  otherPerspective: OtherPerspective;
  misunderstanding: Misunderstanding;
  commonGround: string[];
  reconciliationMessage: string;
}

export type AppStep =
  | 'landing'
  | 'hub'
  | 'chat_a'
  | 'invite'
  | 'chat_b'
  | 'mediation'
  // legacy compatibility
  | 'relationship'
  | 'input'
  | 'processing'
  | 'results';

export interface SafetyFlag {
  isSafe: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}
