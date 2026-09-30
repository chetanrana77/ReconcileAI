import {
  ConflictInput,
  ReconcileResponse,
  ChatMessage,
  ParticipantRole,
  ExtractedInsight,
  MediationBridge,
  RelationshipType,
  SupportedLanguage
} from '@/lib/types';
import {
  MEDIATOR_SYSTEM_PROMPT,
  buildConversationPrompt,
  buildBridgePrompt,
  SYSTEM_PROMPT,
  buildUserPrompt
} from '@/lib/ai/prompts';
import { detectLanguage } from '@/lib/i18n/translations';

export interface MediatorTurnResult {
  reply: string;
  quickReplies: string[];
  extractedInsight: ExtractedInsight;
  aiProvider?: 'gemini' | 'claude' | 'openai' | 'local';
}

interface GeminiCallResult {
  ok: boolean;
  data?: any;
  modelUsed?: string;
  error?: string;
  reason?: 'missing_key' | 'invalid_key' | 'not_found' | 'rate_limited' | 'empty_response' | 'network_error';
}

/**
 * Server-side helper to call Google Gemini API with gemini-3.8-flash
 * Strictly reads process.env.GEMINI_API_KEY. Never exposes key to client.
 */
async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  config?: { temperature?: number; maxOutputTokens?: number }
): Promise<GeminiCallResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, reason: 'missing_key', error: 'GEMINI_API_KEY is not configured in server environment' };
  }

  // Real confirmed Google Generative Language models available for key
  const candidateModels = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: userPrompt }]
              }
            ],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: config?.temperature ?? 0.7,
              maxOutputTokens: config?.maxOutputTokens ?? 320
            }
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json().catch(() => null);
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
          continue;
        }
        const clean = rawText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(clean);
        return { ok: true, data: parsed, modelUsed: model };
      }

      // Handle non-200 responses
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `HTTP ${res.status}`;

      if (res.status === 404) {
        continue;
      }

      if (res.status === 503 || res.status === 429 || res.status === 500) {
        console.warn(`[Gemini API] Temporary server demand on "${model}" (${res.status}). Trying next active model immediately...`);
        continue;
      }

      if (res.status === 400 || res.status === 403) {
        console.warn(`[Gemini API] Auth error (${res.status}): ${errMsg}`);
        return { ok: false, reason: 'invalid_key', error: errMsg };
      }

      continue;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`[Gemini API] Timeout (6.5s) calling "${model}". Trying next model...`);
        continue;
      }
      console.warn(`[Gemini API] Exception calling "${model}":`, err?.message || err);
      continue;
    }
  }

  return { ok: false, reason: 'not_found', error: 'No compatible Gemini model answered' };
}

interface OpenAICallResult {
  ok: boolean;
  data?: any;
  modelUsed?: string;
  error?: string;
  reason?: 'missing_key' | 'invalid_key' | 'rate_limited' | 'network_error';
}

/**
 * Server-side helper to call OpenAI ChatGPT API (gpt-4o-mini / gpt-4o).
 * Strictly reads process.env.OPENAI_API_KEY, process.env.CHATGPT_API_KEY, or process.env.OPENAI_KEY.
 * Never exposes key to client.
 */
async function callOpenAI(
  systemInstruction: string,
  userPrompt: string,
  config?: { temperature?: number; maxTokens?: number }
): Promise<OpenAICallResult> {
  const apiKey = (
    process.env.OPENAI_API_KEY ||
    process.env.CHATGPT_API_KEY ||
    process.env.OPENAI_KEY
  )?.trim();

  if (!apiKey) {
    return { ok: false, reason: 'missing_key', error: 'OpenAI API key not configured in server environment' };
  }

  const candidateModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'];

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: config?.temperature ?? 0.7,
          max_tokens: config?.maxTokens ?? 1000
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json().catch(() => null);
        const rawContent = json?.choices?.[0]?.message?.content;
        if (!rawContent || typeof rawContent !== 'string' || rawContent.trim().length === 0) {
          continue;
        }
        const clean = rawContent.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(clean);
        return { ok: true, data: parsed, modelUsed: model };
      }

      if (res.status === 404 || res.status === 429 || res.status === 500 || res.status === 503) {
        console.warn(`[OpenAI API] ${model} returned HTTP ${res.status}. Trying next candidate/provider...`);
        continue;
      }

      const errJson = await res.json().catch(() => ({}));
      return { ok: false, error: errJson?.error?.message || `HTTP ${res.status}` };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`[OpenAI API] Timeout calling ${model}. Trying next...`);
        continue;
      }
      console.warn(`[OpenAI API] Exception calling ${model}:`, err?.message || err);
      continue;
    }
  }

  return { ok: false, error: 'All OpenAI models unavailable or timed out' };
}

export async function generateMediatorReply(params: {
  relationship: RelationshipType;
  topic?: string;
  role: ParticipantRole;
  participantLabel: string;
  history: ChatMessage[];
  counterpartInsight?: ExtractedInsight;
  language?: SupportedLanguage;
}): Promise<MediatorTurnResult> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = (
    process.env.OPENAI_API_KEY ||
    process.env.CHATGPT_API_KEY ||
    process.env.OPENAI_KEY
  )?.trim();
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();

  const userPrompt = buildConversationPrompt(params);

  // 1. Google Gemini API (with automatic fallback to ChatGPT if unavailable)
  if (geminiKey) {
    try {
      const geminiResult = await callGemini(MEDIATOR_SYSTEM_PROMPT, userPrompt, {
        temperature: 0.7,
        maxOutputTokens: 650
      });

      if (geminiResult.ok && geminiResult.data) {
        const parsed = geminiResult.data;
        if (parsed.reply && parsed.extractedInsight) {
          return {
            reply: parsed.reply,
            quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : [],
            extractedInsight: parsed.extractedInsight,
            aiProvider: 'gemini'
          };
        }
      }
      console.warn('[Mediator] Gemini call was not successful. Automatically failing over to ChatGPT (OpenAI)...');
    } catch (err) {
      console.warn('[Mediator] Gemini call error. Automatically failing over to ChatGPT (OpenAI):', err);
    }
  }

  // 2. OpenAI ChatGPT API (automatic failover if Gemini is down or primary if configured)
  if (openAiKey) {
    try {
      const openAiResult = await callOpenAI(MEDIATOR_SYSTEM_PROMPT, userPrompt, {
        temperature: 0.7,
        maxTokens: 1000
      });

      if (openAiResult.ok && openAiResult.data) {
        const parsed = openAiResult.data;
        if (parsed.reply && parsed.extractedInsight) {
          return {
            reply: parsed.reply,
            quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : [],
            extractedInsight: parsed.extractedInsight,
            aiProvider: 'openai'
          };
        }
      }
      console.warn('[Mediator] ChatGPT API was not successful. Falling over to next active provider...');
    } catch (err) {
      console.warn('[Mediator] ChatGPT API error:', err);
    }
  }

  // 3. Anthropic Claude API if configured
  if (anthropicKey) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1000,
          system: MEDIATOR_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt + '\n\nIMPORTANT: Output strict JSON only matching: {"reply":"...","quickReplies":["..."],"extractedInsight":{"intent":"...","emotions":["..."],"underlyingNeed":"...","readyToInvite":false}}' }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text;
        if (text) {
          const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsed = JSON.parse(cleanText);
          if (parsed.reply && parsed.extractedInsight) {
            return {
              reply: parsed.reply,
              quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : [],
              extractedInsight: parsed.extractedInsight,
              aiProvider: 'claude'
            };
          }
        }
      }
    } catch (err) {
      console.warn('Anthropic live call error, trying fallback:', err);
    }
  }

  // 3. Deep Adaptive Context-Aware Multilingual Conversational Engine (English, Hindi, Marathi)
  const isRoleA = params.role === 'a';
  const userMessages = params.history.filter((m) => m.sender === 'user');
  const historyLen = userMessages.length;
  const lastUserMsg = (userMessages.slice(-1)[0]?.text || '').trim().toLowerCase();
  const allUserText = userMessages.map((m) => m.text.toLowerCase()).join(' ');
  const rel = params.relationship || 'parent';
  const isParentRel = rel === 'parent';
  const isFriendRel = rel === 'friend';
  const isSiblingRel = rel === 'sibling';
  const isPartnerRel = rel === 'partner';

  // Determine active language
  let lang: SupportedLanguage = params.language || 'en';
  const detected = detectLanguage(lastUserMsg);
  if (detected !== 'en' && !params.language) {
    lang = detected;
  }

  // 1. Semantic & Emotional Classifiers
  const isGreeting = /^(hi|hii|hiii|hello|helo|hey|heyy|hey there|good morning|good evening|yo|namaste|namaskar|help|नमस्ते|नमस्कार|हॅलो|हाय|प्रणाम|सलाम)$/i.test(lastUserMsg);
  const isPleasantry = /(kaise ho|kese ho|how are you|how r u|kasa ahes|kashi ahes|kase ahat|aur batao|kya haal|kya chal raha|thik ho|theek ho)/i.test(lastUserMsg);
  const isIntentToShare = /(something to share|kuch batana hai|kuch share karna|ek baat kehni|kahi sangaycha|kahi bolaycha|share something|want to talk|kuch baat karni|kuch kahna hai|baat karni hai)/i.test(lastUserMsg);

  // Emotional distress / feeling low / stressed (e.g. "are yrr presaan hu", "bahut pareshan hu", "tension ho rahi hai")
  const isGeneralDistress = /(presaan|pareshan|pareshaan|paresan|tension|tanaav|udas|udaas|chinta|traas|tras|stressed|stress|anxious|troubled|upset|exhausted|sad|depressed|thak gaya|bura lag raha|kuch samajh nahi|dard|takleef|help me|radayla|ghutan|ro raha|heavy)/i.test(lastUserMsg);

  // Specific themes
  const isAcademic = /(study|studies|exam|exams|marks|grade|school|college|test|career|padhai|pariksha|percentage|coaching|abhyas|dakhla|paper|future)/i.test(allUserText);
  const isConflict = /(argument|fight|arguing|shouted|shouting|screamed|yelled|ladai|jhagda|bhas|behass|chilaye|bhandan|vad|tanta|ladte|chilla)/i.test(allUserText);
  const isIgnored = /(ignore|ignored|silent|silence|reply|replied|texted|blocked|ghosted|call|calling|whatsapp|jawab nahi|bolat nahi|uttar nahi|chuppi|katti|seen pe)/i.test(allUserText);
  const isTrustControl = /(trust|faith|doubt|suspicious|control|micromanage|surveillance|check|phone|bharosa|viswas|shak|azadi|freedom|space|nazar|rok tok|rok-tok|moklik)/i.test(allUserText);
  const isDirectTalkIntent = /(tumse baat|tum se baat|kisi aur se baat|kisi aur se nahi|samajh rahe ho|you sure|are you sure|talk to you|listen to me|sirf tum|just want to talk|abhibhi baat|mere sath baat)/i.test(lastUserMsg);
  const isReadyIntent = /(invitation|invite|message|bhejo|sandesh|tayyar|ready|nimantran|निमंत्रण|bridge|khatam|solution|aage kya)/i.test(lastUserMsg);

  // Person B-specific intent classifiers (direct queries, zero assumptions)
  const isAskingWhyInvited = /(why.*(invited|invite|here)|why she invited|why he invited|why did they|why am i here|what is this|what is reconcile|kya hai ye|mujhe kyu|kyu bulaya|kyun bulaya|ka bolavle|kashasathi|who invited|why was i|why am i)/i.test(lastUserMsg);
  const isAskingWhatCounterpartSaid = /(what did (she|he|they) say|what happened|kya bola|kya kaha|kay bolali|kay mhantat|what is the complaint|what did i do|meri kya galti|usne kya bola|usne kya kaha)/i.test(lastUserMsg);
  const isBusySchedule = /(busy|work|job|shift|schedule|office|project|time nahi|samay nahi|vyast|kaam tha|fursat nahi|kamachi gardi|responsibilit)/i.test(lastUserMsg);
  const isDefensiveOrBlamed = /(blame|fault|my fault|accuse|unfair|not my fault|galti|doshi|ilzam|chidh|annoyed|meri kya galti|dosharop|aarop|attack)/i.test(lastUserMsg);

  // Substantive messages filter: messages that describe a situation beyond greetings and pleasantries
  const substantiveUserMsgs = userMessages.filter((m) => {
    const t = m.text.trim().toLowerCase();
    const g = /^(hi|hii|hiii|hello|helo|hey|heyy|hey there|good morning|good evening|yo|namaste|namaskar|help|नमस्ते|नमस्कार|हॅलो|हाय|प्रणाम|सलाम)$/i.test(t);
    const p = /(kaise ho|kese ho|how are you|how r u|kasa ahes|kashi ahes|kase ahat|aur batao|kya haal|thik ho)/i.test(t);
    const s = /(something to share|kuch batana hai|kuch share karna|ek baat kehni|kahi sangaycha|kahi bolaycha|share something|want to talk|kuch baat karni)/i.test(t);
    return !g && !p && !s && t.length > 5;
  });
  const substantiveCount = substantiveUserMsgs.length;

  if (isRoleA) {
    // ========================================================
    // PERSON A (INITIATOR / SEEKING MEDIATION OR REFLECTION)
    // ========================================================

    // Case 1A: Pleasantry ("Kaise ho", "How are you", "Kasa ahes")
    if (isPleasantry) {
      if (lang === 'hi') {
        return {
          reply: 'मैं बिल्कुल ठीक हूँ, पूछने के लिए बहुत धन्यवाद! मैं यहीं आपके साथ हूँ और पूरी तरह आपकी बात सुनने के लिए तैयार हूँ। आपके मन में क्या बात चल रही है, थोड़ा बताइए?',
          quickReplies: [
            'घर में किसी बात पर तनाव चल रहा है',
            'मुझे किसी अपने के साथ ग़लतफ़हमी सुलझानी है',
            'मुझे एक बात साझा करनी है',
            'मुझे अपनी बात बिना झगड़े के रखनी है'
          ],
          extractedInsight: {
            intent: 'Exchanging pleasantry before opening up',
            emotions: ['open', 'calm'],
            underlyingNeed: 'A respectful, comfortable listening space',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'मी अगदी मजेत आहे, विचारल्याबद्दल मनापासून धन्यवाद! मी इथे तुमच्या सोबत आहे आणि तुमचं म्हणणं ऐकायला तयार आहे. तुमच्या मनात काय चाललंय, नक्की काय घडलंय?',
          quickReplies: [
            'घरात एखाद्या गोष्टीवरून तणाव सुरू आहे',
            'मला कोणासोबत झालेला गैरसमज सोडवायचा आहे',
            'मला एक गोष्ट सांगायची आहे',
            'भांडण न करता मला माझी बाजू मांडायची आहे'
          ],
          extractedInsight: {
            intent: 'Exchanging pleasantry before opening up',
            emotions: ['open', 'calm'],
            underlyingNeed: 'A respectful, comfortable listening space',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply: "I'm doing well, thank you for asking! I'm right here with you and completely ready to listen. What's been on your mind that you would like to talk through?",
        quickReplies: [
          'There is tension with someone close',
          'I have something I want to talk through',
          'We had a misunderstanding recently',
          'I want to explain my feelings without fighting'
        ],
        extractedInsight: {
          intent: 'Exchanging pleasantry before opening up',
          emotions: ['open', 'calm'],
          underlyingNeed: 'A respectful, comfortable listening space',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Direct Talk with Reconcile (e.g. "Are you sure ki mujhe kisi aur se baat karne ki zaroorat hai? Mujhe tumse baat karni hai abhi.")
    if (isDirectTalkIntent) {
      if (lang === 'hi') {
        return {
          reply: 'मैं बिल्कुल समझ रहा हूँ। आपको अभी किसी और से बात करने की कोई जल्दबाजी नहीं है — मैं पूरा ध्यान देकर सिर्फ आपकी बात सुन रहा हूँ। आप आराम से बताइए, दिल में क्या बात चल रही है और आप कैसा महसूस कर रहे हैं?',
          quickReplies: [
            'मुझे अपनी पढ़ाई को लेकर बहुत दबाव महसूस हो रहा है',
            'वे मेरी मेहनत को कभी नहीं समझते',
            'मुझे बस थोड़ा सुकून और समझ चाहिए',
            'मैं बिना किसी तनाव के बात करना चाहता हूँ'
          ],
          extractedInsight: {
            intent: 'Seeking an empathetic listener before ready for mediation',
            emotions: ['overwhelmed', 'needing presence', 'cautious'],
            underlyingNeed: 'To be heard with undivided attention and zero rush',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }
      if (lang === 'mr') {
        return {
          reply: 'मी नक्कीच समजू शकतो. तुम्हाला आता दुसऱ्या कोणाशीही बोलण्याची अजिबात घाई नाही — मी इथे पूर्णपणे तुमचं ऐकण्यासाठीच आहे. शांतपणे सांगा, मनात नक्की काय चाललंय आणि कशाचा जास्त त्रास होतोय?',
          quickReplies: [
            'मला अभ्यासाचा खूप जास्त तणाव आहे',
            'त्यांना माझे प्रयत्न दिसतच नाहीत',
            'मला फक्त थोडी मोकळीक हवी आहे',
            'शांतपणे माझी बाजू कोणीतरी ऐकून घ्यावी'
          ],
          extractedInsight: {
            intent: 'Seeking an empathetic listener before ready for mediation',
            emotions: ['overwhelmed', 'needing presence', 'cautious'],
            underlyingNeed: 'To be heard with undivided attention and zero rush',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }
      return {
        reply: "I completely understand. There is no rush at all to talk to anyone else — I am right here with you, listening with an open mind. Take all the time you need and tell me what is going on.",
        quickReplies: [
          'I feel so much pressure on my shoulders',
          'They never see how hard I try',
          'I just need someone to hear me out',
          'I want space to breathe without being judged'
        ],
        extractedInsight: {
          intent: 'Seeking an empathetic listener before ready for mediation',
          emotions: ['overwhelmed', 'needing presence', 'cautious'],
          underlyingNeed: 'To be heard with undivided attention and zero rush',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Case 1B: Explicit Intent to Share ("I have something to share", "kuch batana hai")
    if (isIntentToShare) {
      if (lang === 'hi') {
        return {
          reply: 'बिल्कुल, पूरा समय लीजिए — मैं बड़े ध्यान से और बिना किसी पूर्वाग्रह के आपकी बात सुन रहा हूँ। कोई जल्दी नहीं है और यह बात पूरी तरह निजी रहेगी। जब भी आप सहज महसूस करें, बताइए क्या बात हुई?',
          quickReplies: [
            'हाल ही में हमारे बीच बहुत तीखी बहस हो गई थी',
            'वे मेरी बात को समझने की कोशिश ही नहीं करते',
            'मुझे लग रहा है कि मुझे पूरी तरह गलत समझा जा रहा है',
            'मैं बिना झगड़ा किए अपनी बात रखना चाहता हूँ'
          ],
          extractedInsight: {
            intent: 'Preparing to open up in a safe container',
            emotions: ['open', 'cautious'],
            underlyingNeed: 'A non-judgmental space to share without rush',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'नक्कीच, अजिबात घाई करू नका — मी इथे पूर्ण लक्ष देऊन तुमचं ऐकण्यासाठी बसलोय. हे बोलणे पूर्णपणे खाजगी आहे. जेव्हा तुम्हाला सोयीचं वाटेल, तेव्हा सांगा नक्की काय घडलंय.',
          quickReplies: [
            'अलीकडेच आमच्यात खूप मोठा वाद झाला होता',
            'माझी बाजू ऐकूनच घेतली जात नाहीये',
            'मला वाटतं मला गैरसमजून घेतलं जातंय',
            'भांडण न करता मला शांतपणे संवाद साधायचा आहे'
          ],
          extractedInsight: {
            intent: 'Preparing to open up in a safe container',
            emotions: ['open', 'cautious'],
            underlyingNeed: 'A non-judgmental space to share without rush',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply: "Take all the time you need — I am right here, listening with an open mind and no judgment. There is no rush at all. Whenever you feel ready, tell me what happened.",
        quickReplies: [
          'We had an emotional argument recently',
          'I feel completely misunderstood and overwhelmed',
          'They refuse to see things from my perspective',
          'I want to resolve this without starting another fight'
        ],
        extractedInsight: {
          intent: 'Preparing to open up in a safe container',
          emotions: ['open', 'cautious'],
          underlyingNeed: 'A non-judgmental space to share without rush',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Case 1C: Pure Greeting ("Hii", "Hello", "Namaste")
    if (isGreeting || (lastUserMsg.length <= 4 && !isGeneralDistress)) {
      if (lang === 'hi') {
        const qr = isSiblingRel
          ? ['मेरे भाई/बहन मेरी चीज़ें बिना पूछे ले लेते हैं', 'वे मेरी सीमाओं और प्राइवेसी की कद्र नहीं करते', 'छोटी-छोटी बातों पर हमारे बीच बहुत तीखी बहस हो जाती है', 'हमेशा मुझसे ही समझौते की उम्मीद की जाती है']
          : isPartnerRel
          ? ['मुझे लगता है मेरा पार्टनर मेरी बात ध्यान से नहीं सुनता', 'एक ही बात पर बार-बार वही पुरानी बहस शुरू हो जाती है', 'तनाव होते ही बातचीत पूरी तरह बंद हो जाती है', 'मैं बिना इल्ज़ाम लगाए शांति से अपनी बात कहना चाहता हूँ']
          : isParentRel
          ? ['मम्मी-पापा रोज़ मेरी पढ़ाई को लेकर सवाल पूछते हैं', 'मुझे लगता है उन्हें मुझ पर ज़रा भी भरोसा नहीं है', 'कल हमारी बहुत बहस हो गई थी', 'मुझे थोड़ा सुकून और आज़ादी चाहिए']
          : isFriendRel
          ? ['मेरे दोस्त ने अचानक बात करना बंद कर दिया', 'हम दोनों के बीच ग़लतफ़हमी हो गई है', 'मुझे लग रहा है कि वह मुझे नज़रअंदाज़ कर रहा है', 'समझ नहीं आ रहा उससे कैसे बात करूँ']
          : ['एक पेचीदा स्थिति है जिसे सुलझाना चाहता हूँ', 'हाल ही में हमारे बीच बहुत बहस हो गई थी', 'मुझे लगता है कि मुझे गलत समझा जा रहा है', 'मैं बिना झगड़ा किए अपनी बात रखना चाहता हूँ'];

        return {
          reply: 'नमस्ते। एक गहरी साँस लीजिए — मैं यहीं आपके साथ हूँ। कोई जल्दी नहीं है और यह बात पूरी तरह निजी रहेगी। ऐसी क्या बात हुई है जिसे आप आज साझा करना चाहते हैं?',
          quickReplies: qr,
          extractedInsight: {
            intent: 'Opening up in a safe container',
            emotions: ['cautious', 'open'],
            underlyingNeed: 'A private place to be heard without judgment',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        const qr = isSiblingRel
          ? ['माझा भाऊ/बहीण विचारल्याशिवाय माझ्या वस्तू वापरतात', 'ते माझ्या खाजगी जागेचा आणि मर्यादांचा आदर करत नाहीत', 'छोट्या गोष्टींवरून रोज आमच्यात मोठे वाद होतात', 'नेहमी मीच माघार घ्यावी अशी त्यांची अपेक्षा असते']
          : isPartnerRel
          ? ['मला वाटतं माझा जोडीदार माझं बोलणं नीट समजून घेत नाही', 'एकाच मुद्द्यावरून पुन्हा पुन्हा तेच जुने वाद होतात', 'वाद सुरू होताच आमच्यातील संवाद पूर्णपणे थांबतो', 'आरोप न करता शांतपणे संवाद व्हावा हीच माझी इच्छा आहे']
          : isParentRel
          ? ['आई-बाबा रोज माझ्या अभ्यासाबद्दल विचारत राहतात', 'मला वाटतं त्यांचा माझ्या क्षमतेवर अजिबात विश्वास नाही', 'काल आमच्यात खूप मोठा वाद झाला', 'मला स्वतःसाठी थोडी मोकळीक हवी आहे']
          : isFriendRel
          ? ['माझ्या मित्राने दोन दिवसांपासून उत्तर दिलेले नाही', 'आमच्यात गैरसमज झाला आहे', 'मला वाटतं तो मला टाळत आहे', 'त्याच्याशी पुन्हा कसं बोलायचं हे समजत नाही']
          : ['एक गुंतागुंतीचा विषय आहे जो मला सोडवायचा आहे', 'अलीकडेच आमच्यात मोठा वाद झाला होता', 'मला वाटतं मला गैरसमजून घेतलं जातंय', 'भांडण न करता मला माझी बाजू मांडायची आहे'];

        return {
          reply: 'नमस्कार। एक दीर्घ श्वास घ्या — मी अगदी तुमच्या सोबत आहे. कोणतीही घाई नाही आणि हे बोलणे पूर्णपणे खाजगी राहील. अशी कोणती गोष्ट घडली आहे ज्यावर तुम्हाला शांतपणे बोलायचे आहे?',
          quickReplies: qr,
          extractedInsight: {
            intent: 'Opening up in a safe container',
            emotions: ['cautious', 'open'],
            underlyingNeed: 'A private place to be heard without judgment',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      const qr = isSiblingRel
        ? ["My sibling keeps using my things without asking", "They do not respect my personal space or boundaries", "We keep having loud arguments over little things", "It feels like I am always expected to compromise"]
        : isPartnerRel
        ? ["I feel like my partner does not really hear me", "The same argument keeps repeating over and over", "One of us shuts down whenever tension starts", "I want to explain my feelings without starting a fight"]
        : isParentRel
        ? ["Mom keeps asking about my exams every day", "It feels like they have zero faith in me", "We had a huge argument yesterday", "I am stressed and need breathing room"]
        : isFriendRel
        ? ["My friend stopped replying to me", "We had an emotional argument", "I feel completely ignored and hurt", "Things have become really awkward"]
        : ["There is a complicated situation I need help with", "We had an emotional argument recently", "I feel misunderstood and do not know how to bring it up", "I want to explain my side without starting a fight"];

      return {
        reply: "Hello. Take a breath — I am right here with you. There is no hurry and nobody else sees this. What has been going on that you would like to talk through?",
        quickReplies: qr,
        extractedInsight: {
          intent: 'Opening up in a safe container',
          emotions: ['cautious', 'open'],
          underlyingNeed: 'A private place to be heard without judgment',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Case 2: User expresses emotional distress without specific topic (e.g. "are yrr presaan hu", "bahut tension hai")
    if (isGeneralDistress && !isAcademic && !isConflict && !isIgnored && historyLen <= 2) {
      if (lang === 'hi') {
        return {
          reply: 'मैं समझ सकता हूँ। जब मन परेशान होता है तो सब कुछ बहुत भारी और उलझा हुआ लगने लगता है। गहरी साँस लीजिए — आप बिल्कुल सुरक्षित जगह पर हैं, यहाँ कोई आपको जज नहीं करेगा। Exactly क्या बात आपको परेशान कर रही है? किस वजह से आप इतना तनाव महसूस कर रहे हैं, थोड़ा खुलकर बताइए?',
          quickReplies: [
            'घर में परिवार के साथ किसी बात पर बहुत तनाव चल रहा है',
            'किसी अपने के साथ ग़लतफ़हमी या झगड़ा हो गया है',
            'बहुत सारी चिंताएँ एक साथ सिर पर आ गई हैं और कोई समझ नहीं रहा',
            'मुझे समझ नहीं आ रहा कि उनसे बिना लड़े अपनी बात कैसे कहूँ'
          ],
          extractedInsight: {
            intent: 'Expressing acute emotional distress and seeking understanding',
            emotions: ['overwhelmed', 'distressed', 'seeking clarity'],
            underlyingNeed: 'A safe space to untangle emotions without judgment',
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'मी समजू शकतो. जेव्हा मन अस्वस्थ किंवा तणावात असतं, तेव्हा सगळंच खूप जड आणि त्रासदायक वाटायला लागतं. दीर्घ श्वास घ्या — येथे तुमचं बोलणं पूर्णपणे सुरक्षित आहे. नक्की काय घडलंय? कोणत्या गोष्टीमुळे तुम्हाला एवढा त्रास किंवा काळजी वाटतेय? थोडे मोकळेपणाने सांगा, मी ऐकत आहे.',
          quickReplies: [
            'घरात एखाद्या गोष्टीवरून खूप वाद किंवा तणाव आहे',
            'जवळच्या व्यक्तीसोबत गैरसमज किंवा भांडण झाले आहे',
            'माझी बाजू कशी मांडायची हेच समजत नाहीये',
            'डोक्यात खूप वेगवेगळ्या चिंता एकदम सुरू आहेत'
          ],
          extractedInsight: {
            intent: 'Expressing acute emotional distress and seeking understanding',
            emotions: ['overwhelmed', 'distressed', 'seeking clarity'],
            underlyingNeed: 'A safe space to untangle emotions without judgment',
            readyToInvite: false
          }
        };
      }

      return {
        reply: "I hear you, and I can tell you are carrying a lot of stress right now. Take a deep breath — you are in a completely safe, private space here. What is the main thing causing you so much distress right now? Tell me what happened.",
        quickReplies: [
          'There is heavy tension at home with family',
          'Had an argument or falling out with someone close',
          'Everything is piling up and nobody is listening to me',
          'I do not know how to explain what I feel without fighting'
        ],
        extractedInsight: {
          intent: 'Expressing acute emotional distress and seeking understanding',
          emotions: ['overwhelmed', 'distressed', 'seeking clarity'],
          underlyingNeed: 'A safe space to untangle emotions without judgment',
          readyToInvite: false
        }
      };
    }

    // Case 2B: User has not shared substantive details yet
    if (substantiveCount === 0) {
      if (lang === 'hi') {
        return {
          reply: 'मैं बड़े ध्यान से सुन रहा हूँ। क्या आप थोड़ा और बता सकते हैं कि यह बात किसके बारे में है और आप दोनों के बीच असल में क्या हुआ था?',
          quickReplies: [
            'घर में परिवार के साथ किसी बात पर तनाव है',
            'मेरे दोस्त या पार्टनर के साथ ग़लतफ़हमी हो गई है',
            'छोटी सी बात पर बहुत बड़ी बहस हो गई थी',
            'मुझे अपनी बात बिना झगड़े के रखनी है'
          ],
          extractedInsight: {
            intent: 'Inviting user to share substantive context',
            emotions: ['open', 'reflective'],
            underlyingNeed: 'A patient space to unpack what happened',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'मी अगदी लक्षपूर्वक ऐकतोय. हे नेमके कोणाबद्दल आहे आणि तुम्हा दोघांमध्ये नक्की काय घडले, याबद्दल थोडे सांगू शकाल का?',
          quickReplies: [
            'घरात एखाद्या गोष्टीवरून वाद झाला आहे',
            'जवळच्या व्यक्तीसोबत गैरसमज झाला आहे',
            'एका छोट्या विषयावरून खूप मोठे भांडण झाले',
            'भांडण न करता मला माझी बाजू मांडायची आहे'
          ],
          extractedInsight: {
            intent: 'Inviting user to share substantive context',
            emotions: ['open', 'reflective'],
            underlyingNeed: 'A patient space to unpack what happened',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply: "I am right here listening closely. Could you tell me a little more about who this involves and what specifically happened between you two?",
        quickReplies: [
          'There is heavy tension at home with family',
          'Had a misunderstanding with someone close',
          'A minor argument escalated out of hand',
          'I want to explain my side without fighting'
        ],
        extractedInsight: {
          intent: 'Inviting user to share substantive context',
          emotions: ['open', 'reflective'],
          underlyingNeed: 'A patient space to unpack what happened',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Turn 1 Substantive: Initial Problem Explanation
    if (substantiveCount === 1) {
      // 3A. Academic / Studies pressure
      if (isAcademic) {
        if (lang === 'hi') {
          return {
            reply: 'रोज़-रोज़ पढ़ाई और परीक्षाओं को लेकर लगातार सवाल पूछे जाना वाकई बहुत थका देने वाला होता है। जब हर बात पढ़ाई पर आ जाती है, तो वह फिक्र से ज़्यादा निगरानी और अविश्वास जैसा लगने लगता है। हाल ही में उन्होंने ऐसा क्या कहा जिससे आपको सबसे ज़्यादा ठेस पहुँची?',
            quickReplies: [
              'उन्होंने पूछा कि क्या मैं वाकई पढ़ाई कर भी रहा हूँ',
              'उन्हें लगता है मेरी ज़िंदगी की कोई योजना ही नहीं है',
              'वे मेरी तुलना दूसरों से करने लगते हैं',
              'वे हर बात पर शक करते हैं'
            ],
            extractedInsight: {
              intent: 'Explaining how daily questioning feels like surveillance',
              emotions: ['pressured', 'scrutinized', 'suffocated'],
              underlyingNeed: 'Autonomy, space, and recognition of their effort',
              readyToInvite: false
            }
          };
        }

        if (lang === 'mr') {
          return {
            reply: 'रोज सकाळी उठल्या उठल्या अभ्यासाची चौकशी होणं खरंच खूप त्रासदायक आणि मानसिक तणावाचं ठरू शकतं. ते प्रेमापेक्षा सतत पाळत ठेवल्यासारखं वाटतं. अलीकडे असं काय बोलणं झालं ज्याचा तुम्हाला सर्वात जास्त त्रास झाला?',
            quickReplies: [
              'ती म्हणाली की तू खरंच अभ्यास करतोस का?',
              'तिला वाटतं मला माझ्या भविष्याची काहीच काळजी नाही',
              'ती सतत इतरांशी माझी तुलना करत राहते',
              'तिला माझ्यावर अजिबात विश्वास नाही'
            ],
            extractedInsight: {
              intent: 'Explaining how daily questioning feels like surveillance',
              emotions: ['pressured', 'scrutinized', 'suffocated'],
              underlyingNeed: 'Autonomy, space, and recognition of their effort',
              readyToInvite: false
            }
          };
        }

        return {
          reply: 'That sounds exhausting to live with every day. When questions about exams and preparation start first thing in the morning, it does not feel like caring — it feels like being under constant surveillance. What did they say recently that bothered you the most?',
          quickReplies: [
            'They asked if I am even studying',
            'They act like I have no plan for my life',
            'They compare me to other people',
            'They constantly doubt my effort'
          ],
          extractedInsight: {
            intent: 'Explaining how daily questioning feels like surveillance',
            emotions: ['pressured', 'scrutinized', 'suffocated'],
            underlyingNeed: 'Autonomy, space, and recognition of their effort',
            readyToInvite: false
          }
        };
      }

      // 3B. Ignored / Silence / Ghosting
      if (isIgnored) {
        if (lang === 'hi') {
          return {
            reply: 'जब कोई करीबी अचानक बात करना बंद कर दे या आपके संदेशों का जवाब न दे, तो वह चुप्पी बहुत चुभती है। ऐसा लगता है जैसे हमारी कोई कद्र ही नहीं रही। यह बात कितने समय से चल रही है, और पिछली बार क्या बातचीत हुई थी?',
            quickReplies: [
              'दो-तीन दिन से कोई जवाब नहीं आया है',
              'एक छोटी सी बात के बाद उन्होंने बात बंद कर दी',
              'मुझे लग रहा है कि दोस्ती सिर्फ मेरी तरफ से है',
              'वे ऑनलाइन हैं पर मुझे जानबूझकर इग्नोर कर रहे हैं'
            ],
            extractedInsight: {
              intent: 'Describing emotional pain of silent treatment',
              emotions: ['ignored', 'hurt', 'anxious'],
              underlyingNeed: 'Communication clarity and reassurance of care',
              readyToInvite: false
            }
          };
        }

        if (lang === 'mr') {
          return {
            reply: 'जेव्हा एखादी जवळची व्यक्ती अचानक मेसेजचे उत्तर देणे थांबवते किंवा दुर्लक्ष करते, तेव्हा ती शांतता मनाला खूप टोचते. हे कधीपासून सुरू आहे, आणि शेवटचं तुमच्यात काय बोलणं झालं होतं?',
            quickReplies: [
              'दोन-तीन दिवसांपासून काहीच उत्तर आलेले नाही',
              'एका छोट्या वादानंतर त्यांनी बोलणे बंद केले',
              'मला वाटतं मैत्री फक्त माझ्याच बाजूने आहे',
              'ते ऑनलाइन आहेत पण मला टाळत आहेत'
            ],
            extractedInsight: {
              intent: 'Describing emotional pain of silent treatment',
              emotions: ['ignored', 'hurt', 'anxious'],
              underlyingNeed: 'Communication clarity and reassurance of care',
              readyToInvite: false
            }
          };
        }

        return {
          reply: 'Being met with cold silence is painful — your mind naturally rushes to the worst conclusions. How long have they been silent, and what happened right before the communication stopped?',
          quickReplies: [
            'It has been two days with no reply',
            'They stopped talking right after a minor disagreement',
            'It feels like they do not care about our connection',
            'They are online but ignoring my messages'
          ],
          extractedInsight: {
            intent: 'Describing emotional pain of silent treatment',
            emotions: ['ignored', 'hurt', 'anxious'],
            underlyingNeed: 'Communication clarity and reassurance of care',
            readyToInvite: false
          }
        };
      }

      // 3C. Conflict / Argument / Shouting
      if (isConflict) {
        if (lang === 'hi') {
          return {
            reply: 'तीखी बहस या लड़ाई के बाद मन बहुत भारी हो जाता है और अंदर तक बेचैनी भर जाती है। गुस्से में अक्सर ऐसी बातें निकल जाती हैं जो इंसान वाकई में नहीं कहना चाहता। यह बहस किस बात पर शुरू हुई थी, और क्या ऐसा कुछ कहा गया जो आपको बहुत चुभ गया?',
            quickReplies: [
              'पुरानी बातें खींचकर मुझ पर इल्ज़ाम लगाए गए',
              'मेरी बात को पूरा सुने बिना चिल्लाना शुरू कर दिया',
              'मुझसे अपनी सीमाएं नहीं संभलीं और मैंने भी गुस्से में बोल दिया',
              'मुझे बहुत अकेला और गलत समझा गया महसूस हुआ'
            ],
            extractedInsight: {
              intent: 'Processing heated emotional clash',
              emotions: ['angry', 'shaken', 'misunderstood'],
              underlyingNeed: 'Fair hearing and mutual respect without yelling',
              readyToInvite: false
            }
          };
        }

        if (lang === 'mr') {
          return {
            reply: 'मोठ्या वादानंतर किंवा भांडणानंतर मन खूप अशांत होतं. रागाच्या भरात अनेकदा असे शब्द बाहेर पडतात जे मनापासून म्हणायचे नसतात. हा वाद नेमका कशावरून सुरू झाला होता?',
            quickReplies: [
              'जुने वाद उकरून काढून माझ्यावर आरोप केले',
              'माझं काहीही न ऐकता ओरडणे सुरू केले',
              'रागाच्या भरात माझ्याकडूनही काही चुकीचे शब्द गेले',
              'मला खूप वाईट आणि एकटं वाटलं'
            ],
            extractedInsight: {
              intent: 'Processing heated emotional clash',
              emotions: ['angry', 'shaken', 'misunderstood'],
              underlyingNeed: 'Fair hearing and mutual respect without yelling',
              readyToInvite: false
            }
          };
        }

        return {
          reply: 'Heated arguments leave you feeling completely drained and emotionally raw. When voices get raised, the real feelings get buried under anger. What was the spark that set this argument off?',
          quickReplies: [
            'Old issues were dragged up as accusations',
            'They started shouting without hearing me out',
            'I lost my temper too and said things in frustration',
            'I felt completely cornered and misunderstood'
          ],
          extractedInsight: {
            intent: 'Processing heated emotional clash',
            emotions: ['angry', 'shaken', 'misunderstood'],
            underlyingNeed: 'Fair hearing and mutual respect without yelling',
            readyToInvite: false
          }
        };
      }

      // 3D. General Situation Fallback
      if (lang === 'hi') {
        return {
          reply: 'आपने जो बात साझा की, मैं उसे बहुत ध्यान से सुन रहा हूँ। ऐसी स्थिति में फँसने पर बहुत अकेलापन और गुस्सा आना लाज़मी है। इस पूरी बात में आपके लिए सबसे ज़्यादा तकलीफदेह क्या रहा — उनका रवैया, या यह कि वे आपकी बात को समझ ही नहीं रहे हैं?',
          quickReplies: [
            'उनका रवैया और बात करने का तरीका',
            'यह कि उन्होंने मेरी बात को समझने की कोशिश ही नहीं की',
            'मुझे लगता है कि वे सिर्फ अपनी ही बात सही मानते हैं',
            'मुझे एक शांत और सुरक्षित बातचीत चाहिए'
          ],
          extractedInsight: {
            intent: 'Describing painful interpersonal experience',
            emotions: ['frustrated', 'hurt'],
            underlyingNeed: 'Validation and fair hearing',
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'तुम्ही जे सांगितलं ते मी अगदी लक्षपूर्वक ऐकतोय. अशा परिस्थितीत अस्वस्थ वाटणं अत्यंत स्वाभाविक आहे. या सगळ्यामध्ये तुमच्या मनाला सर्वात जास्त काय बोचलं — त्यांची वागणूक, की त्यांनी तुमची बाजू समजूनच घेतली नाही हे?',
          quickReplies: [
            'त्यांची वागणूक आणि बोलण्याची पद्धत',
            'त्यांनी माझी बाजू समजून घेण्याचा प्रयत्नच केला नाही',
            'त्यांना वाटतं फक्त तेच बरोबर आहेत',
            'मला एक शांत आणि सन्मानपूर्वक संवाद हवा आहे'
          ],
          extractedInsight: {
            intent: 'Describing painful interpersonal experience',
            emotions: ['frustrated', 'hurt'],
            underlyingNeed: 'Validation and fair hearing',
            readyToInvite: false
          }
        };
      }

      return {
        reply: 'Thank you for sharing that with me. That sounds really heavy to hold onto by yourself. Looking at the whole situation, what was the hardest part for you to swallow?',
        quickReplies: [
          'How unfair and dismissive they were',
          'That they did not even listen to my side',
          'Feeling like whatever I do is judged',
          'That they assumed the worst about me'
        ],
        extractedInsight: {
          intent: 'Describing painful interpersonal experience',
          emotions: ['frustrated', 'hurt'],
          underlyingNeed: 'Validation and fair hearing',
          readyToInvite: false
        }
      };
    }

    // Turn 2 Substantive: Going Beneath the Surface (Intention vs Impact, strictly NEUTRAL)
    if (substantiveCount === 2) {
      if (lang === 'hi') {
        return {
          reply: 'यह बहुत गहरी बात है। जब आपकी पूरी मेहनत या भावना को अनदेखा कर दिया जाता है, तो बहुत ठेस पहुँचती है। लेकिन सामने वाले के नज़रिए से देखें तो अक्सर उनका डर, असुरक्षा या फिक्र उन पर हावी हो जाती है। वे इसे सुरक्षा या प्यार मानते हैं, जबकि आपके लिए यह अविश्वास बन जाता है। क्या आपको लगता है कि वे जानबूझकर चोट पहुँचाना चाहते हैं, या उनकी अपनी चिंता उनसे यह करवा रही है?',
          quickReplies: [
            'उनकी अपनी चिंता और डर बहुत ज़्यादा बढ़ गया है',
            'उन्हें सच में लगता है मैं कुछ ठीक नहीं कर पाऊँगा',
            'शायद दोनों बातें हैं — प्यार भी और असुरक्षा भी',
            'वे अपनी पुरानी मुश्किलें मुझ पर थोप रहे हैं'
          ],
          extractedInsight: {
            intent: 'Differentiating between counterpart anxiety and perceived malice',
            emotions: ['doubted', 'longing for independence', 'frustrated'],
            underlyingNeed: 'To be treated with trust and capability',
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'आपण मनापासून प्रयत्न करत असताना समोरच्याला त्याचा अंदाज न येणं हे खूप दुःख देणारं असतं. पण समोरच्या व्यक्तीच्या बाजूने पाहिलं तर अनेकदा त्यांची स्वतःची भीती आणि चिंता त्यांच्यावर हावी झालेली असते. त्यांच्या दृष्टीने ती काळजी असते, पण तुमच्यासाठी तो अविश्वास ठरतो. तुम्हाला काय वाटतं, त्यांना खरोखर त्रास द्यायचा आहे की त्यांची चिंता कारणीभूत आहे?',
          quickReplies: [
            'त्यांची स्वतःची भीती आणि चिंता खूप जास्त आहे',
            'त्यांना खरंच वाटतं की मी काही करू शकत नाही',
            'दोन्ही गोष्टी आहेत — काळजी पण आहे आणि अविश्वासही',
            'ते त्यांचा जुना संघर्ष माझ्यावर लादतायत'
          ],
          extractedInsight: {
            intent: 'Differentiating between counterpart anxiety and perceived malice',
            emotions: ['doubted', 'longing for independence', 'frustrated'],
            underlyingNeed: 'To be treated with trust and capability',
            readyToInvite: false
          }
        };
      }

      return {
        reply: 'I really hear that. When you are putting in effort and someone keeps questioning you, it hurts because it feels like they have zero faith in you. But looking at it from their side, people often get overwhelmed by their own anxiety or fear. To them it feels like protective care; to you it feels like micromanagement and distrust. Do you think their actions come from bad intentions, or is their own fear taking over?',
        quickReplies: [
          'Their own anxiety is out of control',
          'They honestly do not trust my judgment',
          'A mix of care and controlling anxiety',
          'They think only their way is correct'
        ],
        extractedInsight: {
          intent: 'Differentiating between counterpart anxiety and perceived malice',
          emotions: ['doubted', 'longing for independence', 'frustrated'],
          underlyingNeed: 'To be treated with trust and capability',
          readyToInvite: false
        }
      };
    }

    // Turn 3 Substantive: Finding the Concrete Healthy Boundary
    if (substantiveCount === 3 && !isReadyIntent) {
      if (lang === 'hi') {
        return {
          reply: 'यह बहुत परिपक्व समझ है। उनकी मंशा शायद आपके प्रति फिक्र या सुरक्षा की हो, लेकिन उनका कहने का तरीका आपके लिए घुटन और अविश्वास बन जाता है। अगर बिना लड़े एक स्वस्थ सीमा तय करनी हो — जैसे रोज़ टोकने के बजाय हफ़्ते में एक बार आराम से बात करना — तो आप उनसे क्या बदलाव चाहेंगे?',
          quickReplies: [
            'रोज़ टोकने के बजाय हफ़्ते में एक बार आराम से बात करें',
            'मुझ पर थोड़ा भरोसा रखें और मुझे आज़ादी दें',
            'शांत माहौल में बैठकर बात हो, डांट-फटकार में नहीं',
            'मैं खुद अपनी प्रगति और स्थिति साझा करूँगा'
          ],
          extractedInsight: {
            intent: 'Ready to recognize mutual care while holding a healthy boundary',
            emotions: ['caring', 'clear-headed', 'ready for change'],
            underlyingNeed: 'A structured, calm way to communicate that preserves autonomy',
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'ही खूप परिपक्व समज आहे. त्यांच्या मनात काळजी असू शकते, पण बोलण्याच्या पद्धतीमुळे तुम्हाला घुसमट जाणवते. जर वाद न घालता एक योग्य तोडगा काढायचा असेल — जसे की रोज विचारण्याऐवजी आठवड्यातून एकदा शांतपणे चर्चा करणे — तर तुम्हाला त्यांच्याकडून काय अपेक्षा आहे?',
          quickReplies: [
            'रोज विचारण्याऐवजी आठवड्यातून एकदा शांतपणे चर्चा करावी',
            'माझ्यावर विश्वास ठेवून मला थोडी मोकळीक द्यावी',
            'भीतीने न बोलता शांतपणे संवाद साधावा',
            'मी स्वतःहून माझी परिस्थिती सांगेन'
          ],
          extractedInsight: {
            intent: 'Ready to recognize mutual care while holding a healthy boundary',
            emotions: ['caring', 'clear-headed', 'ready for change'],
            underlyingNeed: 'A structured, calm way to communicate that preserves autonomy',
            readyToInvite: false
          }
        };
      }

      return {
        reply: 'That is so honest and clear. You do not want to fight or shut them out — you just want breathing room and to know that they believe in you. If you could agree on a healthy boundary without an argument — like a scheduled calm check-in instead of daily interrogation — what would that look like?',
        quickReplies: [
          'Check in once a week calmly instead of daily grilling',
          'Give me space to handle things on my own',
          'Talk with calm respect instead of tension',
          'Trust me to bring up issues when I need help'
        ],
        extractedInsight: {
          intent: 'Ready to recognize mutual care while holding a healthy boundary',
          emotions: ['caring', 'clear-headed', 'ready for change'],
          underlyingNeed: 'A structured, calm way to communicate that preserves autonomy',
          readyToInvite: false
        }
      };
    }

    // Turn 4+ Substantive (or explicit ready intent): Preparing the Neutral Invitation
    // Turn 4+ Substantive: Continuing open dialogue unless user explicitly requests invitation
    if (!isReadyIntent) {
      if (lang === 'hi') {
        return {
          reply: 'मैं आपकी बात बहुत गहराई से समझ रहा हूँ। जब मन में इतनी सारी बातें चल रही हों, तो उन्हें खुलकर कह देना ही सबसे अच्छा होता है। कोई जल्दी नहीं है, आप बिल्कुल तनावमुक्त होकर बताइए — और क्या बात है जो आपको परेशान कर रही है?',
          quickReplies: [
            'वे हर बात पर शक करते हैं और टोकते रहते हैं',
            'मुझे लगता है कि मेरी मेहनत को कोई नहीं समझता',
            'मैं बस शांति से रहना चाहता हूँ',
            'हाँ, अब मैं निमंत्रण तैयार करने के लिए तैयार हूँ'
          ],
          extractedInsight: {
            intent: 'Continuing to unpack complex interpersonal feelings in a safe space',
            emotions: ['reflective', 'unburdening', 'seeking calm'],
            underlyingNeed: 'Space to talk through feelings and relax',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'मी तुमची परिस्थिती पूर्णपणे समजू शकतो. मनात जेव्हा एवढ्या गोष्टी सुरू असतात, तेव्हा ते मोकळेपणाने बोलल्याने मन हलके होते. अजिबात घाई करू नका, शांतपणे सांगा — आणखी काय त्रास होतोय?',
          quickReplies: [
            'ते सतत माझ्यावर संशय घेतात आणि टोकतात',
            'मला फक्त शांततेने राहायचे आहे',
            'माझी मेहनत कधीतरी समजून घ्यावी',
            'हो, आता मी निमंत्रण तयार करायला तयार आहे'
          ],
          extractedInsight: {
            intent: 'Continuing to unpack complex interpersonal feelings in a safe space',
            emotions: ['reflective', 'unburdening', 'seeking calm'],
            underlyingNeed: 'Space to talk through feelings and relax',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply: "I hear you completely. When you are carrying this much weight, talking through it is the best way to feel light again. There is no hurry at all — take your time and tell me what else has been weighing on you.",
        quickReplies: [
          'They constantly question my effort and decisions',
          'I just want peace and breathing room',
          'It feels like I can never do enough for them',
          'Yes, I feel ready to invite them now'
        ],
        extractedInsight: {
          intent: 'Continuing to unpack complex interpersonal feelings in a safe space',
          emotions: ['reflective', 'unburdening', 'seeking calm'],
          underlyingNeed: 'Space to talk through feelings and relax',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Only if user explicitly expressed ready intent:
    if (lang === 'hi') {
      return {
        reply: 'आपने अपनी भावना और स्थिति को बहुत अच्छी तरह समझ लिया है। जब भी आप तैयार हों, हम बिना किसी आरोप के एक शांत और सम्मानजनक निमंत्रण तैयार कर सकते हैं, ताकि वे अपनी बात रख सकें और आप दोनों एक स्वस्थ समाधान निकाल सकें।',
        quickReplies: ['हाँ, कृपया निमंत्रण तैयार कीजिए', 'निमंत्रण में क्या लिखा होगा?', 'क्या हम पहले संदेश देख सकते हैं?'],
        extractedInsight: {
          intent: 'Ready to bridge the disconnect through a neutral mediator',
          emotions: ['mature', 'ready for clarity', 'hopeful'],
          underlyingNeed: 'Mutual respect, independence, and peaceful connection',
          readyToInvite: true
        },
        aiProvider: 'local'
      };
    }

    if (lang === 'mr') {
      return {
        reply: 'तुम्ही स्वतःच्या भावना आणि परिस्थिती खूप चांगल्या पद्धतीने स्पष्ट केली आहे. तुम्ही तयार असाल तेव्हा आपण कोणतीही कटुता न आणता एक शांत निमंत्रण तयार करू शकतो, ज्यामुळे ती व्यक्ती तिची बाजू मांडू शकेल आणि चांगला तोडगा निघेल.',
        quickReplies: ['हो, कृपया निमंत्रण तयार करा', 'निमंत्रणात काय लिहिलेलं असेल?', 'आधी आपण संदेश तपासू शकतो का?'],
        extractedInsight: {
          intent: 'Ready to bridge the disconnect through a neutral mediator',
          emotions: ['mature', 'ready for clarity', 'hopeful'],
          underlyingNeed: 'Mutual respect, independence, and peaceful connection',
          readyToInvite: true
        },
        aiProvider: 'local'
      };
    }

    return {
      reply: 'You have untangled something truly important here. When you are ready, I can help invite them with a calm, neutral message — no blame, no forwarded venting — so they can share their perspective and you two can agree on a healthy way forward.',
      quickReplies: ['Yes, let us create the invitation', 'What will the invitation say?', 'Can we preview what they see?'],
      extractedInsight: {
        intent: 'Ready to bridge the disconnect through a neutral mediator',
        emotions: ['mature', 'ready for clarity', 'hopeful'],
        underlyingNeed: 'Mutual respect, independence, and peaceful connection',
        readyToInvite: true
      },
      aiProvider: 'local'
    };
  } else {
    // ========================================================
    // PERSON B (INVITED PARTICIPANT / RESPONDENT)
    // ========================================================

    // Case B1: Asking why they were invited ("Why she invited me here ?", "Why was I invited?", "What is this?")
    if (isAskingWhyInvited) {
      if (lang === 'hi') {
        return {
          reply:
            'आपके किसी करीबी ने आपको यहाँ आमंत्रित किया है क्योंकि वे आपके रिश्ते की बहुत कद्र करते हैं, लेकिन उन्हें लगा कि हाल ही में आपके बीच थोड़ी दूरी या ग़लतफ़हमी आ गई थी। वे एक शांत और निष्पक्ष जगह चाहते थे जहाँ बिना किसी झगड़े या आरोप-प्रत्यारोप के दोनों पक्ष अपनी बात रख सकें। Reconcile पर आपकी हर बात 100% गोपनीय रहेगी — आपके शब्द उन्हें कभी नहीं भेजे जाएँगे। आपके नज़रिए से हाल ही में आप दोनों के बीच क्या चल रहा है?',
          quickReplies: [
            'मैं समझना चाहता हूँ कि उन्हें कैसा लगा',
            'हाल ही में हमारे बीच थोड़ी दूरी या तनाव था',
            'मुझे नहीं लगा था कि बात इतनी बढ़ गई है',
            'मैं बिना लड़े शांति से बात करना चाहता हूँ'
          ],
          extractedInsight: {
            intent: 'Inquiring why they were invited to mediation',
            emotions: ['curious', 'cautious'],
            underlyingNeed: 'Transparency and reassurance of neutral intentions',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply:
            'तुमच्या एका जवळच्या व्यक्तीने तुम्हाला येथे आमंत्रित केले आहे, कारण ते तुमच्या नात्याची कदर करतात. पण अलीकडे तुमच्यात काही गैरसमज किंवा तणाव निर्माण झाल्याचे त्यांना जाणवले. वाद न घालता शांतपणे एकमेकांची बाजू समजून घेता यावी यासाठी त्यांनी ही मध्यस्थी निवडली. तुमचे बोलणे येथे १००% खाजगी राहील — तुमचे शब्द त्यांना कधीही दाखवले जाणार नाहीत. तुमच्या दृष्टीने अलीकडे काय घडले आहे?',
          quickReplies: [
            'त्यांना नक्की काय वाटले हे मला समजून घ्यायचे आहे',
            'हो, अलीकडे आमच्यात थोडा तणाव नक्कीच होता',
            'मला कल्पना नव्हती की ते इतके अस्वस्थ आहेत',
            'मला फक्त वाद न घालता शांततेने संवाद हवा आहे'
          ],
          extractedInsight: {
            intent: 'Inquiring why they were invited to mediation',
            emotions: ['curious', 'cautious'],
            underlyingNeed: 'Transparency and reassurance of neutral intentions',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply:
          'Someone who cares about you invited you here because they value your relationship, but felt things have gotten a bit tense or misunderstood recently. They wanted a calm, neutral space where both of you can be heard without an argument or interruption. Everything you share here is 100% private — your raw words are never forwarded to them. How have things felt from your perspective lately?',
        quickReplies: [
          'I would like to understand what they felt',
          'Things have definitely felt a bit distant or tense',
          'I did not realize they were so upset',
          'I want us to talk through this peacefully'
        ],
        extractedInsight: {
          intent: 'Inquiring why they were invited to mediation',
          emotions: ['curious', 'cautious'],
          underlyingNeed: 'Transparency and reassurance of neutral intentions',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Case B2: Asking what Person A said ("What did she say?", "usne kya bola?")
    if (isAskingWhatCounterpartSaid) {
      if (lang === 'hi') {
        return {
          reply:
            'Reconcile में दोनों पक्षों की प्राइवेसी सबसे अहम है, इसलिए मैं उनके निजी संदेश या शिकायतें आपको नहीं दिखा सकता — ठीक वैसे ही जैसे आपकी बातें कभी उन्हें नहीं दिखाई जाएँगी। पर वे इस रिश्ते को सुधारना चाहते हैं और बिना लड़े एक समझदारी भरा रास्ता निकालना चाहते हैं। आपके नज़रिए से हाल के दिनों में आप दोनों के बीच सबसे बड़ी परेशानी क्या रही है?',
          quickReplies: [
            'हमारे बीच छोटी-छोटी बातों पर ग़लतफ़हमी हो जाती है',
            'मुझे लगता है कि मेरी बात का गलत मतलब निकाल लिया जाता है',
            'मैं बहुत व्यस्त था और समय नहीं दे पाया',
            'हम शांति से बात सुलझाना चाहते हैं'
          ],
          extractedInsight: {
            intent: 'Asking what counterpart said while respecting confidentiality',
            emotions: ['guarded', 'curious'],
            underlyingNeed: 'Clarity and emotional safety',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply:
            'Reconcile मध्ये दोघांचीही गोपनीयता सर्वोच्च मानली जाते, त्यामुळे मी त्यांचे खाजगी संदेश तुम्हाला दाखवू शकत नाही — जसे तुमचे बोलणे त्यांना कधीही दाखवले जाणार नाही. मात्र ते हे नाते टिकवण्यासाठी आणि शांतपणे मार्ग काढण्यासाठी प्रयत्न करत आहेत. तुमच्या दृष्टीने तुम्हा दोघांमध्ये नक्की कुठे अडचण येत आहे?',
          quickReplies: [
            'आमच्यात छोट्या गोष्टींवरून गैरसमज होतात',
            'माझ्या बोलण्याचा चुकीचा अर्थ काढला जातो',
            'मी कामात व्यस्त असल्यामुळे पुरेसा वेळ देऊ शकलो नाही',
            'आम्हाला शांततेने तोडगा काढायचा आहे'
          ],
          extractedInsight: {
            intent: 'Asking what counterpart said while respecting confidentiality',
            emotions: ['guarded', 'curious'],
            underlyingNeed: 'Clarity and emotional safety',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply:
          'Because Reconcile is built on strict confidentiality, I never share their exact messages or ventings — just like I will never share yours with them. What I can share is that they care about this relationship and wanted to find a calm way to understand each other without another argument. From your point of view, what has felt most difficult between you two lately?',
        quickReplies: [
          'We keep misunderstanding each other',
          'I feel like whatever I say gets twisted',
          'I was really busy and could not give enough time',
          'I want us to find a calm way forward'
        ],
        extractedInsight: {
          intent: 'Asking what counterpart said while respecting confidentiality',
          emotions: ['guarded', 'curious'],
          underlyingNeed: 'Clarity and emotional safety',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Case B3: Busy schedule / work / responsibilities
    if (isBusySchedule && historyLen <= 3) {
      if (lang === 'hi') {
        return {
          reply:
            'आपकी यह बात पूरी तरह समझ आती है। जब काम, पढ़ाई या रोज़मर्रा की ज़िम्मेदारियों का बोझ बढ़ जाता है, तो कई बार चाहकर भी हम तुरंत बात नहीं कर पाते। जब आप समय नहीं दे पा रहे थे, तो आपके मन में क्या चल रहा था?',
          quickReplies: [
            'मैं बस अपनी ज़िम्मेदारियाँ पूरी करने में लगा था',
            'मेरा इरादा उन्हें अनदेखा करने का बिल्कुल नहीं था',
            'मुझे लगा कि वे मेरी व्यस्तता को समझेंगे',
            'काश हम बिना दबाव के आराम से बात कर पाते'
          ],
          extractedInsight: {
            intent: 'Explaining schedule pressures and lack of time without malice',
            emotions: ['occupied', 'misunderstood'],
            underlyingNeed: 'Understanding of responsibilities and schedule limits',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply:
            'हे अगदी समजण्यासारखे आहे. जेव्हा कामाचा किंवा जबाबदाऱ्यांचा ताण असतो, तेव्हा अनेकदा आपल्याला लगेच वेळ देता येत नाही. जेव्हा तुम्हाला बोलायला वेळ मिळत नव्हता, तेव्हा तुमच्या मनात काय सुरू होते?',
          quickReplies: [
            'मी फक्त माझी कामे पूर्ण करण्याचा प्रयत्न करत होतो',
            'त्यांना टाळण्याचा माझा कोणताही हेतू नव्हता',
            'मला वाटले होते की ते माझी परिस्थिती समजून घेतील',
            'दबावाशिवाय शांतपणे संवाद व्हावा हीच इच्छा आहे'
          ],
          extractedInsight: {
            intent: 'Explaining schedule pressures and lack of time without malice',
            emotions: ['occupied', 'misunderstood'],
            underlyingNeed: 'Understanding of responsibilities and schedule limits',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply:
          'That is completely understandable. When work, studies, or daily responsibilities pile up, it can be really tough to stay in constant touch, even when you care about the person. When you were caught up in your schedule, how did things feel between you two?',
        quickReplies: [
          'I was just trying to handle my responsibilities',
          'I never intended to make them feel ignored',
          'I thought they would understand I was busy',
          'I wish we could talk without pressure'
        ],
        extractedInsight: {
          intent: 'Explaining schedule pressures and lack of time without malice',
          emotions: ['occupied', 'misunderstood'],
          underlyingNeed: 'Understanding of responsibilities and schedule limits',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Case B4: Feeling blamed or unfairly criticized
    if (isDefensiveOrBlamed && historyLen <= 3) {
      if (lang === 'hi') {
        return {
          reply:
            'जब ऐसा लगे कि हर बात का दोष आप पर ही मढ़ा जा रहा है, तो मन में चिढ़ और निराशा होना बहुत स्वाभाविक है। आपकी बात भी उतनी ही महत्वपूर्ण है और आपको खुद का बचाव करने के लिए कटघरे में खड़े होने की ज़रूरत नहीं है। आप उनसे क्या उम्मीद रखते हैं ताकि वे आपकी स्थिति को समझ सकें?',
          quickReplies: [
            'वे हर बात पर मुझे ही दोषी ठहराना बंद करें',
            'मेरा इरादा कभी उन्हें ठेस पहुँचाने का नहीं था',
            'वे मेरी भी सीमाओं और मुश्किलों का सम्मान करें',
            'हम शांति से बात करें, बहस में नहीं'
          ],
          extractedInsight: {
            intent: 'Expressing frustration with feeling blamed or attacked',
            emotions: ['defensive', 'unfairly judged'],
            underlyingNeed: 'Fair hearing without accusations',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply:
            'जेव्हा प्रत्येक गोष्टीचा दोष आपल्यावरच येतो असे वाटते, तेव्हा चीड येणे अगदी स्वाभाविक आहे. तुमची बाजूही तितकीच महत्त्वाची आहे आणि तुम्हाला येथे स्वतःचा बचाव करण्याची गरज नाही. त्यांनी तुमची परिस्थिती कशी समजून घ्यावी अशी तुमची अपेक्षा आहे?',
          quickReplies: [
            'प्रत्येक वेळी मलाच जबाबदार धरणे थांबवावे',
            'त्यांना दुखवण्याचा माझा हेतू नव्हता',
            'त्यांनी माझ्याही मर्यादा समजून घ्याव्यात',
            'भांडणाऐवजी शांततेने संवाद व्हावा'
          ],
          extractedInsight: {
            intent: 'Expressing frustration with feeling blamed or attacked',
            emotions: ['defensive', 'unfairly judged'],
            underlyingNeed: 'Fair hearing without accusations',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply:
          'It is genuinely frustrating when you feel blamed or like you are always the one in the wrong. You deserve to be heard fairly too without being put on trial. What do you wish they understood about where you were coming from?',
        quickReplies: [
          'Stop assuming everything is my fault',
          'I never intended to cause hurt or conflict',
          'Respect my boundaries and schedule too',
          'Talk to me calmly without accusations'
        ],
        extractedInsight: {
          intent: 'Expressing frustration with feeling blamed or attacked',
          emotions: ['defensive', 'unfairly judged'],
          underlyingNeed: 'Fair hearing without accusations',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Turn 1: Welcoming Person B
    if (isGreeting || lastUserMsg.length <= 4) {
      if (lang === 'hi') {
        return {
          reply:
            'नमस्ते। यहाँ आने और बातचीत के लिए कदम बढ़ाने के लिए धन्यवाद। Reconcile पर आपकी बातें पूरी तरह निजी और गोपनीय रहेंगी। हाल के दिनों में आपके नज़रिए से परिस्थितियाँ कैसी रही हैं?',
          quickReplies: isParentRel
            ? [
                'मुझे दिन-रात बच्चों के भविष्य की चिंता रहती है',
                'मैंने उनके लिए इतना त्याग किया है ताकि उन्हें संघर्ष न करना पड़े',
                'मैं उनसे बहुत प्यार करती हूँ और उन्हें सफल देखना चाहती हूँ',
                'हम शांति से बात कैसे शुरू करें?'
              ]
            : [
                'मुझे यहाँ क्यों बुलाया गया है?',
                'उन्होंने क्या कहा?',
                'हाल ही में हमारे बीच थोड़ी दूरी या तनाव था',
                'मैं बिना लड़े शांति से बात करना चाहता हूँ'
              ],
          extractedInsight: {
            intent: 'Entering private consultation',
            emotions: ['cautious', 'protective'],
            underlyingNeed: 'To be heard fairly without accusations',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply:
            'नमस्कार. येथे येऊन संवाद साधल्याबद्दल धन्यवाद. Reconcile वर आपले बोलणे पूर्णपणे खाजगी राहील. अलीकडच्या काळात आपल्या बाजूने परिस्थिती कशी वाटत आहे?',
          quickReplies: isParentRel
            ? [
                'मला सतत मुलांच्या भविष्याची काळजी सतावत असते',
                'त्यांना चांगले दिवस यावेत म्हणून मी खूप त्याग केला आहे',
                'माझं त्यांच्यावर खूप प्रेम आहे आणि त्यांनी यशस्वी व्हावं हीच इच्छा आहे',
                'आम्ही शांततेने संवाद कसा सुरू करू शकतो?'
              ]
            : [
                'मला येथे का आमंत्रित केले आहे?',
                'ते नक्की काय म्हणाले?',
                'अलीकडे आमच्यात थोडा तणाव नक्कीच होता',
                'मला फक्त वाद न घालता शांततेने संवाद हवा आहे'
              ],
          extractedInsight: {
            intent: 'Entering private consultation',
            emotions: ['cautious', 'protective'],
            underlyingNeed: 'To be heard fairly without accusations',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply:
          'Hello. Thank you for stepping in and taking a moment to talk with me. Reconcile is here to listen to your perspective with total confidentiality. How have things felt from your side lately?',
        quickReplies: isParentRel
          ? [
              'I worry about their future constantly',
              'I gave up a lot so they could have opportunities',
              'I love them and want them to succeed',
              'How can we talk calmly without arguing?'
            ]
          : [
              'Why was I invited here?',
              'What did they say?',
              'Things have felt a bit tense lately',
              'I want us to talk through this peacefully'
            ],
        extractedInsight: {
          intent: 'Entering private consultation',
          emotions: ['cautious', 'protective'],
          underlyingNeed: 'To be heard fairly without accusations',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Turn 2: Validating Person B based on relationship (ZERO canned assumptions of burnout/stress)
    if (historyLen <= 2) {
      if (lang === 'hi') {
        return {
          reply: isParentRel
            ? 'एक माता-पिता के रूप में आपकी यह चिंता पूरी तरह समझ आती है। आप बच्चों के लिए इतना त्याग करते हैं और आपकी फिक्र सिर्फ प्यार और सुरक्षा से आती है। जब आप उनसे बात करते हैं, तो आपके मन में सबसे बड़ी चिंता क्या होती है?'
            : 'आपकी यह बात पूरी तरह समझ आती है। जब आप अपनी ज़िंदगी में उलझे हों और किसी अपने को ऐसा लगे कि दूरी बन रही है, तो दोनों तरफ ग़लतफ़हमी बढ़ना स्वाभाविक है। क्या आपको लगा कि उन्होंने आपकी मंशा को गलत समझ लिया?',
          quickReplies: isParentRel
            ? [
                'मुझे लगता है कि वे पीछे छूट जाएँगे और पछताएँगे',
                'मैं केवल मदद करना चाहती हूँ, उन्हें दुख नहीं देना चाहती',
                'वे समझ नहीं रहे कि दुनिया कितनी कठिन है',
                'मैं रोज़ की बहस से तंग आ चुकी हूँ'
              ]
            : [
                'हाँ, मेरा इरादा उन्हें दुख पहुँचाने का बिल्कुल नहीं था',
                'उन्होंने मुझसे पूछने के बजाय खुद ही बुरा मान लिया',
                'हम दोनों ही एक-दूसरे को समझना चाहते हैं',
                'हम बिना लड़े बात कैसे शुरू कर सकते हैं?'
              ],
          extractedInsight: {
            intent: isParentRel
              ? 'Explaining parental anxiety, love, and protection'
              : 'Clarifying genuine intentions behind recent distance',
            emotions: ['caring', 'misunderstood'],
            underlyingNeed: 'Fair understanding and mutual reassurance',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply: isParentRel
            ? 'एका पालकाच्या नात्याने तुमची ही काळजी अत्यंत स्वाभाविक आहे. तुम्ही मुलांसाठी इतके कष्ट घेतले आहेत आणि तुमचे प्रश्न हे प्रेमातूनच येतात. त्यांच्याशी बोलताना तुमच्या मनात सर्वात मोठी भीती काय असते?'
            : 'तुमची बाजू अगदी समजण्यासारखी आहे. जेव्हा आपण आपल्या कामात असतो आणि समोरच्याला दुरावा वाटतो, तेव्हा गैरसमज वाढणे स्वाभाविक आहे. तुम्हाला वाटते का की त्यांनी तुमचा हेतू चुकीचा समजला?',
          quickReplies: isParentRel
            ? [
                'त्यांचे नुकसान होईल आणि नंतर पश्चात्ताप होईल अशी भीती वाटते',
                'मला फक्त त्यांना आधार द्यायचा आहे, त्रास द्यायचा नाही',
                'जगातील स्पर्धा त्यांना अजून समजत नाही',
                'मला घरात रोजची कटकट नकोय'
              ]
            : [
                'हो, त्यांना दुखवण्याचा माझा हेतू नव्हता',
                'मला विचारण्याऐवजी त्यांनी स्वतःच गैरसमज करून घेतला',
                'आम्हा दोघांनाही एकमेकांना समजून घ्यायचे आहे',
                'वाद न घालता आम्ही चर्चा कशी करू शकतो?'
              ],
          extractedInsight: {
            intent: isParentRel
              ? 'Explaining parental anxiety, love, and protection'
              : 'Clarifying genuine intentions behind recent distance',
            emotions: ['caring', 'misunderstood'],
            underlyingNeed: 'Fair understanding and mutual reassurance',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply: isParentRel
          ? 'I hear the deep love and concern in that. You sacrificed so much to give them opportunities, so watching them navigate life triggers worry. When you ask about their life, what is the biggest fear running through your mind?'
          : 'I hear your side. When you are managing your own responsibilities and someone feels hurt or distant, it is easy for a misunderstanding to get blown out of proportion. Did you feel they misunderstood your intentions?',
        quickReplies: isParentRel
          ? [
              'That they will fall behind and regret it',
              'That they do not realize how tough the world is',
              'I want them to have a secure, happy life',
              'I just want to protect them'
            ]
          : [
              'Yes, my intention was never to make them feel bad',
              'They assumed the worst instead of asking me',
              'I think we both just want to be understood',
              'How do we fix this without an argument?'
            ],
        extractedInsight: {
          intent: isParentRel
            ? 'Explaining parental anxiety, love, and protection'
            : 'Clarifying genuine intentions behind recent distance',
          emotions: ['caring', 'misunderstood'],
          underlyingNeed: 'Reassurance of security and relationship safety',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Turn 3: Intention vs Impact Flip
    if (historyLen === 3) {
      if (lang === 'hi') {
        return {
          reply: isParentRel
            ? 'यही बात सबसे महत्वपूर्ण है — आपकी मंशा शुद्ध सुरक्षा और प्रेम की है। लेकिन जब रोज़-रोज़ सवाल पूछे जाते हैं, तो सामने वाले को "मुझे प्यार करते हैं" के बजाय "मुझ पर ज़रा भी भरोसा नहीं है" सुनाई देता है। दोनों तरफ से कोई बुरी भावना नहीं थी। क्या यह देखकर स्थिति को समझने का नज़रिया थोड़ा आसान होता है?'
            : 'यही बात सबसे महत्वपूर्ण है — आपकी मंशा अपनी ज़िम्मेदारियों को संभालने और शांति बनाए रखने की थी, लेकिन बिना बातचीत के सामने वाले को लगा कि वे आपके लिए महत्वपूर्ण ही नहीं रहे। दोनों में से किसी की भी नीयत बुरी नहीं थी। क्या यह अंतर देखकर तनाव थोड़ा कम महसूस होता है?',
          quickReplies: [
            'हाँ, मैं समझ सकता हूँ कि उन्हें ऐसा क्यों लगा',
            'मैंने कभी नहीं सोचा था कि इसका यह मतलब निकलेगा',
            'हम दोनों बिना लड़े बात कैसे शुरू कर सकते हैं?',
            'हाँ, यह नज़रिया देखने से राहत मिली'
          ],
          extractedInsight: {
            intent: 'Recognizing the gap between innocent intent and painful impact',
            emotions: ['reflective', 'softened', 'empathetic'],
            underlyingNeed: 'Connection without alienation',
            intentionVsImpact: isParentRel
              ? 'Intent: Maternal protection & care. Impact: Felt as micromanagement and lack of trust.'
              : 'Intent: Managing personal responsibilities. Impact: Felt as emotional distance.',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      if (lang === 'mr') {
        return {
          reply: isParentRel
            ? 'हे समजून घेणं खूप गरजेचं आहे — तुमचा हेतू शुद्ध काळजी आणि प्रेमाचा आहे. पण वारंवार विचारण्याने समोरच्याला "काळजी" ऐवजी "अविश्वास" जाणवतो. दोघांचाही हेतू वाईट नव्हता. हे लक्षात आल्यावर तणाव थोडा कमी वाटतो का?'
            : 'हे समजून घेणं अत्यंत महत्त्वाचं आहे — तुमचा हेतू स्वतःच्या जबाबदाऱ्या सांभाळण्याचा होता, पण संवादाअभावी समोरच्या व्यक्तीला दुरावा जाणवला. दोघांचाही हेतू वाईट नव्हता. हे पाहून मन थोडं शांत वाटतं का?',
          quickReplies: [
            'हो, मला समजलं की त्यांना तसं का वाटलं',
            'त्यांना असा अर्थ वाटेल असा मी विचारच केला नव्हता',
            'आम्ही वाद न घालता संवाद कसा सुरू करू शकतो?',
            'हो, हे पाहून मन हलकं झालं'
          ],
          extractedInsight: {
            intent: 'Recognizing the gap between innocent intent and painful impact',
            emotions: ['reflective', 'softened', 'empathetic'],
            underlyingNeed: 'Connection without alienation',
            intentionVsImpact: isParentRel
              ? 'Intent: Maternal protection & care. Impact: Felt as micromanagement and lack of trust.'
              : 'Intent: Managing personal responsibilities. Impact: Felt as emotional distance.',
            readyToInvite: false
          },
          aiProvider: 'local'
        };
      }

      return {
        reply: isParentRel
          ? 'That is such a profound insight. Your intention is pure guidance and love. But when questions happen constantly, they hear "I do not trust you" instead of "I love you". Neither of you was acting out of malice. Does seeing that difference help soften the tension?'
          : 'That is such a key difference. Your intention was simply to manage your own responsibilities and keep peace, but without open communication, they felt distance. Neither of you was acting with bad intentions. Does seeing that contrast help clear the air?',
        quickReplies: [
          'Yes, I understand why they felt hurt',
          'I never intended for it to feel like that',
          'How do we start a better conversation?',
          'Yes, this brings a lot of relief'
        ],
        extractedInsight: {
          intent: 'Recognizing the gap between innocent intent and painful impact',
          emotions: ['reflective', 'softened', 'empathetic'],
          underlyingNeed: 'Connection without alienation',
          intentionVsImpact: isParentRel
            ? 'Intent: Parental protection & care. Impact: Felt as micromanagement and lack of trust.'
            : 'Intent: Managing personal responsibilities. Impact: Felt as emotional distance.',
          readyToInvite: false
        },
        aiProvider: 'local'
      };
    }

    // Turn 4+: Ready for Shared Resolution / Mediation Bridge
    if (lang === 'hi') {
      return {
        reply:
          'आप दोनों एक-दूसरे की बहुत परवाह करते हैं, लेकिन बात करने के तरीके में ग़लतफ़हमी आने से तनाव बढ़ गया था। आप दोनों शांति, सम्मान और स्पष्टता चाहते हैं। Reconcile ने एक साझा मध्यस्थता सेतु (Mediation Bridge) तैयार किया है, जो दोनों पक्षों के लिए शांतिपूर्ण शब्द सुझाता है ताकि बिना किसी की निजी बातें दिखाए आप दोनों बात सुलझा सकें। क्या आप मध्यस्थता सेतु देखने के लिए तैयार हैं?',
        quickReplies: ['मध्यस्थता सेतु दिखाइए', 'हम आपस में यह बात कैसे शुरू करें?'],
        extractedInsight: {
          intent: 'Ready to review mutual common ground and de-escalate the relationship',
          emotions: ['open', 'constructive', 'relieved'],
          underlyingNeed: 'A calm path forward without circular arguing',
          intentionVsImpact: isParentRel
            ? 'Intent: Parental protection & care. Impact: Suffocating pressure & doubt.'
            : 'Intent: Managing personal responsibilities. Impact: Felt as emotional distance.',
          readyToInvite: true
        },
        aiProvider: 'local'
      };
    }

    if (lang === 'mr') {
      return {
        reply:
          'तुम्ही दोघेही एकमेकांची खूप काळजी करता, पण पद्धतीमध्ये गैरसमज झाल्यामुळे तणाव वाढला होता. तुम्हा दोघांनाही शांतता, आदर आणि संवाद हवा आहे. Reconcile ने एक संयुक्त मध्यस्थता सेतू तयार केला आहे, जो दोघांनाही समजूतदार शब्द सुचवतो — कोणाचेही खाजगी बोलणे एकमेकांना न दाखवता. आपण तयार केलेला मध्यस्थता सेतू (Mediation Bridge) पाहायला तयार आहात का?',
        quickReplies: ['मध्यस्थता सेतू दाखवा', 'आपण प्रत्यक्ष संवाद कसा सुरू करावा?'],
        extractedInsight: {
          intent: 'Ready to review mutual common ground and de-escalate the relationship',
          emotions: ['open', 'constructive', 'relieved'],
          underlyingNeed: 'A calm path forward without circular arguing',
          intentionVsImpact: isParentRel
            ? 'Intent: Parental protection & care. Impact: Suffocating pressure & doubt.'
            : 'Intent: Managing personal responsibilities. Impact: Felt as emotional distance.',
          readyToInvite: true
        },
        aiProvider: 'local'
      };
    }

    return {
      reply:
        'Both of you genuinely care about each other, but the way things landed created tension. You both want respect, peace of mind, and connection. Reconcile has prepared a joint Mediation Bridge that suggests kind, peaceful words to both of you to make up — without ever showing each other’s private text. Ready to see the Mediation Bridge?',
      quickReplies: ['Show me the Mediation Bridge', 'How should we talk about this?'],
      extractedInsight: {
        intent: 'Ready to review mutual common ground and de-escalate the relationship',
        emotions: ['open', 'constructive', 'relieved'],
        underlyingNeed: 'A calm path forward without circular arguing',
        intentionVsImpact: isParentRel
          ? 'Intent: Parental protection & care. Impact: Suffocating pressure & doubt.'
          : 'Intent: Managing personal responsibilities. Impact: Felt as emotional distance.',
        readyToInvite: true
      },
      aiProvider: 'local'
    };
  }
}

export async function generateMediationBridge(params: {
  relationship: RelationshipType;
  topic?: string;
  personAInsight: ExtractedInsight;
  personBInsight: ExtractedInsight;
  language?: SupportedLanguage;
}): Promise<MediationBridge> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const lang = params.language || 'en';

  const userPrompt = buildBridgePrompt(params);

  // 1. Google Gemini API (gemini-3.8-flash) server-side
  const geminiResult = await callGemini(MEDIATOR_SYSTEM_PROMPT, userPrompt, {
    temperature: 0.6,
    maxOutputTokens: 1400
  });

  if (geminiResult.ok && geminiResult.data) {
    const parsed = geminiResult.data;
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

  // 2. Anthropic Claude API if configured
  if (anthropicKey) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1500,
          system: MEDIATOR_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt + '\n\nIMPORTANT: Output strict JSON only matching: {"disconnectAnalysis":{"intentVsImpact":"","perceivedGap":"","theRootNeed":""},"commonGround":["..."],"proposedNextStep":"","suggestedSharedMessage":{"starterA":"","starterB":""}}' }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text;
        if (text) {
          const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsed = JSON.parse(cleanText);
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
      console.warn('Anthropic bridge error, trying OpenAI/local:', err);
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

  // Resilient Contextual Bridge Fallback (English, Hindi, Marathi)
  const isParent = params.relationship === 'parent';

  if (lang === 'hi') {
    return {
      status: 'ready' as const,
      personASideNeutral: isParent
        ? "अपनी स्वायत्तता, सम्मान और सांस लेने की जगह चाहते हैं, और चाहते हैं कि उनकी क्षमता पर भरोसा किया जाए।"
        : "अचानक आई चुप्पी से आहत हुए और उन्हें यह जानने की ज़रूरत है कि उनके रिश्ते का सम्मान अभी भी है।",
      personBSideNeutral: isParent
        ? "मातृ प्रेम और भविष्य की गहरी चिंता के कारण सुरक्षा सुनिश्चित करना चाहती हैं ताकि उन्हें संघर्ष न करना पड़े।"
        : "गंभीर तनाव और मानसिक थकान के कारण पीछे हटे ताकि तनाव और बहस न बढ़े।",
      disconnectAnalysis: {
        personAInterpretation: isParent
          ? "रोज़ के सवाल निगरानी जैसे लगे: “उन्हें मेरी क्षमता पर ज़रा भी भरोसा नहीं है।”"
          : "चुप्पी उपेक्षा जैसी लगी: “उन्हें अब इस दोस्ती की कोई परवाह नहीं है।”",
        personBInterpretation: isParent
          ? "रोज़ के सवाल फिक्र और प्यार हैं: “मैंने बहुत त्याग किया है और मैं उनकी सुरक्षा चाहती हूँ।”"
          : "चुप्पी शांति का प्रयास थी: “मैं बहुत तनाव में था और बात को बढ़ाना नहीं चाहता था।”",
        theGap: isParent
          ? "मंशा सुरक्षा और गहरे प्यार की थी; लेकिन उसका भावनात्मक असर घुटन और अविश्वास के रूप में महसूस हुआ। दोनों भविष्य की बेहतरी चाहते हैं, लेकिन रोज़ का तरीका तनाव पैदा कर रहा है।"
          : "मंशा थकान के समय शांत रहने की थी; असर उपेक्षा के रूप में महसूस हुआ।"
      },
      commonGround: [
        isParent
          ? "दोनों चाहते हैं कि भविष्य सुरक्षित, सफल और खुशहाल हो।"
          : "दोनों दोस्ती की क़द्र करते हैं और आपसी विश्वास चाहते हैं।",
        isParent
          ? "दोनों रोज़-रोज़ की बहस और तनाव से थक चुके हैं और घर में शांति चाहते हैं।"
          : "दोनों लंबी खामोशी के बजाय सीधी और ईमानदार बातचीत पसंद करते हैं।",
        isParent
          ? "दोनों सहमत हैं कि अचानक रोज़ पूछने के बजाय एक तय समय पर बात करना बेहतर है।"
          : "दोनों मानते हैं कि बाहरी तनाव का असर बातचीत पर पड़ता है।"
      ],
      suggestedSharedMessage: {
        fromAtoB: isParent
          ? "“माँ, मैं जानता हूँ कि आप मेरे भले के लिए पूछती हैं और मैं आपके प्यार की क़द्र करता हूँ। लेकिन जब यह रोज़ सुबह होता है, तो मुझे बहुत दबाव महसूस होता है। क्या हम हर रविवार बैठकर सुकून से बात कर सकते हैं? इससे आपको भी तसल्ली रहेगी और मुझे भी शांति मिलेगी।”"
          : "“दोस्त, मुझे तुम्हारी चुप्पी से ठेस पहुँची क्योंकि हमारी दोस्ती मेरे लिए मायने रखती है। पर मैं समझता हूँ कि ज़िंदगी में तनाव हो सकता है। जब भी तुम सहज महसूस करो, बिना किसी दबाव के बात करते हैं।”",
        fromBtoA: isParent
          ? "“मैं तुमसे बहुत प्यार करती हूँ और मेरे सवाल सिर्फ तुम्हारी चिंता के कारण होते हैं। मुझे अहसास नहीं था कि इससे तुम्हें अविश्वास महसूस होता है। मुझे तुम पर भरोसा है, और मैं रोज़ पूछने के बजाय हफ़्ते में एक बार बात करने को तैयार हूँ।”"
          : "“माफ़ करना कि मैं शांत हो गया। मैं बहुत तनाव में था और कुछ ग़लत नहीं कहना चाहता था। हमारे रिश्ते की मेरे लिए बहुत अहमियत है।”"
      },
      proposedNextStep: isParent
        ? "रोज़ सुबह सवाल पूछना बंद करें। हर रविवार चाय के साथ 20 मिनट का सहज संवाद तय करें जहाँ प्रगति खुद साझा की जाए।"
        : "यह स्वीकार करें कि तनाव स्वाभाविक है। गायब होने के बजाय एक छोटा संदेश 'मुझे 2 दिन का समय चाहिए' भेजने पर सहमति बनाएं।"
    };
  }

  if (lang === 'mr') {
    return {
      status: 'ready' as const,
      personASideNeutral: isParent
        ? "स्वतःची स्वायत्तता, आदर आणि मोकळीक हवी आहे, तसेच आपल्या क्षमतेवर पालकांनी विश्वास ठेवावा अशी अपेक्षा आहे."
        : "अचानक झालेल्या शांततेमुळे दुखावले गेले असून मैत्रीत विश्वासाची गरज आहे.",
      personBSideNeutral: isParent
        ? "मातृत्वाचे निस्सीम प्रेम आणि भविष्याची काळजी यातूनच सुरक्षिततेचा प्रयत्न करत आहेत जेणेकरून संघर्ष करावा लागू नये."
        : "तीव्र थकवा आणि तणावामुळे वाद टाळण्यासाठी स्वतःला सावरण्याचा प्रयत्न करत होते.",
      disconnectAnalysis: {
        personAInterpretation: isParent
          ? "रोजचे प्रश्न पाळत ठेवल्यासारखे वाटले: “तिचा माझ्या क्षमतेवर शून्य विश्वास आहे.”"
          : "शांतता दुर्लक्षासारखी वाटली: “त्याला मैत्रीची काहीच किंमत राहिलेली नाही.”",
        personBInterpretation: isParent
          ? "रोजचे प्रश्न काळजी आणि प्रेम आहेत: “मी खूप त्याग केला आहे आणि मला तिचं भलं हवं आहे.”"
          : "शांतता संयमाचा मार्ग होता: “मी खूप तणावात होतो आणि मला परिस्थिती बिघडवायची नव्हती.”",
        theGap: isParent
          ? "हेतू काळजी आणि प्रेमाचा होता; मात्र परिणाम अविश्वास आणि घुसमट म्हणून जाणवला. दोघांनाही यश हवे आहे, पण रोजची पद्धत तणाव वाढवत आहे."
          : "हेतू थकव्यातून सावरण्याचा होता; परिणाम दुर्लक्ष झाल्यासारखा वाटला."
      },
      commonGround: [
        isParent
          ? "दोघांनाही मुलाचे भविष्य सुरक्षित, यशस्वी आणि आनंदी व्हावे असे वाटते."
          : "दोघांनाही मैत्री टिकवायची आहे आणि आपापसात विश्वास हवा आहे.",
        isParent
          ? "दोघेही रोजच्या वादाला आणि तणावाला कंटाळले असून घरात शांतता हवी आहे."
          : "दोघेही दीर्घ शांततेपेक्षा थेट आणि प्रामाणिक संवादाला प्राधान्य देतात.",
        isParent
          ? "रोज अचानक विचारण्यापेक्षा आठवड्यातून एकदा ठरवून बोलणे दोघांनाही मान्य आहे."
          : "दोघांनाही जाणीव आहे की बाह्य तणावामुळे संवादावर परिणाम होतो."
      ],
      suggestedSharedMessage: {
        fromAtoB: isParent
          ? "“आई, मला ठाऊक आहे की तू काळजीपोटीच विचारतेस आणि मला तुझ्या प्रेमाची जाणीव आहे. पण रोज सकाळी विचारल्याने मला खूप मानसिक दबाव येतो. आपण दर रविवारी निवांतपणे बसून चर्चा करायची का? म्हणजे तुलाही खात्री राहील आणि मलाही मोकळेपणा मिळेल.”"
          : "“मित्रा, तुझ्या शांततेमुळे मला वाईट वाटलं कारण आपली मैत्री माझ्यासाठी महत्त्वाची आहे. पण मला समजतं की कामाचा ताण असू शकतो. तुला जेव्हा जमेल तेव्हा आपण शांतपणे बोलूया.”",
        fromBtoA: isParent
          ? "“माझं तुझ्यावर खूप प्रेम आहे आणि माझे प्रश्न हे केवळ काळजीपोटीच होते. यामुळे तुला अविश्वास वाटतो याची मला कल्पना नव्हती. माझा तुझ्यावर पूर्ण विश्वास आहे आणि रोज विचारण्याऐवजी आपण आठवड्यातून एकदा बोलूया.”"
          : "“मी शांत राहिलो याबद्दल मनापासून दिलगीर आहे. मला खूप ताण आला होता आणि मला काही चुकीचं बोलायचं नव्हतं. आपल्या मैत्रीची मला खूप कदर आहे.”"
      },
      proposedNextStep: isParent
        ? "रोज सकाळी विचारणे थांबवणे. त्याऐवजी दर रविवारी चहाच्या वेळी २० मिनिटे मनमोकळा संवाद साधण्याचा नियम ठरवणे."
        : "तणाव असू शकतो हे मान्य करणे. अचानक शांत होण्याऐवजी 'मला २ दिवस हवे आहेत' असा छोटा मेसेज पाठवण्याचा नियम करणे."
    };
  }

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
