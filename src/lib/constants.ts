import { RelationshipType, EmotionType } from './types';

export const RELATIONSHIPS: {
  id: RelationshipType;
  label: string;
  emoji: string;
  description: string;
}[] = [
  { id: 'friend', label: 'Friend', emoji: '👋', description: 'A close pal or acquaintance' },
  { id: 'parent', label: 'Parent', emoji: '🏠', description: 'Mother, father, or guardian' },
  { id: 'sibling', label: 'Sibling', emoji: '👥', description: 'Brother or sister' },
  { id: 'partner', label: 'Partner', emoji: '❤️', description: 'Romantic significant other' },
  { id: 'classmate', label: 'Classmate', emoji: '📚', description: 'School or study group member' },
  { id: 'other', label: 'Other', emoji: '✨', description: 'Someone else' },
];

export const EMOTIONS: {
  id: EmotionType;
  label: string;
  emoji: string;
}[] = [
  { id: 'hurt', label: 'Hurt', emoji: '💔' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'ignored', label: 'Ignored', emoji: '👻' },
  { id: 'confused', label: 'Confused', emoji: '😕' },
  { id: 'disappointed', label: 'Disappointed', emoji: '😞' },
  { id: 'frustrated', label: 'Frustrated', emoji: '😤' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'left-out', label: 'Left out', emoji: '🧍' },
];

export const THINKING_STEPS = [
  'Let me think about this for a second...',
  'Looking at your side...',
  'Trying to see their side too...',
  'Finding where things got crossed...',
  'Okay, I think I see it.',
];

export const MAX_STORY_LENGTH = 2000;
export const MAX_REQUESTS_PER_MINUTE = 10;
export const APP_NAME = 'Reconcile AI';
export const APP_TAGLINE = "Don't pick a side. Understand both.";
