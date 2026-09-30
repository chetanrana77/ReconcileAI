import { NextResponse } from 'next/server';
import { getSession, setSession, getSafeSession } from '@/lib/session/store';
import { checkSafety, getSafetyResponse } from '@/lib/safety';
import { generateMediatorReply } from '@/lib/ai/provider';
import { ChatMessage, ParticipantRole, SupportedLanguage, RelationshipType } from '@/lib/types';
import { detectLanguage, I18N_STRINGS } from '@/lib/i18n/translations';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { text, role = 'a', language: requestedLang, relationship: reqRelationship } = body as {
      text: string;
      role: ParticipantRole;
      language?: SupportedLanguage;
      relationship?: RelationshipType;
    };

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const session = getSession(id);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (reqRelationship) {
      session.relationship = reqRelationship;
    }

    // Determine active language: explicit parameter > dynamic detection from text > current session language > default 'en'
    let activeLang: SupportedLanguage = requestedLang || session.language || 'en';
    const detected = detectLanguage(text);
    if (detected !== 'en' && !requestedLang) {
      activeLang = detected;
    }
    session.language = activeLang;

    // Safety check on user input
    const safety = checkSafety(text);
    if (!safety.isSafe && (safety.severity === 'critical' || safety.severity === 'high')) {
      return NextResponse.json(
        {
          safetyFlag: true,
          message: getSafetyResponse(safety)
        },
        { status: 200 }
      );
    }

    const now = Date.now();
    const isRoleA = role === 'a';
    const participant = isRoleA ? session.personA : session.personB;

    if (!participant) {
      return NextResponse.json({ error: 'Participant not initialized' }, { status: 400 });
    }

    // 1. Append user's message
    const userMsg: ChatMessage = {
      id: `msg-${role}-${now}`,
      sender: 'user',
      role,
      text: text.trim().slice(0, 2000),
      timestamp: now,
      privacy: isRoleA ? 'PRIVATE_A' : 'PRIVATE_B'
    };

    participant.messages.push(userMsg);

    // 2. Generate Reconcile's reply and insight in active language
    const aiResult = await generateMediatorReply({
      relationship: session.relationship,
      topic: session.topic,
      role,
      participantLabel: participant.label,
      history: participant.messages,
      counterpartInsight: isRoleA ? session.personB?.insight : session.personA.insight,
      language: activeLang
    });

    const reassuranceNote =
      I18N_STRINGS[activeLang]?.reassuranceNote || 'Your conversation remains confidential.';

    const aiMsg: ChatMessage = {
      id: `msg-ai-${role}-${now + 1}`,
      sender: 'reconcile',
      role,
      text: aiResult.reply,
      timestamp: now + 1,
      privacy: isRoleA ? 'PRIVATE_A' : 'PRIVATE_B',
      quickReplies: aiResult.quickReplies,
      reassuranceNote,
      aiProvider: aiResult.aiProvider
    };

    participant.messages.push(aiMsg);
    participant.insight = aiResult.extractedInsight;

    // Check status progression
    if (isRoleA && aiResult.extractedInsight.readyToInvite && session.status === 'intake_a') {
      session.status = 'invite_created';
    } else if (!isRoleA && aiResult.extractedInsight.readyToInvite) {
      session.status = 'mediation_ready';
    }

    session.updatedAt = Date.now();
    setSession(session);

    const safeSession = getSafeSession(id, role);
    return NextResponse.json(safeSession);
  } catch (error) {
    console.error('Error in session message route:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
