import { type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are the Zik4U Intelligence Analyst — the most advanced music behavioral intelligence system available to the music industry.

Unlike traditional analytics (Spotify for Artists, Chartmetric, Soundcharts), Zik4U measures what happens INSIDE the listening experience:
- Emotional states during listening (not just plays)
- Social behaviors around music (conversations, echoes, live sessions)
- Discovery chains (who found an artist first and influenced others)
- Rare synchronicities (strangers discovering the same obscure track simultaneously)
- Behavioral archetypes (how fans listen, not just what they listen to)
- Real-time collective mood (what the platform feels right now)

Your role: translate this behavioral and emotional data into actionable music industry intelligence for labels, A&R teams, distributors and researchers.

Data layers available (varies by plan):
- Virality scores: authentic momentum based on listening behavior — not social media vanity metrics
- Emotional intensity: derived from time-of-day, repetition rate, session depth
- Listener archetypes: 7 behavioral profiles (Night Explorer, Morning Warrior, Deep Feeler, Cultural Nomad, Obsessive Fan, Social Listener, Zen Drifter)
- Discovery velocity & First Heard data: who found the artist first and how fast adoption is spreading
- Social resonance: conversation threads, musical echo replies, live listening sessions
- Rare synchronicities: strangers discovering the same obscure tracks — the purest early-adopter signal
- Industry radar: what other labels are currently searching for
- Platform mood: real-time collective emotional state

Guidelines:
- Lead with the insight that changes a decision. Not the data — the implication.
- Be specific with numbers. "87 virality score" > "high virality score"
- Translate archetypes into business strategy: Night Explorers = late-night playlist, sync licensing opportunities; Deep Feelers = emotional brand partnerships; Obsessive Fans = merch/superfan strategy
- When you see rare synchronicities, flag them as the highest-confidence early signal available
- Tone: senior analyst at a top-tier A&R firm — direct, confident, no hedging

If asked about data not in the context, acknowledge the limit and offer the closest available inference.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function buildContext(
  apiKey: string,
  question: string,
  plan: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<string> {
  const artistMatch = question.match(
    /(?:about|for|artist|on|analyze|profile|comparing?)\s+([A-Z][a-zA-Z\s\-']+?)(?:\s+is|\s+has|\s+shows|\s+with|\s+and|\?|$)/i
  );
  const artistName = artistMatch?.[1]?.trim();

  let context = `## Zik4U Intelligence Context\n\n`;

  // ── 1. Virality leaderboard (tous les plans) ───────────────────────────
  const { data: leaderboard } = await supabase.rpc('get_virality_leaderboard', { p_limit: 15 });
  if (leaderboard?.length) {
    context += `### Virality Leaderboard (top 15, live)\n`;
    (leaderboard as any[]).forEach((a: any, i: number) => {
      context += `${i + 1}. ${a.artist_name} — virality: ${Math.round((a.virality_score ?? 0) * 100)}/100, listeners: ${a.unique_listeners ?? 0}, growth: ${a.growth_velocity ? Math.round(a.growth_velocity) + '%' : 'n/a'}, pre-viral: ${a.is_pre_viral ? 'YES' : 'no'}\n`;
    });
    context += '\n';
  }

  // ── 2. Profil artiste détaillé (si mentionné) ─────────────────────────
  if (artistName) {
    const { data: intel } = await supabase.rpc('get_artist_intelligence', {
      p_artist_name: artistName, p_days: 30,
    });
    if (intel && typeof intel === 'object') {
      context += `### Artist Profile: ${artistName}\n`;
      context += JSON.stringify(intel, null, 2) + '\n\n';
    }

    // First Heard data — qui a découvert cet artiste en premier
    const { data: firstHeard } = await supabase
      .from('artist_first_heard')
      .select('user_id, first_heard_at, influenced_count')
      .eq('artist_name', artistName)
      .order('first_heard_at', { ascending: true })
      .limit(5);

    if (firstHeard?.length) {
      const totalInfluenced = (firstHeard as any[]).reduce(
        (s: number, r: any) => s + (r.influenced_count ?? 0), 0
      );
      context += `### Discovery Chain: ${artistName}\n`;
      context += `- First discovered on Zik4U: ${new Date((firstHeard as any[])[0].first_heard_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}\n`;
      context += `- Total influenced discoveries: ${totalInfluenced} users led others to this artist\n`;
      context += `- Early adopter count: ${firstHeard.length} users tracked\n\n`;
    }

    // Conversations autour de cet artiste (Fil Rouge)
    const { data: threads } = await supabase
      .from('conversations')
      .select('id, thread_expires_at')
      .eq('thread_type', 'artist_thread')
      .eq('thread_artist', artistName)
      .gte('thread_expires_at', new Date().toISOString());

    if ((threads?.length ?? 0) > 0) {
      context += `### Social Engagement: ${artistName}\n`;
      context += `- Active conversation threads about this artist: ${threads!.length} (generated in last 7 days)\n`;
      context += `- This indicates strong social resonance — fans are actively discussing this artist\n\n`;
    }

    // Echo comments — réponses musicales à cet artiste
    if (plan !== 'discover') {
      const { data: echos } = await supabase
        .from('comments')
        .select('echo_track_title, echo_artist_name')
        .eq('echo_artist_name', artistName)
        .not('echo_track_title', 'is', null)
        .limit(10);

      if ((echos?.length ?? 0) > 0) {
        const uniqueTracks = [...new Set((echos as any[]).map((e: any) => e.echo_track_title))];
        context += `### Echo Responses (musical replies): ${artistName}\n`;
        context += `- ${echos!.length} users replied to posts about this artist with music\n`;
        context += `- Most echoed back: ${uniqueTracks.slice(0, 3).join(', ')}\n`;
        context += `- High echo count = strong emotional resonance\n\n`;
      }
    }
  }

  // ── 3. Archetypes distribution (tous les plans) ───────────────────────
  const { data: archetypes } = await supabase.rpc('get_archetype_distribution');
  if (archetypes?.length) {
    context += `### Platform Listener Archetype Distribution\n`;
    (archetypes as any[]).forEach((a: any) => {
      context += `- ${a.archetype}: ${a.count} users (${Math.round(a.percentage)}%)\n`;
    });
    context += '\n';
  }

  // ── 4. Mood collectif temps réel (Insight+) ───────────────────────────
  if (plan !== 'discover') {
    const { data: platformMood } = await supabase.rpc('get_platform_mood_now');
    if (platformMood) {
      const mood = platformMood as any;
      context += `### Platform Real-Time Mood (live)\n`;
      context += `- Dominant mood right now: ${mood.dominant_mood ?? 'unknown'}\n`;
      context += `- Active users with mood signal: ${mood.user_count ?? 0}\n`;
      if (mood.mood_breakdown) {
        context += `- Breakdown: ${JSON.stringify(mood.mood_breakdown)}\n`;
      }
      context += '\n';
    }

    // Emotional insights plateforme
    const { data: emotionalInsights } = await supabase.rpc('get_platform_emotional_insights');
    if (emotionalInsights) {
      const ei = emotionalInsights as any;
      context += `### Platform Emotional Intelligence\n`;
      context += `- Average emotional score: ${ei.avg_emotional_score ?? 'n/a'}/100\n`;
      context += `- Dominant platform mood (30d): ${ei.dominant_mood ?? 'n/a'}\n`;
      context += `- Vulnerability signal days: ${ei.vulnerability_days ?? 0}\n`;
      context += `- Recovery signal days: ${ei.recovery_days ?? 0}\n`;
      context += `- Mood trajectory: ${ei.mood_trajectory ?? 'stable'}\n\n`;
    }
  }

  // ── 5. Synchronicités rares (Intelligence+) ───────────────────────────
  if (plan === 'intelligence' || plan === 'enterprise') {
    const since6h = new Date(Date.now() - 6 * 3600_000).toISOString();
    const { data: rareSyncs } = await supabase.rpc('get_rare_synchronicities', {
      p_since: since6h,
      p_max_total_listeners: 50,
      p_min_sync_users: 2,
    });
    if ((rareSyncs as any[])?.length > 0) {
      context += `### Rare Synchronicities (last 6h) — Early Signal\n`;
      context += `These tracks were discovered simultaneously by multiple users — strong early-adopter signal:\n`;
      (rareSyncs as any[]).slice(0, 5).forEach((s: any) => {
        context += `- "${s.track_title}" by ${s.artist_name} — ${s.sync_count} simultaneous listeners (${s.total_platform_listeners} total on platform)\n`;
      });
      context += '\n';
    }

    // Artistes les plus recherchés par les partenaires
    const { data: topSearched } = await supabase.rpc('get_top_searched_artists', {
      p_days: 7, p_limit: 10,
    });
    if ((topSearched as any[])?.length > 0) {
      context += `### Most Searched Artists by Industry (last 7 days)\n`;
      context += `What other labels and researchers are currently investigating:\n`;
      (topSearched as any[]).forEach((a: any, i: number) => {
        context += `${i + 1}. ${a.artist_name} — ${a.search_count} searches by ${a.unique_partners} partner${Number(a.unique_partners) > 1 ? 's' : ''}\n`;
      });
      context += '\n';
    }

    // Pulse activity — artistes qui génèrent des sessions live
    const { data: pulseActivity } = await supabase
      .from('pulse_rooms')
      .select('artist_name, participant_count, created_at')
      .eq('status', 'active')
      .order('participant_count', { ascending: false })
      .limit(5);

    if ((pulseActivity?.length ?? 0) > 0) {
      context += `### Live Listening Rooms (active right now)\n`;
      context += `Artists generating live collective listening sessions:\n`;
      (pulseActivity as any[]).forEach((r: any) => {
        context += `- ${r.artist_name} — ${r.participant_count} listeners in sync right now\n`;
      });
      context += '\n';
    }
  }

  void apiKey;
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
          error: 'AI Analyst quota exhausted on Discover plan (10 questions/month). Upgrade to Insight for 100 questions/month.',
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

  // Récupérer le plan du partenaire pour moduler le contexte
  const { data: partnerPlan } = await supabase
    .from('partner_requests')
    .select('plan_requested')
    .eq('api_key', apiKey)
    .single();
  const plan = (partnerPlan?.plan_requested as string) ?? 'discover';

  const context = await buildContext(apiKey, question, plan, supabase);

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
