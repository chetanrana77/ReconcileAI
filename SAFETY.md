# SAFETY.md: Safety & Crisis Protocols

## 1. High-Risk Topic Screening
Reconcile AI monitors conversational inputs for:
- Self-harm and suicidal ideation
- Physical violence and threats
- Domestic abuse and intimate partner violence
- Stalking, extortion, and sexual exploitation
- Immediate danger

## 2. Protocol Upon Detection
If high-risk language is detected:
1. Reconcile halts standard mediation dialogue immediately.
2. The UI renders the dedicated, empathetic `SafetyNotice` component.
3. The user is provided with immediate, verified support resources:
   - National Suicide & Crisis Lifeline: Dial **988**
   - Emergency Services: Dial **911**
   - Domestic Violence Hotline: 1-800-799-SAFE
   - Guidance to reach out to a trusted adult, family member, or counselor.
4. No attempt is made to mediate situations involving domestic abuse or physical threats as though they were ordinary misunderstandings.
