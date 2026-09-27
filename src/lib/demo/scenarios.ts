import { RelationshipType, ReconcileResponse, MediationSession } from '../types';

export const DEMO_SESSIONS: Record<string, MediationSession> = {
  'demo-parent-child': {
    id: 'demo-parent-child',
    relationship: 'parent',
    topic: 'Studies and Parental Trust',
    status: 'mediation_ready',
    personA: {
      label: 'Child (Alex)',
      messages: [
        {
          id: 'msg-a-1',
          sender: 'reconcile',
          role: 'a',
          text: "Hey, I'm here. What's going on?",
          timestamp: 1710000000000,
          privacy: 'PRIVATE_A',
          quickReplies: ["My parents keep asking about my studies", "We had a big argument", "It feels like they don't trust me"]
        },
        {
          id: 'msg-a-2',
          sender: 'user',
          role: 'a',
          text: "My parents keep asking about my studies. I know they're worried, but it feels like they don't trust me.",
          timestamp: 1710000010000,
          privacy: 'PRIVATE_A'
        },
        {
          id: 'msg-a-3',
          sender: 'reconcile',
          role: 'a',
          text: "It sounds like the questions themselves aren't really the whole problem. It might be that they make you feel like they don't trust you to manage your own responsibilities. Is that close to what you're feeling?",
          timestamp: 1710000020000,
          privacy: 'PRIVATE_A',
          quickReplies: ["Yes, exactly that", "There's more to it", "I just feel micromanaged"]
        },
        {
          id: 'msg-a-4',
          sender: 'user',
          role: 'a',
          text: "Yes, exactly. I'm actually doing my best, but every time they ask, it feels like they expect me to fail unless they hover over me.",
          timestamp: 1710000030000,
          privacy: 'PRIVATE_A'
        },
        {
          id: 'msg-a-5',
          sender: 'reconcile',
          role: 'a',
          text: "I hear you. Underneath that frustration, it sounds like you really want independence, but you also want them to know you take your future seriously. What do you wish they understood most about your side?",
          timestamp: 1710000040000,
          privacy: 'PRIVATE_A',
          quickReplies: ["I need room to breathe", "I will ask if I need help", "The constant asking creates anxiety"]
        },
        {
          id: 'msg-a-6',
          sender: 'user',
          role: 'a',
          text: "I wish they knew that when they constantly ask, it gives me anxiety instead of helping. I want to tell them how I'm doing on my own terms.",
          timestamp: 1710000050000,
          privacy: 'PRIVATE_A'
        },
        {
          id: 'msg-a-7',
          sender: 'reconcile',
          role: 'a',
          text: "I think I understand your side now. There might be something useful we can try: If you want, I can help your parents understand what you're actually trying to say — without sending your raw words or starting another argument.",
          timestamp: 1710000060000,
          privacy: 'PRIVATE_A',
          quickReplies: ["Help them understand", "Can I see what you'll say first?", "Keep talking with me"]
        }
      ],
      insight: {
        intent: "Seeking autonomy and emotional validation; wants parents to step back without feeling like the relationship is severed.",
        emotions: ["frustrated", "anxious", "micromanaged", "doubted"],
        underlyingNeed: "Trust, independence, and reduced anxiety while retaining parental love and reassurance.",
        fearedOutcome: "Parents thinking they don't care, or continued escalating scrutiny.",
        readyToInvite: true
      }
    },
    invitation: {
      inviteCode: 'demo-parent-child',
      senderLabel: 'Your child',
      recipientLabel: 'Parent',
      relationship: 'parent',
      topic: 'Studies and Trust',
      neutralSummary: "Your child asked me to help explain something that's been difficult to say directly without tension. From what they've shared, they're feeling increasingly overwhelmed by how often schoolwork and grades are brought up. Underneath that frustration, it seems they want more independence and trust, while still knowing that you care and believe in them.",
      invitationMessage: "Someone wants to talk with you. Reconcile is helping them explain something that has been difficult to say directly.",
      accepted: true
    },
    personB: {
      label: 'Parent (Morgan)',
      messages: [
        {
          id: 'msg-b-1',
          sender: 'reconcile',
          role: 'b',
          text: "Hey. Your child asked me to help explain something that's been difficult to say directly without tension. Before I explain anything, I'd really like to hear your perspective. How have things felt from your side regarding their studies?",
          timestamp: 1710000100000,
          privacy: 'PRIVATE_B',
          quickReplies: ["I'm just worried about their future", "I see them on their phone too much", "I love them and want them to succeed"]
        },
        {
          id: 'msg-b-2',
          sender: 'user',
          role: 'b',
          text: "I ask because admissions are tough and I see them on their phone all the time. I'm terrified they'll fall behind and regret it later. I only ask because I love them.",
          timestamp: 1710000110000,
          privacy: 'PRIVATE_B'
        },
        {
          id: 'msg-b-3',
          sender: 'reconcile',
          role: 'b',
          text: "That really helps clarify things. Your intention is guidance, protection, and deep care for their future. But for them, the impact feels like a lack of trust in their capability. Both can be true at the same time: you love them and want them to succeed, and the constant questions are creating anxiety rather than motivation.",
          timestamp: 1710000120000,
          privacy: 'PRIVATE_B',
          quickReplies: ["I didn't realize it caused anxiety", "How do I know they're on track?", "What can I do instead?"]
        },
        {
          id: 'msg-b-4',
          sender: 'user',
          role: 'b',
          text: "I never wanted to cause them anxiety. I just didn't know how else to stay involved without asking.",
          timestamp: 1710000130000,
          privacy: 'PRIVATE_B'
        },
        {
          id: 'msg-b-5',
          sender: 'reconcile',
          role: 'b',
          text: "That is a huge insight. You want connection and peace of mind, not conflict. I think both of you actually want the exact same outcome. Want to see how we can bridge this together?",
          timestamp: 1710000140000,
          privacy: 'PRIVATE_B',
          quickReplies: ["Show me the bridge", "How do we talk about this?"]
        }
      ],
      insight: {
        intent: "Expressing protective love and preventing future hardship; needs reassurance that child is safe and accountable.",
        emotions: ["protective", "worried", "loving", "concerned"],
        underlyingNeed: "Peace of mind, feeling like a responsible guardian, and staying connected.",
        intentionVsImpact: "Intended as an expression of love and guidance; experienced by the child as doubt and control.",
        readyToInvite: true
      }
    },
    bridge: {
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
    },
    createdAt: 1710000000000,
    updatedAt: 1710000150000
  },

  'demo-friend-friend': {
    id: 'demo-friend-friend',
    relationship: 'friend',
    topic: 'Two Days of Silence After an Argument',
    status: 'mediation_ready',
    personA: {
      label: 'Friend (Jordan)',
      messages: [
        {
          id: 'msg-fa-1',
          sender: 'reconcile',
          role: 'a',
          text: "Hey, I'm here. What's going on?",
          timestamp: 1710000000000,
          privacy: 'PRIVATE_A'
        },
        {
          id: 'msg-fa-2',
          sender: 'user',
          role: 'a',
          text: "My friend hasn't replied to my messages for two days after we had an argument. I feel like they don't care about our friendship.",
          timestamp: 1710000010000,
          privacy: 'PRIVATE_A'
        },
        {
          id: 'msg-fa-3',
          sender: 'reconcile',
          role: 'a',
          text: "Yeah, silence after a disagreement feels awful. It's natural to wonder whether the relationship matters as much to them as it does to you. Did they usually take time to cool off, or is this unusual?",
          timestamp: 1710000020000,
          privacy: 'PRIVATE_A'
        },
        {
          id: 'msg-fa-4',
          sender: 'user',
          role: 'a',
          text: "They usually take a few hours, but two days feels intentional. I'm worried we're growing apart.",
          timestamp: 1710000030000,
          privacy: 'PRIVATE_A'
        }
      ],
      insight: {
        intent: "Wants reassurance that the friendship is intact and values honest closure over lingering silence.",
        emotions: ["hurt", "ignored", "anxious", "sad"],
        underlyingNeed: "Security and connection in the relationship.",
        readyToInvite: true
      }
    },
    invitation: {
      inviteCode: 'demo-friend-friend',
      senderLabel: 'Jordan',
      recipientLabel: 'Friend',
      relationship: 'friend',
      topic: 'Unresolved Silence',
      neutralSummary: "Jordan reached out to Reconcile because they care about your friendship and felt unsettled after your recent disagreement. Rather than letting things stay awkward, they wanted to understand how things felt from your side.",
      invitationMessage: "Someone wants to talk with you. Reconcile is helping explain something that has been difficult to say directly.",
      accepted: true
    },
    personB: {
      label: 'Friend (Sam)',
      messages: [
        {
          id: 'msg-fb-1',
          sender: 'reconcile',
          role: 'b',
          text: "Hey. Jordan asked me to help connect with you about the recent silence. Before anything else, how have you been feeling since the argument?",
          timestamp: 1710000050000,
          privacy: 'PRIVATE_B'
        },
        {
          id: 'msg-fb-2',
          sender: 'user',
          role: 'b',
          text: "I was overwhelmed and felt like whatever I said would make things worse. I had exams this week too, so I wanted to wait until my head was clear.",
          timestamp: 1710000060000,
          privacy: 'PRIVATE_B'
        }
      ],
      insight: {
        intent: "Wanted to prevent escalation and cool down during a stressful week.",
        emotions: ["overwhelmed", "cautious", "stressed"],
        underlyingNeed: "Space to decompress without assuming the friendship is at risk.",
        readyToInvite: true
      }
    },
    bridge: {
      status: 'ready',
      personASideNeutral: "They experienced the two-day silence as emotional abandonment and feared the friendship was ending.",
      personBSideNeutral: "They stepped back temporarily to avoid saying something hurtful in anger while juggling exam stress.",
      disconnectAnalysis: {
        personAInterpretation: "Silence = 'They gave up on our friendship.'",
        personBInterpretation: "Silence = 'I am cooling off so we don't say things we regret.'",
        theGap: "One person interpreted silence as apathy; the other person used silence as damage control."
      },
      commonGround: [
        "You both care about keeping the friendship healthy.",
        "Neither person wanted the argument to cause permanent damage."
      ],
      proposedNextStep: "A quick 5-minute phone call to acknowledge you both needed time, followed by catching up over coffee.",
      suggestedSharedMessage: {
        fromAtoB: "Hey, I was anxious when I didn't hear back, but I realize you were probably overwhelmed. No hard feelings — let's grab coffee whenever you're free.",
        fromBtoA: "Hey, I'm sorry for going quiet without a heads up. I was stressed with exams and wanted to cool down. You mean a lot to me, let's talk soon."
      }
    },
    createdAt: 1710000000000,
    updatedAt: 1710000070000
  },

  'demo-sibling-sibling': {
    id: 'demo-sibling-sibling',
    relationship: 'sibling',
    topic: 'Borrowing Belongings Without Asking',
    status: 'mediation_ready',
    personA: {
      label: 'Sibling (Riley)',
      messages: [
        {
          id: 'msg-sa-1',
          sender: 'reconcile',
          role: 'a',
          text: "Hey, I'm here. What's going on?",
          timestamp: 1710000000000,
          privacy: 'PRIVATE_A'
        },
        {
          id: 'msg-sa-2',
          sender: 'user',
          role: 'a',
          text: "My brother keeps taking my clothes and headphones without asking. It's driving me crazy.",
          timestamp: 1710000010000,
          privacy: 'PRIVATE_A'
        }
      ],
      insight: {
        intent: "Wants personal boundaries respected in a shared home.",
        emotions: ["angry", "disrespected", "annoyed"],
        underlyingNeed: "Personal property boundaries and basic consideration.",
        readyToInvite: true
      }
    },
    invitation: {
      inviteCode: 'demo-sibling-sibling',
      senderLabel: 'Riley',
      recipientLabel: 'Sibling',
      relationship: 'sibling',
      topic: 'Borrowing Things',
      neutralSummary: "Riley asked Reconcile to help clear up recurring tension around borrowing clothes and tech. They don't mind sharing, but want a simple heads-up first.",
      invitationMessage: "Someone in your family wants to clear the air calmly.",
      accepted: true
    },
    personB: {
      label: 'Sibling (Casey)',
      messages: [
        {
          id: 'msg-sb-1',
          sender: 'reconcile',
          role: 'b',
          text: "Hey. Riley wanted to talk about borrowing things around the house without starting a fight. What's your perspective?",
          timestamp: 1710000050000,
          privacy: 'PRIVATE_B'
        },
        {
          id: 'msg-sb-2',
          sender: 'user',
          role: 'b',
          text: "We're family and live in the same house. I always return it. I feel like they get angry over tiny things.",
          timestamp: 1710000060000,
          privacy: 'PRIVATE_B'
        }
      ],
      insight: {
        intent: "Views sharing as natural family informality; doesn't perceive borrowing as an attack on boundaries.",
        emotions: ["defensive", "confused"],
        underlyingNeed: "Informal, affectionate family dynamic without walking on eggshells.",
        readyToInvite: true
      }
    },
    bridge: {
      status: 'ready',
      personASideNeutral: "Feels disrespected when personal items vanish without permission, especially right when they need them.",
      personBSideNeutral: "Views sharing as normal brotherly closeness and assumes it's harmless since everything is returned.",
      disconnectAnalysis: {
        personAInterpretation: "Taking things without asking = 'You don't respect my boundaries.'",
        personBInterpretation: "Borrowing things = 'We're close brothers, what's mine is yours.'",
        theGap: "A clash between a standard of personal property and an assumption of family fluidity."
      },
      commonGround: [
        "You both enjoy living together without daily bickering.",
        "Neither person actually wants to withhold items when needed."
      ],
      proposedNextStep: "A quick 5-second text rule: Send a 1-line text before taking an item. If no reply in 10 mins, take it and leave a note.",
      suggestedSharedMessage: {
        fromAtoB: "I don't mind sharing with you, I just need a heads up so I'm not searching for my stuff when I'm running late.",
        fromBtoA: "Fair enough, I'll text you first from now on. I never meant to disrespect your space."
      }
    },
    createdAt: 1710000000000,
    updatedAt: 1710000070000
  }
};

// Legacy analysis scenarios preserved for backwards compatibility
export const DEMO_SCENARIOS: Record<RelationshipType, { story: string; response: ReconcileResponse }> = {
  parent: {
    story: "My parents keep asking about my studies and I feel like they don't trust me.",
    response: {
      userPerspective: {
        summary: "You feel like you're not being trusted to manage your own responsibilities, making you feel frustrated and micromanaged.",
        feelings: ["frustrated", "anxious", "micromanaged"]
      },
      otherPerspective: {
        summary: "Your parents likely care about your future and checking in is their way of showing involvement, even if it comes across as anxious surveillance.",
        possibleReasons: [
          "They want to ensure you have what you need to succeed in a competitive world.",
          "They feel anxious about your future and want to protect you from regret.",
          "It's the primary way they know how to stay engaged with your daily life."
        ]
      },
      misunderstanding: {
        summary: "You see their questions as a lack of trust, whereas they see questions as an expression of love and guidance.",
        userInterpretation: "Questions = They think I'm failing and don't trust me.",
        possibleOtherInterpretation: "Questions = I care about you and want to help you succeed."
      },
      commonGround: [
        "You both want you to succeed and be happy.",
        "You both want a harmonious, loving relationship at home."
      ],
      reconciliationMessage: "I know you ask about my studies because you care and want me to do well. I'm on top of it, and it would actually help my stress so much if we set a scheduled check-in once a week so I have the space to study without feeling watched."
    }
  },
  friend: {
    story: "My friend hasn't replied to my messages for two days. I feel like they don't care about our friendship.",
    response: {
      userPerspective: {
        summary: "It sounds like the silence made you feel ignored — and maybe even made you wonder whether the friendship matters as much to them as it does to you.",
        feelings: ["hurt", "ignored", "sad"]
      },
      otherPerspective: {
        summary: "They might not realize how their silence is affecting you, and their lack of response likely has more to do with their current situation than your friendship.",
        possibleReasons: [
          "They are overwhelmed with work, school, or personal issues.",
          "They saw the message, got distracted, and forgot to reply.",
          "They are intentionally taking space to decompress."
        ]
      },
      misunderstanding: {
        summary: "You might be interpreting silence as a statement about the friendship, while they might see it as just being busy.",
        userInterpretation: "Silence = They don't care.",
        possibleOtherInterpretation: "Silence = I'm busy, I'll reply later when I have the energy."
      },
      commonGround: [
        "You both care about the relationship.",
        "You both want to feel understood and valued."
      ],
      reconciliationMessage: "Hey, I've been feeling a bit disconnected since I haven't heard from you. I know you might just be super busy, but I wanted to check in and see if everything is alright with you?"
    }
  },
  sibling: {
    story: "My brother keeps using my things without asking.",
    response: {
      userPerspective: {
        summary: "You feel disrespected when your boundaries aren't honored and your personal belongings are taken without asking.",
        feelings: ["angry", "frustrated", "ignored"]
      },
      otherPerspective: {
        summary: "He might view your shared living situation as casual family sharing and not realize how much this boundary matters to you.",
        possibleReasons: [
          "He thinks 'what's mine is yours' in a close family setting.",
          "He acts impulsively out of convenience without thinking.",
          "He doesn't realize it actually upsets you this much."
        ]
      },
      misunderstanding: {
        summary: "You see taking things as disrespect, while he sees it as family informality.",
        userInterpretation: "Using my stuff = Disrespecting my boundaries.",
        possibleOtherInterpretation: "Using stuff = We're family, it's no big deal."
      },
      commonGround: [
        "You both value having access to what you need.",
        "Neither of you wants to constantly fight over small items."
      ],
      reconciliationMessage: "Hey, it really frustrates me when my things get used without asking. I don't mind sharing sometimes, but I need you to ask first so I know where my stuff is."
    }
  },
  classmate: {
    story: "My classmate didn't include me in the group project discussion.",
    response: {
      userPerspective: {
        summary: "You feel left out and undervalued in a situation where you're supposed to be an equal contributor.",
        feelings: ["left-out", "hurt", "confused"]
      },
      otherPerspective: {
        summary: "They might have rushed to start working and didn't intentionally exclude you, just failing to coordinate properly.",
        possibleReasons: [
          "They acted quickly due to deadline stress.",
          "They assumed someone else was going to loop you in.",
          "They thought the discussion was just preliminary."
        ]
      },
      misunderstanding: {
        summary: "You might perceive deliberate exclusion, while it may have been purely an organizational breakdown.",
        userInterpretation: "Not included = My input isn't wanted.",
        possibleOtherInterpretation: "Started without them = Just trying to get a head start."
      },
      commonGround: [
        "You both want the project to be successful.",
        "You both want to avoid last-minute stress."
      ],
      reconciliationMessage: "Hey, I noticed a discussion happened without me for the project. I want to make sure I'm fully contributing — can we make sure we have a group chat where everyone is included for the next steps?"
    }
  },
  partner: {
    story: "I feel like my partner doesn't really listen when I talk.",
    response: {
      userPerspective: {
        summary: "You feel disconnected and unheard, which makes you wonder if your partner truly values what you have to say.",
        feelings: ["hurt", "frustrated", "sad"]
      },
      otherPerspective: {
        summary: "Your partner might be mentally drained or distracted by other stressors, reducing their capacity for active listening.",
        possibleReasons: [
          "They are burnt out from work or other responsibilities.",
          "They process information differently and might be listening without showing it.",
          "They are distracted by something on their mind."
        ]
      },
      misunderstanding: {
        summary: "You equate their lack of outward attention to a lack of love, whereas they might just lack mental bandwidth in that moment.",
        userInterpretation: "Not listening = Not caring about me.",
        possibleOtherInterpretation: "Quiet/distracted = I'm too tired to focus right now."
      },
      commonGround: [
        "You both want to feel connected.",
        "You both want the other person to feel loved."
      ],
      reconciliationMessage: "I've been feeling a bit unheard lately when I share things with you. I know you have a lot on your plate, but it would mean a lot to me if we could set aside some time where we can just focus on talking with each other."
    }
  },
  other: {
    story: "Someone at work took credit for my idea during a meeting.",
    response: {
      userPerspective: {
        summary: "You feel betrayed and undervalued after someone else claimed your hard work or creativity.",
        feelings: ["angry", "frustrated", "hurt"]
      },
      otherPerspective: {
        summary: "They might have internalized the idea as a collaborative team effort and didn't consciously mean to steal it.",
        possibleReasons: [
          "They misremembered who originally came up with it.",
          "They got caught up in the moment and spoke without thinking.",
          "They view the work as a collective 'we' rather than individual 'I'."
        ]
      },
      misunderstanding: {
        summary: "You see intentional theft, whereas they might see collaborative brainstorming.",
        userInterpretation: "Taking credit = Deliberately undermining me.",
        possibleOtherInterpretation: "Sharing the idea = Presenting our team's work to the boss."
      },
      commonGround: [
        "You both want the team to succeed.",
        "You both want to be recognized for good work."
      ],
      reconciliationMessage: "I was glad the idea went over well in the meeting, but I felt a bit side-lined since it was something I originally proposed. I'd love it if we could make sure to acknowledge where ideas originate in the future."
    }
  }
};

export function getDemoScenario(relationship: RelationshipType) {
  return DEMO_SCENARIOS[relationship];
}

export function getDemoSession(id: string): MediationSession | null {
  return DEMO_SESSIONS[id] || null;
}
