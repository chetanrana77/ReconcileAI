export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

export function rateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): RateLimitResult {
  const now = Date.now();
  
  // Clean up old entries
  for (const [key, entry] of rateLimits.entries()) {
    if (now > entry.resetTime) {
      rateLimits.delete(key);
    }
  }

  const currentEntry = rateLimits.get(identifier);

  if (!currentEntry) {
    rateLimits.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    };
  }

  if (now > currentEntry.resetTime) {
    currentEntry.count = 1;
    currentEntry.resetTime = now + windowMs;
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: currentEntry.resetTime
    };
  }

  if (currentEntry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: currentEntry.resetTime
    };
  }

  currentEntry.count += 1;
  return {
    success: true,
    remaining: maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime
  };
}
