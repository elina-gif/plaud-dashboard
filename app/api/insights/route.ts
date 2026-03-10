import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

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
        system: "You are a senior PR strategist for Plaud AI. Respond ONLY in raw JSON. No markdown, no code fences, no extra text.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const raw = data.content?.find((b: any) => b.type === "text")?.text || "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}