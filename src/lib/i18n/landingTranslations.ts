import { SupportedLanguage } from '@/lib/types';

export interface LandingTranslations {
  navbar: {
    howItWorks: string;
    demonstration: string;
    outcomes: string;
    privacy: string;
    faq: string;
    about: string;
    tryReconcile: string;
    start: string;
    tellMeWhatHappened: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustProof: string;
    demoEyebrow: string;
    demoTitle: string;
    feltLabel: string;
    intentLabel: string;
    neverSeenBy: string;
    privateIntake: string;
    theActualDisconnect: string;
    suggestedStarter: string;
    tryThisLive: string;
    scenarios: Array<{
      id: string;
      demoKey: string;
      label: string;
      context: string;
      sideA: {
        name: string;
        role: string;
        rawText: string;
        felt: string;
      };
      sideB: {
        name: string;
        role: string;
        rawText: string;
        intent: string;
      };
      bridge: {
        disconnect: string;
        suggestedMessage: string;
      };
    }>;
  };
  problemStory: {
    badge: string;
    headline: string;
    subtitle: string;
    sectionTitle: string;
    whatWasSaid: string;
    whatWasHeard: string;
    whatWasMeant: string;
    disconnects: Array<{
      spoken: string;
      perceived: string;
      intended: string;
    }>;
    loopTitle: string;
    loopSubtitle: string;
    pillars: Array<{
      num: string;
      title: string;
      desc: string;
    }>;
  };
  demoSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    copyButton: string;
    copiedText: string;
    tryLiveSession: string;
    privateThoughtsA: string;
    privateThoughtsB: string;
    feltBadge: string;
    intentBadge: string;
    coreNeedLabel: string;
    theActualGap: string;
    commonGroundLabel: string;
    readyToSendMessage: string;
    tabs: Array<{
      key: string;
      tag: string;
      title: string;
      subtitle: string;
      personA: {
        name: string;
        role: string;
        quote: string;
        coreNeed: string;
      };
      personB: {
        name: string;
        role: string;
        quote: string;
        coreNeed: string;
      };
      reconcileAnalysis: {
        intent: string;
        impact: string;
        commonGround: string;
        readyOpener: string;
      };
    }>;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
      tag: string;
      microExample: string;
    }>;
  };
  outcomes: {
    badge: string;
    title: string;
    subtitle: string;
    cards: Array<{
      number: string;
      title: string;
      eyebrow: string;
      description: string;
      rawLabel: string;
      rawText: string;
      insightLabel: string;
      insightText: string;
      reasonsTitle?: string;
      reasonsList?: string[];
    }>;
  };
  privacy: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: Array<{
      title: string;
      description: string;
    }>;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  closingCta: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustProof: string;
  };
  footer: {
    philosophy: string;
    mission: string;
    productTitle: string;
    privacyTitle: string;
    resourcesTitle: string;
    crisisIndiaTitle: string;
    crisisDesc: string;
    teleManas: string;
    aasra: string;
    vandrevala: string;
    emergency112: string;
    copyright: string;
    builtWithEmpathy: string;
  };
}

export const LANDING_TRANSLATIONS: Record<SupportedLanguage, LandingTranslations> = {
  // =========================================================================
  // ENGLISH (4th to 5th Grade Reading Level)
  // Simple words, no complicated jargon, easy for a 9-10 year old to understand
  // =========================================================================
  en: {
    navbar: {
      howItWorks: 'How It Works',
      demonstration: 'Examples',
      outcomes: 'Benefits',
      privacy: 'Privacy & Safety',
      faq: 'Questions',
      about: 'About',
      tryReconcile: 'Start Talking',
      start: 'Start',
      tellMeWhatHappened: 'Tell Me What Happened'
    },
    hero: {
      eyebrow: 'A safe place to fix arguments',
      titleLine1: 'Had a fight with someone?',
      titleLine2: "Let's fix it peacefully.",
      description:
        "When you are angry or hurt, it's hard to talk nicely. Tell Reconcile what happened. Your words stay 100% private. We listen to you, help you calm down, and give you kind words to solve things without fighting.",
      ctaPrimary: 'Start Talking',
      ctaSecondary: 'See How It Works',
      trustProof: '100% private. No sign up needed. We never show your private words to anyone.',
      demoEyebrow: 'Real Examples',
      demoTitle: 'See how simple it is to fix an argument:',
      feltLabel: 'What was felt',
      intentLabel: 'What was really meant',
      neverSeenBy: 'Never seen by',
      privateIntake: 'Private Chat',
      theActualDisconnect: 'Where things got mixed up',
      suggestedStarter: 'A nice way to start talking',
      tryThisLive: 'Try this example',
      scenarios: [
        {
          id: 'parent-teen',
          demoKey: 'demo-parent-child',
          label: 'Parent & Kid',
          context: 'Mom asking about homework and studies every day',
          sideA: {
            name: 'Maya',
            role: 'Kid',
            rawText:
              '“Mom asks about my school and homework every single hour. It makes me feel like she thinks I am lazy or cannot do anything right.”',
            felt: 'Felt doubted & stressed'
          },
          sideB: {
            name: 'Mom',
            role: 'Parent',
            rawText:
              '“I ask because I worry about her future. I love her so much and want her to do well in school.”',
            intent: 'Deep love & worry'
          },
          bridge: {
            disconnect:
              'Mom was asking out of love and worry, but Maya felt like her mom did not trust her.',
            suggestedMessage:
              '“Mom, I know you love me and want me to do well. But when you ask every hour, it makes me feel stressed. Can we talk about my school once every Sunday evening instead?”'
          }
        },
        {
          id: 'friends-silence',
          demoKey: 'demo-friend-friend',
          label: 'Two Friends',
          context: 'A friend did not reply to messages for two days',
          sideA: {
            name: 'Rahul',
            role: 'Friend A',
            rawText:
              '“My best friend hasn’t replied to my messages for two days. I feel like he doesn’t care about our friendship anymore.”',
            felt: 'Felt ignored & sad'
          },
          sideB: {
            name: 'Aman',
            role: 'Friend B',
            rawText:
              '“I had so much homework and family work this week. I was completely tired and didn’t check my phone.”',
            intent: 'Tired & busy with family'
          },
          bridge: {
            disconnect:
              'Aman was just very tired and busy, but Rahul thought Aman was ignoring him on purpose.',
            suggestedMessage:
              '“Hey! No rush to reply. I know you’ve been super busy. Just checking in because I miss our chats!”'
          }
        },
        {
          id: 'sibling-sharing',
          demoKey: 'demo-sibling-sibling',
          label: 'Brother & Sister',
          context: 'Taking each other’s things without asking',
          sideA: {
            name: 'Rohan',
            role: 'Brother',
            rawText:
              '“My sister keeps taking my things without asking me first. It makes me really angry!”',
            felt: 'Felt angry & not respected'
          },
          sideB: {
            name: 'Priya',
            role: 'Sister',
            rawText:
              '“I just needed his notebook for five minutes. I didn’t know it would make him so upset.”',
            intent: 'Just needed quick help'
          },
          bridge: {
            disconnect:
              'Priya thought it was not a big deal, but Rohan felt his things were taken without respect.',
            suggestedMessage:
              '“Hey Priya, I don’t mind sharing my things with you, but please ask me first so I know where they are!”'
          }
        }
      ]
    },
    howItWorks: {
      badge: 'Simple 4 Steps',
      title: 'How Reconcile helps you',
      subtitle: 'We help two people understand each other so they can stop fighting and be friends again.',
      steps: [
        {
          number: '01',
          title: 'Tell us what happened',
          description:
            'Type what happened like you’re talking to a good friend. No pressure, take your time.',
          tag: 'Step 1',
          microExample: '“My friend didn’t invite me to play today...”'
        },
        {
          number: '02',
          title: 'We listen and understand',
          description:
            'We listen to your feelings, help you calm down, and help you see what the other person might be thinking.',
          tag: 'Step 2',
          microExample: '“It hurts to feel left out. Let’s see why they did that.”'
        },
        {
          number: '03',
          title: 'Find what went wrong',
          description:
            'We find the simple misunderstanding so nobody has to feel blamed or guilty.',
          tag: 'Step 3',
          microExample: '“They didn’t mean to hurt you — it was just a mix-up.”'
        },
        {
          number: '04',
          title: 'Kind words for both of you',
          description:
            'We suggest kind, peaceful words to both people so you can make up, without ever showing your private messages to each other.',
          tag: 'Step 4',
          microExample: '“Suggested to both people • Zero private text shared”'
        }
      ]
    },
    privacy: {
      badge: 'Safe & Private',
      title: 'Your words are completely private.',
      subtitle: 'Nobody can read what you tell Reconcile. You can be 100% honest without worrying.',
      pillars: [
        {
          title: 'Nobody reads your private chat',
          description:
            'What you type to Reconcile stays only with you. The other person can never see your private thoughts.'
        },
        {
          title: 'We never take sides',
          description:
            'We don’t blame anyone or decide who is right or wrong. We just help both people understand each other.'
        },
        {
          title: 'Angry messages are never sent',
          description:
            'We never send your angry words across. We only help you find polite and calm words when you are ready.'
        },
        {
          title: 'No sign up or password',
          description:
            'You don’t need an account or email to use this. Just open the page and start talking.'
        }
      ]
    },
    problemStory: {
      badge: 'Why We Fight',
      headline: '“When you are hurt, everything feels like an insult.”',
      subtitle:
        'Most fights happen because what you said is not what the other person heard. Reconcile helps you clear the air.',
      sectionTitle: 'How simple words get mixed up:',
      whatWasSaid: 'What was said:',
      whatWasHeard: 'What was heard:',
      whatWasMeant: 'What was actually meant:',
      disconnects: [
        {
          spoken: '“Can we talk tomorrow?”',
          perceived: '“You don’t care about me at all.”',
          intended: '“I’m too tired right now and don’t want to say something mean.”'
        },
        {
          spoken: '“Did you finish your work?”',
          perceived: '“You think I am careless and lazy.”',
          intended: '“I want to make sure you are not struggling.”'
        }
      ],
      loopTitle: 'Breaking the fighting cycle',
      loopSubtitle: 'How Reconcile makes it easy to speak kindly again',
      pillars: [
        { num: '01', title: 'Calm Down', desc: 'Take a breath and share your feelings safely.' },
        { num: '02', title: 'See Both Sides', desc: 'Understand why the other person did what they did.' },
        { num: '03', title: 'Fix It', desc: 'Get simple, peaceful words to make things right.' }
      ]
    },
    demoSection: {
      eyebrow: 'Real Stories',
      title: 'Common arguments solved simply.',
      subtitle: 'See how people like you used Reconcile to fix misunderstandings.',
      copyButton: 'Copy Message',
      copiedText: 'Copied!',
      tryLiveSession: 'Try this scenario',
      privateThoughtsA: 'Person A’s feelings',
      privateThoughtsB: 'Person B’s feelings',
      feltBadge: 'Felt',
      intentBadge: 'True Intent',
      coreNeedLabel: 'What they needed',
      theActualGap: 'Where things got crossed',
      commonGroundLabel: 'What they agree on',
      readyToSendMessage: 'Kind words to send',
      tabs: [
        {
          key: 'parent-kid',
          tag: 'Family',
          title: 'Parent & Kid',
          subtitle: 'Daily arguments over schoolwork and independence',
          personA: {
            name: 'Maya',
            role: 'Kid',
            quote: '“Mom asks about my school every hour. It feels like she thinks I am lazy.”',
            coreNeed: 'Needs trust and breathing room'
          },
          personB: {
            name: 'Mom',
            role: 'Parent',
            quote: '“I worry about her future and want her to do well.”',
            coreNeed: 'Wants reassurance and safety'
          },
          reconcileAnalysis: {
            intent: 'Mom cares deeply about Maya’s success.',
            impact: 'Maya felt micro-managed and doubted.',
            commonGround: 'Both want Maya to succeed without daily fights.',
            readyOpener:
              '“Mom, I know you care. But when you ask constantly, I feel stressed. Can we do a Sunday check-in instead?”'
          }
        }
      ]
    },
    outcomes: {
      badge: 'Good Results',
      title: 'Feel heard without starting another argument.',
      subtitle: 'How Reconcile turns anger into calm understanding.',
      cards: [
        {
          number: '01',
          title: 'Tell the whole truth safely.',
          eyebrow: 'Private venting',
          description:
            'Say whatever you are feeling. Nobody else sees your words. We help you find your calm.',
          rawLabel: 'What you felt:',
          rawText: '“I am so angry they ignored me!”',
          insightLabel: 'What you really want:',
          insightText: 'You want to feel cared for and respected.'
        },
        {
          number: '02',
          title: 'Understand the other person.',
          eyebrow: 'See their side',
          description:
            'See if they were tired, stressed, or confused, rather than trying to hurt you on purpose.',
          rawLabel: 'Their situation:',
          rawText: 'They were stressed with school or work.',
          insightLabel: 'The big picture:',
          insightText: 'Their silence was from tiredness, not anger.'
        }
      ]
    },
    faq: {
      badge: 'Questions',
      title: 'Frequently asked questions.',
      subtitle: 'Simple answers to help you get started.',
      items: [
        {
          question: 'Will the other person see what I typed?',
          answer:
            'Never. What you type stays 100% private with you. The other person only gets a kind, respectful message when you are ready.'
        },
        {
          question: 'Do I need an account or email?',
          answer:
            'No. You can start talking right away. No sign-up, no password, and completely free.'
        },
        {
          question: 'Does Reconcile take sides?',
          answer:
            'No, never! We don’t decide who is right or wrong. We only help both of you understand each other and make peace.'
        }
      ]
    },
    closingCta: {
      badge: 'Make Peace',
      title: 'Ready to fix your argument?',
      subtitle: 'Take two minutes to talk things through in private.',
      ctaPrimary: 'Start Talking',
      ctaSecondary: 'See an Example',
      trustProof: '100% free • No sign-up • Completely private'
    },
    footer: {
      philosophy: '“Understanding someone doesn’t mean agreeing with them.”',
      mission:
        'A friendly AI helper to solve arguments and misunderstandings peacefully.',
      productTitle: 'Product',
      privacyTitle: 'Safety',
      resourcesTitle: 'Helpline Numbers',
      crisisIndiaTitle: '24/7 Helplines (India):',
      crisisDesc:
        'If you or someone you know is feeling very sad, hopeless, or unsafe, please reach out for help right now:',
      teleManas: 'Tele-MANAS (Govt of India): 14416 (Free, 24/7)',
      aasra: 'AASRA Helpline: +91 9820466726',
      vandrevala: 'Vandrevala Foundation: +91 9999 666 555',
      emergency112: 'National Emergency Number: 112',
      copyright: 'Reconcile AI. All rights reserved. Helping people talk peacefully.',
      builtWithEmpathy: 'Made with care for peaceful conversations.'
    }
  },

  // =========================================================================
  // HINDI (सरल हिंदी — 4th to 5th Class Student Level)
  // बिल्कुल आसान और घरेलू हिंदी, जिसे चौथी-पाँचवीं का बच्चा भी समझ सके
  // =========================================================================
  hi: {
    navbar: {
      howItWorks: 'यह कैसे काम करता है',
      demonstration: 'आसान उदाहरण',
      outcomes: 'फायदे',
      privacy: 'सुरक्षा और गोपनीयता',
      faq: 'सवाल-जवाब',
      about: 'हमारे बारे में',
      tryReconcile: 'बात शुरू करें',
      start: 'शुरू करें',
      tellMeWhatHappened: 'बताइए क्या हुआ'
    },
    hero: {
      eyebrow: 'झगड़े सुलझाने का सुरक्षित साथी',
      titleLine1: 'किसी से अनबन या झगड़ा हुआ है?',
      titleLine2: 'आइए शांति से बात सुलझाएं।',
      description:
        'गुस्से या दुख में सही शब्द नहीं मिलते। पहले शांति से हमें बताएं। आपकी बातें 100% गुप्त रहेंगी। हम आपकी बात सुनेंगे, मन हल्का करेंगे, और ऐसे प्यारे शब्द देंगे जिससे बिना लड़े सब ठीक हो जाए।',
      ctaPrimary: 'बात शुरू करें',
      ctaSecondary: 'देखें यह कैसे काम करता है',
      trustProof:
        '100% गुप्त और सुरक्षित। कोई खाता बनाने की ज़रूरत नहीं। आपकी निजी बातें किसी को नहीं दिखाई जातीं।',
      demoEyebrow: 'आसान उदाहरण',
      demoTitle: 'देखें झगड़ा कितनी आसानी से सुलझ सकता है:',
      feltLabel: 'क्या महसूस हुआ',
      intentLabel: 'असली मंशा क्या थी',
      neverSeenBy: 'इन्हें कभी नहीं दिखेगा',
      privateIntake: 'निजी बातचीत',
      theActualDisconnect: 'बात कहाँ उलझी थी',
      suggestedStarter: 'बात शुरू करने के लिए प्यारे शब्द',
      tryThisLive: 'यह उदाहरण चलाकर देखें',
      scenarios: [
        {
          id: 'parent-teen',
          demoKey: 'demo-parent-child',
          label: 'मम्मी-पापा और बच्चा',
          context: 'रोज़ पढ़ाई और होमवर्क को लेकर टोकना',
          sideA: {
            name: 'माया',
            role: 'बेटी',
            rawText:
              '“मम्मी हर घंटे पढ़ाई और परीक्षा के बारे में पूछती रहती हैं। मुझे लगता है उन्हें मुझ पर बिल्कुल भरोसा नहीं है।”',
            felt: 'बुरा लगा और अविश्वास महसूस हुआ'
          },
          sideB: {
            name: 'माँ',
            role: 'माता-पिता',
            rawText:
              '“मैं इसलिए पूछती हूँ क्योंकि मुझे उसकी चिंता होती है। मैं चाहती हूँ कि वो अच्छे से पढ़े और खुश रहे।”',
            intent: 'सच्चा प्यार और फिक्र'
          },
          bridge: {
            disconnect:
              'माँ प्यार और चिंता से पूछ रही थीं, पर बेटी को लगा कि माँ उस पर शक कर रही हैं।',
            suggestedMessage:
              '“मम्मी, मैं जानती हूँ आप मुझसे प्यार करती हैं। लेकिन जब आप बार-बार पूछती हैं, तो मुझे तनाव होता है। क्या हम हर रविवार शाम को पढ़ाई की बात कर सकते हैं?”'
          }
        },
        {
          id: 'friends-silence',
          demoKey: 'demo-friend-friend',
          label: 'दो दोस्त',
          context: 'दोस्त ने दो दिन से मैसेज का जवाब नहीं दिया',
          sideA: {
            name: 'राहुल',
            role: 'दोस्त A',
            rawText:
              '“मेरे पक्के दोस्त ने दो दिन से कोई जवाब नहीं दिया। मुझे लगा अब वो मुझसे दोस्ती नहीं रखना चाहता।”',
            felt: 'अकेलापन और बुरा लगा'
          },
          sideB: {
            name: 'अमन',
            role: 'दोस्त B',
            rawText:
              '“घर में बहुत काम था और मैं बहुत थक गया था। मैंने फोन देखा ही नहीं।”',
            intent: 'थकावट और काम में व्यस्त'
          },
          bridge: {
            disconnect:
              'अमन थका हुआ था, लेकिन राहुल को लगा कि अमन उसे नज़रअंदाज़ कर रहा है।',
            suggestedMessage:
              '“अरे भाई, कोई जल्दी नहीं है। मुझे पता है तुम व्यस्त थे। बस याद आ रही थी तो मैसेज किया!”'
          }
        },
        {
          id: 'sibling-sharing',
          demoKey: 'demo-sibling-sibling',
          label: 'भाई और बहन',
          context: 'बिना पूछे सामान ले लेना',
          sideA: {
            name: 'रोहन',
            role: 'भाई',
            rawText:
              '“मेरी बहन बिना पूछे मेरा सामान उठा लेती है। मुझे बहुत गुस्सा आता है!”',
            felt: 'गुस्सा आया और बुरा लगा'
          },
          sideB: {
            name: 'प्रिया',
            role: 'बहन',
            rawText:
              '“मुझे बस थोड़ी देर के लिए उसकी कॉपी चाहिए थी। मुझे नहीं पता था कि वो इतना गुस्सा हो जाएगा।”',
            intent: 'बस थोड़ी मदद चाहिए थी'
          },
          bridge: {
            disconnect:
              'प्रिया को लगा छोटी सी बात है, लेकिन रोहन को लगा कि उसके सामान की कद्र नहीं की गई।',
            suggestedMessage:
              '“प्रिया, सामान लेने में कोई दिक्कत नहीं है, बस लेने से पहले एक बार पूछ लिया करो ताकि मुझे पता रहे!”'
          }
        }
      ]
    },
    howItWorks: {
      badge: 'आसान 4 कदम',
      title: 'Reconcile कैसे मदद करता है',
      subtitle:
        'हम दो लोगों को एक-दूसरे की बात समझाने में मदद करते हैं ताकि झगड़ा खत्म हो सके।',
      steps: [
        {
          number: '01',
          title: 'बताइए क्या हुआ',
          description:
            'जैसे किसी अच्छे दोस्त को बताते हैं, वैसे ही दिल की बात आराम से लिखें।',
          tag: 'पहला कदम',
          microExample: '“आज मेरे दोस्त ने मुझे खेलने नहीं बुलाया...”'
        },
        {
          number: '02',
          title: 'हम आपकी बात सुनते हैं',
          description:
            'हम आपकी भावना समझते हैं, आपका मन शांत करते हैं, और सामने वाले की मजबूरी भी देखते हैं।',
          tag: 'दूसरा कदम',
          microExample: '“बुरा लगना स्वाभाविक है। आइए देखें उन्होंने ऐसा क्यों किया।”'
        },
        {
          number: '03',
          title: 'ग़लतफ़हमी ढूंढते हैं',
          description:
            'हम दिखाते हैं कि बात कहाँ उलझी थी, ताकि किसी पर कोई दोष न आए।',
          tag: 'तीसरा कदम',
          microExample: '“उनका इरादा आपको दुख पहुँचाना नहीं था, बस समझने में भूल हुई।”'
        },
        {
          number: '04',
          title: 'दोनों पक्षों के लिए शांतिपूर्ण शब्द',
          description:
            'हम दोनों को आपस में बात सुलझाने के लिए शांत और समझदारी भरे शब्द सुझाते हैं, और आपकी निजी बातें कभी एक-दूसरे को नहीं दिखाई जातीं।',
          tag: 'चौथा कदम',
          microExample: '“दोनों को सुलह के शब्दों का सुझाव • निजी बातें 100% सुरक्षित”'
        }
      ]
    },
    privacy: {
      badge: 'सुरक्षित और गुप्त',
      title: 'आपकी बातें बिल्कुल गुप्त रहती हैं।',
      subtitle:
        'यहाँ आप बिना किसी डर के खुलकर बोल सकते हैं। आपकी बातें कोई दूसरा इंसान नहीं पढ़ सकता।',
      pillars: [
        {
          title: 'आपकी चैट कोई नहीं पढ़ सकता',
          description:
            'आप जो लिखते हैं वो सिर्फ आपके पास रहता है। सामने वाले को कभी आपकी निजी बातें नहीं दिखतीं।'
        },
        {
          title: 'हम कभी किसी का पक्ष नहीं लेते',
          description:
            'हम किसी को गलत या सही नहीं ठहराते। हम बस दोनों को एक-दूसरे की बात समझाते हैं।'
        },
        {
          title: 'गुस्से वाले शब्द कभी नहीं भेजे जाते',
          description:
            'हम आपकी कही कड़वी बातें कभी आगे नहीं भेजते। हम सिर्फ सुलह कराने वाले मीठे शब्द देते हैं।'
        },
        {
          title: 'कोई लॉगिन या पासवर्ड नहीं',
          description:
            'न ईमेल चाहिए, न पासवर्ड। बस पेज खोलिए और आराम से अपनी बात कहिए।'
        }
      ]
    },
    problemStory: {
      badge: 'झगड़े क्यों होते हैं',
      headline: '“जब दिल दुखा हो, तो हर बात बुरी लगती है।”',
      subtitle:
        'अक्सर झगड़े इसलिए नहीं होते कि प्यार खत्म हो गया, बल्कि इसलिए होते हैं क्योंकि हम अपनी बात सही से कह नहीं पाते।',
      sectionTitle: 'बातें कैसे उलझती हैं:',
      whatWasSaid: 'क्या कहा गया:',
      whatWasHeard: 'क्या समझा गया:',
      whatWasMeant: 'असली मतलब क्या था:',
      disconnects: [
        {
          spoken: '“क्या हम कल बात कर सकते हैं?”',
          perceived: '“तुम मेरी कोई परवाह नहीं करते।”',
          intended: '“मैं बहुत थका हूँ और गुस्से में कुछ गलत नहीं बोलना चाहता।”'
        }
      ],
      loopTitle: 'झगड़ा खत्म करने का तरीका',
      loopSubtitle: 'Reconcile कैसे बातचीत को आसान बनाता है',
      pillars: [
        { num: '01', title: 'शांत हों', desc: 'अपनी बात खुलकर और बिना डर के बताएं।' },
        { num: '02', title: 'दोनों तरफ देखें', desc: 'समझें कि सामने वाले ने ऐसा क्यों किया होगा।' },
        { num: '03', title: 'बात सुलझाएं', desc: 'प्यारे और सीधे शब्दों से दोबारा दोस्ती करें।' }
      ]
    },
    demoSection: {
      eyebrow: 'सच्ची कहानियाँ',
      title: 'झगड़े कैसे सुलझे',
      subtitle: 'देखें दूसरों ने कैसे अपनी बात सुलझाई।',
      copyButton: 'मैसेज कॉपी करें',
      copiedText: 'कॉपी हो गया!',
      tryLiveSession: 'यह उदाहरण आज़माएं',
      privateThoughtsA: 'इनका पक्ष',
      privateThoughtsB: 'उनका पक्ष',
      feltBadge: 'महसूस हुआ',
      intentBadge: 'असली मंशा',
      coreNeedLabel: 'ज़रूरत',
      theActualGap: 'कहाँ उलझन हुई',
      commonGroundLabel: 'सहमति',
      readyToSendMessage: 'भेजने के लिए अच्छा मैसेज',
      tabs: [
        {
          key: 'parent-kid',
          tag: 'परिवार',
          title: 'मम्मी-पापा और बच्चा',
          subtitle: 'पढ़ाई को लेकर रोज़ की बहस',
          personA: {
            name: 'माया',
            role: 'बेटी',
            quote: '“मम्मी हर रोज़ पढ़ाई के लिए टोकती हैं।”',
            coreNeed: 'भरोसा और थोड़ा समय'
          },
          personB: {
            name: 'माँ',
            role: 'माता-पिता',
            quote: '“मुझे उसकी भविष्य की चिंता रहती है।”',
            coreNeed: 'सच्चा प्यार'
          },
          reconcileAnalysis: {
            intent: 'माँ प्यार से चिंता कर रही थीं।',
            impact: 'बेटी को लगा उस पर भरोसा नहीं है।',
            commonGround: 'दोनों चाहते हैं कि घर में शांति रहे।',
            readyOpener:
              '“मम्मी, मैं जानती हूँ आप प्यार करती हैं। हम रविवार को पढ़ाई की बात करेंगे ताकि रोज़ तनाव न हो।”'
          }
        }
      ]
    },
    outcomes: {
      badge: 'अच्छे नतीजे',
      title: 'बिना लड़े अपनी बात कहें।',
      subtitle: 'गुस्से को शांति में बदलने का आसान तरीका।',
      cards: [
        {
          number: '01',
          title: 'दिल की पूरी बात कहें।',
          eyebrow: 'सुरक्षित बातचीत',
          description: 'जो भी महसूस हो रहा है, खुलकर कहें। आपकी बातें कोई और नहीं पढ़ सकता।',
          rawLabel: 'क्या महसूस हुआ:',
          rawText: '“मुझे बहुत गुस्सा आ रहा है!”',
          insightLabel: 'असली चाहत:',
          insightText: 'आप सम्मान और प्यार चाहते हैं।'
        }
      ]
    },
    faq: {
      badge: 'सवाल-जवाब',
      title: 'अक्सर पूछे जाने वाले सवाल।',
      subtitle: 'सीधे और आसान जवाब।',
      items: [
        {
          question: 'क्या सामने वाला मेरी लिखी बातें पढ़ सकता है?',
          answer:
            'बिल्कुल नहीं! आपकी बातें सिर्फ आपके पास सुरक्षित रहती हैं। उन्हें सिर्फ वही प्यार भरा मैसेज मिलता है जो आप भेजना चाहते हैं।'
        },
        {
          question: 'क्या कोई खाता या पासवर्ड चाहिए?',
          answer: 'नहीं, कुछ भी नहीं। बस पेज खोलिए और तुरंत बात शुरू कीजिए। यह पूरी तरह मुफ्त है।'
        },
        {
          question: 'क्या Reconcile किसी का पक्ष लेता है?',
          answer:
            'नहीं, हम कभी किसी को गलत या सही नहीं कहते। हम सिर्फ दोनों को एक-दूसरे की बात समझाने में मदद करते हैं।'
        }
      ]
    },
    closingCta: {
      badge: 'शांति से सुलझाएं',
      title: 'क्या आप बात सुलझाने के लिए तैयार हैं?',
      subtitle: 'बस दो मिनट निकालें और शांति से अपनी बात कहें।',
      ctaPrimary: 'बात शुरू करें',
      ctaSecondary: 'एक उदाहरण देखें',
      trustProof: '100% मुफ्त • कोई लॉगिन नहीं • पूरी तरह गुप्त'
    },
    footer: {
      philosophy: '“समझने का मतलब हर बात मान लेना नहीं होता।”',
      mission:
        'झगड़े और ग़लतफ़हमी को बिना लड़े, शांति से सुलझाने वाला एक प्यारा AI साथी।',
      productTitle: 'सुविधाएं',
      privacyTitle: 'सुरक्षा',
      resourcesTitle: 'मदद के लिए हेल्पलाइन',
      crisisIndiaTitle: '24 घंटे हेल्पलाइन (भारत):',
      crisisDesc:
        'यदि आप या आपका कोई अपना बहुत दुखी, परेशान या असुरक्षित महसूस कर रहा है, तो इन नंबरों पर अभी मदद लें:',
      teleManas: 'टेलि-मानस (भारत सरकार): 14416 (मुफ्त, 24/7)',
      aasra: 'आसरा हेल्पलाइन: +91 9820466726',
      vandrevala: 'वांद्रेवाला फाउंडेशन: +91 9999 666 555',
      emergency112: 'राष्ट्रीय आपातकालीन सेवा: 112',
      copyright: 'Reconcile AI. सर्वाधिकार सुरक्षित। शांति से बात सुलझाने में सहायक।',
      builtWithEmpathy: 'आपसी रिश्तों में मिठास बनाए रखने के लिए प्यार से निर्मित।'
    }
  },

  // =========================================================================
  // MARATHI (सोपी मराठी — 4th to 5th Class Student Level)
  // अगदी साधी आणि घरगुती मराठी, जी चौथी-पाचवीच्या मुलालाही सहज समजेल
  // =========================================================================
  mr: {
    navbar: {
      howItWorks: 'कसे चालते',
      demonstration: 'सोपी उदाहरणे',
      outcomes: 'फायदे',
      privacy: 'सुरक्षा आणि गोपनीयता',
      faq: 'प्रश्न-उत्तरे',
      about: 'आमच्याबद्दल',
      tryReconcile: 'बोलणे सुरू करा',
      start: 'सुरू करा',
      tellMeWhatHappened: 'काय घडले ते सांगा'
    },
    hero: {
      eyebrow: 'भांडण मिटवणारा सुरक्षित सोबती',
      titleLine1: 'कोणाशी भांडण किंवा अबोला झालाय?',
      titleLine2: 'शांतपणे गैरसमज दूर करूया.',
      description:
        'रागात किंवा दुखावल्यावर योग्य शब्द सुचत नाहीत. आधी निवांतपणे आम्हाला सांगा. तुमचे शब्द १००% खाजगी राहतील. आम्ही तुमचे म्हणणे ऐकू, मन शांत करू, आणि असे प्रेमळ शब्द देऊ ज्यामुळे भांडण न होता गैरसमज मिटेल.',
      ctaPrimary: 'बोलणे सुरू करा',
      ctaSecondary: 'कसे चालते ते पहा',
      trustProof:
        '१००% खाजगी आणि सुरक्षित. लॉगिनची गरज नाही. तुमचे खाजगी शब्द कोणालाही दाखवले जात नाहीत.',
      demoEyebrow: 'सोपी उदाहरणे',
      demoTitle: 'भांडण किती सहज मिटू शकते ते पहा:',
      feltLabel: 'काय वाटले',
      intentLabel: 'खरा हेतू काय होता',
      neverSeenBy: 'यांना कधीही दिसणार नाही',
      privateIntake: 'खाजगी संवाद',
      theActualDisconnect: 'गैरसमज कुठे झाला',
      suggestedStarter: 'गोड शब्दांत बोलण्याची सुरुवात',
      tryThisLive: 'हे उदाहरण चालवून पहा',
      scenarios: [
        {
          id: 'parent-teen',
          demoKey: 'demo-parent-child',
          label: 'आई-वडील आणि मुलं',
          context: 'अभ्यासावरून रोज होणारी विचारपूस',
          sideA: {
            name: 'माया',
            role: 'मुलगी',
            rawText:
              '“आई रोज सकाळी अभ्यासाबद्दल विचारत राहते. मला वाटते तिचा माझ्यावर अजिबात विश्वास नाही.”',
            felt: 'वाईट वाटले आणि अविश्वास वाटला'
          },
          sideB: {
            name: 'आई',
            role: 'पालक',
            rawText:
              '“तिची काळजी वाटते म्हणून मी विचारते. तिने छान शिकावे आणि मोठे व्हावे एवढीच माझी इच्छा आहे.”',
            intent: 'सच्चे प्रेम आणि काळजी'
          },
          bridge: {
            disconnect:
              'आई काळजीने विचारत होती, पण मुलीला वाटले की आई तिच्यावर अविश्वास दाखवते आहे.',
            suggestedMessage:
              '“आई, मला माहित आहे तू माझ्यावर प्रेम करतेस. पण रोज विचारल्याने मला खूप ताण येतो. आपण दर रविवारी निवांतपणे अभ्यासाबद्दल बोलूया का?”'
          }
        },
        {
          id: 'friends-silence',
          demoKey: 'demo-friend-friend',
          label: 'दोन मित्र',
          context: 'मित्राने दोन दिवस मेसेजला उत्तर न देणे',
          sideA: {
            name: 'राहुल',
            role: 'मित्र A',
            rawText:
              '“माझ्या मित्राने दोन दिवस माझ्या मेसेजला उत्तर दिले नाही. मला वाटले त्याला आता माझी मैत्री नकोय.”',
            felt: 'एकटेपणा आणि वाईट वाटले'
          },
          sideB: {
            name: 'अमन',
            role: 'मित्र B',
            rawText:
              '“घरात खूप काम होते आणि मी खूप थकलो होतो. फोन बघायला वेळच मिळाला नाही.”',
            intent: 'थकवा आणि कामात व्यग्र'
          },
          bridge: {
            disconnect:
              'अमन दमलेला होता, पण राहुलला वाटले की अमन मुद्दाम त्याच्याशी बोलत नाही.',
            suggestedMessage:
              '“अरे मित्रा, निवांत उत्तर दे. मला माहित आहे तू कामात होतास. फक्त आठवण आली म्हणून मेसेज केला!”'
          }
        },
        {
          id: 'sibling-sharing',
          demoKey: 'demo-sibling-sibling',
          label: 'भाऊ आणि बहीण',
          context: 'न विचारता वस्तू घेणे',
          sideA: {
            name: 'रोहन',
            role: 'भाऊ',
            rawText:
              '“माझी बहीण न विचारता माझे सामान घेऊन जाते. मला याचा खूप राग येतो!”',
            felt: 'राग आला आणि वाईट वाटले'
          },
          sideB: {
            name: 'प्रिया',
            role: 'बहीण',
            rawText:
              '“मला थोड्या वेळासाठी त्याची वही हवी होती. मला वाटले नव्हते की त्याला इतका राग येईल.”',
            intent: 'फक्त थोडी मदत हवी होती'
          },
          bridge: {
            disconnect:
              'प्रियाला वाटले साधी गोष्ट आहे, पण रोहनला वाटले की त्याच्या सामानाचा आदर केला नाही.',
            suggestedMessage:
              '“प्रिया, वस्तू घ्यायला हरकत नाही, पण घेण्यापूर्वी फक्त एकदा विचारून घेत जा म्हणजे मला समजेल!”'
          }
        }
      ]
    },
    howItWorks: {
      badge: 'सोप्या ४ पायऱ्या',
      title: 'Reconcile कशी मदत करते',
      subtitle:
        'आम्ही दोन व्यक्तींना एकमेकांची बाजू समजावून सांगतो, जेणेकरून भांडण मिटेल आणि पुन्हा गट्टी होईल.',
      steps: [
        {
          number: '01',
          title: 'काय घडले ते सांगा',
          description:
            'एखाद्या चांगल्या मित्राला सांगतो, तसेच मनातले मोकळेपणाने सांगा.',
          tag: 'पहिली पायरी',
          microExample: '“आज माझ्या मित्राने मला खेळायला बोलावले नाही...”'
        },
        {
          number: '02',
          title: 'आम्ही तुमचे म्हणणे ऐकतो',
          description:
            'आम्ही तुमच्या भावना समजून घेतो, मन शांत करतो, आणि समोरच्याची अडचणही पाहतो.',
          tag: 'दुसरी पायरी',
          microExample: '“वाईट वाटणे स्वाभाविक आहे. त्यांनी असे का केले ते पाहूया.”'
        },
        {
          number: '03',
          title: 'गैरसमज शोधतो',
          description:
            'नक्की कुठे चूक झाली ते शोधतो, जेणेकरून कोणावरही दोष येणार नाही.',
          tag: 'तिसरी पायरी',
          microExample: '“त्यांचा हेतू वाईट नव्हता, फक्त समजण्यात चूक झाली होती.”'
        },
        {
          number: '04',
          title: 'दोघांसाठीही समजूतदार शब्द',
          description:
            'आम्ही दोघांनाही वाद मिटवून पुन्हा संवाद साधण्यासाठी गोड आणि शांत शब्द सुचवतो, आणि तुमचे खाजगी बोलणे एकमेकांना कधीही दाखवले जात नाही.',
          tag: 'चौथी पायरी',
          microExample: '“दोन्ही बाजूंना समजूतदार शब्दांचा सल्ला • खाजगी संवाद १००% सुरक्षित”'
        }
      ]
    },
    privacy: {
      badge: 'सुरक्षित आणि गुप्त',
      title: 'तुमचे बोलणे पूर्णपणे खाजगी राहते.',
      subtitle:
        'येथे तुम्ही कोणतीही भीती न बाळगता बोलू शकता. तुमचे शब्द दुसरा कोणीही वाचू शकत नाही.',
      pillars: [
        {
          title: 'तुमचे बोलणे कोणीही वाचत नाही',
          description:
            'तुम्ही जे लिहिता ते फक्त तुमच्यापुरतेच राहते. समोरच्याला तुमचे खाजगी विचार कधीही दिसत नाहीत.'
        },
        {
          title: 'आम्ही कोणाचीही बाजू घेत नाही',
          description:
            'आम्ही कोणालाही चूक किंवा बरोबर ठरवत नाही. फक्त दोघांना एकमेकांची बाजू समजावून सांगतो.'
        },
        {
          title: 'रागातील शब्द कधीही पाठवले जात नाहीत',
          description:
            'तुम्ही रागात बोललेले शब्द कोणाकडेही जात नाहीत. आम्ही फक्त भांडण मिटवणारे शांत शब्द देतो.'
        },
        {
          title: 'लॉगिन किंवा पासवर्डची गरज नाही',
          description:
            'ईमेल किंवा पासवर्डची काहीही गरज नाही. फक्त पान उघडा आणि शांतपणे बोलायला सुरुवात करा.'
        }
      ]
    },
    problemStory: {
      badge: 'भांडणे का होतात',
      headline: '“मन दुखावले की प्रत्येक गोष्टीत वाईट वाटते.”',
      subtitle:
        'भांडणे प्रेमाच्या अभावामुळे नव्हे, तर एकमेकांना नीट न समजल्यामुळे होतात. Reconcile हा दुरावा मिटवते.',
      sectionTitle: 'गैरसमज कसे होतात:',
      whatWasSaid: 'काय बोलले गेले:',
      whatWasHeard: 'काय ऐकू गेले:',
      whatWasMeant: 'खरा अर्थ काय होता:',
      disconnects: [
        {
          spoken: '“आपण उद्या बोलूया का?”',
          perceived: '“तुला माझी काहीच काळजी नाही.”',
          intended: '“मी खूप दमलोय आणि रागात काही चुकीचे बोलू नये असे वाटतेय.”'
        }
      ],
      loopTitle: 'भांडण संपवण्याचा मार्ग',
      loopSubtitle: 'Reconcile कशी मदत करते',
      pillars: [
        { num: '01', title: 'शांत व्हा', desc: 'मनातले मोकळेपणाने आणि निवांतपणे सांगा.' },
        { num: '02', title: 'दोन्ही बाजू पहा', desc: 'समोरच्याने असे का केले असावे ते समजून घ्या.' },
        { num: '03', title: 'गैरसमज मिटवा', desc: 'गोड आणि समजूतदार शब्दांनी पुन्हा संवाद साधा.' }
      ]
    },
    demoSection: {
      eyebrow: 'खऱ्या गोष्टी',
      title: 'भांडणे कशी मिटली',
      subtitle: 'इतरांनी आपले गैरसमज कसे सोडवले ते पहा.',
      copyButton: 'मेसेज कॉपी करा',
      copiedText: 'कॉपी झाला!',
      tryLiveSession: 'हे उदाहरण पहा',
      privateThoughtsA: 'यांची बाजू',
      privateThoughtsB: 'त्यांची बाजू',
      feltBadge: 'काय वाटले',
      intentBadge: 'खरा हेतू',
      coreNeedLabel: 'गरज',
      theActualGap: 'कुठे गैरसमज झाला',
      commonGroundLabel: 'सहमती',
      readyToSendMessage: 'पाठवण्यासाठी गोड मेसेज',
      tabs: [
        {
          key: 'parent-kid',
          tag: 'कुटुंब',
          title: 'आई-वडील आणि मुलं',
          subtitle: 'अभ्यासावरून रोज होणारे वाद',
          personA: {
            name: 'माया',
            role: 'मुलगी',
            quote: '“आई रोज अभ्यासावरून विचारत राहते.”',
            coreNeed: 'विश्वास आणि थोडी मोकळीक'
          },
          personB: {
            name: 'आई',
            role: 'पालक',
            quote: '“तिच्या चांगल्या भविष्याची काळजी वाटते.”',
            coreNeed: 'सच्चे प्रेम'
          },
          reconcileAnalysis: {
            intent: 'आई काळजीपोटी विचारत होती.',
            impact: 'मुलीला वाटले की तिच्यावर विश्वास नाही.',
            commonGround: 'दोघांनाही घरात शांतता हवी आहे.',
            readyOpener:
              '“आई, मला माहित आहे तू काळजी करतेस. आपण दर रविवारी अभ्यासाबद्दल बोलूया म्हणजे रोज ताण येणार नाही.”'
          }
        }
      ]
    },
    outcomes: {
      badge: 'उत्तम परिणाम',
      title: 'भांडण न करता स्वतःचे म्हणणे मांडा.',
      subtitle: 'रागाचे रूपांतर शांततेत करण्याची सोपी पद्धत.',
      cards: [
        {
          number: '01',
          title: 'मनातले सगळे मोकळेपणाने सांगा.',
          eyebrow: 'सुरक्षित जागा',
          description: 'जे काही वाटत आहे, ते बिनधास्त सांगा. तुमचे शब्द इतर कोणालाही दिसत नाहीत.',
          rawLabel: 'काय वाटले:',
          rawText: '“मला खूप राग आला आहे!”',
          insightLabel: 'खरी गरज:',
          insightText: 'तुम्हाला आदर आणि प्रेम हवे आहे.'
        }
      ]
    },
    faq: {
      badge: 'प्रश्न-उत्तरे',
      title: 'नेहमी विचारले जाणारे प्रश्न.',
      subtitle: 'सोपी आणि थेट उत्तरे.',
      items: [
        {
          question: 'समोरच्या व्यक्तीला मी लिहिलेले वाचता येईल का?',
          answer:
            'अजिबात नाही! तुम्ही जे लिहिता ते पूर्णपणे खाजगी राहते. समोरच्या व्यक्तीला फक्त तेच शांत शब्द मिळतात जे तुम्ही पाठवायला तयार होता.'
        },
        {
          question: 'खाते किंवा पासवर्डची गरज आहे का?',
          answer: 'नाही, अजिबात नाही. लगेच बोलणे सुरू करा. हे पूर्णपणे मोफत आहे.'
        },
        {
          question: 'Reconcile कोणाची बाजू घेते का?',
          answer:
            'नाही, कधीच नाही! आम्ही कोणालाही चूक किंवा बरोबर ठरवत नाही. फक्त दोघांना एकमेकांची बाजू समजून सांगतो.'
        }
      ]
    },
    closingCta: {
      badge: 'शांततेचा मार्ग',
      title: 'गैरसमज मिटवण्यासाठी तयार आहात?',
      subtitle: 'फक्त दोन मिनिटे काढून खाजगीत आपले म्हणणे मांडा.',
      ctaPrimary: 'बोलणे सुरू करा',
      ctaSecondary: 'एक उदाहरण पहा',
      trustProof: '१००% मोफत • लॉगिनची गरज नाही • १००% खाजगी'
    },
    footer: {
      philosophy: '“समजून घेणे म्हणजे प्रत्येक गोष्टीशी सहमत असणे नव्हे.”',
      mission:
        'भांडण आणि गैरसमज शांततेने सोडवणारा एक प्रेमळ AI सोबती.',
      productTitle: 'वैशिष्ट्ये',
      privacyTitle: 'सुरक्षा',
      resourcesTitle: 'मदतीसाठी हेल्पलाइन',
      crisisIndiaTitle: '२४ तास हेल्पलाइन (भारत):',
      crisisDesc:
        'तुम्ही किंवा तुमच्या ओळखीची कोणतीही व्यक्ती खूप दुःखी, हताश किंवा संकटात असल्यास, या नंबरवर लगेच मदत घ्या:',
      teleManas: 'टेलि-मानस (भारत सरकार): 14416 (मोफत, २४/७)',
      aasra: 'आसरा हेल्पलाइन: +91 9820466726',
      vandrevala: 'वांद्रेवाला फाउंडेशन: +91 9999 666 555',
      emergency112: 'आपत्कालीन सेवा: 112',
      copyright: 'Reconcile AI. सर्व हक्क राखीव. शांततेने गैरसमज मिटवण्यासाठी सहाय्यक.',
      builtWithEmpathy: 'नात्यांमधील गोडवा टिकवण्यासाठी प्रेमाने विकसित.'
    }
  }
};

export function getLandingTranslations(lang: SupportedLanguage = 'en'): LandingTranslations {
  return LANDING_TRANSLATIONS[lang] || LANDING_TRANSLATIONS.en;
}
