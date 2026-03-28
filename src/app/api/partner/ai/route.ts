import { type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are the Zik4U Intelligence Analyst — an expert music industry advisor with access to exclusive emotional and behavioral listening data from the Zik4U social network.

Your role: answer questions from music labels, A&R teams, distributors and researchers using the Zik4U data provided as context. Be direct, actionable, and specific. Think like a senior music industry analyst who has studied this data deeply.

Data available in context:
- Virality scores (0-100) based on authentic listening patterns — not social media noise
- Emotional intensity scores derived from listening behavior (time of day, repetition rate, session depth)
- Listener archetypes: Night Explorer, Morning Warrior, Deep Feeler, Cultural Nomad, Obsessive Fan, Social Listener, Zen Drifter
- Discovery velocity: who found the artist first and how fast discovery is accelerating
- Fan engagement depth: streak milestones, achievement unlocks, loyalty retention at 30/60/90 days
- Crossover maps: which artists share listeners
- Mood journeys: how fans' emotional states transition during listening sessions
- First Heard data: the exact moment Zik4U users first discovered an artist

Guidelines:
- Always ground your answers in the specific data provided — never fabricate metrics
- Be concise: lead with the key insight, then explain the data behind it
- Use concrete numbers from the context
- When data is insufficient, say so clearly and suggest what additional data would help
- Translate data into actionable recommendations: signing decisions, playlist strategy, marketing timing, collaboration potential
- Tone: professional, confident, like a trusted advisor — not a data report

If asked about something outside the provided data, acknowledge the limitation and offer what you can infer from what's available.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function buildContext(
  apiKey: string,
  question: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<string> {
  // Extraire un nom d'artiste de la question si présent
  const artistMatch = question.match(
    /(?:about|for|artist|on|analyze|profile)\s+([A-Z][a-zA-Z\s]+?)(?:\s+is|\s+has|\s+shows|\s+with|\?|$)/i
  );
  const artistName = artistMatch?.[1]?.trim();

  let context = `## Zik4U Platform Context\n\n`;

  // Toujours inclure le virality leaderboard
  const { data: leaderboard } = await supabase.rpc('get_virality_leaderboard', { p_limit: 10 });
  if (leaderboard?.length) {
    context += `### Top 10 Virality Leaderboard (current)\n`;
    (leaderboard as any[]).forEach((a: any, i: number) => {
      context += `${i + 1}. ${a.artist_name} — virality: ${Math.round((a.virality_score ?? 0) * 100)}/100, listeners: ${a.unique_listeners ?? 0}, growth: ${a.growth_velocity ? Math.round(a.growth_velocity) + '%' : 'n/a'}\n`;
    });
    context += '\n';
  }

  // Si un artiste est mentionné, récupérer son profil complet
  if (artistName) {
    const { data: intel } = await supabase.rpc('get_artist_intelligence', {
      p_artist_name: artistName,
      p_days: 30,
    });
    if (intel && typeof intel === 'object') {
      context += `### Artist Profile: ${artistName}\n`;
      context += JSON.stringify(intel, null, 2) + '\n\n';
    }
  }

  // Archetypes distribution
  const { data: archetypes } = await supabase.rpc('get_archetype_distribution');
  if (archetypes?.length) {
    context += `### Listener Archetype Distribution (platform-wide)\n`;
    (archetypes as any[]).forEach((a: any) => {
      context += `- ${a.archetype}: ${a.count} users (${Math.round(a.percentage)}%)\n`;
    });
    context += '\n';
  }

  void apiKey; // utilisé en amont pour la vérification quota

  return context;
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-zik4u-key');

  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 });
  }

  let body: { question: string; history?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { question, history = [] } = body;
  if (!question?.trim()) {
    return Response.json({ error: 'question is required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Vérifier et incrémenter le quota
  const { data: quota } = await supabase.rpc('check_and_increment_ai_quota', {
    p_api_key: apiKey,
  });

  if (!quota || !quota.allowed) {
    const reason = (quota?.reason as string) ?? 'unknown';
    if (reason === 'quota_exceeded') {
      return Response.json(
        {
          error: 'Monthly AI quota exceeded',
          used: quota.used,
          limit: quota.limit,
          reset_at: quota.reset_at,
          upgrade_url: 'https://zik4u.com/partner',
        },
        { status: 429 }
      );
    }
    if (reason === 'plan_no_ai') {
      return Response.json(
        {
          error: 'AI Analyst is not available on the Discover plan. Upgrade to Insight or Intelligence.',
          upgrade_url: 'https://zik4u.com/partner',
        },
        { status: 403 }
      );
    }
    return Response.json({ error: 'Access denied' }, { status: 403 });
  }

  const rateLimit = await checkRateLimit(apiKey, 'ai');
  if (!rateLimit.allowed) {
    return Response.json(
      { error: 'AI rate limit exceeded — 10 requests per hour', reset_at: rateLimit.resetAt },
      { status: 429 }
    );
  }

  // Construire le contexte Zik4U
  const context = await buildContext(apiKey, question, supabase);

  // Construire les messages pour Claude
  const messages = [
    ...history.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
    {
      role: 'user' as const,
      content: `${context}\n\n## Question\n${question}`,
    },
  ];

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    console.error('[partner/ai] ANTHROPIC_API_KEY not configured');
    return Response.json({ error: 'AI service not configured' }, { status: 503 });
  }

  // Appel Claude API
  const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!claudeRes.ok) {
    const err = await claudeRes.json().catch(() => ({}));
    console.error('[partner/ai] Claude error:', err);
    return Response.json({ error: 'AI service temporarily unavailable' }, { status: 503 });
  }

  const claudeData = await claudeRes.json();
  const answer = (claudeData.content?.[0]?.text as string) ?? '';

  return Response.json({
    answer,
    quota: {
      used: quota.used,
      limit: quota.limit,
      unlimited: quota.unlimited ?? false,
      remaining: quota.unlimited ? null : (quota.remaining ?? 0),
    },
  });
}
