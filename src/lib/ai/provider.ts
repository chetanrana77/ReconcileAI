import {
  ConflictInput,
  ReconcileResponse,
  ChatMessage,
  ParticipantRole,
  ExtractedInsight,
  MediationBridge,
  RelationshipType
} from '@/lib/types';
import {
  MEDIATOR_SYSTEM_PROMPT,
  buildConversationPrompt,
  buildBridgePrompt,
  SYSTEM_PROMPT,
  buildUserPrompt
} from '@/lib/ai/prompts';
import { validateAIResponse } from '@/lib/validation';

export interface MediatorTurnResult {
  reply: string;
  quickReplies: string[];
  extractedInsight: ExtractedInsight;
}

export async function generateMediatorReply(params: {
  relationship: RelationshipType;
  topic?: string;
  role: ParticipantRole;
  participantLabel: string;
  history: ChatMessage[];
  counterpartInsight?: ExtractedInsight;
}): Promise<MediatorTurnResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const userPrompt = buildConversationPrompt(params);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: MEDIATOR_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.reply && parsed.extractedInsight) {
            return {
              reply: parsed.reply,
              quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : [],
              extractedInsight: parsed.extractedInsight
            };
          }
        }
      }
    } catch (err) {
      console.warn('Live AI call failed, using intelligent fallback:', err);
    }
  }

  // Resilient contextual conversational engine
  const isRoleA = params.role === 'a';
  const historyLen = params.history.filter((m) => m.sender === 'user').length;
  const lastUserMsg = (params.history.filter((m) => m.sender === 'user').slice(-1)[0]?.text || '').trim().toLowerCase();
  const isParentRel = params.relationship === 'parent';

  // Greeting check
  const isGreeting = /^(hi|hii|hiii|hello|helo|hey|heyy|hey there|good morning|good evening|yo|namaste|help)$/i.test(lastUserMsg);

  if (isRoleA) {
    // 1. User sent a greeting
    if (isGreeting || lastUserMsg.length <= 3) {
      return {
        reply: "Hello, I'm here. What's been going on that's been weighing on you? Tell me in your own words — nobody else sees this.",
        quickReplies: isParentRel
          ? ["My parents keep checking on my studies", "It feels like they don't trust me", "We had an argument yesterday", "I'm stressed and overwhelmed"]
          : ["A friend hasn't replied to me", "We had a disagreement", "I feel ignored and hurt", "Things feel awkward between us"],
        extractedInsight: {
          intent: "Starting the conversation",
          emotions: ["open", "seeking support"],
          underlyingNeed: "A safe space to be heard without judgment",
          readyToInvite: false
        }
      };
    }

    // 2. User talking about studies / grades / parents / trust
    if (/study|exam|grade|school|parent|mom|dad|career|marks|trust/i.test(lastUserMsg)) {
      if (historyLen <= 2) {
        return {
          reply: "That sounds exhausting. When conversations at home keep turning into check-ins about school or grades, it often feels like they don't believe in you — even if their intention is just worry. How does it usually play out when they bring it up?",
          quickReplies: ["It turns into an argument", "I just go silent and leave", "They think I'm wasting time", "I wish they would just let me breathe"],
          extractedInsight: {
            intent: "Wants autonomy and trust from parents regarding their responsibilities",
            emotions: ["pressured", "doubted", "frustrated"],
            underlyingNeed: "Trust, independence, and to feel respected as capable",
            readyToInvite: false
          }
        };
      }
    }

    // 3. User talking about silence / ghosting / friend / ignoring
    if (/reply|text|ghost|silence|ignore|friend|message|talk|call/i.test(lastUserMsg)) {
      if (historyLen <= 2) {
        return {
          reply: "I hear why that hurts. When someone you care about suddenly pulls back or doesn't reply, it's easy to wonder if the relationship still matters to them. Did something happen right before the silence, or did they just disappear?",
          quickReplies: ["We had a disagreement before", "They just stopped replying completely", "I shared something personal first", "I don't know what happened"],
          extractedInsight: {
            intent: "Seeking clarity and emotional reassurance about the relationship",
            emotions: ["hurt", "ignored", "anxious"],
            underlyingNeed: "Emotional safety and reciprocity",
            readyToInvite: false
          }
        };
      }
    }

    // 4. User expresses feeling hurt / angry / misunderstood
    if (historyLen <= 2) {
      return {
        reply: "Thank you for explaining that. Your feelings make complete sense. When you're in the middle of it, it feels like they don't even try to see where you're coming from. What do you wish they understood about how their words land on you?",
        quickReplies: ["That I'm trying my best", "That the way they talk makes me defensive", "That I still care, I just need space"],
        extractedInsight: {
          intent: "Expressing genuine hurt and desire for their perspective to be acknowledged",
          emotions: ["frustrated", "misunderstood", "caring"],
          underlyingNeed: "Validation, mutual respect, and calm communication",
          readyToInvite: false
        }
      };
    }

    // 5. Deeper conversation turn — ready to offer neutral invitation
    return {
      reply: "I think I really see what's going on from your side now. You want respect and breathing room, without having to fight for it. When you feel ready, I can help invite them with a calm, neutral message that explains your perspective without starting an argument.",
      quickReplies: ["Yes, help me invite them", "Can I see the invitation first?", "I want to keep talking"],
      extractedInsight: {
        intent: "Ready to establish healthy communication and bridge the misunderstanding",
        emotions: ["reflective", "caring", "ready for clarity"],
        underlyingNeed: "Mutual respect, independence, and peaceful resolution",
        readyToInvite: true
      }
    };
  } else {
    // Person B conversational fallback
    if (isGreeting || lastUserMsg.length <= 3) {
      return {
        reply: "Hello. Thank you for taking a moment to talk with me. Reconcile is here to understand your side without judgment or blame. How have things felt from your end lately?",
        quickReplies: isParentRel
          ? ["I worry about their future", "I just want them to succeed", "I didn't realize it bothered them", "Things have been tense"]
          : ["I was overwhelmed with work", "I needed time to cool down", "I didn't mean to ignore them", "I value our friendship"],
        extractedInsight: {
          intent: "Opening up to share their perspective",
          emotions: ["cautious", "protective"],
          underlyingNeed: "To be heard and understood fairly",
          readyToInvite: false
        }
      };
    }

    if (historyLen <= 2) {
      return {
        reply: isParentRel
          ? "That really helps clarify things. Your intention comes from deep care and anxiety for their future. But because of how often it's brought up, the impact lands as a lack of trust. Both realities can exist at the same time: you love them, and the check-ins feel overwhelming to them."
          : "That makes a lot of sense. Your silence wasn't about discarding the relationship — it was about being overwhelmed. But on their end, the impact felt like rejection. Neither of you had bad intentions.",
        quickReplies: ["I didn't realize it landed like that", "What can we do instead?", "How do we talk about this?"],
        extractedInsight: {
          intent: "Explaining genuine intentions of care, protection, or self-preservation",
          emotions: ["concerned", "reflective", "caring"],
          underlyingNeed: "Connection, mutual peace, and reassurance",
          intentionVsImpact: isParentRel
            ? "Intention was love and future protection; felt impact was micromanagement and doubt"
            : "Intention was coping with burnout; felt impact was perceived as cold neglect",
          readyToInvite: true
        }
      };
    }

    return {
      reply: "Both of you genuinely care about each other, but the way things landed created tension. Ready to see the joint Mediation Bridge and look at a ready-to-send message that opens a better conversation?",
      quickReplies: ["Show me the Mediation Bridge", "What is the recommended next step?"],
      extractedInsight: {
        intent: "Ready to review mutual common ground and de-escalating communication",
        emotions: ["open", "constructive", "relieved"],
        underlyingNeed: "A calm path forward without circular arguing",
        readyToInvite: true
      }
    };
  }
}

export async function generateMediationBridge(params: {
  relationship: RelationshipType;
  topic?: string;
  personAInsight: ExtractedInsight;
  personBInsight: ExtractedInsight;
}): Promise<MediationBridge> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const userPrompt = buildBridgePrompt(params);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: MEDIATOR_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.personASideNeutral && parsed.disconnectAnalysis) {
            return {
              status: 'ready',
              personASideNeutral: parsed.personASideNeutral,
              personBSideNeutral: parsed.personBSideNeutral,
              disconnectAnalysis: parsed.disconnectAnalysis,
              commonGround: Array.isArray(parsed.commonGround) ? parsed.commonGround : [],
              proposedNextStep: parsed.proposedNextStep || 'Have a calm 10-minute check-in.',
              suggestedSharedMessage: parsed.suggestedSharedMessage || {
                fromAtoB: "I value our relationship and wanted to talk through this calmly.",
                fromBtoA: "I love you and I'm listening."
              }
            };
          }
        }
      }
    } catch (err) {
      console.warn('Live AI bridge generation failed, using structured fallback:', err);
    }
  }

  // High quality offline fallback
  const isParent = params.relationship === 'parent';

  if (isParent) {
    return {
      status: 'ready',
      personASideNeutral: "They feel overwhelmed by frequent check-ins and interpret questions as a lack of trust in their independence.",
      personBSideNeutral: "They ask out of deep protective love and fear of regret in a competitive world, not a desire to micromanage.",
      disconnectAnalysis: {
        personAInterpretation: "Frequent questions = 'My parents think I am irresponsible and will fail without surveillance.'",
        personBInterpretation: "Frequent questions = 'I am showing active love and making sure they have the best future.'",
        theGap: "Anxious love colliding with emerging autonomy: The intent was support, but the impact was feeling scrutinized and distrusted."
      },
      commonGround: [
        "You both care deeply about the child's future and well-being.",
        "You both hate the daily household tension around grades.",
        "Neither person wants schoolwork to damage your bond."
      ],
      proposedNextStep: "Switch from unpredictable daily questions to a scheduled 15-minute weekly sync on Sunday evenings. Outside that sync, school talk is paused.",
      suggestedSharedMessage: {
        fromAtoB: "Mom & Dad, I know you ask because you want me to do well. It would help my anxiety so much if we set a dedicated check-in once a week, so I have the space to study without feeling watched.",
        fromBtoA: "I love you and I see how hard you're working. I'm stepping back from daily questions because I believe in you. I'm always here whenever you want to bring something up."
      }
    };
  }

  return {
    status: 'ready',
    personASideNeutral: "They experienced the communication gap as a lack of care and feared the relationship was deteriorating.",
    personBSideNeutral: "They stepped back to cool off and handle stress, without realizing how hurtful the silence felt.",
    disconnectAnalysis: {
      personAInterpretation: "Silence = 'They don't care about our relationship anymore.'",
      personBInterpretation: "Silence = 'I am overwhelmed and will reply when I have the energy.'",
      theGap: "One person interpreted silence as apathy, while the other person used silence as emotional damage control."
    },
    commonGround: [
      "You both value having a genuine, supportive connection.",
      "Neither person intended this to become a prolonged conflict.",
      "Both of you want clearer ways to signal when you need space."
    ],
    proposedNextStep: "A quick 10-minute relaxed conversation to acknowledge both perspectives without rehashing past blame.",
    suggestedSharedMessage: {
      fromAtoB: "Hey, I wanted to reach out because our friendship really matters to me. I felt hurt earlier, but I understand you were overwhelmed. Let's catch up when you're free.",
      fromBtoA: "Hey, thank you for being patient with me. I was stressed and handled the delay poorly. I value you and want to talk things through."
    }
  };
}

// Backwards-compatible analyzeConflict
export async function analyzeConflict(input: ConflictInput): Promise<ReconcileResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const userPrompt = buildUserPrompt(input);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenAI API Error:', errorData);
    throw new Error('Failed to communicate with AI provider');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from AI provider');
  }

  const parsedContent = JSON.parse(content);
  const validationResult = validateAIResponse(parsedContent);
  if (!validationResult.valid || !validationResult.data) {
    throw new Error('AI response did not match expected schema');
  }

  return validationResult.data;
}
