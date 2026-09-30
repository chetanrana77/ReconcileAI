import { NextResponse } from 'next/server';
import { getSession, setSession, getSafeSession } from '@/lib/session/store';
import { generateMediationBridge } from '@/lib/ai/provider';
import { ParticipantRole } from '@/lib/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const role = (body.role as ParticipantRole) || 'a';

    const session = getSession(id);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!session.bridge) {
      const pAInsight = session.personA.insight || {
        intent: "Seeking understanding and trust",
        emotions: ["frustrated", "anxious"],
        underlyingNeed: "Autonomy and reassurance",
        readyToInvite: true
      };

      const pBInsight = session.personB?.insight || {
        intent: "Expressing care and concern for their future",
        emotions: ["protective", "loving"],
        underlyingNeed: "Peace of mind and connection",
        intentionVsImpact: "Intended as guidance; experienced as micromanagement",
        readyToInvite: true
      };

      const bridge = await generateMediationBridge({
        relationship: session.relationship,
        topic: session.topic,
        personAInsight: pAInsight,
        personBInsight: pBInsight,
        language: session.language || 'en'
      });

      session.bridge = bridge;
      session.status = 'mediation_ready';
      session.updatedAt = Date.now();
      setSession(session);
    }

    const safe = getSafeSession(id, role);
    return NextResponse.json(safe);
  } catch (error) {
    console.error('Error in bridge route:', error);
    return NextResponse.json({ error: 'Failed to generate bridge' }, { status: 500 });
  }
}
