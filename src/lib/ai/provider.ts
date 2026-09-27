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

  // Resilient contextual fallback (guarantees rock-solid event demo offline)
  const isRoleA = params.role === 'a';
  const historyLen = params.history.filter((m) => m.sender === 'user').length;
  const lastUserMsg = params.history.filter((m) => m.sender === 'user').slice(-1)[0]?.text || '';
  const isParentRel = params.relationship === 'parent';

  if (isRoleA) {
    if (historyLen <= 1) {
      return {
        reply: isParentRel
          ? "It sounds like the questions themselves aren't really the whole issue. It might be that they make you feel like they don't trust you to manage your own responsibilities. Is that close to what you're feeling?"
          : "I hear why that feels frustrating. When someone goes quiet or pulls back, it's easy to wonder if the relationship matters as much to them as it does to you. Did something happen right before this?",
        quickReplies: ["Yes, exactly that", "There is more to it", "I just feel misunderstood"],
        extractedInsight: {
          intent: "Expressing frustration over perceived lack of trust or disconnection",
          emotions: ["frustrated", "doubted", "anxious"],
          underlyingNeed: "Trust, autonomy, and feeling valued",
          readyToInvite: false
        }
      };
    } else {
      return {
        reply: isParentRel
          ? "I think I understand your side now. There might be something useful we can try: If you want, I can help your parents understand what you're actually trying to say — without sending your raw words or starting an argument."
          : "I think I really see what's going on from your side. If you want, I can reach out to them and help them understand what you're actually feeling, without forwarding your raw words.",
        quickReplies: ["Help them understand", "Can I see what you'll say first?", "Keep talking with me"],
        extractedInsight: {
          intent: "Wants the other person to understand their boundary and need for trust without relationship rupture",
          emotions: ["frustrated", "caring", "ready for clarity"],
          underlyingNeed: "Respect, independence, and mutual peace",
          readyToInvite: true
        }
      };
    }
  } else {
    // Person B fallback
    if (historyLen <= 1) {
      return {
        reply: isParentRel
          ? "That really helps clarify things. Your intention is guidance, protection, and deep care for their future. But for them, the impact feels like a lack of trust in their capability. Both can be true at the same time: you love them and want them to succeed, and the constant questions are creating anxiety rather than motivation."
          : "Got it. That helps explain a lot. It sounds like your intention wasn't to ignore them or push them away, but because of life stress, the impact on their side felt like silence and neglect.",
        quickReplies: ["I didn't realize it caused anxiety", "What can we do instead?", "I only want what's best"],
        extractedInsight: {
          intent: "Expressing care and protection, though execution triggered defensive anxiety in the other person",
          emotions: ["protective", "concerned", "loving"],
          underlyingNeed: "Peace of mind and connection",
          intentionVsImpact: "Intention was love and care; impact was perceived as mistrust and pressure",
          readyToInvite: true
        }
      };
    } else {
      return {
        reply: "That is a huge insight. You want connection and peace of mind, not conflict. I think both of you actually want the exact same outcome. Want to see how we can bridge this together?",
        quickReplies: ["Show me the bridge", "How do we talk about this?"],
        extractedInsight: {
          intent: "Ready to find common ground and establish healthier communication",
          emotions: ["open", "reflective", "caring"],
          underlyingNeed: "Harmonious connection and mutual understanding",
          readyToInvite: true
        }
      };
    }
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
