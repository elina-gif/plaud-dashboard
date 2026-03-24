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

  const industryPrompt = `Today is ${now}. You are a high-level market research analyst for Plaud AI. 
  
  IMPORTANT: You must provide ACTUAL 2026 industry news and reports. If you cannot browse the live web, simulate the most plausible T3 2026 trends based on the current AI trajectory (Agentic AI, NotePin competitors, etc.).
  
  MANDATORY: Every report MUST have a realistic "url". If you don't have the exact deep link, provide the official report landing page or news portal link (e.g., https://www.gartner.com/en/newsroom, https://openai.com/news, etc.). DO NOT leave URL empty.

  Return ONLY raw JSON (no markdown):
  {
    "generatedAt": "${now}",
    "headline": "2026 AI Trend: [Insert specific 2026 trend]",
    "reports": [
      {
        "title": "Specific 2026 Report Name",
        "source": "Gartner | IDC | Forrester | TechCrunch",
        "url": "https://www.gartner.com/en/newsroom",
        "date": "March 2026",
        "keyFinding": "1-2 sentences on a 2026 specific discovery.",
        "relevanceToPlaud": "How NotePin leverages this.",
        "category": "Enterprise AI | Consumer AI | AI Hardware | Regional Trends"
      }
    ],
    "bigPicture": "Synthesis of 2026 landscape.",
    "plaudOpportunity": "Specific tactical move for Plaud now."
  }
  Include 6-8 reports.`;

  const thoughtPrompt = `Today is ${now}. You are a PR strategist. Provide the most influential AI thought leader opinions from MARCH 2026.
  
  FOCUS ON: Sam Altman's 2026 vision, Agentic workflows, and AI Hardware sentiment.
  
  MANDATORY: Every leader MUST have a "url" (e.g., their LinkedIn, X profile, or a recent interview link like https://www.theverge.com). DO NOT leave URL empty.

  Return ONLY raw JSON (no markdown):
  {
    "generatedAt": "${now}",
    "leaders": [
      {
        "name": "Full Name",
        "title": "Current 2026 Role",
        "quote": "A specific statement made in 2026.",
        "source": "X | LinkedIn | Wired | Verge",
        "url": "https://x.com/samA",
        "date": "March 2026",
        "topic": "Topic name",
        "relevanceToPlaud": "PR angle for Plaud.",
        "sentiment": "opportunity | risk | neutral"
      }
    ],
    "hotDebate": "The #1 AI controversy in March 2026."
  }
  Include 6-8 leaders.`;

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