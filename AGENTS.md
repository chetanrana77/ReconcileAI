<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RECONCILE AI — AGENT DIRECTIVE & AUTHORITATIVE INSTRUCTIONS

## 1. What Reconcile AI Is
Reconcile AI is an **AI Communication Mediator** and confidential bridge.
When two people cannot communicate without arguments or defensive silence, one person talks to Reconcile AI first.
Reconcile untangles their emotions, underlying needs, and true intent.
Instead of forwarding their raw/angry message, Reconcile translates the issue into a neutral, empathetic invitation for the other person.
Then Reconcile talks privately with the second person, understands their perspective, and reveals a joint Mediation Bridge.

- **Long-term Architecture**:
  ```
  PERSON A ↕ RECONCILE AI ↕ PERSON B
  ```
- **Core Product Promises**:
  - *"Reconcile is the AI you talk to when you don't know how to talk to them."*
  - *"Your words stay private. We help the other person understand what you mean."*
  - *"Don't pick a side. Understand both."*
  - *"Intention is not the same as impact."*

## 2. Core User Journey
1. **Landing**: "Some things are easier to say with someone in the middle."
2. **Talk to Reconcile**: Person A enters private, conversational intake ("Hey, I'm here. What's going on?").
3. **Adaptive Understanding**: Reconcile asks contextual follow-ups, gently challenges reactive assumptions, and identifies the underlying need.
4. **Invitation Generation**: Reconcile crafts a neutral summary of Person A's concern without raw hostility.
5. **Person B Private Intake**: Person B joins with their own confidential chat channel.
6. **Intention vs. Impact**: Reconcile explores Person B's intent and contrasts it with Person A's perceived impact.
7. **Joint Mediation Bridge**:
   - *Here's what I'm hearing* (both sides validated)
   - *Here's where things got crossed* (the actual disconnect)
   - *What you have in common* (shared values)
   - *A better conversation to start with* (ready-to-send de-escalating messages)
   - *Shared Agreement* (concrete next step)

## 3. Strict Privacy Boundaries
Every piece of information strictly belongs to:
- `PRIVATE_A`: Kept strictly with Person A; never exposed to Person B.
- `PRIVATE_B`: Kept strictly with Person B; never exposed to Person A.
- `SHARED`: Only neutral translations and consensus common ground.
- `AI_INTERNAL`: Internal analysis never exposed to either user.
This boundary is enforced server-side in `src/lib/session/store.ts` via `getSafeSession`.

## 4. Safety & Crisis Protocol
For high-risk topics (self-harm, suicide, physical violence, domestic abuse, stalking, sexual violence):
- Never treat as a normal communication disagreement.
- Display a dedicated, serious `SafetyNotice`.
- Provide direct crisis resources (988, 911, counselor support).
- Never diagnose psychiatric conditions or label someone "toxic" / "narcissist".

## 5. Offline Demo Mode (Mandatory)
Guaranteed to work offline without network, API keys, or cloud dependencies.
Flagship Event Demo:
**PARENT ↔ CHILD** (`demo-parent-child`)
- Child feels micromanaged and doubted about studies.
- Parent acts out of anxious love and fear of regret.
- Reconcile mediates the intention vs impact gap and creates shared harmony.
Also includes **Friend ↔ Friend** and **Sibling ↔ Sibling**.

## 6. What NOT to Build
- No user accounts / passwords / social login.
- No subscriptions / paywalls.
- No real-time peer-to-peer chat between participants (Reconcile is the mediator).
- No vector DBs / RAG pipelines.
- No native mobile apps (responsive web only).
