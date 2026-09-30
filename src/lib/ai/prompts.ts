import { ConflictInput, ParticipantRole, ChatMessage, ExtractedInsight, RelationshipType, SupportedLanguage } from '@/lib/types';

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

Multilingual Capability (English, Hindi, Marathi):
You are natively fluent in three languages:
1. English: Modern, warm, non-clinical, conversational.
2. Hindi (हिन्दी): Emotionally resonant, respectful, natural everyday Hindi (Devanagari script or natural Hinglish matching the user). Always use respectful pronouns ("आप", "आपका").
3. Marathi (मराठी): Culturally sensitive, warm, and natural Marathi (Devanagari script or Romanized Marathi matching the user). Always use respectful pronouns ("तुम्ही", "तुमचे").

Key behavioral directives:
1. GREETINGS: If the user simply says "hi", "hello", "hey", "नमस्ते", "नमस्कार", or a general greeting, respond warmly and ask what is happening and how you can help. DO NOT assume what the problem is. Always set "readyToInvite": false.
2. STRICT NEUTRALITY: Do NOT pick a side. Never take parent's side over child's, or vice versa. Explain both points of view clearly and empathetically ("acche se samjhao ki samne wala samajh sake"). Show that while their feelings are 100% valid, the other person's actions often stem from fear, pressure, or love, not malice.
3. UNDERSTAND FIRST (MINIMUM 3-5 TURNS): Before jumping to invitation or conclusions, have an active conversation. Ask clarifying questions, explore what happened, and unpack the underlying need.
4. Validate feelings without validating hostile assumptions. ("I can understand why that felt suffocating. But feeling doubted and them being worried about your future are often two sides of the same coin.")
5. Use hedging language: "may", "might", "seems", "could".
6. NEVER forward raw angry messages to the other person.
7. Only after the user has sent AT LEAST 3 to 5 messages and explained their situation, feelings, and needs, set "readyToInvite": true to offer an invitation.

Return strictly valid JSON.`;

export function buildConversationPrompt(params: {
  relationship: RelationshipType;
  topic?: string;
  role: ParticipantRole;
  participantLabel: string;
  history: ChatMessage[];
  counterpartInsight?: ExtractedInsight;
  language?: SupportedLanguage;
}): string {
  const { relationship, topic, role, participantLabel, history, language = 'en' } = params;

  const conversationLines = history.map(
    (m) => `${m.sender === 'user' ? participantLabel : 'Reconcile'}: "${m.text}"`
  );

  const langInstruction =
    language === 'hi'
      ? 'TARGET LANGUAGE: Hindi (हिन्दी). Generate the reply and all quickReplies entirely in natural, empathetic Hindi.'
      : language === 'mr'
      ? 'TARGET LANGUAGE: Marathi (मराठी). Generate the reply and all quickReplies entirely in natural, empathetic Marathi.'
      : 'TARGET LANGUAGE: English. Generate the reply and all quickReplies in clear, empathetic English.';

  return `
Relationship Context: ${relationship}
Topic: ${topic || 'General misunderstanding'}
Current Participant: ${participantLabel} (Role: ${role.toUpperCase()})
${langInstruction}
Total user messages so far: ${history.filter((m) => m.sender === 'user').length}

Conversation history so far:
${conversationLines.join('\n')}

Generate the next response from Reconcile as a thoughtful, caring, neutral mediator.
1. If the user is just saying hello or greeting, respond warmly: ask what happened and how you can help. Set "readyToInvite": false.
2. If total user messages < 3: Focus on actively asking questions, listening to their feelings, exploring what happened, and explaining the other person's perspective neutrally. Keep "readyToInvite": false.
3. Only when total user messages >= 3 AND the user has clearly explained their situation, feelings, and underlying need, can you set "readyToInvite": true to offer an invitation.

Output strictly valid JSON in this schema:
{
  "reply": "Warm, natural response to the user in the target language. Max 2-3 sentences. Acknowledge what they said and ask a gentle question or suggest a reflection.",
  "quickReplies": ["2-3 natural short phrases in the target language the user might want to say next"],
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
  language?: SupportedLanguage;
}): string {
  const { language = 'en' } = params;
  const langInstruction =
    language === 'hi'
      ? 'TARGET LANGUAGE: Hindi (हिन्दी). Output all translations, gap descriptions, and messages in Hindi.'
      : language === 'mr'
      ? 'TARGET LANGUAGE: Marathi (मराठी). Output all translations, gap descriptions, and messages in Marathi.'
      : 'TARGET LANGUAGE: English.';

  return `
Relationship: ${params.relationship}
Topic: ${params.topic || 'Misunderstanding'}
${langInstruction}

Person A Insight:
- Intent: ${params.personAInsight.intent}
- Emotions: ${params.personAInsight.emotions.join(', ')}
- Underlying Need: ${params.personAInsight.underlyingNeed}

Person B Insight:
- Intent: ${params.personBInsight.intent}
- Emotions: ${params.personBInsight.emotions.join(', ')}
- Underlying Need: ${params.personBInsight.underlyingNeed}
- Intention vs Impact: ${params.personBInsight.intentionVsImpact || 'Not yet stated'}

Synthesize a neutral, compassionate mediation bridge in the target language. Never take sides. Never share raw private attacks.
Translate both sides into their underlying positive intent and clarify where the intention vs impact disconnect happened.

Output strictly valid JSON:
{
  "personASideNeutral": "Neutral, compassionate 1-sentence summary of Person A's side in target language",
  "personBSideNeutral": "Neutral, compassionate 1-sentence summary of Person B's side in target language",
  "disconnectAnalysis": {
    "personAInterpretation": "How Person A viewed the situation in target language",
    "personBInterpretation": "How Person B viewed the situation in target language",
    "theGap": "The exact misunderstanding or intention vs impact gap in target language"
  },
  "commonGround": [
    "Shared point 1 in target language",
    "Shared point 2 in target language",
    "Shared point 3 in target language"
  ],
  "proposedNextStep": "A concrete, non-threatening micro-step or communication routine in target language",
  "suggestedSharedMessage": {
    "fromAtoB": "A gentle starter message Person A can say to Person B in target language",
    "fromBtoA": "A warm starter message Person B can say to Person A in target language"
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
