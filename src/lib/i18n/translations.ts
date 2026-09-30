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
    welcomeGreeting: "Hello. Take a breath — I am right here with you. There is no hurry and nobody else sees this. What has been going on that you would like to talk through?",
    reassuranceNote: "Your words stay private with Reconcile. Nothing is forwarded without your consent.",
    defaultQuickReplies: [
      "There is a complicated situation I need help with",
      "We had an emotional argument recently",
      "I feel misunderstood and do not know how to bring it up",
      "I want to explain my side without starting a fight"
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
    welcomeGreeting: "नमस्ते। एक गहरी साँस लीजिए — मैं यहीं आपके साथ हूँ। कोई जल्दी नहीं है और यह बात पूरी तरह निजी रहेगी। ऐसी क्या बात हुई है जिसे आप आज साझा करना चाहते हैं?",
    reassuranceNote: "आपकी बातें पूरी तरह गोपनीय रहेंगी। आपकी अनुमति के बिना कुछ भी साझा नहीं किया जाएगा।",
    defaultQuickReplies: [
      "एक पेचीदा स्थिति है जिसे सुलझाना चाहता हूँ",
      "हाल ही में हमारे बीच बहुत बहस हो गई थी",
      "मुझे लगता है कि मुझे गलत समझा जा रहा है",
      "मैं बिना झगड़ा किए अपनी बात रखना चाहता हूँ"
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
    welcomeGreeting: "नमस्कार। एक दीर्घ श्वास घ्या — मी अगदी तुमच्या सोबत आहे. कोणतीही घाई नाही आणि हे बोलणे पूर्णपणे खाजगी राहील. अशी कोणती गोष्ट घडली आहे ज्यावर तुम्हाला शांतपणे बोलायचे आहे?",
    reassuranceNote: "तुमचे बोलणे पूर्णपणे खाजगी राहील. तुमच्या संमतीशिवाय काहीही शेअर केले जाणार नाही.",
    defaultQuickReplies: [
      "एक गुंतागुंतीचा विषय आहे जो मला सोडवायचा आहे",
      "अलीकडेच आमच्यात मोठा वाद झाला होता",
      "मला वाटतं मला गैरसमजून घेतलं जातंय",
      "भांडण न करता मला माझी बाजू मांडायची आहे"
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
    'aai', 'baba', 'abhyas', 'bhandan', 'sangto', 'sangte', 'vicharte', 'vichartat', 'samjat', 'kasa',
    'kashi', 'kiti', 'mala', 'mazya', 'ticha', 'tyancha', 'ahe', 'nahi', 'traas', 'tras', 'chinta', 'khup'
  ];

  // 2. Hindi Devanagari specific keywords / markers
  const hiSpecificWords = [
    'है', 'हैं', 'नहीं', 'मुझे', 'मेरा', 'मेरी', 'मेरे', 'माँ', 'मम्मी', 'पापा', 'दोस्त',
    'बात', 'झगड़ा', 'गुस्सा', 'पूछती', 'पूछते', 'पढ़ाई', 'होता', 'रहा', 'रही', 'रहे',
    'करना', 'चाहता', 'चाहती', 'समझ', 'बहुत', 'कुछ', 'क्या', 'परेशान', 'परेशानी', 'तनाव', 'उदास'
  ];
  const hiRomanized = [
    'mujhe', 'mummy', 'papa', 'padhai', 'jhagda', 'gussa', 'baat', 'puchti', 'puchte', 'hota',
    'hoti', 'raha', 'rahi', 'kuch', 'samajh', 'nahi', 'kare', 'kaise', 'batao',
    'are', 'yrr', 'yaar', 'presaan', 'pareshan', 'pareshaan', 'paresan', 'hu', 'hoon', 'tanaav',
    'udas', 'udaas', 'chinta', 'takleef', 'dard', 'bura', 'lag'
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
  let quickReplies: string[] = [];

  if (relationship === 'sibling') {
    if (language === 'hi') {
      quickReplies = [
        "मेरे भाई/बहन मेरी चीज़ें बिना पूछे ले लेते हैं",
        "वे मेरी सीमाओं और प्राइवेसी की कद्र नहीं करते",
        "छोटी-छोटी बातों पर हमारे बीच बहुत तीखी बहस हो जाती है",
        "हमेशा मुझसे ही समझौते की उम्मीद की जाती है"
      ];
    } else if (language === 'mr') {
      quickReplies = [
        "माझा भाऊ/बहीण विचारल्याशिवाय माझ्या वस्तू वापरतात",
        "ते माझ्या खाजगी जागेचा आणि मर्यादांचा आदर करत नाहीत",
        "छोट्या गोष्टींवरून रोज आमच्यात मोठे वाद होतात",
        "नेहमी मीच माघार घ्यावी अशी त्यांची अपेक्षा असते"
      ];
    } else {
      quickReplies = [
        "My sibling keeps using my things without asking",
        "They do not respect my personal space or boundaries",
        "We keep having loud arguments over little things",
        "It feels like I am always expected to compromise"
      ];
    }
  } else if (relationship === 'partner') {
    if (language === 'hi') {
      quickReplies = [
        "मुझे लगता है मेरा पार्टनर मेरी बात ध्यान से नहीं सुनता",
        "एक ही बात पर बार-बार वही पुरानी बहस शुरू हो जाती है",
        "तनाव होते ही बातचीत पूरी तरह बंद हो जाती है",
        "मैं बिना इल्ज़ाम लगाए शांति से अपनी बात कहना चाहता हूँ"
      ];
    } else if (language === 'mr') {
      quickReplies = [
        "मला वाटतं माझा जोडीदार माझं बोलणं नीट समजून घेत नाही",
        "एकाच मुद्द्यावरून पुन्हा पुन्हा तेच जुने वाद होतात",
        "वाद सुरू होताच आमच्यातील संवाद पूर्णपणे थांबतो",
        "आरोप न करता शांतपणे संवाद व्हावा हीच माझी इच्छा आहे"
      ];
    } else {
      quickReplies = [
        "I feel like my partner does not really hear me",
        "The same argument keeps repeating over and over",
        "One of us shuts down whenever tension starts",
        "I want to explain my feelings without starting a fight"
      ];
    }
  } else if (relationship === 'friend') {
    if (language === 'hi') {
      quickReplies = [
        "मेरे दोस्त ने कई दिनों से कोई जवाब नहीं दिया",
        "हमारे बीच अचानक दूरी और ठंडापन आ गया है",
        "एक बहस के बाद बात पूरी तरह बंद हो गई",
        "लग रहा है कि दोस्ती सिर्फ मेरी तरफ से चल रही है"
      ];
    } else if (language === 'mr') {
      quickReplies = [
        "माझ्या मित्राने दोन दिवसांपासून काहीच उत्तर दिले नाही",
        "आमच्यात अचानक दुरावा आणि शांतता पसरली आहे",
        "एका वादानंतर आमच्यात प्रचंड अवघडलेपण आले आहे",
        "नातं टिकवण्याचा प्रयत्न फक्त मीच करतोय असं वाटतंय"
      ];
    } else {
      quickReplies = [
        "My friend has not replied for days",
        "There is sudden distance and coldness between us",
        "We had an emotional argument and things feel awkward",
        "It feels like I am the only one making an effort"
      ];
    }
  } else if (relationship === 'parent') {
    if (language === 'hi') {
      quickReplies = [
        "मम्मी-पापा रोज़ मेरी पढ़ाई और दिनचर्या को लेकर सवाल पूछते हैं",
        "मुझे लगता है उन्हें मुझ पर ज़रा भी भरोसा नहीं है",
        "उनकी अपेक्षाओं को लेकर हमारी बहुत तीखी बहस हो गई",
        "मैं उनका साथ चाहता हूँ, लेकिन निगरानी और दबाव नहीं"
      ];
    } else if (language === 'mr') {
      quickReplies = [
        "आई-बाबा रोज माझ्या अभ्यास आणि वेळापत्रकाबद्दल विचारतात",
        "माझ्या क्षमतेवर त्यांचा अजिबात विश्वास नाही असं वाटतं",
        "त्यांच्या अपेक्षांवरून काल आमच्यात खूप मोठा वाद झाला",
        "मला त्यांचा पाठिंबा हवा आहे, पण सतत नियंत्रण नको"
      ];
    } else {
      quickReplies = [
        "My parents keep questioning my daily schedule and studies",
        "It feels like they have zero faith in my capability",
        "We had a painful argument about their expectations",
        "I want their support, but not constant micromanagement"
      ];
    }
  } else {
    // Other / Complicated
    if (language === 'hi') {
      quickReplies = [
        "हम दोनों के बीच एक पेचीदा ग़लतफ़हमी हो गई है",
        "बात इतनी बढ़ गई कि समझ नहीं आ रहा आगे क्या कहें",
        "मुझे बहुत अकेला और गलत समझा गया महसूस हो रहा है",
        "मैं बिना नई बहस शुरू किए बात को सुलझाना चाहता हूँ"
      ];
    } else if (language === 'mr') {
      quickReplies = [
        "आमच्यात एक अतिशय गुंतागुंतीचा गैरसमज झाला आहे",
        "प्रकरण एवढं वाढलंय की पुढे काय बोलायचं हेच समजत नाही",
        "माझी बाजू समजून घेतली जात नाहीये आणि खूप त्रास होतोय",
        "नवीन वाद न घालता मला हा तिढा शांतपणे सोडवायचा आहे"
      ];
    } else {
      quickReplies = [
        "There is a complicated misunderstanding between us",
        "Things got heated and neither of us knows what to say",
        "I feel completely misunderstood and overwhelmed",
        "I want to clear the air without starting another fight"
      ];
    }
  }

  return {
    text: strings.welcomeGreeting,
    quickReplies,
    reassuranceNote: strings.reassuranceNote
  };
}
