# ARCHITECTURE.md: System Architecture

## 1. High-Level Flow
```
┌─────────────┐                      ┌─────────────┐
│  Person A   │                      │  Person B   │
└──────┬──────┘                      └──────▲──────┘
       │ [PRIVATE_A Chat]                   │ [PRIVATE_B Chat]
       ▼                                    │
┌───────────────────────────────────────────┴──────┐
│                  Reconcile AI                    │
│   • Intent & Emotion Understanding               │
│   • Neutral Communication Translation            │
│   • Privacy Boundary Enforcement (getSafeSession)│
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
         ┌───────────────────────────┐
         │   Joint Mediation Bridge  │
         │   • Intention vs. Impact  │
         │   • Common Ground         │
         │   • De-escalating Starters│
         └───────────────────────────┘
```

## 2. Directory Structure
```text
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # Single-party analysis endpoint
│   │   ├── session/
│   │   │   ├── route.ts              # Session creation & role-filtered retrieval
│   │   │   └── [id]/
│   │   │       ├── bridge/route.ts   # Joint mediation bridge synthesis
│   │   │       ├── invite/route.ts   # Neutral invitation & recipient join
│   │   │       └── message/route.ts  # Multi-turn chat & intent extraction
│   ├── join/[id]/page.tsx            # Person B invitation onboarding page
│   ├── globals.css                   # Custom tokens & keyframe animations
│   ├── layout.tsx                    # Root layout & typography
│   └── page.tsx                      # Home page entry
├── components/
│   ├── AppShell.tsx                  # Main mediation orchestrator
│   ├── landing/                      # Hero, HowItWorks, DemoSection, Navbar, Footer
│   ├── mediator/
│   │   ├── PrivateChat.tsx           # Private conversation card interface
│   │   ├── InvitationCard.tsx        # Neutral invite preview & share link
│   │   ├── MediationBridgeView.tsx   # 4-part joint mediation screen
│   │   └── RoleSwitcherBar.tsx       # Event demo perspective switcher
│   └── ui/                           # Button, Card, ErrorState, SafetyNotice
└── lib/
    ├── ai/
    │   ├── prompts.ts                # Mediator system prompt & bridge prompt
    │   └── provider.ts               # OpenAI client & local fallbacks
    ├── demo/
    │   └── scenarios.ts              # Flagship Parent-Child and demo scenarios
    ├── session/
    │   └── store.ts                  # Server-side session store & privacy filter
    ├── rate-limit/                   # In-memory IP rate limiter
    ├── safety/                       # Crisis keyword detection
    └── types.ts                      # Strict TypeScript data models
```

## 3. Strict Information Privacy
The server enforces four privacy categories:
- `PRIVATE_A`: Only returned when querying with role `'a'`.
- `PRIVATE_B`: Only returned when querying with role `'b'`.
- `SHARED`: Neutral summaries and consensus mediation points.
- `AI_INTERNAL`: Extracted schema flags not leaked to end users.
`getSafeSession` projects the session specifically for the requesting participant.
