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

  // 3. Deep Multi-Turn Multilingual Conversational Engine (English, Hindi, Marathi)
  const isRoleA = params.role === 'a';
  const userMessages = params.history.filter((m) => m.sender === 'user');
  const historyLen = userMessages.length;
  const lastUserMsg = (userMessages.slice(-1)[0]?.text || '').trim().toLowerCase();
  const allUserText = userMessages.map((m) => m.text.toLowerCase()).join(' ');
  const isParentRel = params.relationship === 'parent';

  // Determine active language
  let lang: SupportedLanguage = params.language || 'en';
  const detected = detectLanguage(lastUserMsg);
  if (detected !== 'en' && !params.language) {
    lang = detected;
  }

  // Greeting detection (English, Hindi, Marathi)
  const isGreeting = /^(hi|hii|hiii|hello|helo|hey|heyy|hey there|good morning|good evening|yo|namaste|namaskar|help|नमस्ते|नमस्कार|हॅलो|हाय|प्रणाम|सलाम)$/i.test(lastUserMsg);

  if (isRoleA) {
    // ==========================================
    // PERSON A (CHILD / INITIATOR)
    // ==========================================

    // TURN 1: Initial Greeting / Opening
    if (isGreeting || lastUserMsg.length <= 4) {
      if (lang === 'hi') {
        return {
          reply: "नमस्ते। गहरी साँस लीजिए — मैं यहाँ आपके साथ हूँ। कोई जल्दबाज़ी नहीं है और यह बातचीत केवल आपके और मेरे बीच है। क्या बात हुई है जिसे आप साझा करना चाहेंगे?",
          quickReplies: isParentRel
            ? ["मम्मी रोज़ मेरी पढ़ाई को लेकर सवाल पूछती हैं", "मुझे लगता है उन्हें मुझ पर ज़रा भी भरोसा नहीं है", "कल हमारी बहुत बहस हो गई थी", "मुझे थोड़ा सुकून और आज़ादी चाहिए"]
            : ["मेरे दोस्त ने अचानक बात करना बंद कर दिया", "हम दोनों के बीच ग़लतफ़हमी हो गई है", "मुझे लग रहा है कि वह मुझे नज़रअंदाज़ कर रहा है", "मुझे समझ नहीं आ रहा उससे कैसे बात करूँ"],
          extractedInsight: {
            intent: "Opening up in a safe container",
            emotions: ["cautious", "open"],
            underlyingNeed: "A private place to be heard without judgment",
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: "नमस्कार. दीर्घ श्वास घ्या — मी तुमच्यासोबत आहे. कसलीही घाई नाही आणि हे संभाषण पूर्णपणे गोपनीय आहे. नक्की काय घडलंय, कशाबद्दल बोलायला आवडेल?",
          quickReplies: isParentRel
            ? ["आई रोज माझ्या अभ्यासाबद्दल विचारत राहते", "मला वाटतं तिचा माझ्या क्षमतेवर अजिबात विश्वास नाही", "काल आमच्यात खूप मोठा वाद झाला", "मला स्वतःसाठी थोडी मोकळीक हवी आहे"]
            : ["माझ्या मित्राने दोन दिवसांपासून उत्तर दिलेले नाही", "आमच्यात गैरसमज झाला आहे", "मला वाटतं तो मला टाळत आहे", "त्याच्याशी पुन्हा कसं बोलायचं हे समजत नाही"],
          extractedInsight: {
            intent: "Opening up in a safe container",
            emotions: ["cautious", "open"],
            underlyingNeed: "A private place to be heard without judgment",
            readyToInvite: false
          }
        };
      }

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
      if (lang === 'hi') {
        return {
          reply: "यह रोज़-रोज़ झेलना सच में थका देने वाला होता है। जब सुबह उठते ही सबसे पहले परीक्षाओं और तैयारी को लेकर सवाल शुरू हो जाते हैं, तो वह चिंता नहीं बल्कि निगरानी जैसा लगने लगता है। हाल ही में उन्होंने ऐसा क्या कहा जिससे आपको सबसे ज़्यादा ठेस पहुँची?",
          quickReplies: ["उन्होंने पूछा कि क्या मैं वाकई पढ़ाई कर भी रहा हूँ", "उन्हें लगता है मेरी ज़िंदगी की कोई योजना ही नहीं है", "वे मेरी तुलना दूसरों से करने लगती हैं", "वे हर बात पर शक करती हैं"],
          extractedInsight: {
            intent: "Explaining how daily questioning feels like surveillance",
            emotions: ["pressured", "scrutinized", "suffocated"],
            underlyingNeed: "Autonomy, space, and recognition of their effort",
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: "रोज सकाळी उठल्या उठल्या अभ्यासाची चौकशी होणं खरंच खूप त्रासदायक आणि मानसिक तणावाचं ठरू शकतं. ते प्रेमापेक्षा सतत पाळत ठेवल्यासारखं वाटतं. अलीकडे आई असं काय बोलली ज्याचा तुम्हाला सर्वात जास्त त्रास झाला?",
          quickReplies: ["ती म्हणाली की तू खरंच अभ्यास करतोस का?", "तिला वाटतं मला माझ्या भविष्याची काहीच काळजी नाही", "ती सतत इतरांशी माझी तुलना करत राहते", "तिला माझ्यावर अजिबात विश्वास नाही"],
          extractedInsight: {
            intent: "Explaining how daily questioning feels like surveillance",
            emotions: ["pressured", "scrutinized", "suffocated"],
            underlyingNeed: "Autonomy, space, and recognition of their effort",
            readyToInvite: false
          }
        };
      }

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
      if (lang === 'hi') {
        return {
          reply: "यह सुनकर बहुत बुरा लगता है जब आपकी पूरी मेहनत को अनदेखा कर दिया जाता है। क्या आपको सच में लगता है कि वे आप पर भरोसा नहीं करतीं, या उनकी अपनी चिंता और डर उन पर हावी हो रहा है?",
          quickReplies: ["उनकी अपनी चिंता बहुत ज़्यादा बढ़ गई है", "उन्हें सच में लगता है मैं कुछ नहीं कर पाऊँगा", "शायद दोनों बातें हैं — प्यार भी और डर भी", "वे अपनी पुरानी मुश्किलें मुझ पर थोप रही हैं"],
          extractedInsight: {
            intent: "Differentiating between parental anxiety and perceived lack of trust",
            emotions: ["doubted", "longing for independence", "frustrated"],
            underlyingNeed: "To be treated as an adult capable of responsibility",
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: "आपण मनापासून मेहनत करत असताना समोरच्याला त्याचा अंदाज न येणं हे खूप दुःख देणारं असतं. तुम्हाला काय वाटतं, तिला खरोखरच तुमच्यावर विश्वास नाही, की तिच्या मनातील धास्ती आणि चिंता तिच्या तोंडून बाहेर पडतेय?",
          quickReplies: ["तिची स्वतःची चिंता आणि भीती खूप जास्त आहे", "तिला खरंच वाटतं की मी अपयशी होईन", "दोन्ही गोष्टी आहेत — काळजी पण आहे आणि अविश्वासही", "ती तिचा जुना संघर्ष माझ्यावर लादतेय"],
          extractedInsight: {
            intent: "Differentiating between parental anxiety and perceived lack of trust",
            emotions: ["doubted", "longing for independence", "frustrated"],
            underlyingNeed: "To be treated as an adult capable of responsibility",
            readyToInvite: false
          }
        };
      }

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

    // TURN 4: Finding the Bridge (Clarifying the Core Wish)
    if (historyLen === 3) {
      if (lang === 'hi') {
        return {
          reply: "यह बहुत गहरी समझ है। उनकी मंशा शायद आपके भविष्य की सुरक्षा और फिक्र है, लेकिन उनका रोज़ का पूछना आपके लिए घुटन और अविश्वास बन जाता है। अगर आप बिना लड़े एक सीमा तय कर सकें, तो आप उनसे क्या बदलाव चाहेंगे?",
          quickReplies: ["रोज़ पूछने के बजाय हफ़्ते में एक बार बात करें", "मुझ पर थोड़ा भरोसा रखें और मुझे साँस लेने दें", "शांत माहौल में बैठकर बात हो, डांट-फटकार में नहीं", "मैं अपनी प्रगति खुद साझा करूँगा"],
          extractedInsight: {
            intent: "Ready to recognize mutual care while holding a healthy boundary",
            emotions: ["caring", "clear-headed", "ready for change"],
            underlyingNeed: "A structured, calm way to communicate that preserves autonomy",
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: "ही खूप परिपक्व समज आहे. तिच्या मनात तुमच्या भविष्याची काळजी आणि प्रेम असू शकतं, पण रोजच्या विचारण्याने तुम्हाला अविश्वास आणि घुसमट जाणवते. जर वाद न घालता एक योग्य तोडगा काढायचा असेल, तर तुम्हाला तिच्याकडून काय अपेक्षा आहे?",
          quickReplies: ["रोज विचारण्याऐवजी आठवड्यातून एकदा रविवारी चर्चा करावी", "माझ्यावर विश्वास ठेवून मला थोडी मोकळीक द्यावी", "भीतीने न बोलता शांतपणे संवाद साधावा", "मी स्वतःहून माझी प्रगती सांगेन"],
          extractedInsight: {
            intent: "Ready to recognize mutual care while holding a healthy boundary",
            emotions: ["caring", "clear-headed", "ready for change"],
            underlyingNeed: "A structured, calm way to communicate that preserves autonomy",
            readyToInvite: false
          }
        };
      }

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
    if (lang === 'hi') {
      return {
        reply: "आपने बहुत महत्वपूर्ण बात समझी है। आप उनका साथ चाहते हैं, लेकिन आपको उनके विश्वास की ज़रूरत है। जब भी आप तैयार हों, मैं बिना किसी आरोप के एक शांत और सम्मानजनक निमंत्रण तैयार कर सकता हूँ, ताकि वे अपनी बात रख सकें और आप दोनों एक स्वस्थ नियम बना सकें।",
        quickReplies: ["हाँ, कृपया निमंत्रण तैयार कीजिए", "निमंत्रण में क्या लिखा होगा?", "क्या हम पहले संदेश देख सकते हैं?"],
        extractedInsight: {
          intent: "Ready to bridge the disconnect through a neutral mediator",
          emotions: ["mature", "ready for clarity", "hopeful"],
          underlyingNeed: "Mutual respect, independence, and peaceful connection",
          readyToInvite: true
        }
      };
    }

    if (lang === 'mr') {
      return {
        reply: "तुम्ही एक अत्यंत महत्त्वाचा मुद्दा स्पष्ट केला आहे. तुम्हाला तिचा पाठिंबा हवा आहे, पण सोबत तिच्या विश्वासाचीही गरज आहे. तुम्ही तयार असाल तेव्हा मी कोणतीही कटुता न आणता एक शांत निमंत्रण तयार करू शकतो, ज्यामुळे ती तिची बाजू मांडू शकेल आणि तुमच्यात चांगला तोडगा निघेल.",
        quickReplies: ["हो, कृपया निमंत्रण तयार करा", "निमंत्रणात काय लिहिलेलं असेल?", "आधी आपण संदेश तपासू शकतो का?"],
        extractedInsight: {
          intent: "Ready to bridge the disconnect through a neutral mediator",
          emotions: ["mature", "ready for clarity", "hopeful"],
          underlyingNeed: "Mutual respect, independence, and peaceful connection",
          readyToInvite: true
        }
      };
    }

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
      if (lang === 'hi') {
        return {
          reply: "नमस्ते। यहाँ आने और अपनी बात साझा करने के लिए धन्यवाद। Reconcile पर आपकी बातें पूरी तरह गोपनीय रहेंगी। हाल के दिनों में आपके नज़रिए से परिस्थितियाँ कैसी रही हैं?",
          quickReplies: isParentRel
            ? ["मुझे दिन-रात बच्चों के भविष्य की चिंता रहती है", "मैंने उनके लिए इतना त्याग किया है ताकि उन्हें संघर्ष न करना पड़े", "जब मैं उन्हें फ़ोन पर देखती हूँ तो घबरा जाती हूँ", "मैं उनसे बहुत प्यार करती हूँ और उन्हें सफल देखना चाहती हूँ"]
            : ["मैं इस हफ़्ते बहुत तनाव में था", "मेरा इरादा उन्हें दुख पहुँचाने का नहीं था", "मुझे अपनी बात रखने के लिए थोड़ा समय चाहिए था", "यह रिश्ता मेरे लिए बहुत कीमती है"],
          extractedInsight: {
            intent: "Entering private consultation",
            emotions: ["cautious", "protective"],
            underlyingNeed: "To be heard fairly without accusations",
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: "नमस्कार. येथे येऊन मन मोकळं केल्याबद्दल धन्यवाद. Reconcile वर आपले बोलणे पूर्णपणे खाजगी राहील. अलीकडच्या काळात आपल्या बाजूने परिस्थिती कशी वाटत आहे?",
          quickReplies: isParentRel
            ? ["मला सतत मुलांच्या भविष्याची चिंता सतावत असते", "त्यांना चांगले दिवस यावेत म्हणून मी खूप त्याग केला आहे", "त्यांना सतत फोनवर पाहिलं की भीती वाटते", "माझं त्यांच्यावर खूप प्रेम आहे आणि त्यांनी यशस्वी व्हावं हीच इच्छा आहे"]
            : ["मी या आठवड्यात खूप तणावात होतो", "त्यांना दुखवण्याचा माझा कोणताही हेतू नव्हता", "मला स्वतःसाठी थोडा वेळ हवा होता", "हे नाते माझ्यासाठी अत्यंत महत्त्वाचे आहे"],
          extractedInsight: {
            intent: "Entering private consultation",
            emotions: ["cautious", "protective"],
            underlyingNeed: "To be heard fairly without accusations",
            readyToInvite: false
          }
        };
      }

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
      if (lang === 'hi') {
        return {
          reply: "एक माँ के रूप में आपकी यह भावना बिल्कुल समझ आती है। आपने उनके लिए इतना त्याग किया है और आपकी फिक्र सिर्फ प्यार से आती है। लेकिन जब बच्चे इसे अविश्वास और दबाव समझ लेते हैं, तो यह आपके लिए कितना दुखदायी होता है?",
          quickReplies: ["मुझे बहुत अकेला और ग़लत समझा गया महसूस होता है", "मैं केवल मदद करना चाहती हूँ, उन्हें दुख नहीं देना चाहती", "काश वे समझ पाते कि मैंने क्या झेला है", "मैं रोज़ की बहस से तंग आ चुकी हूँ"],
          extractedInsight: {
            intent: "Explaining parental anxiety, love, and protection",
            emotions: ["fear of their regret", "deep protective love", "anxious"],
            underlyingNeed: "Reassurance of child's safety and long-term security",
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: "एका आईच्या नात्याने तुमची ही काळजी अत्यंत स्वाभाविक आहे. तुम्ही मुलांसाठी इतके कष्ट घेतले आहेत आणि तुमचे प्रश्न हे प्रेमातूनच येतात. पण जेव्हा त्यांना यातून अविश्वास जाणवतो, तेव्हा तुमच्या मनाला किती वेदना होतात?",
          quickReplies: ["मला खूप वाईट वाटतं की माझा हेतू त्यांना समजला नाही", "मला फक्त त्यांना आधार द्यायचा आहे, त्रास द्यायचा नाही", "मी ज्या कष्टांतून गेले ते त्यांना भोगावे लागू नयेत एवढीच इच्छा", "मला घरात रोजची कटकट अजिबात नकोय"],
          extractedInsight: {
            intent: "Explaining parental anxiety, love, and protection",
            emotions: ["fear of their regret", "deep protective love", "anxious"],
            underlyingNeed: "Reassurance of child's safety and long-term security",
            readyToInvite: false
          }
        };
      }

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
      if (lang === 'hi') {
        return {
          reply: "यही बात सबसे महत्वपूर्ण है — आप दोनों के बीच प्यार है, लेकिन बात करने के तरीके में ग़लतफ़हमी आ गई है। अगर रोज़-रोज़ पूछने के बजाय हफ़्ते में एक तय समय पर सुकून से बात करने का नियम बन जाए, तो क्या आप इसके लिए तैयार होंगी?",
          quickReplies: ["हाँ, अगर वे अपनी प्रगति ईमानदारी से साझा करें तो मुझे मंज़ूर है", "हाँ, मैं घर में शांति चाहती हूँ", "मैं उन्हें अपनी क्षमता दिखाने का मौक़ा देने को तैयार हूँ", "हाँ, यह हम दोनों के लिए बेहतर होगा"],
          extractedInsight: {
            intent: "Recognizing the gap between loving intent and perceived surveillance",
            emotions: ["reflective", "softened", "loving"],
            underlyingNeed: "Connection without alienation",
            intentionVsImpact: "Intent: Protection & deep love. Impact: Felt as micromanagement and lack of trust.",
            readyToInvite: false
          }
        };
      }

      if (lang === 'mr') {
        return {
          reply: "हे समजून घेणं खूप गरजेचं आहे — तुमच्या दोघांमध्ये प्रेम आहे, पण संवादात अंतर पडलं आहे. रोज सकाळी विचारण्याऐवजी, जर आठवड्यातून एकदा रविवारी शांतपणे प्रगतीबद्दल बोलण्याचं ठरवलं, तर तुम्हाला चालेल का?",
          quickReplies: ["हो, त्यांनी प्रामाणिकपणे प्रगती सांगितली तर मला नक्कीच चालेल", "हो, मला घरात शांतता हवी आहे", "मी त्यांना स्वतःची क्षमता सिद्ध करण्यासाठी मोकळीक द्यायला तयार आहे", "हो, हा आम्हा दोघांसाठी उत्तम मार्ग आहे"],
          extractedInsight: {
            intent: "Recognizing the gap between loving intent and perceived surveillance",
            emotions: ["reflective", "softened", "loving"],
            underlyingNeed: "Connection without alienation",
            intentionVsImpact: "Intent: Protection & deep love. Impact: Felt as micromanagement and lack of trust.",
            readyToInvite: false
          }
        };
      }

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
    if (lang === 'hi') {
      return {
        reply: "आप दोनों एक-दूसरे की बहुत परवाह करते हैं, लेकिन तरीके में ग़लतफ़हमी आने से तनाव बढ़ गया था। आप दोनों घर में शांति, सम्मान और विश्वास चाहते हैं। क्या आप साझा मध्यस्थता सेतु (Mediation Bridge) देखने के लिए तैयार हैं?",
        quickReplies: ["मध्यस्थता सेतु दिखाइए", "हम आपस में यह बात कैसे शुरू करें?"],
        extractedInsight: {
          intent: "Ready to review mutual common ground and de-escalate the relationship",
          emotions: ["open", "constructive", "relieved"],
          underlyingNeed: "A calm path forward without circular arguing",
          intentionVsImpact: "Intent: Maternal protection & care. Impact: Suffocating pressure & doubt.",
          readyToInvite: true
        }
      };
    }

    if (lang === 'mr') {
      return {
        reply: "तुम्ही दोघेही एकमेकांची खूप काळजी करता, पण पद्धतीमध्ये गैरसमज झाल्यामुळे तणाव वाढला होता. तुम्हा दोघांनाही घरात शांतता, आदर आणि विश्वास हवा आहे. आपण तयार केलेला संयुक्त मध्यस्थता सेतू (Mediation Bridge) पाहायला तयार आहात का?",
        quickReplies: ["मध्यस्थता सेतू दाखवा", "आपण प्रत्यक्ष संवाद कसा सुरू करावा?"],
        extractedInsight: {
          intent: "Ready to review mutual common ground and de-escalate the relationship",
          emotions: ["open", "constructive", "relieved"],
          underlyingNeed: "A calm path forward without circular arguing",
          intentionVsImpact: "Intent: Maternal protection & care. Impact: Suffocating pressure & doubt.",
          readyToInvite: true
        }
      };
    }

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
  language?: SupportedLanguage;
}): Promise<MediationBridge> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const lang = params.language || 'en';

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
