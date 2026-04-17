import { NextResponse } from "next/server";

const PLATFORM_LIMITS: Record<string, number> = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
  threads: 500,
};

const PLATFORM_STYLES: Record<string, string> = {
  twitter: "Concise, punchy, under 280 characters. Use 2-3 relevant hashtags inline or at end. No filler words. Hook in first 5 words.",
  linkedin: "Professional yet human. 150-300 words. Start with a bold insight or question. Use line breaks for readability. 3-5 hashtags at end. Encourage professional engagement.",
  instagram: "Visual and aspirational. 100-200 words. Emojis used sparingly and purposefully. Strong opening line. 5-10 hashtags at end in a separate block.",
  threads: "Conversational and authentic. Under 500 characters. Feel like a genuine thought, not marketing copy. 1-2 hashtags max.",
};

const TONE_GUIDES: Record<string, string> = {
  professional: "Authoritative, data-driven, polished. Speak to business decision-makers.",
  casual: "Friendly, approachable, relatable. Like a smart colleague sharing a tip.",
  inspirational: "Visionary, motivating, forward-looking. Paint a picture of what's possible.",
  educational: "Clear, informative, step-by-step. Teach something valuable without being dry.",
};

const CONTENT_TYPE_ANGLES: Record<string, string> = {
  product_feature: "Highlight a specific Plaud feature or capability. Show the concrete benefit, not just the spec.",
  thought_leadership: "Share a bold POV on AI productivity, the future of work, or meeting intelligence. Position Plaud as a category creator.",
  engagement: "Ask a genuine question or share a relatable scenario that invites followers to comment or share their experience.",
  campaign: "Drive a specific action (download, trial, event attendance). Clear CTA, value proposition upfront.",
  use_case: "Tell a specific story of how someone uses Plaud — capture a meeting, extract insights, take action. Real-world outcome.",
};

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    platform = "linkedin",
    contentType = "product_feature",
    tone = "professional",
    topic = "",
    context = "",
    variationCount = 3,
  } = body;

  if (!topic.trim()) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const charLimit = PLATFORM_LIMITS[platform] || 500;
  const platformStyle = PLATFORM_STYLES[platform] || "";
  const toneGuide = TONE_GUIDES[tone] || "";
  const contentAngle = CONTENT_TYPE_ANGLES[contentType] || "";

  const systemPrompt = `You are a world-class social media content strategist for Plaud AI — an AI note-taking and conversation intelligence company.

BRAND IDENTITY:
- Mission: Amplify Human Intelligence
- Positioning: "AI Work Companion" (not just AI Note Taker)
- Core loop: Capture → Extract → Utilize
- Brand voice: Smart, confident, human-first, not overly corporate
- Brand colors/feel: Modern, clean, innovative
- Target audience: Knowledge workers, executives, founders, professionals who want to work smarter
- Key products: Plaud NotePin (wearable AI recorder), Plaud Note (mobile), Plaud Desktop, AI notes app

NARRATIVE PRIORITIES (2026):
- Primary: "AI Work Companion" (target 70% penetration, currently 38%)
- Secondary: "Conversation Intelligence" — turning spoken words into structured knowledge
- Core loop: Capture, Extract, Utilize
- Avoid: generic "AI assistant" language; lean into specificity

COMPETITORS (differentiate from):
- Otter.ai, Notion AI, reMarkable, traditional note apps

You create high-performing social content that feels authentic, drives engagement, and builds the Plaud brand.`;

  const userPrompt = `Create ${variationCount} distinct variations of social media content for ${platform.toUpperCase()}.

TOPIC: ${topic}
${context ? `ADDITIONAL CONTEXT: ${context}` : ""}

CONTENT TYPE: ${contentType.replace("_", " ")} — ${contentAngle}

TONE: ${tone} — ${toneGuide}

PLATFORM REQUIREMENTS for ${platform.toUpperCase()}:
- ${platformStyle}
- Character limit: ${charLimit} characters

INSTRUCTIONS:
- Each variation must feel distinctly different (different angle, hook, or structure)
- Never start two variations with the same word
- Include relevant hashtags appropriate to the platform
- Make it feel like a real person wrote it, not a marketing bot
- Each variation should subtly reinforce Plaud's "AI Work Companion" positioning without being forced

Return ONLY a raw JSON object (no markdown, no code fences) with this exact structure:
{
  "variations": [
    {
      "id": 1,
      "content": "full post text including hashtags",
      "hook": "the first line or opening hook",
      "hashtags": ["tag1", "tag2"],
      "charCount": 123,
      "angle": "brief description of the angle used for this variation"
    }
  ],
  "contentType": "${contentType}",
  "platform": "${platform}",
  "tone": "${tone}"
}`;

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
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await res.json();
    const raw = data.content?.find((b: any) => b.type === "text")?.text || "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
