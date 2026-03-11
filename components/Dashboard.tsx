import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  const body = await req.json().catch(() => ({}));

  // ── 模式 1：记者 Pitch 推荐 ──────────────────────────────
  if (body.journalistMode && body.journalists) {
    const prompt = `You are a senior PR strategist for Plaud AI.

Plaud's current narrative priorities:
- Primary: Position Plaud as "AI Work Companion" (currently only 38% penetration, target 70%)
- Secondary: "Conversation Intelligence" and "Capture → Extract → Utilize" loop
- Gap: Missing from Bloomberg, CNBC financial press
- Opportunity: Humane AI negative cycle = chance to position Plaud as "AI wearable that works"

Here are the journalists in Plaud's network:
${body.journalists}

Recommend the TOP 5 journalists to pitch THIS WEEK, ranked by priority.
For each, provide a specific pitch angle aligned with Plaud's narrative needs.

Return ONLY raw JSON array (no markdown) with this structure:
[
  {
    "name": "journalist name",
    "outlet": "outlet name",
    "priority": "High" | "Medium" | "Low",
    "angle": "specific pitch angle in one sentence",
    "reason": "why this journalist is the right fit right now (1-2 sentences)"
  }
]`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a senior PR strategist. Respond ONLY in raw JSON array. No markdown, no code fences.",
          messages: [{ role: "user", content: prompt }],
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

  // ── 模式 2：标准 Weekly Brief ────────────────────────────
  const prompt = `Analyze Plaud AI's PR performance this week.

BRAND CONTEXT:
- Mission: Amplify Human Intelligence
- 2026 positioning target: AI Work Companion
- Core loop: Capture, Extract, Utilize
- Narrative gap: Still labeled "AI Note Taker" more than "AI Work Companion"
- Key outlets missing: Bloomberg, CNBC
- Competitors: Otter.ai, Notion AI, reMarkable

Return ONLY raw JSON (no markdown, no code fences) with these exact keys:
- summary: string (2-3 sentence executive brief)
- insights: array of 4 strings
- actions: array of 5 strings
- risk: string (1 sentence)
- opportunity: string (1 sentence)`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a senior PR strategist for Plaud AI. Respond ONLY in raw JSON. No markdown, no code fences.",
        messages: [{ role: "user", content: prompt }],
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