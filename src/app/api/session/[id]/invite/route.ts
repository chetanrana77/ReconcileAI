import { NextResponse } from 'next/server';
import { getSession, createInvitationForSession, initializePersonB, getSafeSession } from '@/lib/session/store';
import { ParticipantRole } from '@/lib/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const action = body.action as 'create' | 'join';

    const session = getSession(id);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (action === 'join') {
      initializePersonB(id);
      const safe = getSafeSession(id, 'b');
      return NextResponse.json(safe);
    }

    // Default: create invitation
    const invitation = createInvitationForSession(id);
    const safe = getSafeSession(id, (body.role as ParticipantRole) || 'a');
    return NextResponse.json({ invitation, session: safe });
  } catch (error) {
    console.error('Error handling invitation:', error);
    return NextResponse.json({ error: 'Failed to process invitation' }, { status: 500 });
  }
}
