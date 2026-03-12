import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const INDUSTRY_TTL     = 60 * 60 * 24 * 30;
const THOUGHT_TTL      = 60 * 60 * 24 * 7;
const INSPIRATIONS_TTL = 60 * 60 * 24 * 14; // 2周更新一次

export const maxDuration = 60;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  let body: any = {};
  try { const t = await req.text(); if (t) body = JSON.parse(t); } catch {}

  const mode         = body.mode || "industry";
  const forceRefresh = body.forceRefresh || false;
  const cacheKey     = mode === "industry" ? "narrative:industry"
                     : mode === "thought"  ? "narrative:thought"
                     : "narrative:inspirations";
  const now = new Date().toISOString().split("T")[0];

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

  const inspirationsPrompt = `Today is ${now}. You are a brand strategist for Plaud AI, an AI hardware company (NotePin voice recorder, AI work companion, targeting professionals).

Based on your knowledge, identify the most creative and effective brand activation campaigns run by global AI companies in the past 60 days. Focus on:
1. Content marketing campaigns that went viral or generated significant PR
2. Social media activations (X, LinkedIn, TikTok, Instagram)
3. Community-building initiatives (Discord, events, ambassador programs)
4. Partnerships and co-marketing activations
5. Product launch campaigns and PR stunts
6. Thought leadership campaigns (CEO positioning, op-eds, talks)

For each campaign, explain WHY it worked and what Plaud can specifically learn or adapt.

Return ONLY raw JSON (no markdown, no code fences, no cite tags, no XML):
{
  "generatedAt": "${now}",
  "headline": "one sentence summarizing the biggest brand activation trend among AI companies right now",
  "campaigns": [
    {
      "brand": "company name",
      "campaign": "campaign name or description",
      "type": "Content Marketing | Social Media | Community | Partnership | PR Stunt | Thought Leadership | Product Launch",
      "date": "approximate month/period",
      "whatTheyDid": "2-3 sentences describing the activation, plain text only",
      "whyItWorked": "2 sentences on why it was effective, plain text only",
      "plaudTakeaway": "1-2 sentences on what Plaud can specifically learn or adapt from this, plain text only",
      "effort": "Low | Medium | High",
      "impact": "Low | Medium | High"
    }
  ],
  "bigInsight": "2-3 sentences on the overall brand activation trend Plaud should pay attention to, plain text only"
}
Include 6-8 campaigns. Prioritize campaigns with High impact. Be specific and concrete.`;

  const prompt = mode === "industry" ? industryPrompt
               : mode === "thought"  ? thoughtPrompt
               : inspirationsPrompt;

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
        system:     "You are a brand strategist. Respond ONLY with raw JSON. No markdown, no code fences, no XML tags, no cite tags.",
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    const data      = await res.json();
    const textBlock = data.content?.find((b: any) => b.type === "text")?.text || "{}";
    const cleaned   = textBlock.replace(/<cite[^>]*>|<\/cite>/g, "").replace(/```json|```/g, "").trim();
    const parsed    = JSON.parse(cleaned);

    const ttl = mode === "industry" ? INDUSTRY_TTL
              : mode === "thought"  ? THOUGHT_TTL
              : INSPIRATIONS_TTL;
    await redis.set(cacheKey, JSON.stringify(parsed), { ex: ttl });

    return NextResponse.json({ ...parsed, fromCache: false });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}