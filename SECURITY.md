# SECURITY.md: Security & Confidentiality Architecture

## 1. Zero Direct Credential Exposure
- `OPENAI_API_KEY` is strictly managed server-side in environment variables.
- It is never embedded in client JS, localStorage, or sent to browsers.

## 2. Server-Enforced Role Isolation
- Person B can never access Person A's private chat messages.
- Person A can never access Person B's private chat messages.
- The `getSafeSession` function projects only the caller's authorized messages before serializing JSON responses.
- Session IDs are cryptographically non-enumerable.

## 3. Data Minimization & Privacy
- Conversational data is ephemeral.
- No database logging of raw venting messages.
- Server-side rate limiting prevents automated scraping or denial-of-service abuse.
- Input length limits (2,000 characters) and HTML sanitization prevent payload injection and XSS.
