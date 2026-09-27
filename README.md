# Reconcile AI

> **"Reconcile is the AI you talk to when you don't know how to talk to them."**
> 
> *"Your words stay private. We help the other person understand what you mean."*
> 
> *"Don't pick a side. Understand both."*

Reconcile AI is an **AI Communication Mediator** and confidential bridge. When two people are trapped in emotional conflict or defensive silence, one person talks to Reconcile AI first. Reconcile understands their real intent, emotions, and underlying needs. Instead of forwarding angry or reactive messages, Reconcile translates the issue into a neutral, compassionate invitation for the other person. Reconcile then consults privately with the second person, untangles intention vs. impact, and builds a shared Mediation Bridge.

---

## 🌟 The 3-Way Journey

```
PERSON A (Private Intake)
       ↕
RECONCILE AI (Neutral Translator & Mediator)
       ↕
PERSON B (Private Intake)
       ↓
JOINT MEDIATION BRIDGE (Shared Clarity)
```

1. **Person A Private Consultation**: Share what happened in your own words. Reconcile listens like a calm common friend, asking adaptive follow-ups to uncover what you really need.
2. **Neutral Translation & Invitation**: Reconcile drafts a transparent, neutral preview of your concern without raw anger. You review it before inviting the other person.
3. **Strict Privacy Isolation**: Raw words are NEVER cross-shared. Person B gets their own confidential chat channel.
4. **Person B Private Consultation**: Person B joins via `/join/[id]` and shares their side. Reconcile explores *Intention vs. Impact* (e.g., intended as care, experienced as micromanagement).
5. **Joint Mediation Bridge**:
   - *Here's what I'm hearing* (both sides validated)
   - *Here's where things got crossed* (the actual gap)
   - *What you have in common* (shared values and mutual goals)
   - *A better conversation to start with* (ready-to-send de-escalating messages)
   - *Shared Agreement* (concrete next step)

---

## 🎬 60–90 Second Event Demo Flow

### Flagship Demo: Parent ↔ Child
1. Open **http://localhost:3000**
2. Click **"Explore a Complete Mediation"** on the Parent ↔ Child card (or click **"Talk to Reconcile"**).
3. **Person A (Child)** speaks with Reconcile:
   - *"My parents keep asking about my studies. I know they're worried, but it feels like they don't trust me."*
   - Reconcile reflects the underlying need: *"It sounds like the questions make you feel doubted rather than supported."*
   - Click **"Invite them to Reconcile"**.
4. **Neutral Invitation Preview**:
   - See the transparent, neutral summary Reconcile prepared for the parent.
   - Click **"Simulate Person B (Parent) Joining"**.
5. **Person B (Parent)** speaks with Reconcile:
   - Parent explains: *"I'm just terrified they'll fall behind in college admissions. I only ask because I love them."*
   - Reconcile untangles **Intention vs. Impact**: *"Your intention was love and protection; the impact on them was feeling mistrusted. Both can be true."*
   - Click **"View Mediation Bridge"**.
6. **The Mediation Bridge**:
   - Side-by-side gap analysis (*Questions = "You think I'll fail"* vs *"I love you and want to help"*).
   - Common Ground & suggested weekly sync agreement.
   - Ready-to-send starter messages for both sides!
7. Finish with: **"Reconcile AI doesn't pick a side. It helps people understand each other."**

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Engine**: OpenAI GPT-4o-mini with structured JSON validation and resilient offline fallbacks

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional for Demo Mode)

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note**: Reconcile AI features complete **Demo Mode** and local fallback pipelines. You can explore and demonstrate the product without an OpenAI API key.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy Architecture

- **Strict Information Boundaries**:
  - `PRIVATE_A`: Only returned to Person A.
  - `PRIVATE_B`: Only returned to Person B.
  - `SHARED`: Neutral bridge data.
  - Enforced server-side in `src/lib/session/store.ts` via `getSafeSession`.
- **Zero Raw Message Forwarding**: Raw text is never exposed across roles.
- **Server-Side API Keys**: OpenAI keys are never exposed to the browser.
- **Crisis Screening**: Immediate safety detection for high-risk topics with redirection to 988/911.

---

## 📁 Project Architecture

```text
src/
├── app/
│   ├── api/
│   │   ├── session/
│   │   │   ├── route.ts              # Session creation & role-filtered retrieval
│   │   │   └── [id]/
│   │   │       ├── bridge/route.ts   # Joint mediation bridge synthesis
│   │   │       ├── invite/route.ts   # Neutral invitation & recipient join
│   │   │       └── message/route.ts  # Multi-turn chat & intent extraction
│   │   └── analyze/route.ts          # Legacy analysis endpoint
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

---

## 📄 License

MIT © Reconcile AI
