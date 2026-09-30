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
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  // 1. Try Anthropic Claude API if configured
  if (anthropicKey) {
    try {
      const userPrompt = buildConversationPrompt(params);
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
              extractedInsight: parsed.extractedInsight
            };
          }
        }
      }
    } catch (err) {
      console.warn('Anthropic live call error, trying fallback:', err);
    }
  }

  // 2. Try Google Gemini API if configured
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

  // 3. Deep Adaptive Context-Aware Multilingual Conversational Engine (English, Hindi, Marathi)
  const isRoleA = params.role === 'a';
  const userMessages = params.history.filter((m) => m.sender === 'user');
  const historyLen = userMessages.length;
  const lastUserMsg = (userMessages.slice(-1)[0]?.text || '').trim().toLowerCase();
  const allUserText = userMessages.map((m) => m.text.toLowerCase()).join(' ');
  const rel = params.relationship || 'parent';
  const isParentRel = rel === 'parent';
  const isFriendRel = rel === 'friend';

  // Determine active language
  let lang: SupportedLanguage = params.language || 'en';
  const detected = detectLanguage(lastUserMsg);
  if (detected !== 'en' && !params.language) {
    lang = detected;
  }

  // 1. Semantic & Emotional Classifiers
  const isGreeting = /^(hi|hii|hiii|hello|helo|hey|heyy|hey there|good morning|good evening|yo|namaste|namaskar|help|नमस्ते|नमस्कार|हॅलो|हाय|प्रणाम|सलाम|kasa ahes|kaise ho)$/i.test(lastUserMsg);

  // Emotional distress / feeling low / stressed (e.g. "are yrr presaan hu", "bahut pareshan hu", "tension ho rahi hai")
  const isGeneralDistress = /(presaan|pareshan|pareshaan|paresan|tension|tanaav|udas|udaas|chinta|traas|tras|stressed|stress|anxious|troubled|upset|exhausted|sad|depressed|thak gaya|bura lag raha|kuch samajh nahi|dard|takleef|help me|radayla|ghutan|ro raha|heavy)/i.test(lastUserMsg);

  // Specific themes
  const isAcademic = /(study|studies|exam|exams|marks|grade|school|college|test|career|padhai|pariksha|percentage|coaching|abhyas|dakhla|paper|future)/i.test(allUserText);
  const isConflict = /(argument|fight|arguing|shouted|shouting|screamed|yelled|ladai|jhagda|bhas|behass|chilaye|bhandan|vad|tanta|ladte|chilla)/i.test(allUserText);
  const isIgnored = /(ignore|ignored|silent|silence|reply|replied|texted|blocked|ghosted|call|calling|whatsapp|jawab nahi|bolat nahi|uttar nahi|chuppi|katti|seen pe)/i.test(allUserText);
  const isTrustControl = /(trust|faith|doubt|suspicious|control|micromanage|surveillance|check|phone|bharosa|viswas|shak|azadi|freedom|space|nazar|rok tok|rok-tok|moklik)/i.test(allUserText);
  const isReadyIntent = /(invitation|invite|message|bhejo|sandesh|tayyar|ready|batana|samjhana|agreed|agree|bridge|khatam|solution|aage kya)/i.test(lastUserMsg);

  if (isRoleA) {
    // ========================================================
    // PERSON A (INITIATOR / SEEKING MEDIATION OR REFLECTION)
    // ========================================================

    // Case 1: Pure Greeting
    if (isGreeting || (lastUserMsg.length <= 4 && !isGeneralDistress)) {
      if (lang === 'hi') {
        return {
          reply: 'नमस्ते। गहरी साँस लीजिए — मैं यहाँ आपके साथ हूँ। कोई जल्दबाज़ी नहीं है और यह बातचीत केवल आपके और मेरे बीच है। क्या बात हुई है जिसे आप साझा करना चाहेंगे?',
          quickReplies: isParentRel
            ? ['मम्मी-पापा रोज़ मेरी पढ़ाई को लेकर सवाल पूछते हैं', 'मुझे लगता है उन्हें मुझ पर ज़रा भी भरोसा नहीं है', 'कल हमारी बहुत बहस हो गई थी', 'मुझे थोड़ा सुकून और आज़ादी चाहिए']
            : isFriendRel
            ? ['मेरे दोस्त ने अचानक बात करना बंद कर दिया', 'हम दोनों के बीच ग़लतफ़हमी हो गई है', 'मुझे लग रहा है कि वह मुझे नज़रअंदाज़ कर रहा है', 'समझ नहीं आ रहा उससे कैसे बात करूँ']
            : ['घर में किसी बात को लेकर बहुत तनाव चल रहा है', 'किसी करीबी के साथ ग़लतफ़हमी हो गई है', 'मैं बहुत परेशान महसूस कर रहा हूँ', 'कोई मेरी बात सुनने को तैयार नहीं है'],
          extractedInsight: {
            intent: 'Opening up in a safe container',
            emotions: ['cautious', 'open'],
            underlyingNeed: 'A private place to be heard without judgment',
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'नमस्कार. दीर्घ श्वास घ्या — मी तुमच्यासोबत आहे. कसलीही घाई नाही आणि हे संभाषण पूर्णपणे गोपनीय आहे. नक्की काय घडलंय, कशाबद्दल बोलायला आवडेल?',
          quickReplies: isParentRel
            ? ['आई-बाबा रोज माझ्या अभ्यासाबद्दल विचारत राहतात', 'मला वाटतं त्यांचा माझ्या क्षमतेवर अजिबात विश्वास नाही', 'काल आमच्यात खूप मोठा वाद झाला', 'मला स्वतःसाठी थोडी मोकळीक हवी आहे']
            : isFriendRel
            ? ['माझ्या मित्राने दोन दिवसांपासून उत्तर दिलेले नाही', 'आमच्यात गैरसमज झाला आहे', 'मला वाटतं तो मला टाळत आहे', 'त्याच्याशी पुन्हा कसं बोलायचं हे समजत नाही']
            : ['घरात एखाद्या गोष्टीवरून खूप वाद सुरू आहे', 'जवळच्या व्यक्तीसोबत गैरसमज झाला आहे', 'मला खूप तणाव जाणवतोय', 'माझं कोणी ऐकून घेत नाहीये'],
          extractedInsight: {
            intent: 'Opening up in a safe container',
            emotions: ['cautious', 'open'],
            underlyingNeed: 'A private place to be heard without judgment',
            readyToInvite: false
          }
        };
      }

      return {
        reply: "Hello. Take a breath — I am right here with you. There is no hurry and nobody else sees this. What has been going on that you would like to talk through?",
        quickReplies: isParentRel
          ? ["Mom keeps asking about my exams every day", "It feels like they have zero faith in me", "We had a huge argument yesterday", "I am stressed and need breathing room"]
          : isFriendRel
          ? ["My friend stopped replying to me", "We had an emotional argument", "I feel completely ignored and hurt", "Things have become really awkward"]
          : ["There is heavy tension in my life right now", "Had a misunderstanding with someone close", "I feel completely overwhelmed", "Nobody is listening to my side"],
        extractedInsight: {
          intent: 'Opening up in a safe container',
          emotions: ['cautious', 'open'],
          underlyingNeed: 'A private place to be heard without judgment',
          readyToInvite: false
        }
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

    // Case 3: Initial Problem Explanation (Turn 1 or 2 with specific topic)
    if (historyLen <= 2) {
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

    // Turn 3: Going Beneath the Surface (Intention vs Impact)
    if (historyLen === 3) {
      if (lang === 'hi') {
        return {
          reply: 'यह बहुत गहरी बात है। जब आपकी पूरी मेहनत या भावना को अनदेखा कर दिया जाता है, तो बहुत ठेस पहुँचती है। क्या आपको सच में लगता है कि वे जानबूझकर आपको दुख पहुँचाना चाहते हैं, या उनकी अपनी चिंता, डर या असुरक्षा उन पर हावी हो रही है?',
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
          reply: 'आपण मनापासून प्रयत्न करत असताना समोरच्याला त्याचा अंदाज न येणं हे खूप दुःख देणारं असतं. तुम्हाला काय वाटतं, त्यांना खरोखरच तुम्हाला त्रास द्यायचा आहे, की त्यांच्या मनातील भीती आणि चिंता त्यांच्या वागण्यातून बाहेर पडतेय?',
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
        reply: 'I really hear that. It hurts the most because you are already carrying pressure, and having someone constantly doubt you makes you feel small. Do you think they are acting out of bad intentions, or is their own fear and anxiety taking over?',
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

    // Turn 4: Finding the Concrete Healthy Boundary
    if (historyLen === 4 && !isReadyIntent) {
      if (lang === 'hi') {
        return {
          reply: 'यह बहुत परिपक्व समझ है। उनकी मंशा शायद आपके प्रति फिक्र या सुरक्षा की हो, लेकिन उनका कहने का तरीका आपके लिए घुटन और अविश्वास बन जाता है। अगर बिना लड़े एक स्वस्थ सीमा तय करनी हो, तो आप उनसे क्या बदलाव चाहेंगे?',
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
          reply: 'ही खूप परिपक्व समज आहे. त्यांच्या मनात काळजी असू शकते, पण बोलण्याच्या पद्धतीमुळे तुम्हाला घुसमट जाणवते. जर वाद न घालता एक योग्य तोडगा काढायचा असेल, तर तुम्हाला त्यांच्याकडून काय अपेक्षा आहे?',
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
        reply: 'That is so honest and clear. You do not want to fight or shut them out — you just want breathing room and to know that they believe in you. If you could set a healthy boundary without an argument, what would that look like?',
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

    // Turn 5+: Preparing the Neutral Invitation
    if (lang === 'hi') {
      return {
        reply: 'आपने अपनी भावना और स्थिति को बहुत अच्छी तरह समझ लिया है। आप यह रिश्ता चाहते हैं, लेकिन सम्मान और सुकून के साथ। जब भी आप तैयार हों, मैं बिना किसी आरोप के एक शांत और सम्मानजनक निमंत्रण तैयार कर सकता हूँ, ताकि वे अपनी बात रख सकें और आप दोनों एक स्वस्थ समाधान निकाल सकें।',
        quickReplies: ['हाँ, कृपया निमंत्रण तैयार कीजिए', 'निमंत्रण में क्या लिखा होगा?', 'क्या हम पहले संदेश देख सकते हैं?'],
        extractedInsight: {
          intent: 'Ready to bridge the disconnect through a neutral mediator',
          emotions: ['mature', 'ready for clarity', 'hopeful'],
          underlyingNeed: 'Mutual respect, independence, and peaceful connection',
          readyToInvite: true
        }
      };
    }

    if (lang === 'mr') {
      return {
        reply: 'तुम्ही स्वतःच्या भावना आणि परिस्थिती खूप चांगल्या पद्धतीने स्पष्ट केली आहे. तुम्ही तयार असाल तेव्हा मी कोणतीही कटुता न आणता एक शांत निमंत्रण तयार करू शकतो, ज्यामुळे ती व्यक्ती तिची बाजू मांडू शकेल आणि तुमच्यात चांगला तोडगा निघेल.',
        quickReplies: ['हो, कृपया निमंत्रण तयार करा', 'निमंत्रणात काय लिहिलेलं असेल?', 'आधी आपण संदेश तपासू शकतो का?'],
        extractedInsight: {
          intent: 'Ready to bridge the disconnect through a neutral mediator',
          emotions: ['mature', 'ready for clarity', 'hopeful'],
          underlyingNeed: 'Mutual respect, independence, and peaceful connection',
          readyToInvite: true
        }
      };
    }

    return {
      reply: 'You have untangled something truly important here. You want this connection, but with mutual respect and calm communication. When you are ready, I can help invite them with a calm, neutral message — no blame, no forwarded venting — so they can share their perspective and you two can agree on a healthy way forward.',
      quickReplies: ['Yes, let us create the invitation', 'What will the invitation say?', 'Can we preview what they see?'],
      extractedInsight: {
        intent: 'Ready to bridge the disconnect through a neutral mediator',
        emotions: ['mature', 'ready for clarity', 'hopeful'],
        underlyingNeed: 'Mutual respect, independence, and peaceful connection',
        readyToInvite: true
      }
    };
  } else {
    // ========================================================
    // PERSON B (INVITED PARTICIPANT / RESPONDENT)
    // ========================================================

    // Turn 1: Welcoming Person B
    if (isGreeting || lastUserMsg.length <= 4) {
      if (lang === 'hi') {
        return {
          reply: 'नमस्ते। यहाँ आने और बातचीत के लिए कदम बढ़ाने के लिए धन्यवाद। Reconcile पर आपकी बातें पूरी तरह निजी और गोपनीय रहेंगी। हाल के दिनों में आपके नज़रिए से परिस्थितियाँ कैसी रही हैं?',
          quickReplies: isParentRel
            ? ['मुझे दिन-रात बच्चों के भविष्य की चिंता रहती है', 'मैंने उनके लिए इतना त्याग किया है ताकि उन्हें संघर्ष न करना पड़े', 'जब मैं उन्हें बेपरवाह देखती हूँ तो घबरा जाती हूँ', 'मैं उनसे बहुत प्यार करती हूँ और उन्हें सफल देखना चाहती हूँ']
            : ['मैं इस हफ़्ते बहुत तनाव में था', 'मेरा इरादा उन्हें दुख पहुँचाने का नहीं था', 'मुझे अपनी बात रखने के लिए थोड़ा समय चाहिए था', 'यह रिश्ता मेरे लिए बहुत कीमती है'],
          extractedInsight: {
            intent: 'Entering private consultation',
            emotions: ['cautious', 'protective'],
            underlyingNeed: 'To be heard fairly without accusations',
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: 'नमस्कार. येथे येऊन संवाद साधल्याबद्दल धन्यवाद. Reconcile वर आपले बोलणे पूर्णपणे खाजगी राहील. अलीकडच्या काळात आपल्या बाजूने परिस्थिती कशी वाटत आहे?',
          quickReplies: isParentRel
            ? ['मला सतत मुलांच्या भविष्याची काळजी सतावत असते', 'त्यांना चांगले दिवस यावेत म्हणून मी खूप त्याग केला आहे', 'त्यांना निष्काळजी पाहिलं की भीती वाटते', 'माझं त्यांच्यावर खूप प्रेम आहे आणि त्यांनी यशस्वी व्हावं हीच इच्छा आहे']
            : ['मी या आठवड्यात खूप तणावात होतो', 'त्यांना दुखवण्याचा माझा कोणताही हेतू नव्हता', 'मला स्वतःसाठी थोडा वेळ हवा होता', 'हे नाते माझ्यासाठी अत्यंत महत्त्वाचे आहे'],
          extractedInsight: {
            intent: 'Entering private consultation',
            emotions: ['cautious', 'protective'],
            underlyingNeed: 'To be heard fairly without accusations',
            readyToInvite: false
          }
        };
      }

      return {
        reply: 'Hello. Thank you for stepping in and taking a moment to talk with me. Reconcile is here to listen to your perspective with total confidentiality. How have things felt from your side lately?',
        quickReplies: isParentRel
          ? ['I worry about their future constantly', 'I gave up a lot so they could have opportunities', 'I see them stressed or careless and panic', 'I love them and want them to succeed']
          : ['I was completely overwhelmed this week', 'I did not mean to hurt them', 'I had personal stress and burnout', 'I value this relationship deeply'],
        extractedInsight: {
          intent: 'Entering private consultation',
          emotions: ['cautious', 'protective'],
          underlyingNeed: 'To be heard fairly without accusations',
          readyToInvite: false
        }
      };
    }

    // Turn 2: Validating Person B based on relationship
    if (historyLen <= 2) {
      if (lang === 'hi') {
        return {
          reply: isParentRel
            ? 'एक माता-पिता के रूप में आपकी यह चिंता पूरी तरह समझ आती है। आप बच्चों के लिए इतना त्याग करते हैं और आपकी फिक्र सिर्फ प्यार और सुरक्षा से आती है। लेकिन जब बच्चे इसे अविश्वास और दबाव समझ लेते हैं, तो यह आपके लिए कितना दुखदायी होता है?'
            : 'एक करीबी के नाते आपकी यह बात पूरी तरह समझ आती है। जब ज़िंदगी में बहुत सारा तनाव या काम का बोझ बढ़ जाता है, तो कई बार हम दूसरों को समय नहीं दे पाते। जब आपने दूरी बनाई थी, तो आपके मन में क्या चल रहा था?',
          quickReplies: isParentRel
            ? ['मुझे बहुत अकेला और ग़लत समझा गया महसूस होता है', 'मैं केवल मदद करना चाहती हूँ, उन्हें दुख नहीं देना चाहती', 'काश वे समझ पाते कि मैंने क्या झेला है', 'मैं रोज़ की बहस से तंग आ चुकी हूँ']
            : ['मैं बस चीज़ों को और बिगाड़ना नहीं चाहता था', 'मुझे खुद को संभालने के लिए थोड़ा समय चाहिए था', 'मेरा इरादा उन्हें अनदेखा करने का नहीं था', 'मुझे लगा शांत होकर बात करना बेहतर होगा'],
          extractedInsight: {
            intent: isParentRel ? 'Explaining parental anxiety, love, and protection' : 'Explaining self-preservation during stress',
            emotions: ['caring', 'misunderstood', 'anxious'],
            underlyingNeed: 'Fair understanding and mutual reassurance',
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: isParentRel
            ? 'एका पालकाच्या नात्याने तुमची ही काळजी अत्यंत स्वाभाविक आहे. तुम्ही मुलांसाठी इतके कष्ट घेतले आहेत आणि तुमचे प्रश्न हे प्रेमातूनच येतात. पण जेव्हा त्यांना यातून अविश्वास जाणवतो, तेव्हा तुम्हाला किती वेदना होतात?'
            : 'नात्याच्या दृष्टीने हे अगदी समजण्यासारखे आहे. कामाचा किंवा वैयक्तिक तणाव वाढल्यावर बऱ्याचदा आपण लगेच व्यक्त होऊ शकत नाही. जेव्हा तुमच्यात संवाद थांबला, तेव्हा तुमच्या मनात नक्की काय सुरू होते?',
          quickReplies: isParentRel
            ? ['मला खूप वाईट वाटतं की माझा हेतू समजला नाही', 'मला फक्त त्यांना आधार द्यायचा आहे, त्रास द्यायचा नाही', 'मी ज्या कष्टांतून गेले ते त्यांना भोगावे लागू नयेत', 'मला घरात रोजची कटकट नकोय']
            : ['मला वाद वाढवायचा नव्हता', 'मला स्वतःला सावरण्यासाठी थोडा वेळ हवा होता', 'त्यांना टाळण्याचा माझा हेतू नव्हता', 'शांत झाल्यावर बोलणं योग्य वाटलं'],
          extractedInsight: {
            intent: isParentRel ? 'Explaining parental anxiety, love, and protection' : 'Explaining self-preservation during stress',
            emotions: ['caring', 'misunderstood', 'anxious'],
            underlyingNeed: 'Fair understanding and mutual reassurance',
            readyToInvite: false
          }
        };
      }

      return {
        reply: isParentRel
          ? 'I hear the deep love in that. You sacrificed so much to give them opportunities, so watching them navigate life triggers intense worry. When you ask about their life, what is the biggest fear running through your mind?'
          : 'That makes a lot of sense. Life stress and burnout can completely drain your emotional battery, making even a short text feel heavy. When you pulled back, what did you hope would happen?',
        quickReplies: isParentRel
          ? ['That they will fall behind and regret it', 'That they do not realize how tough the world is', 'I want them to have a secure, happy life', 'I just want to protect them']
          : ['I wanted to clear my head first', 'I did not want to say the wrong thing in anger', 'I was barely surviving the week', 'I thought we could talk when calm'],
        extractedInsight: {
          intent: isParentRel ? 'Explaining parental anxiety, love, and protection' : 'Coping with exhaustion while avoiding conflict',
          emotions: ['protective', 'cautious'],
          underlyingNeed: 'Reassurance of security and relationship safety',
          readyToInvite: false
        }
      };
    }

    // Turn 3: Intention vs Impact Flip
    if (historyLen === 3) {
      if (lang === 'hi') {
        return {
          reply: isParentRel
            ? 'यही बात सबसे महत्वपूर्ण है — आपकी मंशा शुद्ध सुरक्षा और प्रेम की है। लेकिन जब रोज़-रोज़ सवाल पूछे जाते हैं, तो सामने वाले को "मुझे प्यार करते हैं" के बजाय "मुझ पर ज़रा भी भरोसा नहीं है" सुनाई देता है। क्या यह देखकर स्थिति को समझने का नज़रिया बदलता है?'
            : 'यही बात सबसे महत्वपूर्ण है — आपकी मंशा परिस्थिति को शांत रखने और खुद को संभालने की थी, लेकिन सामने वाले को लगा कि वे आपके लिए महत्वपूर्ण ही नहीं रहे। दोनों तरफ से कोई बुरी भावना नहीं थी। क्या यह देखकर तनाव थोड़ा कम महसूस होता है?',
          quickReplies: [
            'हाँ, मैं समझ सकता हूँ कि उन्हें ऐसा क्यों लगा',
            'मैंने कभी नहीं सोचा था कि वे इसे अविश्वास समझेंगे',
            'हम दोनों बिना लड़े बात कैसे शुरू कर सकते हैं?',
            'हाँ, यह नज़रिया देखने से राहत मिली'
          ],
          extractedInsight: {
            intent: 'Recognizing the gap between innocent intent and painful impact',
            emotions: ['reflective', 'softened', 'empathetic'],
            underlyingNeed: 'Connection without alienation',
            intentionVsImpact: isParentRel
              ? 'Intent: Maternal protection & care. Impact: Felt as micromanagement and lack of trust.'
              : 'Intent: Self-preservation during stress. Impact: Felt as emotional disregard.',
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: isParentRel
            ? 'हे समजून घेणं खूप गरजेचं आहे — तुमचा हेतू शुद्ध काळजी आणि प्रेमाचा आहे. पण वारंवार विचारण्याने समोरच्याला "काळजी" ऐवजी "अविश्वास" जाणवतो. हे लक्षात आल्यावर तणाव कमी वाटतो का?'
            : 'हे समजून घेणं अत्यंत महत्त्वाचं आहे — तुमचा हेतू वाद टाळण्याचा होता, पण समोरच्या व्यक्तीला दुरावा आणि दुर्लक्ष जाणवले. दोघांचाही हेतू वाईट नव्हता. हे पाहून मन थोडं शांत वाटतं का?',
          quickReplies: [
            'हो, मला समजलं की त्यांना तसं का वाटलं',
            'त्यांना अविश्वास वाटेल असा मी विचारच केला नव्हता',
            'आम्ही वाद न घालता संवाद कसा सुरू करू शकतो?',
            'हो, हे पाहून मन हलकं झालं'
          ],
          extractedInsight: {
            intent: 'Recognizing the gap between innocent intent and painful impact',
            emotions: ['reflective', 'softened', 'empathetic'],
            underlyingNeed: 'Connection without alienation',
            intentionVsImpact: isParentRel
              ? 'Intent: Maternal protection & care. Impact: Felt as micromanagement and lack of trust.'
              : 'Intent: Self-preservation during stress. Impact: Felt as emotional disregard.',
            readyToInvite: false
          }
        };
      }

      return {
        reply: isParentRel
          ? 'That is such a profound insight. Your intention is pure guidance and love. But when questions happen constantly, they hear "I do not trust you to manage your life" instead of "I love you". Does seeing that help soften the tension?'
          : 'Exactly. Your intention was to avoid making things worse while overwhelmed. But for them, the silence felt like abandonment. Neither of you was acting out of malice. Does seeing that help clear the air?',
        quickReplies: [
          'Yes, I understand why they felt hurt',
          'I never intended for it to feel like distrust',
          'How do we start a better conversation?',
          'Yes, this brings a lot of relief'
        ],
        extractedInsight: {
          intent: 'Recognizing the gap between innocent intent and painful impact',
          emotions: ['reflective', 'softened', 'empathetic'],
          underlyingNeed: 'Connection without alienation',
          intentionVsImpact: isParentRel
            ? 'Intent: Maternal protection & care. Impact: Felt as micromanagement and lack of trust.'
            : 'Intent: Self-preservation during stress. Impact: Felt as emotional disregard.',
          readyToInvite: false
        }
      };
    }

    // Turn 4+: Ready for Shared Resolution
    if (lang === 'hi') {
      return {
        reply: 'आप दोनों एक-दूसरे की बहुत परवाह करते हैं, लेकिन बात करने के तरीके में ग़लतफ़हमी आने से तनाव बढ़ गया था। आप दोनों शांति, सम्मान और स्पष्टता चाहते हैं। क्या आप साझा मध्यस्थता सेतु (Mediation Bridge) देखने के लिए तैयार हैं?',
        quickReplies: ['मध्यस्थता सेतु दिखाइए', 'हम आपस में यह बात कैसे शुरू करें?'],
        extractedInsight: {
          intent: 'Ready to review mutual common ground and de-escalate the relationship',
          emotions: ['open', 'constructive', 'relieved'],
          underlyingNeed: 'A calm path forward without circular arguing',
          intentionVsImpact: isParentRel
            ? 'Intent: Parental protection & care. Impact: Suffocating pressure & doubt.'
            : 'Intent: Self-preservation during burnout. Impact: Emotional disregard.',
          readyToInvite: true
        }
      };
    }

    if (lang === 'mr') {
      return {
        reply: 'तुम्ही दोघेही एकमेकांची खूप काळजी करता, पण पद्धतीमध्ये गैरसमज झाल्यामुळे तणाव वाढला होता. तुम्हा दोघांनाही घरात शांतता, आदर आणि विश्वास हवा आहे. आपण तयार केलेला संयुक्त मध्यस्थता सेतू (Mediation Bridge) पाहायला तयार आहात का?',
        quickReplies: ['मध्यस्थता सेतू दाखवा', 'आपण प्रत्यक्ष संवाद कसा सुरू करावा?'],
        extractedInsight: {
          intent: 'Ready to review mutual common ground and de-escalate the relationship',
          emotions: ['open', 'constructive', 'relieved'],
          underlyingNeed: 'A calm path forward without circular arguing',
          intentionVsImpact: isParentRel
            ? 'Intent: Parental protection & care. Impact: Suffocating pressure & doubt.'
            : 'Intent: Self-preservation during burnout. Impact: Emotional disregard.',
          readyToInvite: true
        }
      };
    }

    return {
      reply: 'Both of you genuinely care about each other, but the way things landed created tension. You both want respect, peace of mind, and connection. Ready to see the joint Mediation Bridge and review a starter message to clear the air together?',
      quickReplies: ['Show me the Mediation Bridge', 'How should we talk about this?'],
      extractedInsight: {
        intent: 'Ready to review mutual common ground and de-escalate the relationship',
        emotions: ['open', 'constructive', 'relieved'],
        underlyingNeed: 'A calm path forward without circular arguing',
        intentionVsImpact: isParentRel
          ? 'Intent: Parental protection & care. Impact: Suffocating pressure & doubt.'
          : 'Intent: Self-preservation during burnout. Impact: Emotional neglect.',
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
  language?: SupportedLanguage;
}): Promise<MediationBridge> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const lang = params.language || 'en';

  if (anthropicKey) {
    try {
      const userPrompt = buildBridgePrompt(params);
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
      console.warn('Anthropic bridge error, trying Gemini/OpenAI:', err);
    }
  }

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
