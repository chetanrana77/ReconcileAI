import { NextResponse } from 'next/server';

async function testGemini(key: string) {
  const startTime = Date.now();
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with 1 word: "ready"' }] }],
          generationConfig: { maxOutputTokens: 5 }
        })
      }
    );

    const latencyMs = Date.now() - startTime;
    if (res.ok) {
      return { ok: true, latencyMs };
    }
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err?.error?.message || 'Invalid API key or model unreachable' };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Network error connecting to Gemini API' };
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paramKey = searchParams.get('key');
  const headerKey = req.headers.get('x-gemini-key');
  const geminiKey = paramKey || headerKey || process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const result = {
    geminiConfigured: !!geminiKey,
    anthropicConfigured: !!anthropicKey,
    openAiConfigured: !!openAiKey,
    activeProvider: 'local' as 'gemini' | 'claude' | 'openai' | 'local',
    modelName: 'Reconcile Local Conversational Engine',
    status: 'fallback' as 'connected' | 'fallback',
    latencyMs: 0,
    message: 'Running on Reconcile Local Conversational Engine (Offline Ready)'
  };

  // 1. Check Gemini (Primary)
  if (geminiKey) {
    const check = await testGemini(geminiKey);
    if (check.ok) {
      result.activeProvider = 'gemini';
      result.modelName = 'Google Gemini 1.5 Flash';
      result.status = 'connected';
      result.latencyMs = check.latencyMs || 0;
      result.message = `Connected & Answering Live via Gemini 1.5 Flash (${check.latencyMs}ms)`;
      return NextResponse.json(result);
    }
  }

  // 2. Check Anthropic Claude
  if (anthropicKey) {
    result.activeProvider = 'claude';
    result.modelName = 'Anthropic Claude 3.5 Haiku';
    result.status = 'connected';
    result.message = 'Configured with Anthropic Claude 3.5 Haiku';
    return NextResponse.json(result);
  }

  // 3. Check OpenAI
  if (openAiKey) {
    result.activeProvider = 'openai';
    result.modelName = 'OpenAI GPT-4o-mini';
    result.status = 'connected';
    result.message = 'Configured with OpenAI GPT-4o-mini';
    return NextResponse.json(result);
  }

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = body.key?.trim() || req.headers.get('x-gemini-key')?.trim();

    if (!key) {
      return NextResponse.json(
        { error: 'Please provide a valid Gemini API key to test.' },
        { status: 400 }
      );
    }

    const check = await testGemini(key);
    if (check.ok) {
      return NextResponse.json({
        ok: true,
        status: 'connected',
        activeProvider: 'gemini',
        modelName: 'Google Gemini 1.5 Flash',
        latencyMs: check.latencyMs,
        message: `Successfully connected to Gemini 1.5 Flash! (${check.latencyMs}ms)`
      });
    }

    return NextResponse.json({
      ok: false,
      status: 'error',
      error: check.error || 'Failed to verify Gemini API Key'
    }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
