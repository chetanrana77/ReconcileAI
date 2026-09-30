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
  en: {
    navbar: {
      howItWorks: 'How It Works',
      demonstration: 'Demonstration',
      outcomes: 'Outcomes',
      privacy: 'Privacy',
      faq: 'FAQ',
      about: 'About',
      tryReconcile: 'Try Reconcile',
      start: 'Start',
      tellMeWhatHappened: 'Tell Me What Happened'
    },
    hero: {
      eyebrow: 'Private AI for Hard Conversations',
      titleLine1: 'You know what you feel.',
      titleLine2: 'We help you say it right.',
      description:
        'When a conversation feels impossible, Reconcile listens to both sides privately, finds where intent and impact got crossed, and gives you the exact words to fix it.',
      ctaPrimary: 'Tell Me What Happened',
      ctaSecondary: 'See How It Works',
      trustProof: '100% private. No account required. Your raw words are never forwarded.',
      demoEyebrow: 'Interactive Demonstration',
      demoTitle: 'How Reconcile resolves a real misunderstanding:',
      feltLabel: 'Felt',
      intentLabel: 'Intent',
      neverSeenBy: 'Never seen by',
      privateIntake: 'Private Intake',
      theActualDisconnect: 'The Actual Disconnect',
      suggestedStarter: 'A better conversation to start with',
      tryThisLive: 'Try this live scenario',
      scenarios: [
        {
          id: 'parent-teen',
          demoKey: 'demo-parent-child',
          label: 'Parent & Teen',
          context: 'Daily arguments around study hours and independence',
          sideA: {
            name: 'Maya',
            role: 'Daughter, 19',
            rawText:
              '“Mom asks about my exams every single morning. I know she cares, but it makes me feel like she has zero faith in my ability to manage my life.”',
            felt: 'Scrutinized & distrusted'
          },
          sideB: {
            name: 'Elena',
            role: 'Mother',
            rawText:
              '“I gave up my career so she could have better opportunities. I ask because I worry constantly and don’t want her to struggle the way I did.”',
            intent: 'Deep love & fear of future regret'
          },
          bridge: {
            disconnect:
              'The intention was anxious protection; the emotional impact was feeling doubted.',
            suggestedMessage:
              '“Mom, I know you ask because my future matters to you. But when it’s every day, I feel doubted. Can we agree on a Sunday check-in instead?”'
          }
        },
        {
          id: 'friends-silence',
          demoKey: 'demo-friend-friend',
          label: 'Two Friends',
          context: 'Three days of silence after an emotional disagreement',
          sideA: {
            name: 'Sarah',
            role: 'Friend A',
            rawText:
              '“I opened up about something really vulnerable and she just went completely dark for three days. It feels like our friendship is one-sided.”',
            felt: 'Abandoned & unimportant'
          },
          sideB: {
            name: 'Chloe',
            role: 'Friend B',
            rawText:
              '“Work destroyed me this week and I broke down. I started drafting a reply twice, but I had zero emotional energy left to explain myself.”',
            intent: 'Coping with acute personal burnout'
          },
          bridge: {
            disconnect:
              'The intention was self-preservation during burnout; the emotional impact was felt as cold neglect.',
            suggestedMessage:
              '“Hey — zero pressure to reply right away. I know work has been overwhelming. Just wanted you to know I care about you whenever you’re ready.”'
          }
        }
      ]
    },
    problemStory: {
      badge: 'The Psychology of Conflict',
      headline: '“When you\'re hurt, every explanation sounds like an excuse.”',
      subtitle:
        'Most arguments between people who care about each other aren\'t caused by a lack of love. They are caused by a translation failure: what was intended is almost never what was received.',
      sectionTitle: 'Why conversations get stuck:',
      whatWasSaid: 'What was said:',
      whatWasHeard: 'What was heard:',
      whatWasMeant: 'What was actually meant:',
      disconnects: [
        {
          spoken: '“Can we talk about this tomorrow?”',
          perceived: '“You don’t care about what I’m feeling and want to brush this under the rug.”',
          intended: '“I’m overwhelmed right now and afraid of saying something I’ll regret.”'
        },
        {
          spoken: '“I just don’t want you to fall behind.”',
          perceived: '“I don’t believe in your intelligence or trust your judgment.”',
          intended: '“I love you and I’m terrified of seeing you struggle the way I did.”'
        },
        {
          spoken: '“Fine. Do whatever you want.”',
          perceived: '“You’ve given up on this relationship.”',
          intended: '“I feel completely powerless and hurt, and don’t know what else to say.”'
        }
      ],
      loopTitle: 'How Reconcile breaks the defensive loop',
      loopSubtitle:
        'When two people try to talk while defensive, their nervous systems are in fight-or-flight. Reconcile introduces a confidential mediator in the middle to restore emotional safety.',
      pillars: [
        {
          num: '01',
          title: 'Unfiltered Venting',
          desc: 'You can be angry, messy, and blunt. Your raw words remain strictly private with Reconcile.'
        },
        {
          num: '02',
          title: 'Neutral Translation',
          desc: 'Reconcile extracts the underlying vulnerability and core need, discarding the hostile accusations.'
        },
        {
          num: '03',
          title: 'Two-Sided Perspective',
          desc: 'The other person shares their side without fear of blame. Both sides are validated neutrally.'
        },
        {
          num: '04',
          title: 'Practical Next Words',
          desc: 'You receive de-escalating openers that invite connection without sacrificing your boundaries.'
        }
      ]
    },
    demoSection: {
      eyebrow: 'Interactive Product Demonstration',
      title: 'How two private perspectives become one understanding.',
      subtitle:
        'Explore real conflict scenarios below. Switch between archetypes to see how Reconcile identifies the disconnect and generates actionable resolution.',
      copyButton: 'Copy Message',
      copiedText: 'Copied!',
      tryLiveSession: 'Try this live session',
      privateThoughtsA: 'Private Intake',
      privateThoughtsB: 'Private Intake',
      feltBadge: 'Felt',
      intentBadge: 'Intent',
      coreNeedLabel: 'Core Need',
      theActualGap: 'The Actual Disconnect',
      commonGroundLabel: 'Common Ground',
      readyToSendMessage: 'Ready-to-send reconciliation message',
      tabs: [
        {
          key: 'demo-parent-child',
          tag: 'Flagship Scenario',
          title: 'Parent & Teen',
          subtitle: 'Studies, Independence & Fear of Failure',
          personA: {
            name: 'Maya',
            role: 'Daughter (19)',
            quote:
              '“They ask about my grades and exam prep every single day. I know they care, but it makes me feel like they have zero faith in my ability to handle my life.”',
            coreNeed: 'Needs autonomy, trust, and to feel respected as an adult.'
          },
          personB: {
            name: 'Elena',
            role: 'Mother',
            quote:
              '“I sacrificed so much for her opportunities. When I ask, it is because I worry constantly about her future. I don’t want her to struggle or face regret.”',
            coreNeed: 'Needs emotional reassurance that her child will be secure and happy.'
          },
          reconcileAnalysis: {
            intent: 'Love, protection, and anxiety for her child’s future well-being.',
            impact: 'Experienced as suffocating surveillance and a perceived lack of trust.',
            commonGround: 'Both deeply value Maya’s long-term success and emotional peace.',
            readyOpener:
              '“Mom, I know you ask because you care deeply about my future, but when it’s every day, I feel doubted. Can we agree on a Sunday check-in instead? That way I can update you with less stress.”'
          }
        },
        {
          key: 'demo-friend-friend',
          tag: 'Popular Scenario',
          title: 'Best Friends',
          subtitle: 'Unanswered Text & Disappearing After Vulnerability',
          personA: {
            name: 'Sarah',
            role: 'Friend A',
            quote:
              '“I opened up about something really heavy that happened, and she just disappeared for three days. It feels like our friendship is completely one-sided.”',
            coreNeed: 'Needs reciprocity, validation, and emotional reliability.'
          },
          personB: {
            name: 'Chloe',
            role: 'Friend B',
            quote:
              '“Work destroyed me this week and I had an emotional breakdown. I started typing a reply twice, but I didn’t have the mental capacity to give her the care she deserved.”',
            coreNeed: 'Needs space to recover from acute exhaustion without guilt.'
          },
          reconcileAnalysis: {
            intent: 'Protecting the friendship by waiting until she had the capacity to respond properly.',
            impact: 'The silence was experienced as emotional abandonment and cold neglect.',
            commonGround: 'Both cherish the intimacy of the friendship and want to support each other.',
            readyOpener:
              '“Hey — zero pressure to reply right away! I know life can be overwhelming. I just wanted to make sure you’re okay whenever you have the energy to talk.”'
          }
        },
        {
          key: 'demo-sibling-sibling',
          tag: 'Family Scenario',
          title: 'Siblings',
          subtitle: 'Borrowing Belongings & Disrespected Boundaries',
          personA: {
            name: 'Riley',
            role: 'Older Sibling',
            quote:
              '“My brother keeps taking my headphones and jackets without asking. I don’t mind sharing, but it feels like my personal boundaries don’t exist in this house.”',
            coreNeed: 'Needs basic courtesy, respect for personal space, and consent.'
          },
          personB: {
            name: 'Casey',
            role: 'Younger Sibling',
            quote:
              '“We live in the same house and we’re close. I always put it back. When they get furious over a borrowed hoodie, it feels like they treat me like an enemy.”',
            coreNeed: 'Needs familial warmth, informality, and to feel close rather than judged.'
          },
          reconcileAnalysis: {
            intent: 'Comfortable family informality and casual closeness.',
            impact: 'Experienced as entitled intrusion and disregard for personal space.',
            commonGround: 'Both value their closeness and living peacefully under the same roof.',
            readyOpener:
              '“I’m happy to share my stuff with you, but when it’s taken without asking, I feel disrespected. Just shoot me a quick text before grabbing it and it’s all good.”'
          }
        }
      ]
    },
    howItWorks: {
      badge: 'How Reconcile Mediates',
      title: 'From defensive silence to a conversation that works.',
      subtitle:
        'Four thoughtful steps designed to protect your emotional safety and restore genuine connection.',
      steps: [
        {
          number: '01',
          title: 'You talk. We listen.',
          description:
            'Tell Reconcile what happened in your own words. Be as messy, angry, or blunt as you need to be. This intake is strictly confidential — nobody else will ever read this raw text.',
          tag: '100% Confidential',
          microExample: '“I felt like they didn’t care at all and completely ignored me.”'
        },
        {
          number: '02',
          title: 'We find what you actually mean.',
          description:
            'Underneath reactive anger is almost always an unspoken vulnerability: the need to be trusted, respected, or heard. Reconcile untangles your true intent from the frustration.',
          tag: 'Emotional Intelligence',
          microExample: 'Identified Core Need: Desires recognition and emotional safety.'
        },
        {
          number: '03',
          title: 'We invite the other side.',
          description:
            'We send a neutral, respectful invitation to the other person. No accusations, no guilt trips, and zero forwarded messages. They are invited to share their side in confidence too.',
          tag: 'Zero Hostility Forwarding',
          microExample: 'Neutral Invitation: “Reconcile noticed a communication gap. We’d love to hear your perspective.”'
        },
        {
          number: '04',
          title: 'Both sides finally make sense.',
          description:
            'Once both perspectives are heard, Reconcile reveals the Mediation Bridge: the exact gap between what was intended and what was felt, and gives both of you language to heal the rift.',
          tag: 'The Resolution Bridge',
          microExample: 'Ready to Send: De-escalating conversation starter crafted for connection.'
        }
      ]
    },
    outcomes: {
      badge: 'Measurable Outcomes',
      title: 'Communication clarity without emotional risk.',
      subtitle:
        'How Reconcile converts destructive defensive loops into constructive dialogue.',
      cards: [
        {
          number: '01',
          title: 'Say it ugly. We clean it up.',
          eyebrow: 'Unfiltered Emotional Intake',
          description:
            'When you’re angry or heartbroken, holding your tongue is impossible. Reconcile gives you a confidential container to vent everything without regret. We extract what you really mean and ensure your raw words never reach the other person.',
          rawLabel: 'Your raw intake (Private):',
          rawText: '“I’m sick of them ignoring my texts. It proves they don’t give a damn about me.”',
          insightLabel: 'What Reconcile identifies:',
          insightText: 'Core Need: Desires emotional reliability and to feel valued in the relationship.'
        },
        {
          number: '02',
          title: 'See what they may have meant.',
          eyebrow: 'Perspective Without Excuses',
          description:
            'Step out of defensive tunnel vision. Reconcile helps you understand the other person’s pressures, fears, or awkwardness — without excusing neglect or invalidating your genuine pain.',
          rawLabel: 'Their likely situation:',
          rawText: 'They care deeply, but felt paralyzed by stress or fear of escalation.',
          insightLabel: 'Perspective Shift:',
          insightText: 'Their silence was a symptom of overwhelm, not malice or apathy.'
        },
        {
          number: '03',
          title: 'A message that opens doors, not walls.',
          eyebrow: 'De-escalating Dialogue',
          description:
            'Most texts sent in anger trigger instant defensiveness. Reconcile crafts a ready-to-send opener that names your hurt clearly without attacking the other person’s character.',
          rawLabel: 'Reactive impulse:',
          rawText: '“Fine, ignore me then. Don’t bother reaching out ever again.”',
          insightLabel: 'Reconcile recommendation:',
          insightText: '“Hey, things feel awkward between us and I miss talking to you. When you’re free this week, can we chat for 5 minutes?”'
        },
        {
          number: '04',
          title: 'Shared clarity without mutual blame.',
          eyebrow: 'The Joint Mediation Bridge',
          description:
            'When both participants join, Reconcile maps where the wires got crossed, highlights shared values, and produces a mutually agreed next step.',
          rawLabel: 'The Disconnect:',
          rawText: 'Maya felt micro-managed; Elena felt terrified for Maya’s future.',
          insightLabel: 'Shared Agreement:',
          insightText: 'Scheduled weekly check-in instead of daily surprise interrogations.'
        }
      ]
    },
    privacy: {
      badge: 'Cryptographic Privacy Boundaries',
      title: 'Your raw words stay private.',
      subtitle:
        'Confidentiality is not an option in Reconcile. It is the architectural boundary that makes honesty possible. You can say what you really feel without fear of making things worse.',
      pillars: [
        {
          title: 'Person A cannot see Person B’s conversation',
          description:
            'Person A’s intake channel is strictly isolated from Person B. Even after mediation is generated, Person B cannot read what Person A wrote during their private session.'
        },
        {
          title: 'Person B cannot see Person A’s conversation',
          description:
            'Person B’s intake channel is completely confidential. Raw emotional venting, accusations, or insecurities remain locked to their individual view.'
        },
        {
          title: 'Raw emotional venting is never forwarded',
          description:
            'Reconcile is not a messaging app that blindly sends messages across. The only text both people see is the neutral, consented Mediation Bridge.'
        },
        {
          title: 'Private data is used only for mediation',
          description:
            'Your conversations are used solely to generate mutual understanding for your active session. We do not sell user data or train public commercial models on your private relationships.'
        }
      ]
    },
    faq: {
      badge: 'Questions & Answers',
      title: 'Frequently asked questions.',
      subtitle: 'Everything you need to know about Reconcile and how your confidentiality is preserved.',
      items: [
        {
          question: 'Will the other person know I used Reconcile?',
          answer:
            'Yes, transparency is essential for rebuilding trust. When you choose to invite the other person, Reconcile sends a calm, neutral invitation introducing itself as an AI communication mediator that helps both people understand each other without arguments. Nothing is done behind their back.'
        },
        {
          question: 'What if the other person refuses to participate?',
          answer:
            'Even if the other person chooses not to join, Reconcile is deeply useful. Your private intake helps you untangle your own feelings, explore their likely pressures and intentions, and gives you a ready-to-send message you can text them directly on your own terms.'
        },
        {
          question: 'Can the other person read what I typed during my private intake?',
          answer:
            'Never. Reconcile strictly isolates private intake channels. The only content both participants ever see is the neutral Mediation Bridge, which contains agreed-upon common ground and de-escalating language.'
        },
        {
          question: 'Is Reconcile a replacement for therapy or counseling?',
          answer:
            'No. Reconcile is a focused communication tool for everyday misunderstandings between people who care about each other. It is not psychotherapy, medical care, or crisis intervention. If a conversation involves domestic violence, self-harm, or abuse, our safety protocol immediately redirects to certified crisis resources.'
        },
        {
          question: 'How does Reconcile make sure it doesn’t take sides?',
          answer:
            'Reconcile is engineered with strict neutrality rules: validate emotions, but never validate hostile assumptions; avoid blaming or labeling either person as “toxic”; separate intent from impact; and always seek constructive common ground.'
        },
        {
          question: 'Do I need to create an account or pay?',
          answer:
            'No account or password is required. You can start a conversation immediately. Reconcile is currently free to use with no paywalls or advertising.'
        }
      ]
    },
    closingCta: {
      badge: 'Confidential Mediation',
      title: 'Ready to have a better conversation?',
      subtitle:
        'You don’t have to stay stuck in silence or repeat the same argument. Take two minutes to explain what happened in private.',
      ctaPrimary: 'Tell Me What Happened',
      ctaSecondary: 'Explore an Example First',
      trustProof: 'Free to use • No login or password • Your words stay strictly private'
    },
    footer: {
      philosophy: '“Understanding someone doesn’t mean agreeing with them.”',
      mission:
        'An empathetic AI communication mediator built to help people navigate misunderstandings privately without taking sides.',
      productTitle: 'Product',
      privacyTitle: 'Confidentiality',
      resourcesTitle: 'India Support Helplines',
      crisisIndiaTitle: '24/7 Mental Health Helplines (India):',
      crisisDesc:
        'If you or someone you know is in immediate distress or facing a crisis, professional confidential help is available 24/7 across India:',
      teleManas: 'Tele-MANAS (Govt. of India): 14416 (Toll-Free, 24/7)',
      aasra: 'AASRA Crisis Support: +91 9820466726 (24/7)',
      vandrevala: 'Vandrevala Foundation: +91 9999 666 555',
      emergency112: 'India National Emergency: 112',
      copyright: 'Reconcile AI. All rights reserved. Private, confidential conflict resolution.',
      builtWithEmpathy: 'Built with empathy for honest human connections.'
    }
  },

  hi: {
    navbar: {
      howItWorks: 'कार्यप्रणाली',
      demonstration: 'डेमो / उदाहरण',
      outcomes: 'परिणाम',
      privacy: 'गोपनीयता',
      faq: 'सामान्य प्रश्न',
      about: 'परिचय',
      tryReconcile: 'Reconcile आज़माएं',
      start: 'शुरू करें',
      tellMeWhatHappened: 'बताइए क्या हुआ'
    },
    hero: {
      eyebrow: 'कठिन बातचीत के लिए निजी AI मध्यस्थ',
      titleLine1: 'आप जानते हैं कि आप क्या महसूस कर रहे हैं।',
      titleLine2: 'हम इसे सही तरीके से कहने में मदद करते हैं।',
      description:
        'जब आमने-सामने बातचीत नामुमकिन लगे, Reconcile दोनों पक्षों को गोपनीय तरीके से सुनता है, समझता है कि इरादे और असर में कहाँ दूरी आई, और शांति बहाल करने के लिए सटीक शब्द देता है।',
      ctaPrimary: 'बताइए क्या हुआ',
      ctaSecondary: 'देखें यह कैसे काम करता है',
      trustProof: '100% गोपनीय। किसी खाते की आवश्यकता नहीं। आपके शब्द कभी सीधे आगे नहीं भेजे जाते।',
      demoEyebrow: 'इंटरैक्टिव प्रदर्शन',
      demoTitle: 'Reconcile कैसे एक वास्तविक ग़लतफ़हमी को सुलझाता है:',
      feltLabel: 'महसूस हुआ',
      intentLabel: 'असली इरादा',
      neverSeenBy: 'इन्होंने कभी नहीं देखा',
      privateIntake: 'गोपनीय संवाद',
      theActualDisconnect: 'असल में ग़लतफ़हमी कहाँ हुई',
      suggestedStarter: 'बातचीत शुरू करने के लिए सही शब्द',
      tryThisLive: 'इस स्थिति को लाइव आज़माएं',
      scenarios: [
        {
          id: 'parent-teen',
          demoKey: 'demo-parent-child',
          label: 'माता-पिता और किशोर',
          context: 'पढ़ाई के घंटों और आज़ादी को लेकर रोज़ाना बहस',
          sideA: {
            name: 'माया',
            role: 'बेटी, 19 वर्ष',
            rawText:
              '“मम्मी रोज़ सुबह मेरी परीक्षाओं और पढ़ाई के बारे में पूछती हैं। मुझे पता है वो परवाह करती हैं, लेकिन ऐसा लगता है कि उन्हें मुझ पर ज़रा भी भरोसा नहीं है।”',
            felt: 'सख्त निगरानी और अविश्वास महसूस हुआ'
          },
          sideB: {
            name: 'एलेना',
            role: 'माँ',
            rawText:
              '“मैंने उसके अच्छे भविष्य के लिए अपना करियर तक छोड़ दिया। मैं इसलिए पूछती हूँ क्योंकि मुझे उसकी चिंता रहती है और मैं नहीं चाहती कि वो मेरी तरह संघर्ष करे।”',
            intent: 'गहरा प्रेम और भविष्य के संघर्ष का डर'
          },
          bridge: {
            disconnect:
              'माँ का इरादा चिंता भरी सुरक्षा था; लेकिन बेटी पर असर यह हुआ कि उसे लगा उस पर भरोसा नहीं किया जा रहा।',
            suggestedMessage:
              '“मम्मी, मैं जानती हूँ आप मेरी चिंता करती हैं। लेकिन रोज़-रोज़ पूछने से मुझे लगता है आपको मुझ पर भरोसा नहीं है। क्या हम रविवार को एक तय समय पर इस बारे में बात कर सकते हैं?”'
          }
        },
        {
          id: 'friends-silence',
          demoKey: 'demo-friend-friend',
          label: 'दो पक्के दोस्त',
          context: 'एक भावनात्मक बहस के बाद तीन दिनों की चुप्पी',
          sideA: {
            name: 'सारा',
            role: 'दोस्त A',
            rawText:
              '“मैंने अपनी एक बहुत निजी और संवेदनशील बात साझा की और उसने तीन दिन तक कोई जवाब नहीं दिया। मुझे लगा कि यह दोस्ती सिर्फ मेरी तरफ से है।”',
            felt: 'उपेक्षित और अकेलापन महसूस हुआ'
          },
          sideB: {
            name: 'क्लोई',
            role: 'दोस्त B',
            rawText:
              '“ऑफिस के तनाव ने मुझे इस हफ़्ते पूरी तरह तोड़ दिया था। मैंने दो बार जवाब लिखने की कोशिश की, लेकिन मुझमें बात करने की ज़रा भी ऊर्जा नहीं बची थी।”',
            intent: 'गंभीर व्यक्तिगत तनाव और थकान से जूझना'
          },
          bridge: {
            disconnect:
              'इरादा खुद को मानसिक थकान से बचाना था; लेकिन चुप्पी का असर उपेक्षा और बेरुखी के रूप में महसूस हुआ।',
            suggestedMessage:
              '“नमस्ते — तुरंत जवाब देने का कोई दबाव नहीं है। मुझे पता है काम का बहुत तनाव था। बस यह बताना था कि जब भी तुम सहज महसूस करो, मैं बात करने के लिए यहाँ हूँ।”'
          }
        }
      ]
    },
    problemStory: {
      badge: 'टकराव का मनोविज्ञान',
      headline: '“जब दिल दुखा हो, तो हर स्पष्टीकरण एक बहाना लगता है।”',
      subtitle:
        'आपस में प्यार करने वाले लोगों के बीच झगड़े प्यार की कमी से नहीं होते। वे संवाद की विफलता से होते हैं: जो कहा गया और जो समझा गया, उसमें हमेशा अंतर रह जाता है।',
      sectionTitle: 'बातचीत क्यों अटक जाती है:',
      whatWasSaid: 'क्या कहा गया था:',
      whatWasHeard: 'क्या सुना गया:',
      whatWasMeant: 'असली मतलब क्या था:',
      disconnects: [
        {
          spoken: '“क्या हम इस बारे में कल बात कर सकते हैं?”',
          perceived: '“तुम्हें मेरी भावनाओं की कोई परवाह नहीं है और तुम बात को टालना चाहते हो।”',
          intended: '“मैं इस समय बहुत तनाव में हूँ और डर है कि गुस्से में कुछ गलत न कह दूँ।”'
        },
        {
          spoken: '“मैं बस नहीं चाहता कि तुम पीछे रह जाओ।”',
          perceived: '“मुझे तुम्हारी समझदारी या काबिलियत पर कोई भरोसा नहीं है।”',
          intended: '“मैं तुमसे प्यार करता हूँ और तुम्हें मेरी तरह ठोकरें खाते नहीं देख सकता।”'
        },
        {
          spoken: '“ठीक है। जो मन करे वही करो।”',
          perceived: '“तुमने इस रिश्ते की उम्मीद छोड़ दी है।”',
          intended: '“मैं बहुत लाचार और आहत महसूस कर रहा हूँ, और समझ नहीं आ रहा क्या कहूँ।”'
        }
      ],
      loopTitle: 'Reconcile रक्षात्मक चक्र को कैसे तोड़ता है',
      loopSubtitle:
        'जब दो लोग गुस्से में बात करते हैं, तो उनका दिमाग सिर्फ खुद का बचाव करता है। Reconcile बीच में एक गोपनीय मध्यस्थ बनकर भावनात्मक सुरक्षा लौटाता है।',
      pillars: [
        {
          num: '01',
          title: 'बिना किसी संकोच के बात कहें',
          desc: 'आप गुस्सा निकाल सकते हैं, अपनी उलझन बयां कर सकते हैं। आपके शब्द केवल Reconcile के पास गोपनीय रहते हैं।'
        },
        {
          num: '02',
          title: 'शांत और सटीक अनुवाद',
          desc: 'Reconcile कड़वाहट और आरोपों को हटाकर आपकी असली भावना और ज़रूरत को पहचानता है।'
        },
        {
          num: '03',
          title: 'दोनों पक्षों का सम्मान',
          desc: 'दूसरा व्यक्ति भी बिना किसी डर या इल्ज़ाम के अपनी बात रखता है। दोनों पक्षों को निष्पक्षता से सुना जाता है।'
        },
        {
          num: '04',
          title: 'बातचीत के लिए सही शब्द',
          desc: 'आपको ऐसे वाक्य मिलते हैं जो बिना आत्मसम्मान गिराए, शांति से बातचीत का रास्ता खोलते हैं।'
        }
      ]
    },
    demoSection: {
      eyebrow: 'उत्पाद का इंटरैक्टिव प्रदर्शन',
      title: 'कैसे दो अलग-अलग नज़रिए एक साझी समझ बन जाते हैं।',
      subtitle:
        'नीचे दिए गए वास्तविक स्थितियों को देखें। समझें कि कैसे Reconcile ग़लतफ़हमी को पहचानता है और समाधान का रास्ता तैयार करता है।',
      copyButton: 'संदेश कॉपी करें',
      copiedText: 'कॉपी हो गया!',
      tryLiveSession: 'इस सत्र को लाइव आज़माएं',
      privateThoughtsA: 'गोपनीय संवाद',
      privateThoughtsB: 'गोपनीय संवाद',
      feltBadge: 'महसूस हुआ',
      intentBadge: 'असली इरादा',
      coreNeedLabel: 'मूल आवश्यकता',
      theActualGap: 'असल में ग़लतफ़हमी कहाँ हुई',
      commonGroundLabel: 'साझा सहमति',
      readyToSendMessage: 'शांतिपूर्ण सुलह का तैयार संदेश',
      tabs: [
        {
          key: 'demo-parent-child',
          tag: 'प्रमुख परिदृश्य',
          title: 'माता-पिता और किशोर',
          subtitle: 'पढ़ाई, आज़ादी और असफलता का डर',
          personA: {
            name: 'माया',
            role: 'बेटी (19 वर्ष)',
            quote:
              '“वे हर रोज़ मेरे अंकों और परीक्षा की तैयारी को लेकर सवाल पूछते हैं। मुझे पता है वो परवाह करते हैं, लेकिन ऐसा लगता है कि उन्हें मुझ पर ज़रा भी भरोसा नहीं है।”',
            coreNeed: 'आज़ादी, भरोसा और एक वयस्क के रूप में सम्मान की ज़रूरत।'
          },
          personB: {
            name: 'एलेना',
            role: 'माँ',
            quote:
              '“मैंने उसके अवसरों के लिए बहुत त्याग किया है। जब मैं पूछती हूँ तो इसलिए क्योंकि मुझे उसके भविष्य की चिंता रहती है। मैं नहीं चाहती कि उसे पछतावा हो।”',
            coreNeed: 'इस बात का भावनात्मक आश्वासन कि उसकी संतान सुरक्षित और खुश रहेगी।'
          },
          reconcileAnalysis: {
            intent: 'गहरा प्रेम, सुरक्षा और संतान के भविष्य को लेकर चिंता।',
            impact: 'दमघोंटू निगरानी और अविश्वास के रूप में महसूस होना।',
            commonGround: 'दोनों ही माया की दीर्घकालिक सफलता और मानसिक शांति चाहते हैं।',
            readyOpener:
              '“मम्मी, मैं जानती हूँ आप मेरी भलाई के लिए पूछती हैं। लेकिन रोज़ पूछने से मुझे लगता है आपको मुझ पर भरोसा नहीं है। क्या हम रविवार को एक समय तय कर सकते हैं जब मैं बिना तनाव के आपको अपडेट दे सकूँ?”'
          }
        },
        {
          key: 'demo-friend-friend',
          tag: 'लोकप्रिय परिदृश्य',
          title: 'पक्के दोस्त',
          subtitle: 'मैसेज का जवाब न आना और अचानक दूरी',
          personA: {
            name: 'सारा',
            role: 'दोस्त A',
            quote:
              '“मैंने अपने जीवन की एक गंभीर परेशानी साझा की और उसने तीन दिन तक कोई जवाब नहीं दिया। मुझे लगा कि यह दोस्ती सिर्फ मेरी तरफ से चल रही है।”',
            coreNeed: 'पारस्परिकता, भावनात्मक सहारा और दोस्ती में निरंतरता।'
          },
          personB: {
            name: 'क्लोई',
            role: 'दोस्त B',
            quote:
              '“इस हफ़्ते काम के तनाव ने मेरी हालत खराब कर दी थी। मैंने दो बार जवाब लिखना शुरू किया, लेकिन मुझमें ठीक से बात करने की मानसिक ऊर्जा ही नहीं थी।”',
            coreNeed: 'बिना अपराधबोध के अत्यधिक थकान से उबरने के लिए थोड़ा समय।'
          },
          reconcileAnalysis: {
            intent: 'दोस्ती की कद्र करते हुए तब तक रुकना जब तक कि सही से बात करने की स्थिति न हो।',
            impact: 'चुप्पी को भावनात्मक उपेक्षा और बेरुखी के रूप में महसूस किया गया।',
            commonGround: 'दोनों एक-दूसरे की दोस्ती की कद्र करते हैं और एक-दूसरे का साथ चाहते हैं।',
            readyOpener:
              '“नमस्ते — तुरंत जवाब देने की कोई जल्दी नहीं है! मुझे पता है जीवन में बहुत उलझनें हो सकती हैं। बस यह पूछना था कि तुम ठीक हो ना? जब भी ऊर्जा हो, बात करना।”'
          }
        },
        {
          key: 'demo-sibling-sibling',
          tag: 'पारिवारिक परिदृश्य',
          title: 'भाई और बहन',
          subtitle: 'बिना पूछे सामान लेना और सीमाओं का आदर न करना',
          personA: {
            name: 'रिली',
            role: 'बड़ा भाई / बहन',
            quote:
              '“मेरा भाई बिना पूछे मेरे हेडफ़ोन और कपड़े ले लेता है। मुझे बाँटने में कोई ऐतराज़ नहीं है, लेकिन ऐसा लगता है जैसे इस घर में मेरी कोई निजता ही नहीं है।”',
            coreNeed: 'बुनियादी शिष्टाचार, व्यक्तिगत स्थान का आदर और सहमति।'
          },
          personB: {
            name: 'केसी',
            role: 'छोटा भाई / बहन',
            quote:
              '“हम एक ही घर में रहते हैं और बहुत करीब हैं। मैं हमेशा चीज़ वापस रख देता हूँ। जब वो एक हुडी के लिए इतना गुस्सा करते हैं, तो लगता है जैसे मुझे पराया समझ रहे हों।”',
            coreNeed: 'पारिवारिक अपनापन, बेतकल्लुफ़ी और बिना डांट-फटकार के नज़दीकी।'
          },
          reconcileAnalysis: {
            intent: 'पारिवारिक सहजता और सहज नज़दीकी।',
            impact: 'अधिकार जताने और व्यक्तिगत सीमाओं के अनादर के रूप में महसूस होना।',
            commonGround: 'दोनों अपनी नज़दीकी और एक ही छत के नीचे शांति से रहना चाहते हैं।',
            readyOpener:
              '“मुझे अपनी चीज़ें तुम्हारे साथ साझा करने में खुशी है, लेकिन बिना पूछे लेने से मुझे बुरा लगता है। बस लेने से पहले एक छोटा-सा मैसेज भेज दिया करो, फिर कोई परेशानी नहीं होगी।”'
          }
        }
      ]
    },
    howItWorks: {
      badge: 'Reconcile की कार्यप्रणाली',
      title: 'बचावात्मक चुप्पी से एक सार्थक बातचीत तक।',
      subtitle:
        'आपकी भावनात्मक सुरक्षा की रक्षा करने और सच्चे जुड़ाव को बहाल करने के लिए चार विचारशील कदम।',
      steps: [
        {
          number: '01',
          title: 'आप बोलिए, हम सुनेंगे।',
          description:
            'Reconcile को अपने शब्दों में बताइए कि क्या हुआ। जितना चाहें गुस्सा या उलझन व्यक्त करें। यह बातचीत पूरी तरह गोपनीय है — कोई अन्य व्यक्ति इसे कभी नहीं पढ़ पाएगा।',
          tag: '100% गोपनीय',
          microExample: '“मुझे लगा कि उन्हें मेरी कोई परवाह नहीं है और उन्होंने मुझे पूरी तरह नज़रअंदाज़ कर दिया।”'
        },
        {
          number: '02',
          title: 'हम आपका असली मतलब समझते हैं।',
          description:
            'गुस्से के नीचे अक्सर एक अनकही भावना छिपी होती है: विश्वास, आदर या सुने जाने की ज़रूरत। Reconcile कड़वाहट से आपके वास्तविक इरादे को अलग करता है।',
          tag: 'भावनात्मक बुद्धिमत्ता',
          microExample: 'पहचानी गई आवश्यकता: भावनात्मक सुरक्षा और सम्मान की इच्छा।'
        },
        {
          number: '03',
          title: 'हम दूसरे पक्ष को आमंत्रित करते हैं।',
          description:
            'हम दूसरे व्यक्ति को एक शांतिपूर्ण, सम्मानजनक निमंत्रण भेजते हैं। कोई इल्ज़ाम नहीं, कोई ताने नहीं, और कोई पुराना मैसेज फॉरवर्ड नहीं किया जाता। वे भी पूरी गोपनीयता में अपनी बात रखते हैं।',
          tag: 'शून्य कड़वाहट',
          microExample: 'शांतिपूर्ण निमंत्रण: “Reconcile ने बातचीत में दूरी देखी है। हम आपका नज़रिया भी सुनना चाहते हैं।”'
        },
        {
          number: '04',
          title: 'दोनों पक्षों की बात समझ में आ जाती है।',
          description:
            'जब दोनों पक्ष अपनी बात कह लेते हैं, तो Reconcile मध्यस्थता सेतु दिखाता है: जहाँ इरादे और असर में फर्क आया, और दोनों को रिश्ते सुधारने के लिए सही शब्द देता है।',
          tag: 'समाधान सेतु',
          microExample: 'भेजने के लिए तैयार: तनाव घटाने वाला और जुड़ाव बनाने वाला संवाद।'
        }
      ]
    },
    outcomes: {
      badge: 'वास्तविक परिणाम',
      title: 'बिना किसी भावनात्मक जोखिम के स्पष्ट संवाद।',
      subtitle:
        'Reconcile कैसे विनाशकारी बहस को एक सार्थक और रचनात्मक बातचीत में बदलता है।',
      cards: [
        {
          number: '01',
          title: 'जैसा महसूस हो वैसा कहिए। हम उसे संवार देंगे।',
          eyebrow: 'बिना फ़िल्टर की भावनात्मक अभिव्यक्ति',
          description:
            'जब आप दुखी या गुस्से में होते हैं, तो शांत रहना मुश्किल होता है। Reconcile आपको बिना किसी पछतावे के अपना दिल हल्का करने की जगह देता है। आपके कच्चे शब्द कभी दूसरे व्यक्ति तक नहीं पहुँचते।',
          rawLabel: 'आपकी निजी अभिव्यक्ति (गोपनीय):',
          rawText: '“मैं उनके मुझे नज़रअंदाज़ करने से तंग आ गया हूँ। इससे साबित होता है कि उन्हें मेरी ज़रा भी परवाह नहीं है।”',
          insightLabel: 'Reconcile क्या पहचानता है:',
          insightText: 'मूल आवश्यकता: रिश्ते में भावनात्मक भरोसा और खुद को मूल्यवान महसूस करने की इच्छा।'
        },
        {
          number: '02',
          title: 'जानिए कि उनका असली इरादा क्या रहा होगा।',
          eyebrow: 'बिना बहानेबाजी के दूसरा नज़रिया',
          description:
            'बचाव की संकीर्ण सोच से बाहर निकलिए। Reconcile आपको दूसरे व्यक्ति के दबाव, डर या झिझक को समझने में मदद करता है — बिना उनके गलत व्यवहार को सही ठहराए या आपकी पीड़ा को कम आंके।',
          rawLabel: 'उनकी संभावित स्थिति:',
          rawText: 'वे दिल से परवाह करते हैं, लेकिन अत्यधिक तनाव या झगड़े के डर से चुप हो गए थे।',
          insightLabel: 'नज़रिए का बदलाव:',
          insightText: 'उनकी चुप्पी तनाव और उलझन का संकेत थी, किसी दुर्भावना या बेरुखी का नहीं।'
        },
        {
          number: '03',
          title: 'ऐसा संदेश जो दीवारें नहीं, दरवाजे खोले।',
          eyebrow: 'तनाव कम करने वाला संवाद',
          description:
            'गुस्से में भेजे गए मैसेज तुरंत दूसरे व्यक्ति को रक्षात्मक बना देते हैं। Reconcile एक ऐसा संदेश तैयार करता है जो बिना चरित्र पर उंगली उठाए आपकी तकलीफ़ को स्पष्ट करता है।',
          rawLabel: 'गुस्से की स्वाभाविक प्रतिक्रिया:',
          rawText: '“ठीक है, मत करो बात। आगे से कभी मुझे फोन भी मत करना।”',
          insightLabel: 'Reconcile की सलाह:',
          insightText: '“सुनो, हमारे बीच अजीब-सा खिंचाव है और मुझे तुमसे बात करना याद आ रहा है। इस हफ़्ते जब भी फुरसत हो, क्या 5 मिनट बात कर सकते हैं?”'
        },
        {
          number: '04',
          title: 'बिना किसी पर इल्ज़ाम लगाए साझी स्पष्टता।',
          eyebrow: 'साझा मध्यस्थता सेतु',
          description:
            'जब दोनों पक्ष शामिल होते हैं, तो Reconcile दिखाता है कि बात कहाँ उलझी, साझा मूल्यों को रेखांकित करता है, और आगे बढ़ने के लिए एक स्वीकार्य कदम सुझाता है।',
          rawLabel: 'ग़लतफ़हमी:',
          rawText: 'माया को लगा उस पर नज़र रखी जा रही है; माँ को माया के भविष्य की चिंता सता रही थी।',
          insightLabel: 'साझा सहमति:',
          insightText: 'रोज़ाना पूछताछ के बदले हफ़्ते में एक बार रविवार को आराम से बात करने का समझौता।'
        }
      ]
    },
    privacy: {
      badge: 'कठोर गोपनीयता सुरक्षा',
      title: 'आपके शब्द हमेशा पूरी तरह निजी रहते हैं।',
      subtitle:
        'गोपनीयता Reconcile में कोई विकल्प नहीं है। यह वह नींव है जो सच्ची ईमानदारी को संभव बनाती है। आप स्थिति खराब होने के डर के बिना अपनी बात कह सकते हैं।',
      pillars: [
        {
          title: 'व्यक्ति A, व्यक्ति B की बातचीत नहीं देख सकता',
          description:
            'व्यक्ति A का चैनल पूरी तरह अलग रखा जाता है। मध्यस्थता बनने के बाद भी, व्यक्ति B यह नहीं पढ़ सकता कि व्यक्ति A ने अपने निजी सत्र में क्या लिखा था।'
        },
        {
          title: 'व्यक्ति B, व्यक्ति A की बातचीत नहीं देख सकता',
          description:
            'व्यक्ति B का चैनल भी पूरी तरह गोपनीय रहता है। उनके कच्चे विचार, भावनाएं या शिकायतें सिर्फ उन्हीं के पास सुरक्षित रहती हैं।'
        },
        {
          title: 'गुस्से भरे कच्चे संदेश कभी आगे नहीं भेजे जाते',
          description:
            'Reconcile कोई साधारण चैट ऐप नहीं है जो आपके मैसेज सीधे फॉरवर्ड कर दे। दोनों लोग सिर्फ वही देखते हैं जो तटस्थ और स्वीकृत मध्यस्थता सेतु है।'
        },
        {
          title: 'डेटा केवल आपके समाधान के लिए उपयोग होता है',
          description:
            'आपकी बातचीत का उपयोग केवल आपके सत्र में आपसी समझ बनाने के लिए किया जाता है। हम आपका डेटा कभी किसी को नहीं बेचते और न ही सार्वजनिक मॉडल ट्रेन करते हैं।'
        }
      ]
    },
    faq: {
      badge: 'सवाल और जवाब',
      title: 'अक्सर पूछे जाने वाले सवाल।',
      subtitle: 'Reconcile और आपकी गोपनीयता सुरक्षा से जुड़ी सभी महत्वपूर्ण जानकारियाँ।',
      items: [
        {
          question: 'क्या दूसरे व्यक्ति को पता चलेगा कि मैंने Reconcile का उपयोग किया है?',
          answer:
            'हाँ, विश्वास की बहाली के लिए पारदर्शिता ज़रूरी है। जब आप दूसरे व्यक्ति को आमंत्रित करते हैं, तो Reconcile एक शांत, निष्पक्ष निमंत्रण भेजता है और बताता है कि वह एक AI संचार मध्यस्थ है जो बिना किसी झगड़े के दोनों को समझने में मदद करता है। पीठ पीछे कुछ नहीं होता।'
        },
        {
          question: 'अगर दूसरा व्यक्ति शामिल होने से मना कर दे तो?',
          answer:
            'अगर दूसरा व्यक्ति शामिल नहीं भी होता, तब भी Reconcile बहुत मददगार है। आपका निजी सत्र आपको अपनी भावनाओं को सुलझाने, उनके संभावित दबावों को समझने और उन्हें सीधे भेजने के लिए एक बेहतरीन संदेश तैयार करने में मदद करता है।'
        },
        {
          question: 'क्या दूसरा व्यक्ति मेरे द्वारा लिखे गए निजी शब्द पढ़ सकता है?',
          answer:
            'कभी नहीं। Reconcile दोनों व्यक्तियों के निजी चैनलों को पूरी तरह अलग रखता है। दोनों केवल वही देखते हैं जो तटस्थ मध्यस्थता सेतु है, जिसमें दोनों की सहमति से तैयार भाषा होती है।'
        },
        {
          question: 'क्या Reconcile थेरेपी या काउंसलिंग का विकल्प है?',
          answer:
            'नहीं। Reconcile एक संचार उपकरण है जो रोज़मर्रा की ग़लतफ़हमियों को सुलझाने के लिए बनाया गया है। यह कोई चिकित्सा, थेरेपी या आपातकालीन सेवा नहीं है। यदि मामला घरेलू हिंसा, आत्म-हानि या गंभीर दुर्व्यवहार का है, तो हमारा सिस्टम तुरंत प्रमाणित आपातकालीन हेल्पलाइन पर भेजता है।'
        },
        {
          question: 'Reconcile कैसे सुनिश्चित करता है कि वह किसी का पक्ष न ले?',
          answer:
            'Reconcile कड़े निष्पक्षता नियमों पर काम करता है: भावनाओं को समझें लेकिन नकारात्मक धारणाओं का समर्थन न करें; किसी को “विषाक्त” या गलत करार न दें; इरादे और असर को अलग करें; और हमेशा साझा सहमति तलाशें।'
        },
        {
          question: 'क्या मुझे अकाउंट बनाना होगा या कोई शुल्क देना होगा?',
          answer:
            'किसी अकाउंट या पासवर्ड की ज़रूरत नहीं है। आप तुरंत बातचीत शुरू कर सकते हैं। Reconcile पूरी तरह निःशुल्क है और इसमें कोई विज्ञापन या छिपा हुआ शुल्क नहीं है।'
        }
      ]
    },
    closingCta: {
      badge: 'गोपनीय मध्यस्थता',
      title: 'एक बेहतर बातचीत के लिए तैयार हैं?',
      subtitle:
        'आपको चुप्पी में घुटने या वही पुरानी बहस दोहराने की ज़रूरत नहीं है। दो मिनट निकालकर अपनी बात शांति से साझा करें।',
      ctaPrimary: 'बताइए क्या हुआ',
      ctaSecondary: 'पहले एक उदाहरण देखें',
      trustProof: 'उपयोग के लिए निःशुल्क • कोई लॉगिन नहीं • आपकी बातें 100% गोपनीय'
    },
    footer: {
      philosophy: '“किसी को समझने का मतलब उनकी हर बात से सहमत होना नहीं है।”',
      mission:
        'एक संवेदनशील AI संचार मध्यस्थ, जिसे बिना किसी का पक्ष लिए लोगों को ग़लतफ़हमियाँ सुलझाने में मदद करने के लिए बनाया गया है।',
      productTitle: 'उत्पाद',
      privacyTitle: 'गोपनीयता',
      resourcesTitle: 'भारत सहायता हेल्पलाइन',
      crisisIndiaTitle: '24/7 मानसिक स्वास्थ्य हेल्पलाइन (भारत):',
      crisisDesc:
        'यदि आप या आपका कोई जानने वाला गंभीर तनाव में है या संकट से जूझ रहा है, तो पूरे भारत में 24/7 गोपनीय पेशेवर सहायता उपलब्ध है:',
      teleManas: 'टेली-मानस (भारत सरकार): 14416 (टोल-फ्री, 24/7)',
      aasra: 'आसरा संकट सहायता: +91 9820466726 (24/7)',
      vandrevala: 'वांद्रेवाला फाउंडेशन: +91 9999 666 555',
      emergency112: 'भारत राष्ट्रीय आपातकालीन सेवा: 112',
      copyright: 'Reconcile AI. सर्वाधिकार सुरक्षित। गोपनीय, सुरक्षित विवाद समाधान।',
      builtWithEmpathy: 'ईमानदार मानवीय रिश्तों के लिए संवेदनशीलता के साथ निर्मित।'
    }
  },

  mr: {
    navbar: {
      howItWorks: 'कसे कार्य करते',
      demonstration: 'प्रात्यक्षिक',
      outcomes: 'फायदे',
      privacy: 'गोपनीयता',
      faq: 'नेहमीचे प्रश्न',
      about: 'माहिती',
      tryReconcile: 'Reconcile वापरा',
      start: 'सुरू करा',
      tellMeWhatHappened: 'काय घडलं ते सांगा'
    },
    hero: {
      eyebrow: 'कठीण संवादांसाठी खाजगी AI मध्यस्थ',
      titleLine1: 'तुम्हाला काय वाटतं हे तुम्हाला ठाऊक आहे.',
      titleLine2: 'ते योग्य शब्दांत कसं सांगायचं यात आम्ही मदत करतो.',
      description:
        'जेव्हा एकमेकांशी बोलणं अशक्य वाटतं, तेव्हा Reconcile दोन्ही बाजू गोपनीयपणे ऐकून घेतं, हेतू आणि प्रभाव यात कुठे गैरसमज झाला ते शोधतं आणि संवाद सुधारण्यासाठी योग्य शब्द देतं.',
      ctaPrimary: 'काय घडलं ते सांगा',
      ctaSecondary: 'कसे कार्य करते ते पहा',
      trustProof: '100% खाजगी. कोणत्याही खात्याची गरज नाही. तुमचे मूळ शब्द कधीही पुढे पाठवले जात नाहीत.',
      demoEyebrow: 'थेट प्रात्यक्षिक',
      demoTitle: 'Reconcile प्रत्यक्ष गैरसमज कसा सोडवतो:',
      feltLabel: 'जाणवले',
      intentLabel: 'मूळ हेतू',
      neverSeenBy: 'यांना कधीही दिसले नाही',
      privateIntake: 'खाजगी संवाद',
      theActualDisconnect: 'नक्की कुठे गैरसमज झाला',
      suggestedStarter: 'संवाद सुरू करण्यासाठी योग्य शब्द',
      tryThisLive: 'हा प्रसंग थेट अनुभवून पहा',
      scenarios: [
        {
          id: 'parent-teen',
          demoKey: 'demo-parent-child',
          label: 'आई-वडील आणि मुलगी',
          context: 'अभ्यास आणि स्वातंत्र्यावरून रोज होणारे वाद',
          sideA: {
            name: 'माया',
            role: 'मुलगी, १९ वर्षे',
            rawText:
              '“आई रोज सकाळी माझ्या अभ्यास आणि परीक्षांबद्दल विचारते. मला ठाऊक आहे तिला काळजी वाटते, पण मला वाटतं तिचा माझ्या क्षमतेवर अजिबात विश्वास नाही.”',
            felt: 'सतत तपासणी आणि अविश्वास जाणवला'
          },
          sideB: {
            name: 'एलेना',
            role: 'आई',
            rawText:
              '“मी तिच्या चांगल्या भविष्यासाठी माझ्या करिअरचा त्याग केला. मला तिची सतत काळजी वाटते म्हणून मी विचारते, मला नाही वाटत तिने माझ्यासारखा संघर्ष करावा.”',
            intent: 'गाढ प्रेम आणि भविष्याची चिंता'
          },
          bridge: {
            disconnect:
              'आईचा हेतू काळजीपोटी संरक्षणाचा होता; पण मुलीला तिच्यावर अविश्वास दाखवला जात असल्याचे जाणवले.',
            suggestedMessage:
              '“आई, मला ठाऊक आहे तू माझ्या भल्यासाठी विचारतेस. पण रोज सकाळी विचारल्याने मला वाटतं तुला माझ्यावर विश्वास नाही. आपण दर रविवारी निवांत बोलू शकतो का?”'
          }
        },
        {
          id: 'friends-silence',
          demoKey: 'demo-friend-friend',
          label: 'दोन जीवलग मित्र',
          context: 'एका भावनिक वादानंतर तीन दिवसांची शांतता',
          sideA: {
            name: 'सारा',
            role: 'मैत्रीण A',
            rawText:
              '“मी तिच्याशी माझी एक अतिशय खाजगी गोष्ट शेअर केली आणि तिने तीन दिवस काहीच उत्तर दिले नाही. मैत्री फक्त माझ्याच बाजूने आहे असं वाटतं.”',
            felt: 'दुर्लक्ष आणि एकटेपण जाणवले'
          },
          sideB: {
            name: 'क्लोई',
            role: 'मैत्रीण B',
            rawText:
              '“कामाच्या तणावाने मला या आठवड्यात पूर्णपणे खचवून टाकलं होतं. मी दोनदा उत्तर टाईप केलं, पण नीट संवाद साधण्याची माझ्यात अजिबात ताकद नव्हती.”',
            intent: 'तीव्र मानसिक तणाव आणि थकव्याशी मुकाबला'
          },
          bridge: {
            disconnect:
              'हेतू स्वतःला थकव्यातून सावरण्याचा होता; पण शांततेचा प्रभाव दुर्लक्ष आणि बेपर्वाईसारखा जाणवला.',
            suggestedMessage:
              '“हाय — लगेच उत्तर देण्याचं काही दडपण नाही. कामाचा खूप ताण होता हे समजलं. फक्त सांगायचं होतं की तू ठीक आहेस ना, जेव्हा तुला जमेल तेव्हा आपण बोलू.”'
          }
        }
      ]
    },
    problemStory: {
      badge: 'वादाचे मानसशास्त्र',
      headline: '“जेव्हा मन दुखावलेलं असतं, तेव्हा प्रत्येक स्पष्टीकरण निव्वळ सबब वाटते.”',
      subtitle:
        'परस्पर प्रेम असलेल्या व्यक्तींमधील वाद प्रेमाच्या अभावामुळे होत नाहीत. ते संवादाच्या त्रुटीमुळे होतात: जो हेतू होता, तो समोरच्यापर्यंत क्वचितच पोहोचतो.',
      sectionTitle: 'संवाद का अडकतो:',
      whatWasSaid: 'काय बोलले गेले:',
      whatWasHeard: 'काय ऐकू गेले:',
      whatWasMeant: 'नक्की काय सांगायचे होते:',
      disconnects: [
        {
          spoken: '“आपण यावर उद्या बोलू शकतो का?”',
          perceived: '“तुला माझ्या भावनांची काहीच किंमत नाही आणि तुला हा विषय टाळायचा आहे.”',
          intended: '“मी सध्या खूप तणावात आहे आणि रागाच्या भरात काही चुकीचं बोलण्याची भीती वाटतेय.”'
        },
        {
          spoken: '“तू मागे पडू नयेस इतकीच माझी इच्छा आहे.”',
          perceived: '“माझ्या हुशारीवर किंवा निर्णयावर तुझा अजिबात विश्वास नाही.”',
          intended: '“माझं तुझ्यावर प्रेम आहे आणि मी जसा त्रास सहन केला तसा तुला होऊ नये हीच भीती आहे.”'
        },
        {
          spoken: '“ठीक आहे. तुला जे वाटेल ते कर.”',
          perceived: '“तू या नात्याचा विचार सोडून दिला आहेस.”',
          intended: '“मला खूप हतबल आणि दुःखी वाटतंय, आणि काय बोलावे हेच सुचत नाहीये.”'
        }
      ],
      loopTitle: 'Reconcile तणावपूर्ण वादाचे चक्र कसे तोडतो',
      loopSubtitle:
        'जेव्हा दोन व्यक्ती बचावात्मक पवित्र्यात बोलतात, तेव्हा त्यांचे मन फक्त स्वतःचे रक्षण करते. Reconcile मध्ये एक गोपनीय मध्यस्थ बनून भावनिक सुरक्षितता निर्माण करतो.',
      pillars: [
        {
          num: '01',
          title: 'मनातील भावना मोकळेपणाने मांडा',
          desc: 'तुम्ही तुमचा राग किंवा संताप व्यक्त करू शकता. तुमचे मूळ शब्द फक्त Reconcile कडे सुरक्षित आणि खाजगी राहतात.'
        },
        {
          num: '02',
          title: 'शांत आणि तटस्थ विश्लेषण',
          desc: 'Reconcile कटुता बाजूला ठेवून तुमच्या मनातील खरी गरज आणि भावना समजून घेतो.'
        },
        {
          num: '03',
          title: 'दोन्ही बाजूंचा आदर',
          desc: 'दुसरी व्यक्तीही कोणताही दोषारोप न होता आपली बाजू मांडू शकते. दोन्ही बाजू निष्पक्षपणे ऐकल्या जातात.'
        },
        {
          num: '04',
          title: 'योग्य आणि शांत शब्द',
          desc: 'आत्मसन्मानाला धक्का न लावता, शांततेने संवाद सुरू करण्यासाठी योग्य वाक्ये दिली जातात.'
        }
      ]
    },
    demoSection: {
      eyebrow: 'उत्पादनाचे थेट प्रात्यक्षिक',
      title: 'दोन खाजगी दृष्टिकोन एक सामायिक समज कसे बनतात.',
      subtitle:
        'खालील प्रत्यक्ष प्रसंग पहा. Reconcile गैरसमज कसा ओळखतो आणि योग्य संवाद कसा घडवतो ते समजून घ्या.',
      copyButton: 'मेसेज कॉपी करा',
      copiedText: 'कॉपी झाला!',
      tryLiveSession: 'हा संवाद थेट सुरू करा',
      privateThoughtsA: 'खाजगी संवाद',
      privateThoughtsB: 'खाजगी संवाद',
      feltBadge: 'जाणवले',
      intentBadge: 'मूळ हेतू',
      coreNeedLabel: 'मूलभूत गरज',
      theActualGap: 'नक्की कुठे गैरसमज झाला',
      commonGroundLabel: 'सामायिक सहमती',
      readyToSendMessage: 'शांततेने संवाद साधण्यासाठी तयार मेसेज',
      tabs: [
        {
          key: 'demo-parent-child',
          tag: 'महत्त्वाचा प्रसंग',
          title: 'आई-वडील आणि मुलगी',
          subtitle: 'अभ्यास, स्वातंत्र्य आणि अपयशाची भीती',
          personA: {
            name: 'माया',
            role: 'मुलगी (१९ वर्षे)',
            quote:
              '“ते रोज माझ्या अभ्यासाबद्दल विचारतात. मला माहितीय ते काळजी करतात, पण मला वाटतं त्यांना माझ्या क्षमतेवर अजिबात विश्वास नाही.”',
            coreNeed: 'स्वातंत्र्य, विश्वास आणि एक प्रौढ व्यक्ती म्हणून आदराची गरज.'
          },
          personB: {
            name: 'एलेना',
            role: 'आई',
            quote:
              '“मी तिच्यासाठी खूप त्याग केला आहे. मला तिच्या भविष्याची काळजी वाटते म्हणून मी विचारते. मला नाही वाटत तिचे नुकसान व्हावे.”',
            coreNeed: 'मुलगी सुरक्षित आणि आनंदी राहील याबद्दल भावनिक दिलासा.'
          },
          reconcileAnalysis: {
            intent: 'गाढ प्रेम, काळजी आणि भविष्याविषयी भीती.',
            impact: 'सतत नियंत्रण आणि अविश्वास असल्याचे जाणवणे.',
            commonGround: 'दोघांनाही मायाचे यश आणि तिची मानसिक शांतता हवी आहे.',
            readyOpener:
              '“आई, मला ठाऊक आहे तू माझ्या काळजीपोटी विचारतेस. पण रोज विचारल्याने मला वाटतं तुला माझ्यावर विश्वास नाही. आपण दर रविवारी बोलू शकतो का, जेणेकरून मी तणावाशिवाय तुला अपडेट देऊ शकेन?”'
          }
        },
        {
          key: 'demo-friend-friend',
          tag: 'लोकप्रिय प्रसंग',
          title: 'जीवलग मित्र',
          subtitle: 'उत्तराची वाट आणि अचानक दुरावा',
          personA: {
            name: 'सारा',
            role: 'मैत्रीण A',
            quote:
              '“मी तिच्याशी माझी महत्त्वाची अडचण मांडली आणि तिने तीन दिवस काहीच उत्तर दिले नाही. मैत्री टिकवण्याचा प्रयत्न फक्त मीच करतेय असं वाटतं.”',
            coreNeed: 'भावनिक आधार, समजूतदारपणा आणि नात्यातील विश्वास.'
          },
          personB: {
            name: 'क्लोई',
            role: 'मैत्रीण B',
            quote:
              '“या आठवड्यात कामाच्या ताणाने मला बेजार केले होते. मी दोनदा मेसेज टाईप केला, पण नीट बोलण्याची मानसिक ताकदच माझ्यात नव्हती.”',
            coreNeed: 'अपराधबोधाशिवाय विश्रांती घेण्यासाठी आणि सावरण्यासाठी थोडा वेळ.'
          },
          reconcileAnalysis: {
            intent: 'मैत्री जपण्यासाठी योग्य मानसिक स्थितीत येईपर्यंत थांबणे.',
            impact: 'शांततेचा अर्थ भावनिक दुर्लक्ष आणि बेफिकिरी असा काढला गेला.',
            commonGround: 'दोघींनाही एकमेकांची मैत्री मनापासून जपायची आहे.',
            readyOpener:
              '“हाय — लगेच उत्तर द्यायची काही घाई नाही! मला ठाऊक आहे खूप धावपळ असू शकते. तू ठीक आहेस ना इतकंच विचारायचं होतं. वेळ मिळेल तेव्हा बोलू.”'
          }
        },
        {
          key: 'demo-sibling-sibling',
          tag: 'कौटुंबिक प्रसंग',
          title: 'भाऊ आणि बहीण',
          subtitle: 'विचारल्याशिवाय वस्तू वापरणे आणि मर्यादा न पाळणे',
          personA: {
            name: 'रिली',
            role: 'मोठा भाऊ / बहीण',
            quote:
              '“माझा भाऊ विचारल्याशिवाय माझे हेडफोन्स आणि कपडे घेतो. मला शेअर करायला हरकत नाही, पण या घरात माझ्या खाजगी जागेला काही किंमतच नाही असं वाटतं.”',
            coreNeed: 'मूलभूत शिष्टाचार, वैयक्तिक जागेचा आदर आणि पूर्वपरवानगी.'
          },
          personB: {
            name: 'केसी',
            role: 'लहान भाऊ / बहीण',
            quote:
              '“आम्ही एकाच घरात राहतो आणि खूप जवळ आहोत. मी नेहमी वस्तू परत ठेवतो. हुडीसाठी एवढा मोठा वाद घातला की ते मला परकं समजतात असं वाटतं.”',
            coreNeed: 'कौटुंबिक जिव्हाळा, अनौपचारिकता आणि कोणतीही टीका न होता जवळीक.'
          },
          reconcileAnalysis: {
            intent: 'कौटुंबिक सहजता आणि जवळीक.',
            impact: 'अधिकार गाजवणे आणि वैयक्तिक मर्यादांचा अनादर झाल्याची भावना.',
            commonGround: 'दोघांनाही आपापसातील जिव्हाळा आणि शांततेने एकत्र राहणे महत्त्वाचे वाटते.',
            readyOpener:
              '“मला माझ्या वस्तू तुझ्यासोबत शेअर करायला आवडतं, पण विचारल्याशिवाय घेतल्यास मला अनादर झाल्यासारखं वाटतं. फक्त घेण्यापूर्वी एक छोटा मेसेज करत जा, मग काही अडचण नाही.”'
          }
        }
      ]
    },
    howItWorks: {
      badge: 'Reconcile कसे कार्य करते',
      title: 'तणावपूर्ण शांततेकडून एका सुसंवादी संवादाकडे.',
      subtitle:
        'तुमची भावनिक सुरक्षितता जपण्यासाठी आणि नात्यातील जिव्हाळा परत आणण्यासाठी चार विचारपूर्वक पावले.',
      steps: [
        {
          number: '01',
          title: 'तुम्ही बोला, आम्ही ऐकू.',
          description:
            'Reconcile ला तुमच्या शब्दांत नक्की काय घडले ते सांगा. राग किंवा संताप व्यक्त करा. हा संवाद पूर्णपणे खाजगी आहे — कोणीही हा मूळ मेसेज वाचू शकणार नाही.',
          tag: '100% खाजगी',
          microExample: '“मला वाटलं त्यांना माझी काहीच किंमत नाही आणि त्यांनी मला पूर्णपणे दुर्लक्षित केलं.”'
        },
        {
          number: '02',
          title: 'आम्ही तुमचा खरा अर्थ समजून घेतो.',
          description:
            'रागाच्या मागे नेहमी एक न बोललेली भावना असते: आदर, विश्वास किंवा समजून घेण्याची गरज. Reconcile संतापातून तुमचा मूळ हेतू वेगळा करतो.',
          tag: 'भावनिक बुद्धिमत्ता',
          microExample: 'शोधलेली मूलभूत गरज: नात्यात सुरक्षितता आणि आदराची तीव्र इच्छा.'
        },
        {
          number: '03',
          title: 'आम्ही दुसऱ्या बाजूला आमंत्रित करतो.',
          description:
            'आम्ही समोरच्या व्यक्तीला एक शांततापूर्ण, आदरयुक्त निमंत्रण पाठवतो. कोणतेही आरोप नाहीत आणि जुने मेसेज फॉरवर्ड केले जात नाहीत. तेही विश्वासाने आपली बाजू मांडतात.',
          tag: 'कोणतीही कटुता नाही',
          microExample: 'शांततापूर्ण निमंत्रण: “Reconcile ने संवादातील अंतर पाहिले आहे. आम्हाला तुमची बाजूही जाणून घ्यायची आहे.”'
        },
        {
          number: '04',
          title: 'दोन्ही बाजूंचा खरा अर्थ स्पष्ट होतो.',
          description:
            'दोन्ही बाजू आल्यानंतर, Reconcile मध्यस्थता सेतू तयार करतो: हेतू आणि भावना यातील अंतर दाखवून गैरसमज दूर करण्यासाठी योग्य शब्द देतो.',
          tag: 'तोडगा सेतू',
          microExample: 'पाठवण्यासाठी तयार: तणाव कमी करणारा आणि मन जुळवणारा संवाद.'
        }
      ]
    },
    outcomes: {
      badge: 'स्पष्ट परिणाम',
      title: 'कोणत्याही भावनिक धोक्याशिवाय स्पष्ट संवाद.',
      subtitle:
        'Reconcile वादग्रस्त आणि संतापजनक चर्चांना सकारात्मक संवादात कसे रूपांतरित करतो.',
      cards: [
        {
          number: '01',
          title: 'मनात येईल तसं मोकळं व्हा. आम्ही ते सावरून घेऊ.',
          eyebrow: 'अनफिल्टर्ड भावनिक संवाद',
          description:
            'जेव्हा राग येतो किंवा मन दुखतं, तेव्हा शांत राहणं कठीण असतं. Reconcile पश्चात्ताप न होता भावना व्यक्त करायला सुरक्षित जागा देतो. तुमचे कच्चे शब्द कधीही समोरच्यापर्यंत पोहोचत नाहीत.',
          rawLabel: 'तुमची खाजगी भावना (गोपनीय):',
          rawText: '“त्यांच्या मेसेज न करण्याने मी वैतागलो आहे. त्यांना माझी काहीच किंमत नाही हेच यातून दिसतं.”',
          insightLabel: 'Reconcile काय ओळखतो:',
          insightText: 'मूलभूत गरज: नात्यात भावनिक विश्वास आणि स्वतःची कदर केली जाण्याची गरज.'
        },
        {
          number: '02',
          title: 'त्यांचा नक्की काय हेतू असावा ते समजून घ्या.',
          eyebrow: 'समर्थन न करता समजून घेणे',
          description:
            'बचावात्मक विचारांच्या पलीकडे पहा. Reconcile तुम्हाला समोरच्या व्यक्तीचा ताण, भीती किंवा अवघडलेपण समजून घ्यायला मदत करतो — त्यांच्या चुकीचे समर्थन न करता.',
          rawLabel: 'त्यांची संभाव्य परिस्थिती:',
          rawText: 'त्यांना मनापासून काळजी आहे, पण प्रचंड ताणामुळे किंवा वाद नको म्हणून ते शांत बसले.',
          insightLabel: 'दृष्टिकोनातील बदल:',
          insightText: 'त्यांची शांतता ही मानसिक थकव्याचे लक्षण होती, कोणतीही कपटी भावना नव्हती.'
        },
        {
          number: '03',
          title: 'भिंती नाही, संवाद जोडणारा मार्ग देणारा मेसेज.',
          eyebrow: 'तणाव कमी करणारा संवाद',
          description:
            'रागाच्या भरात पाठवलेले मेसेज समोरच्या व्यक्तीला दुखावून टाकतात. Reconcile एक असा मेसेज तयार करतो जो आदर राखून तुमची अडचण शांतपणे मांडतो.',
          rawLabel: 'रागातील पहिली प्रतिक्रिया:',
          rawText: '“ठीक आहे, नको बोलूस. पुन्हा कधी फोनही करू नकोस.”',
          insightLabel: 'Reconcile चा सल्ला:',
          insightText: '“आपल्यात सध्या दुरावा जाणवतोय आणि मला तुझ्याशी बोलायची आठवण येतेय. या आठवड्यात सवड मिळेल तेव्हा आपण ५ मिनिटे बोलू शकतो का?”'
        },
        {
          number: '04',
          title: 'कोणावरही दोष न देता सामायिक स्पष्टता.',
          eyebrow: 'मध्यस्थता सेतू',
          description:
            'दोन्ही व्यक्ती आल्यावर, Reconcile नक्की कुठे मतभेद झाले ते दाखवतो आणि पुढे जाण्यासाठी एक मान्य तोडगा सुचवतो.',
          rawLabel: 'झालेला गैरसमज:',
          rawText: 'मायेला सतत नियंत्रण वाटले; आईला तिच्या भविष्याची चिंता सतावत होती.',
          insightLabel: 'सामायिक तोडगा:',
          insightText: 'दररोजच्या चौकशीऐवजी दर रविवारी निवांतपणे चर्चा करण्याचे ठरवले.'
        }
      ]
    },
    privacy: {
      badge: 'गोपनीयतेची भक्कम सुरक्षा',
      title: 'तुमचे मूळ शब्द नेहमी पूर्णपणे खाजगी राहतात.',
      subtitle:
        'Reconcile मध्ये गोपनीयता हा निव्वळ पर्याय नाही, तर संवादाचा मुख्य पाया आहे. तुम्ही भीतीशिवाय मन मोकळे करू शकता.',
      pillars: [
        {
          title: 'A व्यक्ती, B व्यक्तीचा संवाद पाहू शकत नाही',
          description:
            'A व्यक्तीचे संभाषण पूर्णपणे वेगळे ठेवले जाते. मध्यस्थता सेतू तयार झाल्यानंतरही B व्यक्ती A व्यक्तीचे खाजगी मेसेज वाचू शकत नाही.'
        },
        {
          title: 'B व्यक्ती, A व्यक्तीचा संवाद पाहू शकत नाही',
          description:
            'B व्यक्तीचे संभाषणही पूर्णपणे खाजगी असते. त्यांच्या भावना किंवा विचार फक्त त्यांच्याकडेच सुरक्षित राहतात.'
        },
        {
          title: 'संतापातील कच्चे शब्द कधीही पुढे पाठवले जात नाहीत',
          description:
            'Reconcile कोणतंही मेसेजिंग ॲप नाही जे थेट मेसेज फॉरवर्ड करेल. दोन्ही व्यक्ती फक्त तटस्थ मध्यस्थता सेतूच पाहू शकतात.'
        },
        {
          title: 'माहिती फक्त तुमच्या संवादासाठी वापरली जाते',
          description:
            'तुमच्या बोलण्याचा वापर फक्त चालू सत्रातील तोडग्यासाठी होतो. आम्ही डेटा विकत नाही किंवा सार्वजनिक मॉडेल ट्रेन करत नाही.'
        }
      ]
    },
    faq: {
      badge: 'प्रश्न आणि उत्तरे',
      title: 'नेहमी विचारले जाणारे प्रश्न.',
      subtitle: 'Reconcile आणि तुमच्या गोपनीयतेबद्दल संपूर्ण माहिती.',
      items: [
        {
          question: 'मी Reconcile वापरत असल्याचे समोरच्या व्यक्तीला कळेल का?',
          answer:
            'होय, विश्वास परत मिळवण्यासाठी पारदर्शकता महत्त्वाची आहे. जेव्हा तुम्ही समोरच्या व्यक्तीला आमंत्रित करता, तेव्हा Reconcile एक शांत आणि तटस्थ निमंत्रण पाठवतो. यात कोणाच्याही पाठीमागे काहीही केले जात नाही.'
        },
        {
          question: 'समोरच्या व्यक्तीने नकार दिला तर काय?',
          answer:
            'समोरची व्यक्ती आली नाही तरीही Reconcile खूप उपयुक्त आहे. तुमचा खाजगी संवाद तुम्हाला स्वतःच्या भावना समजून घ्यायला आणि त्यांना थेट पाठवण्यासाठी शांत शब्द शोधायला मदत करतो.'
        },
        {
          question: 'समोरची व्यक्ती माझे खाजगी शब्द वाचू शकते का?',
          answer:
            'कधीही नाही. Reconcile खाजगी संभाषणे पूर्णपणे वेगळी ठेवतो. दोन्ही व्यक्तींना फक्त तटस्थ मध्यस्थता सेतूच दिसतो.'
        },
        {
          question: 'Reconcile थेरपी किंवा समुपदेशनाचा पर्याय आहे का?',
          answer:
            'नाही. Reconcile हे दैनंदिन गैरसमज सोडवण्यासाठीचे एक संवाद साधन आहे. हे वैद्यकीय उपचार किंवा थेरपी नाही. गंभीर हिंसा किंवा आत्महत्येसारख्या प्रसंगी आमची यंत्रणा त्वरित आपत्कालीन हेल्पलाइनकडे वळवते.'
        },
        {
          question: 'Reconcile कोणाचीही बाजू न घेण्याची खात्री कशी देतो?',
          answer:
            'Reconcile निष्पक्षतेच्या कठोर नियमांवर काम करतो: भावनांचा आदर करा पण पूर्वग्रहांचे समर्थन करू नका; कोणावरही आरोप करू नका; हेतू आणि परिणाम वेगळे करा; आणि नेहमी सामायिक मार्ग शोधा.'
        },
        {
          question: 'मला अकाऊंट तयार करावे लागेल किंवा पैसे द्यावे लागतील का?',
          answer:
            'कोणत्याही अकाऊंट किंवा पासवर्डची गरज नाही. तुम्ही त्वरित संवाद सुरू करू शकता. Reconcile सध्या पूर्णपणे मोफत आहे.'
        }
      ]
    },
    closingCta: {
      badge: 'गोपनीय मध्यस्थता',
      title: 'एक चांगला संवाद सुरू करण्यासाठी तयार आहात का?',
      subtitle:
        'शांततेत घुसमटत राहण्याची किंवा तेच वाद पुन्हा करण्याची गरज नाही. दोन मिनिटे काढून आपली बाजू खाजगीत मांडा.',
      ctaPrimary: 'काय घडलं ते सांगा',
      ctaSecondary: 'आधी एक उदाहरण पहा',
      trustProof: 'वापरण्यासाठी पूर्णपणे मोफत • लॉगिनची गरज नाही • १००% खाजगी'
    },
    footer: {
      philosophy: '“एखाद्या व्यक्तीला समजून घेणे म्हणजे त्यांच्या प्रत्येक मताशी सहमत असणे नव्हे.”',
      mission:
        'एक संवेदनशील AI संवाद मध्यस्थ, ज्याची निर्मिती कोणाचीही बाजू न घेता गैरसमज शांततेने सोडवण्यासाठी करण्यात आली आहे.',
      productTitle: 'उत्पादन',
      privacyTitle: 'गोपनीयता',
      resourcesTitle: 'भारतातील हेल्पलाइन',
      crisisIndiaTitle: '२४/७ मानसिक स्वास्थ्य हेल्पलाइन (भारत):',
      crisisDesc:
        'तुम्ही किंवा तुमच्या ओळखीची कोणतीही व्यक्ती संकटात असल्यास, संपूर्ण भारतात २४/७ गोपनीय व्यावसायिक मदत उपलब्ध आहे:',
      teleManas: 'टेलि-मानस (भारत सरकार): 14416 (टोल-फ्री, २४/७)',
      aasra: 'आसरा हेल्पलाइन: +91 9820466726 (२४/७)',
      vandrevala: 'वांद्रेवाला फाउंडेशन: +91 9999 666 555',
      emergency112: 'भारत राष्ट्रीय आपत्कालीन सेवा: 112',
      copyright: 'Reconcile AI. सर्व हक्क राखीव. खाजगी आणि सुरक्षित वाद निवारण.',
      builtWithEmpathy: 'नात्यांमधील जिव्हाळा जपण्यासाठी संवेदनशीलतेने विकसित.'
    }
  }
};

export function getLandingTranslations(lang: SupportedLanguage = 'en'): LandingTranslations {
  return LANDING_TRANSLATIONS[lang] || LANDING_TRANSLATIONS.en;
}
