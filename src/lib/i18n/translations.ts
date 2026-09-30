import { SupportedLanguage, RelationshipType } from '@/lib/types';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  native: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export interface ChatTranslations {
  titleA: string;
  titleB: string;
  confidential: string;
  banner: string;
  placeholderA: string;
  placeholderB: string;
  send: string;
  inviteButton: string;
  viewBridge: string;
  suggested: string;
  thinking: string;
  readyToInviteA: string;
  readyToBridgeB: string;
  createInvitation: string;
  welcomeGreeting: string;
  reassuranceNote: string;
  defaultQuickReplies: string[];
}

export const I18N_STRINGS: Record<SupportedLanguage, ChatTranslations> = {
  en: {
    titleA: 'Private Space',
    titleB: 'Confidential Consultation',
    confidential: 'Confidential',
    banner: 'Your words stay private. Reconcile never forwards your raw messages.',
    placeholderA: 'Tell me what happened...',
    placeholderB: 'Share your perspective...',
    send: 'Send',
    inviteButton: 'Invite Them to Talk',
    viewBridge: 'View Mediation Bridge',
    suggested: 'Suggested:',
    thinking: 'Reconcile is reflecting on what you said...',
    readyToInviteA: 'I think I understand your perspective. Ready to invite them to share their side without any conflict?',
    readyToBridgeB: 'Both sides have shared their thoughts. Ready to see where things crossed and how to move forward?',
    createInvitation: 'Create Neutral Invitation',
    welcomeGreeting: "Hey, I'm here. What's going on?",
    reassuranceNote: "Your words stay private with Reconcile. Nothing is forwarded without your consent.",
    defaultQuickReplies: [
      "My parents keep asking about my studies",
      "We had a huge argument yesterday",
      "It feels like they don't trust me",
      "I don't know how to bring this up directly"
    ]
  },
  hi: {
    titleA: 'व्यक्तिगत संवाद',
    titleB: 'गोपनीय परामर्श',
    confidential: 'गोपनीय',
    banner: 'आपकी बातें पूरी तरह निजी हैं। Reconcile आपके संदेश कभी सीधे नहीं भेजता।',
    placeholderA: 'बताइए, क्या बात हुई है...',
    placeholderB: 'अपनी बात यहाँ साझा करें...',
    send: 'भेजें',
    inviteButton: 'बातचीत के लिए आमंत्रित करें',
    viewBridge: 'मध्यस्थता सेतु देखें',
    suggested: 'सुझाव:',
    thinking: 'Reconcile आपकी बात को समझ रहा है...',
    readyToInviteA: 'मुझे आपकी बात और भावना समझ आ रही है। क्या आप उन्हें बिना किसी तनाव के अपनी बात रखने के लिए आमंत्रित करना चाहते हैं?',
    readyToBridgeB: 'दोनों पक्षों ने अपनी बात साझा की है। क्या आप साझा सहमति और अगला कदम देखने के लिए तैयार हैं?',
    createInvitation: 'शांतिपूर्ण निमंत्रण तैयार करें',
    welcomeGreeting: "नमस्ते, मैं यहाँ हूँ। क्या बात हुई है?",
    reassuranceNote: "आपकी बातें पूरी तरह गोपनीय रहेंगी। आपकी अनुमति के बिना कुछ भी साझा नहीं किया जाएगा।",
    defaultQuickReplies: [
      "मम्मी-पापा रोज़ पढ़ाई को लेकर सवाल पूछते हैं",
      "कल हमारी बहुत बहस हो गई थी",
      "मुझे लगता है वे मुझ पर भरोसा नहीं करते",
      "समझ नहीं आ रहा उनसे सीधे कैसे बात करूँ"
    ]
  },
  mr: {
    titleA: 'खाजगी संवाद',
    titleB: 'गोपनीय सल्लामसलत',
    confidential: 'गोपनीय',
    banner: 'तुमचे बोलणे पूर्णपणे खाजगी राहील. Reconcile तुमचे मूळ मेसेज कधीही पुढे पाठवत नाही.',
    placeholderA: 'काय घडलंय ते सांगा...',
    placeholderB: 'तुमची बाजू इथे मांडा...',
    send: 'पाठवा',
    inviteButton: 'संवादासाठी आमंत्रित करा',
    viewBridge: 'मध्यस्थता सेतू पहा',
    suggested: 'सुचवलेले पर्याय:',
    thinking: 'Reconcile तुमच्या बोलण्याचा विचार करत आहे...',
    readyToInviteA: 'मला तुमची भावना आणि बाजू समजली आहे. कोणताही वाद न घालता त्यांची बाजू ऐकण्यासाठी त्यांना आमंत्रित करायचे का?',
    readyToBridgeB: 'दोन्ही बाजूंचे विचार आले आहेत. कुठे गैरसमज झाला आणि पुढे कसा मार्ग काढायचा हे पाहण्यासाठी तयार आहात का?',
    createInvitation: 'शांततापूर्ण निमंत्रण तयार करा',
    welcomeGreeting: "नमस्कार, मी इथे आहे. काय घडलंय, नक्की काय अडचण आहे?",
    reassuranceNote: "तुमचे बोलणे पूर्णपणे खाजगी राहील. तुमच्या संमतीशिवाय काहीही शेअर केले जाणार नाही.",
    defaultQuickReplies: [
      "आई-बाबा सतत अभ्यासाबद्दल विचारतात",
      "काल आमच्यात खूप मोठा वाद झाला",
      "मला वाटतं त्यांचा माझ्यावर विश्वासच नाही",
      "त्यांच्याशी थेट कसं बोलायचं हेच समजत नाही"
    ]
  }
};

/**
 * Intelligent Language Detector:
 * Detects if user writes in Hindi or Marathi (Devanagari script or typical Romanized words).
 */
export function detectLanguage(text: string): SupportedLanguage {
  const clean = text.toLowerCase().trim();

  // 1. Marathi Devanagari specific keywords / markers
  const mrDevanagari = /[\u0900-\u097F]/;
  const mrSpecificWords = [
    'आहे', 'नाही', 'नाहीत', 'होत', 'होते', 'होती', 'मला', 'माझे', 'माझ्या', 'त्यांचे', 'त्यांच्या',
    'आई', 'बाबा', 'दादा', 'ताई', 'भांडण', 'विचारतात', 'विचारते', 'सांगितलं', 'समजत', 'नको',
    'कसं', 'कशी', 'काय', 'घडलं', 'झाला', 'झाली', 'येथे', 'मित्रा', 'मित्राने', 'काही'
  ];
  const mrRomanized = [
    'aai', 'abhyas', 'bhandan', 'sangto', 'sangte', 'vicharte', 'vichartat', 'samjat', 'kasa',
    'kashi', 'kiti', 'mala', 'mazya', 'ticha', 'tyancha', 'ahe', 'nahi'
  ];

  // 2. Hindi Devanagari specific keywords / markers
  const hiSpecificWords = [
    'है', 'हैं', 'नहीं', 'मुझे', 'मेरा', 'मेरी', 'मेरे', 'माँ', 'मम्मी', 'पापा', 'दोस्त',
    'बात', 'झगड़ा', 'गुस्सा', 'पूछती', 'पूछते', 'पढ़ाई', 'होता', 'रहा', 'रही', 'रहे',
    'करना', 'चाहता', 'चाहती', 'समझ', 'बहुत', 'कुछ', 'क्या'
  ];
  const hiRomanized = [
    'mujhe', 'mummy', 'papa', 'padhai', 'jhagda', 'gussa', 'baat', 'puchti', 'puchte', 'hota',
    'hoti', 'raha', 'rahi', 'kuch', 'samajh', 'nahi', 'kare', 'kaise', 'batao'
  ];

  // Count matches
  let mrCount = 0;
  let hiCount = 0;

  for (const word of mrSpecificWords) {
    if (clean.includes(word)) mrCount += 2;
  }
  for (const word of mrRomanized) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(clean)) mrCount += 1;
  }

  for (const word of hiSpecificWords) {
    if (clean.includes(word)) hiCount += 2;
  }
  for (const word of hiRomanized) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(clean)) hiCount += 1;
  }

  if (mrCount > hiCount && mrCount >= 2) return 'mr';
  if (hiCount > mrCount && hiCount >= 2) return 'hi';

  // Check if purely Devanagari script was used
  if (mrDevanagari.test(clean)) {
    // If Devanagari is present, lean into matched counts or default to Hindi if unknown Devanagari
    if (mrCount > 0) return 'mr';
    return 'hi';
  }

  return 'en';
}

export function getGreetingForLanguage(
  language: SupportedLanguage,
  relationship: RelationshipType = 'parent'
): { text: string; quickReplies: string[]; reassuranceNote: string } {
  const strings = I18N_STRINGS[language] || I18N_STRINGS.en;
  let quickReplies = strings.defaultQuickReplies;

  if (relationship === 'friend') {
    if (language === 'hi') {
      quickReplies = [
        "मेरे दोस्त ने दो दिन से कोई जवाब नहीं दिया",
        "हम दोनों के बीच ग़लतफ़हमी हो गई है",
        "मुझे लग रहा है कि वह मुझे नज़रअंदाज़ कर रहा है",
        "मुझे समझ नहीं आ रहा उससे कैसे बात करूँ"
      ];
    } else if (language === 'mr') {
      quickReplies = [
        "माझ्या मित्राने दोन दिवसांपासून उत्तर दिलेले नाही",
        "आमच्यात गैरसमज झाला आहे",
        "मला वाटतं तो मला टाळत आहे",
        "त्याच्याशी पुन्हा कसं बोलायचं हे समजत नाही"
      ];
    } else {
      quickReplies = [
        "My friend hasn't replied for two days",
        "We had an emotional argument",
        "I feel completely ignored and hurt",
        "Things have become really awkward"
      ];
    }
  }

  return {
    text: strings.welcomeGreeting,
    quickReplies,
    reassuranceNote: strings.reassuranceNote
  };
}
