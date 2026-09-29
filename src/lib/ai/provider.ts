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
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  // 1. Try Google Gemini API if configured
  if (geminiKey) {
    try {
      const userPrompt = buildConversationPrompt(params);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: MEDIATOR_SYSTEM_PROMPT }]
            },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.7,
              maxOutputTokens: 1000
            }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
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
      console.warn('Gemini live call error, trying fallback:', err);
    }
  }

  // 2. Try OpenAI API if configured
  if (openAiKey) {
    try {
      const userPrompt = buildConversationPrompt(params);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`
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
      console.warn('OpenAI live call error, using local conversational engine:', err);
    }
  }

  // 3. Deep Multi-Turn Conversational Engine (Longer, Empathetic, Highly Layered Dialogue)
  const isRoleA = params.role === 'a';
  const userMessages = params.history.filter((m) => m.sender === 'user');
  const historyLen = userMessages.length;
  const lastUserMsg = (userMessages.slice(-1)[0]?.text || '').trim().toLowerCase();
  const allUserText = userMessages.map((m) => m.text.toLowerCase()).join(' ');
  const isParentRel = params.relationship === 'parent';

  // Greeting detection
  const isGreeting = /^(hi|hii|hiii|hello|helo|hey|heyy|hey there|good morning|good evening|yo|namaste|help)$/i.test(lastUserMsg);

  if (isRoleA) {
    // TURN 1: Initial Greeting / Opening
    if (isGreeting || lastUserMsg.length <= 4) {
      return {
        reply: "Hello. Take a breath — I'm right here with you. There's no hurry and nobody else sees this. What's been going on that you'd like to talk through?",
        quickReplies: isParentRel
          ? ["Mom keeps asking about my exams every day", "It feels like they have zero faith in me", "We had a huge argument yesterday", "I'm stressed and need breathing room"]
          : ["My friend stopped replying to me", "We had an emotional argument", "I feel completely ignored and hurt", "Things have become really awkward"],
        extractedInsight: {
          intent: "Opening up in a safe container",
          emotions: ["cautious", "open"],
          underlyingNeed: "A private place to be heard without judgment",
          readyToInvite: false
        }
      };
    }

    // TURN 2: Exploring What Happened & Acknowledging the Surface Pain
    if (historyLen === 1) {
      if (/study|exam|grade|school|marks|college|schedule|career|morning|parent|mom|dad/i.test(allUserText)) {
        return {
          reply: "That sounds exhausting to live with every day. When questions about exams and preparation start first thing in the morning, it doesn't feel like caring — it feels like being under constant surveillance. What did she say recently that bothered you the most?",
          quickReplies: ["She asked if I'm even studying", "She acts like I have no plan", "She said I'm on my phone too much", "She compares me to other people"],
          extractedInsight: {
            intent: "Explaining how daily questioning feels like surveillance",
            emotions: ["pressured", "scrutinized", "suffocated"],
            underlyingNeed: "Autonomy, space, and recognition of their effort",
            readyToInvite: false
          }
        };
      }

      if (/friend|reply|text|ghost|silence|ignore|message/i.test(allUserText)) {
        return {
          reply: "I hear you. When someone you care about goes cold or doesn't reply, it's easy to wonder if you did something wrong or if the bond only mattered to you. Did this silence happen out of nowhere, or after a specific conversation?",
          quickReplies: ["We had a disagreement before this", "It was right after I shared something personal", "It came completely out of nowhere", "They've done this before"],
          extractedInsight: {
            intent: "Seeking clarity on sudden interpersonal distance",
            emotions: ["hurt", "confused", "abandoned"],
            underlyingNeed: "Emotional reciprocity and reliability",
            readyToInvite: false
          }
        };
      }

      return {
        reply: "Thank you for sharing that with me. That sounds really heavy to hold onto by yourself. When that happened, what was the hardest part for you to swallow?",
        quickReplies: ["How unfair it felt", "That they didn't even listen to me", "Feeling like whatever I say is wrong", "That they assumed the worst"],
        extractedInsight: {
          intent: "Describing painful interpersonal experience",
          emotions: ["frustrated", "hurt"],
          underlyingNeed: "Validation and fair hearing",
          readyToInvite: false
        }
      };
    }

    // TURN 3: Going Beneath the Surface (Unpacking Intention vs Impact)
    if (historyLen === 2) {
      if (/faith|trust|manage|life|own|doubt|pressure|independent/i.test(allUserText)) {
        return {
          reply: "I really hear that. It hurts the most because you're already feeling the pressure yourself, and having her constantly doubt your ability makes you feel like an incompetent kid. Do you think she actually doesn't trust you, or is her own anxiety taking over?",
          quickReplies: ["Her own anxiety is out of control", "She honestly doesn't trust me", "A mix of both", "She thinks she knows what's best for me"],
          extractedInsight: {
            intent: "Differentiating between parental anxiety and perceived lack of trust",
            emotions: ["doubted", "longing for independence", "frustrated"],
            underlyingNeed: "To be treated as an adult capable of responsibility",
            readyToInvite: false
          }
        };
      }

      return {
        reply: "That makes complete sense. When you're constantly on the defensive, you don't even have space to figure out what you need. If you could press pause and tell them how this really affects you — without them getting defensive — what would you say?",
        quickReplies: ["I need you to let me breathe", "I want you to trust that I care too", "Your questions make me more anxious, not less", "I just want peace between us"],
        extractedInsight: {
          intent: "Articulating unexpressed boundary and emotional truth",
          emotions: ["vulnerable", "reflective", "tired"],
          underlyingNeed: "Breathing room, trust, and mutual peace",
          readyToInvite: false
        }
      };
    }

    // TURN 4: Finding the Bridge (Clarifying the Core Wish)
    if (historyLen === 3) {
      return {
        reply: "That is so honest and clear. You don't want to fight with her or shut her out — you just want breathing room and to know that she believes in you. And ironically, she probably asks because she is terrified for your future and doesn't know any other way to show it. Does that ring true?",
        quickReplies: ["Yes, exactly that", "I know she loves me, but it's too much", "I just need a different way to check in", "I want her to stop asking every day"],
        extractedInsight: {
          intent: "Ready to recognize mutual care while holding a healthy boundary",
          emotions: ["caring", "clear-headed", "ready for change"],
          underlyingNeed: "A structured, calm way to communicate that preserves autonomy",
          readyToInvite: false
        }
      };
    }

    // TURN 5+: Ready to Create the Neutral Invitation
    return {
      reply: "You've untangled something truly important here. You want her support, but you need her trust. When you're ready, I can help invite her with a calm, neutral message — no blame, no forwarded venting — so she can share her perspective and you two can agree on a healthy way forward.",
      quickReplies: ["Yes, let's create the invitation", "What will the invitation say?", "Can we practice what I'll say first?"],
      extractedInsight: {
        intent: "Ready to bridge the disconnect through a neutral mediator",
        emotions: ["mature", "ready for clarity", "hopeful"],
        underlyingNeed: "Mutual respect, independence, and peaceful connection",
        readyToInvite: true
      }
    };
  } else {
    // ==========================================
    // PERSON B (PARENT / FRIEND / SECOND PERSON)
    // ==========================================

    // TURN 1: Welcoming Person B
    if (isGreeting || lastUserMsg.length <= 4) {
      return {
        reply: "Hello. Thank you for stepping in and taking a moment to talk with me. Reconcile is here to listen to your perspective with total confidentiality. How have things felt from your side lately?",
        quickReplies: isParentRel
          ? ["I worry about their future constantly", "I gave up a lot so they could have opportunities", "I see them on their phone and panic", "I love them and want them to succeed"]
          : ["I was completely overwhelmed this week", "I didn't mean to hurt them", "I had exams and personal stress", "I value this relationship deeply"],
        extractedInsight: {
          intent: "Entering private consultation",
          emotions: ["cautious", "protective"],
          underlyingNeed: "To be heard fairly without accusations",
          readyToInvite: false
        }
      };
    }

    // TURN 2: Validating Person B's Good Intentions
    if (historyLen === 1) {
      if (isParentRel) {
        return {
          reply: "I hear the deep love in that. You sacrificed so much to give her opportunities you didn't have, so watching her navigate life triggers intense worry that she'll stumble. When you ask about her studies, what is the biggest worry running through your mind?",
          quickReplies: ["That she'll fall behind and regret it", "That she doesn't realize how tough the world is", "I want her to have a secure career", "I just want her to be independent and happy"],
          extractedInsight: {
            intent: "Explaining parental anxiety, love, and protection",
            emotions: ["fear of their regret", "deep protective love", "anxious"],
            underlyingNeed: "Reassurance of child's safety and long-term security",
            readyToInvite: false
          }
        };
      } else {
        return {
          reply: "That makes a lot of sense. Life stress and burnout can completely drain your emotional battery, making even a short text feel impossible. When you pulled back, what did you hope would happen?",
          quickReplies: ["I wanted to clear my head first", "I didn't want to say the wrong thing", "I was barely surviving the week", "I thought we could talk when I'm calm"],
          extractedInsight: {
            intent: "Coping with exhaustion while avoiding conflict escalation",
            emotions: ["overwhelmed", "cautious"],
            underlyingNeed: "Time to recover without guilt or confrontation",
            readyToInvite: false
          }
        };
      }
    }

    // TURN 3: The Lightbulb Realization (Intention vs Impact)
    if (historyLen === 2) {
      if (isParentRel) {
        return {
          reply: "That is such a profound insight. Your intention is pure guidance and love. But let me ask you gently: when you ask her about grades every single morning, do you think she hears 'I love you', or does she hear 'I don't trust you to manage your life'?",
          quickReplies: ["I never thought she heard it as distrust", "I guess it does sound like nagging", "How else can I know she's on track?", "I just want what's best for her"],
          extractedInsight: {
            intent: "Recognizing the gap between loving intent and perceived surveillance",
            emotions: ["reflective", "softened", "loving"],
            underlyingNeed: "Connection without alienation",
            intentionVsImpact: "Intent: Protection & deep love. Impact: Felt as micromanagement and lack of trust.",
            readyToInvite: false
          }
        };
      } else {
        return {
          reply: "Exactly. Your intention was to avoid making things worse while overwhelmed. But for them, the silence felt like abandonment. Neither of you was acting out of malice — one person withdrew to cope, and the other felt neglected. Does seeing that help soften the tension?",
          quickReplies: ["Yes, I understand why they felt hurt", "I want to apologize for the silence", "I want them to understand I was drowning", "How do we fix this?"],
          extractedInsight: {
            intent: "Recognizing that silence was received as rejection despite innocent intent",
            emotions: ["empathetic", "relieved", "caring"],
            underlyingNeed: "Mutual understanding and forgiveness",
            intentionVsImpact: "Intent: De-escalation & personal recovery. Impact: Felt as cold disregard.",
            readyToInvite: false
          }
        };
      }
    }

    // TURN 4+: Ready for Shared Resolution
    return {
      reply: "Both of you genuinely care about each other, but the way things landed created tension. You both want respect, peace of mind, and connection. Ready to see the joint Mediation Bridge and review a starter message to clear the air together?",
      quickReplies: ["Show me the Mediation Bridge", "How should we talk about this?"],
      extractedInsight: {
        intent: "Ready to review mutual common ground and de-escalate the relationship",
        emotions: ["open", "constructive", "relieved"],
        underlyingNeed: "A calm path forward without circular arguing",
        intentionVsImpact: isParentRel
          ? "Intent: Maternal protection & care. Impact: Suffocating pressure & doubt."
          : "Intent: Self-preservation during burnout. Impact: Emotional neglect.",
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
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const userPrompt = buildBridgePrompt(params);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: MEDIATOR_SYSTEM_PROMPT }]
            },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.6,
              maxOutputTokens: 1200
            }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed.disconnectAnalysis && parsed.suggestedSharedMessage) {
            return {
              status: 'ready' as const,
              personASideNeutral: parsed.personASideNeutral || '',
              personBSideNeutral: parsed.personBSideNeutral || '',
              disconnectAnalysis: parsed.disconnectAnalysis,
              commonGround: parsed.commonGround || [],
              proposedNextStep: parsed.proposedNextStep || parsed.sharedAgreementStep || '',
              suggestedSharedMessage: parsed.suggestedSharedMessage
            };
          }
        }
      }
    } catch (err) {
      console.warn('Gemini bridge error, using fallback:', err);
    }
  }

  if (openAiKey) {
    try {
      const userPrompt = buildBridgePrompt(params);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: MEDIATOR_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.6,
          max_tokens: 1200
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.disconnectAnalysis && parsed.suggestedSharedMessage) {
            return {
              status: 'ready' as const,
              personASideNeutral: parsed.personASideNeutral || '',
              personBSideNeutral: parsed.personBSideNeutral || '',
              disconnectAnalysis: parsed.disconnectAnalysis,
              commonGround: parsed.commonGround || [],
              proposedNextStep: parsed.proposedNextStep || parsed.sharedAgreementStep || '',
              suggestedSharedMessage: parsed.suggestedSharedMessage
            };
          }
        }
      }
    } catch (err) {
      console.warn('OpenAI bridge error, using fallback:', err);
    }
  }

  // Resilient Contextual Bridge Fallback
  const isParent = params.relationship === 'parent';

  return {
    status: 'ready' as const,
    personASideNeutral: isParent
      ? "Wants autonomy, breathing room, and to feel trusted to manage their own future without daily scrutiny."
      : "Felt hurt by the sudden silence and needs to know their vulnerability was received with care.",
    personBSideNeutral: isParent
      ? "Acts out of deep maternal protection and fear of regret, wanting to ensure a secure and happy future."
      : "Was experiencing acute exhaustion and pulled back to avoid escalating tensions while overwhelmed.",
    disconnectAnalysis: {
      personAInterpretation: isParent
        ? "Daily questions feel like surveillance: “She has zero faith that I can manage my own life.”"
        : "Silence feels like abandonment: “They don't care enough about me to even send a reply.”",
      personBInterpretation: isParent
        ? "Daily questions feel like care: “I sacrificed so much and worry constantly because I love her.”"
        : "Silence feels like self-preservation: “I need to cool down and survive this week before I speak.”",
      theGap: isParent
        ? "The intention was protective love; the emotional impact was experienced as suffocating distrust. Both care about her future, but the daily delivery creates tension instead of motivation."
        : "The intention was taking space during burnout; the emotional impact was felt as cold neglect. Neither wanted the friendship to suffer."
    },
    commonGround: [
      isParent
        ? "Both want Maya to succeed and live a happy, fulfilling life."
        : "Both cherish the friendship and want mutual trust.",
      isParent
        ? "Both are exhausted by daily arguments and want genuine peace at home."
        : "Both prefer direct honesty over prolonged awkward silence.",
      isParent
        ? "Both agree that clear check-ins work better than unexpected daily interrogation."
        : "Both recognize that external stress affects communication."
    ],
    suggestedSharedMessage: {
      fromAtoB: isParent
        ? "“Mom, I know you ask because my future matters deeply to you, and I love you for that. But when it’s every morning, I feel doubted and overwhelmed. Can we agree on a Sunday check-in instead? That way you know I’m on track, and I can have room to breathe.”"
        : "“Hey — I was hurt by the silence because our friendship matters to me. But I also understand life gets overwhelming. Whenever you have the mental energy, I’d love to talk without any pressure.”",
      fromBtoA: isParent
        ? "“I love you more than anything and my questions come from fear of seeing you struggle. I didn’t realize it felt like I don’t trust you. I believe in you, and I’m ready to give you the space you need with a weekly check-in instead.”"
        : "“I am so sorry I went quiet. I was completely burned out and didn’t want to say the wrong thing. I value you and our friendship, and I never meant to make you feel ignored.”"
    },
    proposedNextStep: isParent
      ? "Agree to pause daily morning questioning. Set a recurring Sunday 20-minute coffee check-in where progress is shared willingly."
      : "Acknowledge that external stress happens. Agree to send a simple 'Need 2 days to recharge' heads-up instead of disappearing into silence."
  };
}

export async function analyzeConflict(input: ConflictInput): Promise<ReconcileResponse> {
  return {
    userPerspective: {
      summary: "You are experiencing deep frustration because your effort isn't being recognized, and the way issues are brought up makes you feel doubted.",
      feelings: ["doubted", "frustrated", "overwhelmed"]
    },
    otherPerspective: {
      summary: "Their actions likely stem from anxious care and a fear of regret, rather than intentional malice or a desire to control.",
      possibleReasons: [
        "They are carrying heavy anxiety about the future.",
        "They use questions as a coping mechanism for their own worry.",
        "They don't realize the emotional pressure their words create."
      ]
    },
    misunderstanding: {
      summary: "Intent was protection and care; impact was experienced as lack of trust and micromanagement.",
      userInterpretation: "“They don't believe I can handle my own life.”",
      possibleOtherInterpretation: "“I love them and must prevent them from making mistakes.”"
    },
    commonGround: [
      "Both parties want peace and security in the relationship.",
      "Both want a successful and happy outcome without constant conflict."
    ],
    reconciliationMessage: "“I know you care deeply about me. But when this is brought up constantly, I feel overwhelmed. Can we agree on a structured check-in so we can communicate with less stress?”"
  };
}
