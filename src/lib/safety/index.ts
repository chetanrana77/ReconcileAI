import { SafetyFlag } from '@/lib/types';

const SAFETY_KEYWORDS = [
  'self-harm', 'suicide', 'kill', 'die', 'hurt myself', 'end my life',
  'abuse', 'violence', 'threat', 'weapon', 'murder', 'hit me',
  'beat me', 'stalk', 'rape', 'assault'
];

export function checkSafety(text: string): SafetyFlag {
  const lowerText = text.toLowerCase();
  
  const containsKeyword = SAFETY_KEYWORDS.some(keyword => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(lowerText);
  });

  if (!containsKeyword) {
    return { isSafe: true };
  }

  const criticalTerms = ['suicide', 'kill', 'die', 'hurt myself', 'end my life'];
  const highTerms = ['abuse', 'violence', 'threat', 'weapon', 'murder', 'hit me', 'beat me', 'rape', 'assault'];
  
  if (criticalTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(lowerText))) {
    return { isSafe: false, severity: 'critical', reason: 'Content indicates potential self-harm or immediate danger.' };
  }
  
  if (highTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(lowerText))) {
    return { isSafe: false, severity: 'high', reason: 'Content indicates potential violence or abuse.' };
  }
  
  return { isSafe: false, severity: 'medium', reason: 'Content contains concerning language.' };
}

export function getSafetyResponse(flag: SafetyFlag): string {
  switch (flag.severity) {
    case 'critical':
      return "This sounds more serious than a normal misunderstanding. Your safety matters more than resolving the conversation right now. Please reach out to emergency services (dial 112 in India), a trusted person, or India's 24/7 mental health helpline Tele-MANAS (dial 14416 / 1800 891 4416) or AASRA (+91 9820466726) immediately.";
    case 'high':
      return "It sounds like you might be dealing with a situation involving violence or abuse. Please prioritize your safety and reach out to a trusted adult, school counselor, or professional helpline to get the support you need.";
    case 'medium':
      return "This sounds like a very difficult and potentially unsafe situation. Consider speaking with a trusted adult or professional about what you're experiencing.";
    default:
      return "";
  }
}
