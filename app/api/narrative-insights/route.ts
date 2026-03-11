export const maxDuration = 60;
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const INDUSTRY_TTL  = 60 * 60 * 24 * 30; // 30 天
const THOUGHT_TTL   = 60 * 60 * 24 * 7;  // 7 天

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  let body: any = {};
  try { const t = await req.text(); if (t) body = JSON.parse(t); } catch {}

  const mode = body.mode || "industry"; // "industry" | "thought"
  const forceRefresh = body.forceRefresh || false;
  const cacheKey = mode === "industry" ? "narrative:industry" : "narrative:thought";

  // ── 检查缓存 ──────────────────────────────────────────────
  if (!forceRefresh) {
    try {
      const cached = await redis.get(cacheKey) as string | null;
      if (cached) {
        const data = typeof cached === "string" ? JSON.parse(cached) : cached;
        return NextResponse.json({ ...data, fromCache: true });
      }
    } catch {}
  }

  // ── 用 Claude + web_search 生成内容 ──────────────────────
  const now = new Date().toISOString().split("T")[0];

  const industryPrompt = `Today is ${now}. You are a market research analyst for Plaud AI, a company making AI hardware (NotePin, AI recorder) targeting professionals.

Search the web for the LATEST AI industry research and market reports from the past 6 months. Focus on:
1. How enterprises are adopting AI tools (productivity, meetings, note-taking)
2. How individuals are using AI in daily work
3. AI hardware/wearable trends (devices, recorders, ambient AI)
4. Regional differences in AI adoption (US, Asia, Europe)
5. Key statistics and findings from major reports (McKinsey, Gartner, IDC, Stanford HAI, etc.)

IMPORTANT: 
- Write all findings as plain text. Do NOT include any XML tags, cite tags, or HTML in the text.
- For each report, include the actual URL of the source if available.

Return ONLY raw JSON (no markdown, no code fences):
{
  "generatedAt": "${now}",
  "headline": "one compelling headline summarizing the biggest AI trend right now",
  "reports": [
    {
      "title": "report or finding title",
      "source": "source name",
      "url": "actual URL of the report or article, or empty string if not available",
      "date": "month year",
      "keyFinding": "the most relevant finding in 1-2 sentences, plain text only",
      "relevanceToPlaud": "why this matters for Plaud's positioning in 1 sentence, plain text only",
      "category": "Enterprise AI | Consumer AI | AI Hardware | Regional Trends"
    }
  ],
  "bigPicture": "2-3 sentence synthesis, plain text only",
  "plaudOpportunity": "1-2 sentences, plain text only"
}
Include 6-8 reports/findings.`;

  const thoughtPrompt = `Today is ${now}. You are a PR strategist for Plaud AI.

Search the web for the most influential AI thought leader opinions and viral quotes from the PAST 4 WEEKS. Focus on:
1. What top tech executives are saying about AI at work (Sam Altman, Satya Nadella, Jensen Huang, etc.)
2. What influential investors/analysts are saying about AI productivity tools
3. Hot debates or controversies in AI (e.g. AI replacing jobs, privacy, ambient AI)
4. Viral LinkedIn/X posts or articles about AI work habits

IMPORTANT:
- Write all text as plain text. Do NOT include any XML tags, cite tags, or HTML.
- Include the actual URL where the quote or opinion was published.

Return ONLY raw JSON (no markdown, no code fences):
{
  "generatedAt": "${now}",
  "leaders": [
    {
      "name": "person name",
      "title": "their role/title",
      "quote": "their key statement or position, plain text only",
      "source": "where they said it (X, LinkedIn, interview, etc.)",
      "url": "actual URL of the source, or empty string if not available",
      "date": "approximate date",
      "topic": "what topic this is about",
      "relevanceToPlaud": "how Plaud can respond to or leverage this, plain text only",
      "sentiment": "opportunity | risk | neutral"
    }
  ],
  "hotDebate": "1-2 sentences on the biggest AI debate right now, plain text only"
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
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: "You are a market research analyst. After searching the web, respond ONLY with raw JSON. No markdown, no code fences, no extra text.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const textBlock = data.content?.find((b: any) => b.type === "text")?.text || "{}";
    const parsed = JSON.parse(textBlock.replace(/```json|```/g, "").trim());

    // 存入 Redis 缓存
    const ttl = mode === "industry" ? INDUSTRY_TTL : THOUGHT_TTL;
    await redis.set(cacheKey, JSON.stringify(parsed), { ex: ttl });

    return NextResponse.json({ ...parsed, fromCache: false });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}