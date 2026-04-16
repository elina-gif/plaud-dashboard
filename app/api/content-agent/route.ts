import { NextResponse } from "next/server";

// ── Brand voice constants ─────────────────────────────────────
const BRAND_CONTEXT = `
BRAND: Plaud AI — NotePin (AI Work Companion hardware)
MISSION: Amplify Human Intelligence
TAGLINE: The AI that works WITH you, not just FOR you

CORE VALUE PROPOSITION — "Capture → Extract → Utilize":
  • Capture: Records any voice conversation or meeting hands-free
  • Extract: Distills raw audio into structured intelligence (summaries, action items, insights)
  • Utilize: Surfaces extracted knowledge into your workflows (email drafts, project notes, decisions)

2026 NARRATIVE TARGETS (guide every post):
  ✅ PUSH: "AI Work Companion" (currently 38% penetration → target 70%)
  ✅ PUSH: "Conversation Intelligence" (29% → target 65%)
  ✅ PUSH: "Capture, Extract, Utilize" loop (18% → target 60%)
  ❌ AVOID: "AI Note Taker" framing (62% → target 40%) — too passive, undersells the product

AUDIENCE: Knowledge workers, executives, consultants, researchers, product managers
TONE: Professional yet human. Confident, not arrogant. Forward-thinking. Empowering.
COMPETITORS TO REFERENCE (carefully): Otter.ai (pure software, enterprise), Notion AI, reMarkable
DIFFERENTIATOR: The only AI work companion that combines hardware (always-on capture) + AI intelligence + workflow integration

DO NOT:
  - Call it a "note-taker" or "transcription tool"
  - Use hollow buzzwords like "game-changer", "revolutionary"
  - Be salesy or promotional — be insightful and credible
  - Use generic productivity advice

DO:
  - Frame around the professional outcome, not the feature
  - Connect to the broader AI-at-work conversation
  - Use specific, concrete scenarios (e.g., "post-client-call", "after a board meeting")
  - Sound like a practitioner, not a marketer
`;

const CONTENT_TYPES: Record<string, string> = {
  thought_leadership: "Thought leadership — original insight or POV on AI, the future of work, or conversation intelligence. Position Plaud as a category creator, not just a product.",
  product_story:      "Product story — tell the Capture→Extract→Utilize story through a specific real-world professional scenario. Show the transformation, not the features.",
  use_case:           "Use case — one vivid, specific professional situation where the AI Work Companion changes the outcome. Make readers recognize themselves in it.",
  industry_commentary:"Industry commentary — react to a real AI or productivity trend in the news. Connect it to Plaud's POV without mentioning competitors negatively.",
  engagement:         "Engagement post — ask a question or share a provocative observation that sparks a discussion among knowledge workers about meetings, memory, and AI.",
  campaign:           "Brand campaign — push the 'Amplify Human Intelligence' mission. Emotionally resonant, vision-forward, shareable.",
};

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  let body: any = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {}

  const platform    = body.platform    || "linkedin";   // "x" | "linkedin"
  const contentType = body.contentType || "thought_leadership";
  const topic       = body.topic       || "";
  const angle       = body.angle       || "";

  const contentTypeDesc = CONTENT_TYPES[contentType] || CONTENT_TYPES.thought_leadership;

  // ── Platform rules ────────────────────────────────────────
  const platformRules = platform === "x"
    ? `PLATFORM: X (Twitter)
FORMAT OPTIONS:
  Option A — Single tweet: max 260 characters (hard limit). Punchy, quotable, opinionated.
  Option B — Thread starter: 260-char hook tweet that begs to be continued. End with "🧵" or "Thread:".
  Option C — Single tweet (question or stat): opens with a bold number or question.
HASHTAGS: 1–2 only. Prefer: #AIWorkCompanion #ConversationIntelligence #FutureOfWork #PlaudAI
STYLE: Direct. No filler. Strong first 5 words. High signal-to-noise ratio.
OUTPUT NOTE: The "text" field must be the tweet ready to post — including hashtags if used.`
    : `PLATFORM: LinkedIn
FORMAT: 900–1800 characters (sweet spot). Professional storytelling voice.
STRUCTURE:
  • Line 1: Hook — bold statement or question (this is what appears before "...see more")
  • Lines 2–4: Build the insight or story with a blank line between paragraphs
  • Last paragraph: Takeaway or call-to-reflection (not a CTA to buy)
HASHTAGS: 3–5 at the end. Prefer: #AIWorkCompanion #ConversationIntelligence #FutureOfWork #PlaudAI #ArtificialIntelligence
STYLE: Personal, credible, slightly vulnerable. Sounds like a practitioner sharing a real observation.
OUTPUT NOTE: The "text" field must include proper line breaks (\\n) between paragraphs, and hashtags on the last line.`;

  const topicContext = topic
    ? `TOPIC/ANGLE REQUESTED BY USER: "${topic}"${angle ? `\nSPECIFIC ANGLE: "${angle}"` : ""}`
    : "Choose the most timely and relevant topic aligned with the brand context above.";

  const prompt = `${BRAND_CONTEXT}

${platformRules}

CONTENT TYPE: ${contentTypeDesc}

${topicContext}

Generate exactly 3 distinct post options. Each must take a DIFFERENT angle or hook — variety is essential.

Return ONLY a raw JSON array (no markdown, no code fences) with this exact structure:
[
  {
    "text": "the full post text ready to copy-paste, with proper line breaks using \\n for LinkedIn",
    "hashtags": ["#Tag1", "#Tag2"],
    "narrative": "which Plaud narrative goal this serves (e.g. AI Work Companion, Capture→Extract→Utilize)",
    "hook": "1 sentence describing what makes this version distinctive",
    "charCount": 0
  }
]

After writing each post, calculate the actual character count (including hashtags) and set charCount accurately.`;

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
        max_tokens: 3000,
        system:     "You are Plaud AI's senior brand strategist and content writer. You write sharp, credible social content that builds category leadership — never salesy, always insightful. Respond ONLY in a raw JSON array. No markdown, no code fences, no extra text.",
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const raw  = data.content?.find((b: any) => b.type === "text")?.text || "[]";

    let posts: any[] = [];
    try {
      posts = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      return NextResponse.json({ error: "Failed to parse Claude response", raw }, { status: 500 });
    }

    // Recalculate charCount server-side as a sanity check
    posts = posts.map((p: any) => ({
      ...p,
      charCount: (p.text || "").length,
    }));

    return NextResponse.json({ posts, platform, contentType });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
