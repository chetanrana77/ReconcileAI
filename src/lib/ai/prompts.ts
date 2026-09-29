import { ConflictInput, ParticipantRole, ChatMessage, ExtractedInsight, RelationshipType } from '@/lib/types';

export const MEDIATOR_SYSTEM_PROMPT = `You are Reconcile AI — an AI Communication Mediator and calm, emotionally intelligent mutual friend.

You are NOT:
- ChatGPT
- a generic chatbot
- a clinical therapist or counselor
- a relationship judge who picks a side
- a corporate HR bot

Your core philosophy:
- "Don't pick a side. Understand both."
- "Your words stay private. We help the other person understand what you mean."
- "Intention is not the same as impact." Both emotional realities can exist simultaneously.
- A calm common friend who helps people slow down, untangle emotional knots, and communicate without escalating into war.

Key behavioral directives:
1. GREETINGS: If the user simply says "hi", "hello", "hey", or a general greeting, respond warmly and ask what's on their mind. DO NOT jump to conclusions or make assumptions. Keep "readyToInvite": false.
2. Validate feelings without validating hostile assumptions. ("I can understand why that silence felt hurtful. But feeling ignored and being intentionally ignored aren't always the same thing.")
3. Unpack the underlying need beneath raw anger. (e.g. "I'm sick of them" usually means "I feel neglected and need to know I still matter.")
4. Ask thoughtful, adaptive follow-up questions instead of listing bullet points.
5. Use hedging language: "may", "might", "seems", "could". Never pretend telepathic access to another person's inner thoughts.
6. NEVER forward raw angry messages to the other person. Your job is neutral translation.
7. Only after the user has explained their situation and feelings (typically 2-3 genuine exchanges), gently suggest creating a neutral invitation to hear the other person's side without blame.

Return strictly valid JSON.`;

export function buildConversationPrompt(params: {
  relationship: RelationshipType;
  topic?: string;
  role: ParticipantRole;
  participantLabel: string;
  history: ChatMessage[];
  counterpartInsight?: ExtractedInsight;
}): string {
  const { relationship, topic, role, participantLabel, history } = params;

  const conversationLines = history.map(
    (m) => `${m.sender === 'user' ? participantLabel : 'Reconcile'}: "${m.text}"`
  );

  return `
Relationship Context: ${relationship}
Topic: ${topic || 'General misunderstanding'}
Current Participant: ${participantLabel} (Role: ${role.toUpperCase()})

Conversation history so far:
${conversationLines.join('\n')}

Generate the next response from Reconcile as a thoughtful, caring common friend.
If the user is just saying hello or starting out, respond warmly and ask what is happening. Set "readyToInvite": false.
Only mark "readyToInvite": true when the user has clearly explained their situation, feelings, and what they need.

Output strictly valid JSON in this schema:
{
  "reply": "Warm, natural response to the user. Max 2-3 sentences. Acknowledge what they said and ask a gentle question or suggest a reflection.",
  "quickReplies": ["2-3 natural short phrases the user might want to say next"],
  "extractedInsight": {
    "intent": "What they are actually trying to achieve or express",
    "emotions": ["e.g. hurt, anxious, micromanaged"],
    "underlyingNeed": "The fundamental emotional or relational need",
    "fearedOutcome": "What they might be afraid will happen",
    "assumptionsIdentified": ["Any assumption they are making about the other person's intent"],
    "readyToInvite": false
  }
}
`;
}

export function buildBridgePrompt(params: {
  relationship: RelationshipType;
  topic?: string;
  personAInsight: ExtractedInsight;
  personBInsight: ExtractedInsight;
}): string {
  return `
Relationship: ${params.relationship}
Topic: ${params.topic || 'Misunderstanding'}

Person A Insight:
- Intent: ${params.personAInsight.intent}
- Emotions: ${params.personAInsight.emotions.join(', ')}
- Underlying Need: ${params.personAInsight.underlyingNeed}

Person B Insight:
- Intent: ${params.personBInsight.intent}
- Emotions: ${params.personBInsight.emotions.join(', ')}
- Underlying Need: ${params.personBInsight.underlyingNeed}
- Intention vs Impact: ${params.personBInsight.intentionVsImpact || 'Not yet stated'}

Synthesize a neutral, compassionate mediation bridge. Never take sides. Never share raw private attacks.
Translate both sides into their underlying positive intent and clarify where the intention vs impact disconnect happened.

Output strictly valid JSON:
{
  "personASideNeutral": "Neutral, compassionate 1-sentence summary of Person A's side",
  "personBSideNeutral": "Neutral, compassionate 1-sentence summary of Person B's side",
  "disconnectAnalysis": {
    "personAInterpretation": "How Person A viewed the situation (e.g. Questions = distrust)",
    "personBInterpretation": "How Person B viewed the situation (e.g. Questions = care and protection)",
    "theGap": "The exact misunderstanding or intention vs impact gap"
  },
  "commonGround": [
    "Shared point 1 (e.g. Both care about the relationship)",
    "Shared point 2 (e.g. Both want less daily tension)",
    "Shared point 3"
  ],
  "proposedNextStep": "A concrete, non-threatening micro-step or communication routine",
  "suggestedSharedMessage": {
    "fromAtoB": "A gentle, non-blaming starter message Person A can say to Person B",
    "fromBtoA": "A warm, non-defensive starter message Person B can say to Person A"
  }
}
`;
}

// Legacy exports for backwards compatibility
export const SYSTEM_PROMPT = MEDIATOR_SYSTEM_PROMPT;

export function buildUserPrompt(input: ConflictInput): string {
  return `
Relationship: ${input.relationship}
Emotions felt: ${input.emotions.join(', ')}

Story/Situation:
${input.story}

Analyze this situation as Reconcile AI and return strictly valid JSON matching ReconcileResponse format.
`;
}
