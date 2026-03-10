// scripts/update-dashboard.mjs
import fs from "fs";
import path from "path";

// ─── RSS 数据源配置 ──────────────────────────────────────────
const FEEDS = [
  { outlet: "TechCrunch",   traffic: "10M+", url: "https://techcrunch.com/feed/" },
  { outlet: "The Verge",    traffic: "15M+", url: "https://www.theverge.com/rss/index.xml" },
  { outlet: "Wired",        traffic: "20M+", url: "https://www.wired.com/feed/rss" },
  { outlet: "Forbes Tech",  traffic: "70M+", url: "https://www.forbes.com/technology/feed/" },
  { outlet: "CNET",         traffic: "30M+", url: "https://www.cnet.com/rss/news/" },
  { outlet: "ZDNET",        traffic: "8M+",  url: "https://www.zdnet.com/news/rss.xml" },
  { outlet: "Engadget",     traffic: "5M+",  url: "https://www.engadget.com/rss.xml" },
  { outlet: "Tom's Guide",  traffic: "8M+",  url: "https://www.tomsguide.com/feeds/all" },
];

// ─── 关键词匹配 ──────────────────────────────────────────────
const KEYWORDS = {
  Plaud:       ["plaud", "notepin", "plaud note", "plaud desktop"],
  "Otter.ai":  ["otter.ai", "otter ai", "otterai"],
  "Notion AI": ["notion ai", "notion intelligence"],
  reMarkable:  ["remarkable 2", "remarkable paper", "remarkable"],
};

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// ─── RSS 解析 ────────────────────────────────────────────────
function parseRSS(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const b       = m[1];
    const title   = (/<title><!\[CDATA\[(.*?)\]\]>/.exec(b) || /<title>(.*?)<\/title>/.exec(b))?.[1]?.trim() || "";
    const link    = /<link>(.*?)<\/link>/.exec(b)?.[1]?.trim() || "";
    const pubDate = /<pubDate>(.*?)<\/pubDate>/.exec(b)?.[1]?.trim() || "";
    if (title) items.push({ title, link, pubDate });
  }
  return items;
}

function detectSentiment(title) {
  const t   = title.toLowerCase();
  const pos = ["excellent","best","great","impressive","award","launch","win","thriving","top","love"];
  const neg = ["bad","fail","worst","problem","disappoint","overpromise","concern","struggle"];
  if (pos.some(w => t.includes(w))) return "Positive";
  if (neg.some(w => t.includes(w))) return "Negative";
  return "Neutral";
}

function detectType(title) {
  const t = title.toLowerCase();
  if (t.includes("review") || t.includes("hands-on"))          return "Review";
  if (t.includes("interview") || t.includes("ceo"))            return "Interview";
  if (t.includes("how") || t.includes("why") || t.includes("guide")) return "Feature";
  return "News";
}

// ─── Step 1: 抓取 RSS ────────────────────────────────────────
async function scrapeCoverage() {
  const results = [];
  const cutoff  = Date.now() - THIRTY_DAYS;

  await Promise.allSettled(
    FEEDS.map(async ({ outlet, traffic, url }) => {
      try {
        const res   = await fetch(url, { headers: { "User-Agent": "PlaudPRBot/1.0" } });
        if (!res.ok) return;
        const xml   = await res.text();
        const items = parseRSS(xml);

        for (const item of items) {
          const pub = item.pubDate ? new Date(item.pubDate).getTime() : 0;
          if (pub && pub < cutoff) continue;

          const tl = item.title.toLowerCase();
          for (const [company, kws] of Object.entries(KEYWORDS)) {
            if (kws.some(kw => tl.includes(kw.toLowerCase()))) {
              results.push({
                title:     item.title,
                outlet,
                traffic,
                url:       item.link,
                date:      item.pubDate
                  ? new Date(item.pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Recent",
                company,
                sentiment: detectSentiment(item.title),
                type:      detectType(item.title),
              });
              break;
            }
          }
        }
      } catch (e) {
        console.warn(`[scraper] ${outlet} failed:`, e.message);
      }
    })
  );

  // 去重
  const seen = new Set();
  return results.filter(a => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}

// ─── Step 2: 计算指标 ────────────────────────────────────────
function calcMetrics(coverage) {
  const plaud = coverage.filter(a => a.company === "Plaud");
  const pos   = plaud.filter(a => a.sentiment === "Positive").length;
  return {
    totalMentions: plaud.length * 8,
    tier1Count:    plaud.length,
    positiveRatio: plaud.length ? Math.round((pos / plaud.length) * 100) : 0,
    shareOfVoice:  coverage.length ? Math.round((plaud.length / coverage.length) * 100) : 0,
    byCompany: {
      Plaud:       plaud.length,
      "Otter.ai":  coverage.filter(a => a.company === "Otter.ai").length,
      "Notion AI": coverage.filter(a => a.company === "Notion AI").length,
      reMarkable:  coverage.filter(a => a.company === "reMarkable").length,
    },
  };
}

// ─── Step 3: 调用 Anthropic API 生成 AI 简报 ─────────────────
async function generateInsights(coverage, metrics) {
  const plaudHeadlines = coverage
    .filter(a => a.company === "Plaud")
    .slice(0, 6)
    .map(a => `"${a.title}" (${a.outlet})`)
    .join("\n") || "No new articles found this week.";

  const prompt = `Analyze Plaud AI's PR performance this week.

SCRAPED DATA:
- Plaud Tier-1 articles: ${metrics.tier1Count}
- Headlines:
${plaudHeadlines}
- Positive sentiment: ${metrics.positiveRatio}%
- Share of voice vs competitors: ${metrics.shareOfVoice}%
- Competitor breakdown: Otter.ai ${metrics.byCompany["Otter.ai"]} articles, Notion AI ${metrics.byCompany["Notion AI"]}, reMarkable ${metrics.byCompany.reMarkable}

BRAND CONTEXT:
- Mission: Amplify Human Intelligence
- 2026 positioning target: AI Work Companion
- Core loop: Capture, Extract, Utilize
- Narrative gap: Still labeled "AI Note Taker" more than "AI Work Companion"
- Key outlets missing: Bloomberg, CNBC

Return ONLY raw JSON (no markdown, no code fences) with these exact keys:
- summary: string (2-3 sentence executive brief)
- insights: array of 4 strings
- actions: array of 5 strings
- risk: string (1 sentence)
- opportunity: string (1 sentence)`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "You are a senior PR strategist for Plaud AI. Respond ONLY in raw JSON. No markdown, no code fences, no extra text.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const raw  = data.content?.find(b => b.type === "text")?.text || "{}";
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─── 工具函数 ────────────────────────────────────────────────
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// ─── 主函数 ──────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY — make sure it is set in GitHub Secrets");
  }

  console.log("🚀 Starting weekly dashboard update...");

  console.log("📰 Scraping Tier-1 RSS feeds...");
  const coverage = await scrapeCoverage();
  const metrics  = calcMetrics(coverage);
  console.log(`   → ${coverage.length} total articles found`);
  console.log(`   → Plaud: ${metrics.tier1Count} | Sentiment: ${metrics.positiveRatio}% positive | SOV: ${metrics.shareOfVoice}%`);

  console.log("🧠 Generating AI insights via Anthropic...");
  const insights = await generateInsights(coverage, metrics);
  console.log(`   → Done: ${insights.summary?.slice(0, 80)}...`);

  const snapshot = {
    weekNumber:  getWeekNumber(new Date()),
    generatedAt: new Date().toISOString(),
    insights,
    coverage,
    metrics,
  };

  const outPath = path.join(process.cwd(), "data", "weekly.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2));

  console.log(`✅ Successfully written to data/weekly.json`);
}

main().catch(err => {
  console.error("❌ Update failed:", err.message);
  process.exit(1);
});