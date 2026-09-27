import { NextResponse } from 'next/server';
import { validateConflictInput } from '@/lib/validation';
import { checkSafety, getSafetyResponse } from '@/lib/safety';
import { rateLimit } from '@/lib/rate-limit';
import { analyzeConflict } from '@/lib/ai/provider';
import { getDemoScenario } from '@/lib/demo/scenarios';

export async function POST(req: Request) {
  try {
    // 1. Get IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    
    // 2. Rate limit check
    const rateLimitResult = rateLimit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429, headers: { 'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString() } }
      );
    }

    // 3. Parse body
    const body = await req.json();

    // 4. Handle demo mode
    if (body.demoMode) {
      const demoData = getDemoScenario(body.relationship);
      if (demoData) {
        return NextResponse.json(demoData.response, {
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
      }
    }

    // 5. Validate input
    const validationResult = validateConflictInput(body);
    if (!validationResult.valid || !validationResult.sanitized) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.errors },
        { status: 400 }
      );
    }

    // 6. Check safety
    const safetyFlag = checkSafety(validationResult.sanitized.story);
    if (!safetyFlag.isSafe && (safetyFlag.severity === 'critical' || safetyFlag.severity === 'high')) {
      return NextResponse.json(
        { 
          safetyFlag: true,
          message: getSafetyResponse(safetyFlag) 
        },
        { status: 200 }
      );
    }

    // 7. Call AI Provider
    let aiResponse;
    try {
      aiResponse = await analyzeConflict(validationResult.sanitized);
    } catch (aiErr) {
      console.warn('AI Provider unavailable or error, falling back to context-aware scenario:', aiErr);
      const fallback = getDemoScenario(validationResult.sanitized.relationship) || getDemoScenario('friend');
      if (fallback) {
        aiResponse = fallback.response;
      } else {
        throw aiErr;
      }
    }

    // 8. Return response
    return NextResponse.json(aiResponse, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });

  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: "Hmm, I couldn't quite process that. Let's try again." },
      { status: 500 }
    );
  }
}
