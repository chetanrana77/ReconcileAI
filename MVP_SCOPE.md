# MVP_SCOPE.md: Alpha Prototype Scope

## 1. In Scope for Alpha
- **Two-Sided Communication Architecture**:
  - Person A private intake with Reconcile.
  - Person B private intake with Reconcile.
  - Strict server-side privacy boundaries (`PRIVATE_A`, `PRIVATE_B`, `SHARED`).
  - Raw messages are never cross-shared.
- **Adaptive Dialogue**:
  - Conversational card UI with natural typing and contextual quick replies.
  - Dynamic extraction of intent, emotions, and underlying needs.
- **Neutral Invitation System**:
  - Transparent preview of the neutral summary.
  - Shareable invitation link (`/join/[id]`).
  - Interactive fast-forward simulation button for live event demos.
- **Joint Mediation Bridge**:
  - Both sides summarized neutrally.
  - Intention vs. Impact analysis.
  - Common ground.
  - De-escalating starter messages.
  - Shared next-step agreement.
- **Event Demo Resilience**:
  - Flagship Demo: **Parent ↔ Child (Studies & Trust)**.
  - Friend ↔ Friend, Sibling ↔ Sibling.
  - Works 100% offline without live API keys or network connection.
- **Crisis Screening**:
  - Keyword safety interceptor with dedicated crisis helpline notice.

## 2. Explicitly Out of Scope
- User authentication, passwords, social login.
- Subscriptions, payment gateways.
- Real-time peer-to-peer chat between participants.
- Real WhatsApp Business API integration (architected for future addition).
- Vector databases, RAG memory pipelines.
- Native mobile applications (responsive web only).
