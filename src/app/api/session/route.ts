import { NextResponse } from 'next/server';
import { createSession, getSafeSession, setSession } from '@/lib/session/store';
import { rateLimit } from '@/lib/rate-limit';
import { ParticipantRole, RelationshipType } from '@/lib/types';
import { DEMO_SESSIONS } from '@/lib/demo/scenarios';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const role = (searchParams.get('role') as ParticipantRole) || 'a';

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const safeSession = getSafeSession(id, role);
    if (!safeSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(safeSession, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitResult = rateLimit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const demoKey = body.demoKey as string | undefined;

    // Load prebuilt demo session if requested
    if (demoKey && DEMO_SESSIONS[demoKey]) {
      const cloned = JSON.parse(JSON.stringify(DEMO_SESSIONS[demoKey]));
      // generate a fresh active copy
      cloned.id = `${demoKey}-${Date.now().toString(36)}`;
      setSession(cloned);
      const safe = getSafeSession(cloned.id, (body.role as ParticipantRole) || 'a');
      return NextResponse.json(safe, { status: 201 });
    }

    const relationship = (body.relationship as RelationshipType) || 'parent';
    const topic = (body.topic as string) || undefined;

    const newSession = createSession(relationship, topic);
    const safe = getSafeSession(newSession.id, 'a');

    return NextResponse.json(safe, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
