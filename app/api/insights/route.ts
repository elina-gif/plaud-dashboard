import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  let body: any = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {}

  // ── 从 Redis 读取真实的 Meltwater 数据 ──────────────────
  let mwSummary = "No Meltwater data uploaded yet.";
  try {
    const mwRaw = await redis.get("meltwater") as string | null;
    if (mwRaw) {
      const mw = typeof mwRaw === "string" ? JSON.parse(mwRaw) : mwRaw;
      const rows: any[] = mw.rows || [];
      const date: string = mw.date || "";
      const tier1 = rows.filter((r: any) => (r.reach || 0) >= 1000000);
      const pos   = rows.filter((r: any) => (r.sentiment || "").includes("pos")).length;
      const neg   = rows.filter((r: any) => (r.sentiment || "").includes("neg")).length;
      const outlets = [...new Set(tier1.map((r: any) => r.outlet).filter(Boolean))].slice(0, 10).join(", ");
      const topTitles = tier1.slice(0, 5).map((r: any) => `"${r.title}" (${r.outlet}, reach: ${Number(r.reach).toLocaleString()})`).join("\n");
      mwSummary = `Meltwater data uploaded on ${date}:
- Total mentions: ${rows.length}
- Tier 1 articles (Reach >1M): ${tier1.length}
- Positive: ${pos}, Negative: ${neg}, Neutral: ${rows.length - pos - neg}
- Tier 1 outlets covered: ${outlets || "none"}
- Top Tier 1 articles:
${topTitles || "none"}`;
    }
  } catch {}

  // ── 模式 1：记者 Pitch 推荐 ──────────────────────────────
  if (body.journalistMode && body.journalists) {
    const prompt = `You are a senior PR strategist for Plaud AI.

Plaud's current narrative priorities:
- Primary: Position Plaud as "AI Work Companion" (currently only 38% penetration, target 70%)
- Secondary: "Conversation Intelligence" and "Capture, Extract, Utilize" loop
- Gap: Missing from Bloomberg, CNBC financial press
- Opportunity: Humane AI negative cycle = chance to position Plaud as "AI wearable that works"

Here are the journalists in Plaud's network:
${body.journalists}

Recommend the TOP 5 journalists to pitch THIS WEEK, ranked by priority.

Return ONLY a raw JSON array (no markdown, no code fences) with this exact structure:
[
  {
    "name": "journalist name",
    "outlet": "outlet name",
    "priority": "High",
    "angle": "specific pitch angle in one sentence",
    "reason": "why this journalist is the right fit right now in 1-2 sentences"
  }
]`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type":      "application/json",
          "x-api-key":         apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:     "You are a senior PR strategist. Respond ONLY in a raw JSON array. No markdown, no code fences, no extra text.",
          messages:   [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw  = data.content?.find((b: any) => b.type === "text")?.text || "[]";
      const recs = JSON.parse(raw.replace(/```json|```/g, "").trim());
      return NextResponse.json({ journalistRecs: recs });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // ── 模式 2：标准 Weekly Brief（使用真实数据）────────────
  const prompt = `Analyze Plaud AI's PR performance this week based on REAL data.

BRAND CONTEXT:
- Mission: Amplify Human Intelligence
- 2026 positioning target: AI Work Companion
- Core loop: Capture, Extract, Utilize
- Narrative gap: Still labeled "AI Note Taker" more than "AI Work Companion"
- Key outlets missing: Bloomberg, CNBC
- Competitors: Otter.ai ($100M ARR, enterprise push), Notion AI, reMarkable

REAL MELTWATER DATA THIS WEEK:
${mwSummary}

Based on the REAL data above, provide an honest and accurate PR analysis. If there is real Tier 1 coverage, acknowledge it specifically. Do not say there is zero coverage if the data shows otherwise.

Return ONLY raw JSON (no markdown, no code fences) with these exact keys:
- summary: string (2-3 sentence executive brief based on real data)
- insights: array of 4 strings (based on real data)
- actions: array of 5 strings
- risk: string (1 sentence)
- opportunity: string (1 sentence)`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system:     "You are a senior PR strategist for Plaud AI. Respond ONLY in raw JSON. No markdown, no code fences, no extra text.",
        messages:   [{ role: "user", content: prompt }],
      }),
    });
    const data   = await res.json();
    const raw    = data.content?.find((b: any) => b.type === "text")?.text || "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}