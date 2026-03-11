import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const INDUSTRY_TTL = 60 * 60 * 24 * 30;
const THOUGHT_TTL  = 60 * 60 * 24 * 7;

export const maxDuration = 60;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  let body: any = {};
  try { const t = await req.text(); if (t) body = JSON.parse(t); } catch {}

  const mode         = body.mode || "industry";
  const forceRefresh = body.forceRefresh || false;
  const cacheKey     = mode === "industry" ? "narrative:industry" : "narrative:thought";
  const now          = new Date().toISOString().split("T")[0];

  if (!forceRefresh) {
    try {
      const cached = await redis.get(cacheKey) as string | null;
      if (cached) {
        const data = typeof cached === "string" ? JSON.parse(cached) : cached;
        return NextResponse.json({ ...data, fromCache: true });
      }
    } catch {}
  }

  const industryPrompt = `Today is ${now}. You are a market research analyst for Plaud AI (AI hardware: NotePin recorder, targeting professionals).

Based on your knowledge of AI industry trends from the past 6 months, provide insights on:
1. Enterprise AI adoption (productivity, meetings, note-taking tools)
2. Individual AI usage in daily work
3. AI hardware/wearable trends
4. Regional AI adoption differences
5. Key findings from major reports (McKinsey, Gartner, IDC, Stanford HAI, etc.)

Return ONLY raw JSON (no markdown, no code fences, no cite tags, no XML):
{
  "generatedAt": "${now}",
  "headline": "one compelling headline summarizing the biggest AI trend right now",
  "reports": [
    {
      "title": "report or finding title",
      "source": "source name",
      "url": "URL if you know it, otherwise empty string",
      "date": "month year",
      "keyFinding": "the most relevant finding in 1-2 sentences, plain text only",
      "relevanceToPlaud": "why this matters for Plaud in 1 sentence, plain text only",
      "category": "Enterprise AI | Consumer AI | AI Hardware | Regional Trends"
    }
  ],
  "bigPicture": "2-3 sentence synthesis, plain text only",
  "plaudOpportunity": "1-2 sentences on biggest opportunity for Plaud, plain text only"
}
Include 6-8 reports.`;

  const thoughtPrompt = `Today is ${now}. You are a PR strategist for Plaud AI.

Based on your knowledge of recent AI discussions (past 4 weeks), provide the most influential AI thought leader opinions. Focus on:
1. Top tech executives on AI at work (Sam Altman, Satya Nadella, Jensen Huang, etc.)
2. Influential investors/analysts on AI productivity tools
3. Hot debates in AI (jobs, privacy, ambient AI)
4. Viral opinions about AI work habits

Return ONLY raw JSON (no markdown, no code fences, no cite tags, no XML):
{
  "generatedAt": "${now}",
  "leaders": [
    {
      "name": "person name",
      "title": "their role",
      "quote": "their key statement, plain text only",
      "source": "platform or publication",
      "url": "URL if you know it, otherwise empty string",
      "date": "approximate date",
      "topic": "topic in 3-5 words",
      "relevanceToPlaud": "how Plaud can leverage this, plain text only",
      "sentiment": "opportunity | risk | neutral"
    }
  ],
  "hotDebate": "1-2 sentences on biggest AI debate right now, plain text only"
}
Include 6-8 thought leaders.`;

  const prompt = mode === "industry" ? industryPrompt : thoughtPrompt;

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
        max_tokens: 2000,
        system:     "You are a market research analyst. Respond ONLY with raw JSON. No markdown, no code fences, no XML tags, no cite tags.",
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    const data      = await res.json();
    const textBlock = data.content?.find((b: any) => b.type === "text")?.text || "{}";
    const cleaned   = textBlock.replace(/<cite[^>]*>|<\/cite>/g, "").replace(/```json|```/g, "").trim();
    const parsed    = JSON.parse(cleaned);

    const ttl = mode === "industry" ? INDUSTRY_TTL : THOUGHT_TTL;
    await redis.set(cacheKey, JSON.stringify(parsed), { ex: ttl });

    return NextResponse.json({ ...parsed, fromCache: false });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}