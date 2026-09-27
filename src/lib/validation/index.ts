import { ConflictInput, ReconcileResponse, RelationshipType, EmotionType } from '@/lib/types';

const MAX_STORY_LENGTH = 2000;

export function validateConflictInput(input: any): { valid: boolean; errors: string[]; sanitized?: ConflictInput } {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Invalid input format'] };
  }

  // Validate story
  if (!input.story || typeof input.story !== 'string') {
    errors.push('Story is required and must be text');
  } else if (input.story.trim().length === 0) {
    errors.push('Story cannot be empty');
  } else if (input.story.length > MAX_STORY_LENGTH) {
    errors.push(`Story must be ${MAX_STORY_LENGTH} characters or less`);
  }

  // Validate relationship
  if (!input.relationship || typeof input.relationship !== 'string') {
    errors.push('A valid relationship type is required');
  }

  // Validate emotions
  if (!Array.isArray(input.emotions) || input.emotions.length === 0) {
    errors.push('At least one emotion must be selected');
  } else if (!input.emotions.every((e: any) => typeof e === 'string')) {
    errors.push('Invalid emotion selected');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize story
  const sanitizedStory = input.story
    .replace(/<[^>]*>/g, '') // Strip HTML
    .trim();

  return {
    valid: true,
    errors: [],
    sanitized: {
      ...input,
      story: sanitizedStory,
      relationship: input.relationship as RelationshipType,
      emotions: input.emotions as EmotionType[]
    }
  };
}

export function validateAIResponse(response: unknown): { valid: boolean; data?: ReconcileResponse } {
  if (!response || typeof response !== 'object') {
    return { valid: false };
  }

  const r = response as Record<string, unknown>;

  // Check userPerspective
  if (!r.userPerspective || typeof r.userPerspective !== 'object') return { valid: false };
  const up = r.userPerspective as Record<string, unknown>;
  if (typeof up.summary !== 'string' || !Array.isArray(up.feelings)) return { valid: false };

  // Check otherPerspective
  if (!r.otherPerspective || typeof r.otherPerspective !== 'object') return { valid: false };
  const op = r.otherPerspective as Record<string, unknown>;
  if (typeof op.summary !== 'string' || !Array.isArray(op.possibleReasons)) return { valid: false };

  // Check misunderstanding
  if (!r.misunderstanding || typeof r.misunderstanding !== 'object') return { valid: false };
  const mu = r.misunderstanding as Record<string, unknown>;
  if (typeof mu.summary !== 'string' || typeof mu.userInterpretation !== 'string' || typeof mu.possibleOtherInterpretation !== 'string') return { valid: false };

  // Check commonGround
  if (!Array.isArray(r.commonGround) || r.commonGround.length === 0) return { valid: false };

  // Check reconciliationMessage
  if (typeof r.reconciliationMessage !== 'string' || r.reconciliationMessage.trim().length === 0) return { valid: false };

  return { valid: true, data: response as ReconcileResponse };
}
