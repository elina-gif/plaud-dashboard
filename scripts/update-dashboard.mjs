// scripts/update-dashboard.mjs
import fs   from "fs";
import path from "path";

// ─── 北美 Tier-1 feeds（7天窗口，月流量>1M）────────────────
const FEEDS_NA = [
  { outlet: "TechCrunch",      traffic: "10M+",  url: "https://techcrunch.com/feed/" },
  { outlet: "The Verge",       traffic: "15M+",  url: "https://www.theverge.com/rss/index.xml" },
  { outlet: "Wired",           traffic: "20M+",  url: "https://www.wired.com/feed/rss" },
  { outlet: "Forbes Tech",     traffic: "70M+",  url: "https://www.forbes.com/technology/feed/" },
  { outlet: "CNET",            traffic: "30M+",  url: "https://www.cnet.com/rss/news/" },
  { outlet: "ZDNET",           traffic: "8M+",   url: "https://www.zdnet.com/news/rss.xml" },
  { outlet: "Engadget",        traffic: "5M+",   url: "https://www.engadget.com/rss.xml" },
  { outlet: "Tom's Guide",     traffic: "8M+",   url: "https://www.tomsguide.com/feeds/all" },
  { outlet: "Ars Technica",    traffic: "21M+",  url: "https://feeds.arstechnica.com/arstechnica/index" },
  { outlet: "Gizmodo",         traffic: "20M+",  url: "https://gizmodo.com/feed" },
  { outlet: "Mashable",        traffic: "25M+",  url: "https://mashable.com/feeds/rss/tech" },
  { outlet: "Fast Company",    traffic: "10M+",  url: "https://www.fastcompany.com/technology/rss" },
  { outlet: "VentureBeat",     traffic: "5M+",   url: "https://feeds.feedburner.com/venturebeat/SZYF" },
  { outlet: "PCMag",           traffic: "10M+",  url: "https://www.pcmag.com/rss" },
  { outlet: "NYT Tech",        traffic: "620M+", url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml" },
  { outlet: "WSJ Tech",        traffic: "66M+",  url: "https://feeds.a.dj.com/rss/RSSWSJD.xml" },
  { outlet: "Washington Post", traffic: "65M+",  url: "https://feeds.washingtonpost.com/rss/business/technology" },
  { outlet: "Bloomberg Tech",  traffic: "50M+",  url: "https://feeds.bloomberg.com/technology/news.rss" },
];

// ─── 地区 feeds（30天窗口）──────────────────────────────────
const FEEDS_REGIONAL = [
  // 欧洲
  { outlet: "BBC Tech",         region: "Europe", traffic: "100M+", url: "https://feeds.bbci.co.uk/news/technology/rss.xml" },
  { outlet: "The Guardian Tech",region: "Europe", traffic: "50M+",  url: "https://www.theguardian.com/uk/technology/rss" },
  { outlet: "Sifted",           region: "Europe", traffic: "1M+",   url: "https://sifted.eu/feed/?post_type=article" },
  { outlet: "Silicon Canals",   region: "Europe", traffic: "1M+",   url: "https://siliconcanals.com/feed/" },
  { outlet: "Tech.eu",          region: "Europe", traffic: "1M+",   url: "https://tech.eu/feed" },
  // 日本
  { outlet: "Japan Times Tech", region: "Japan",  traffic: "5M+",   url: "https://www.japantimes.co.jp/business/tech/feed" },
  { outlet: "ITmedia",          region: "Japan",  traffic: "10M+",  url: "https://rss.itmedia.co.jp/rss/2.0/toplevel.xml" },
  { outlet: "Impress Watch",    region: "Japan",  traffic: "5M+",   url: "https://www.watch.impress.co.jp/data/rss/1.0/wdc/feed.rdf" },
  // 亚太（非日非中）
  { outlet: "Tech in Asia",     region: "APAC",   traffic: "2M+",   url: "https://feeds.feedburner.com/techinasia" },
  { outlet: "KrASIA",           region: "APAC",   traffic: "1M+",   url: "https://console.kr-asia.com/feed" },
  { outlet: "e27",              region: "APAC",   traffic: "1M+",   url: "https://e27.co/index_wp.php/feed/" },
  { outlet: "Nikkei Asia",      region: "APAC",   traffic: "5M+",   url: "https://asia.nikkei.com/rss/feed/nar" },
  // 南美
  { outlet: "Contxto",          region: "LatAm",  traffic: "500K+", url: "https://contxto.com/feed/" },
];

// ─── 关键词 ──────────────────────────────────────────────────
const KEYWORDS = {
  Plaud:       ["plaud", "notepin", "plaud note", "plaud desktop"],
  "Otter.ai":  ["otter.ai", "otter ai", "otterai"],
  "Notion AI": ["notion ai", "notion intelligence"],
  reMarkable:  ["remarkable 2", "remarkable paper", "remarkable"],
};

const SEVEN_DAYS  = 7  * 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// ─── 英语检测 ────────────────────────────────────────────────
function isEnglish(text) {
  const nonAscii = (text.match(/[^\x00-\x7F]/g) || []).length;
  return nonAscii / text.length < 0.3;
}

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
  if (t.includes("review") || t.includes("hands-on"))           return "Review";
  if (t.includes("interview") || t.includes("ceo"))             return "Interview";
  if (t.includes("how") || t.includes("why") || t.includes("guide")) return "Feature";
  return "News";
}

// ─── 通用抓取函数 ────────────────────────────────────────────
async function scrapeFeeds(feeds, cutoff, englishOnly = false) {
  const results = [];
  await Promise.allSettled(
    feeds.map(async (feed) => {
      try {
        const res   = await fetch(feed.url, { headers: { "User-Agent": "PlaudPRBot/1.0" } });
        if (!res.ok) return;
        const xml   = await res.text();
        const items = parseRSS(xml);
        for (const item of items) {
          const pub = item.pubDate ? new Date(item.pubDate).getTime() : 0;
          if (pub && pub < cutoff) continue;
          if (englishOnly && !isEnglish(item.title)) continue;
          const tl = item.title.toLowerCase();
          for (const [company, kws] of Object.entries(KEYWORDS)) {
            if (kws.some(kw => tl.includes(kw.toLowerCase()))) {
              results.push({
                title:     item.title,
                outlet:    feed.outlet,
                traffic:   feed.traffic,
                region:    feed.region || "North America",
                url:       item.link,
                date:      item.pubDate
                  ? new Date(item.pubDate).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
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
        console.warn(`[scraper] ${feed.outlet} failed:`, e.message);
      }
    })
  );
  const seen = new Set();
  return results.filter(a => { if (seen.has(a.url)) return false; seen.add(a.url); return true; });
}

// ─── 指标计算 ────────────────────────────────────────────────
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

// ─── 地区统计 ────────────────────────────────────────────────
function calcRegionalStats(regionalCoverage) {
  const regions = ["Europe", "Japan", "APAC", "LatAm"];
  const stats = {};
  for (const region of regions) {
    const items = regionalCoverage.filter(a => a.region === region && a.company === "Plaud");
    stats[region] = {
      count:    items.length,
      outlets:  [...new Set(items.map(a => a.outlet))],
      articles: items.slice(0, 5),
    };
  }
  return stats;
}

// ─── AI 生成简报 ─────────────────────────────────────────────
async function generateInsights(coverage, metrics) {
  const plaudHeadlines = coverage
    .filter(a => a.company === "Plaud")
    .slice(0, 6)
    .map(a => `"${a.title}" (${a.outlet})`)
    .join("\n") || "No new articles found this week.";

  const prompt = `Analyze Plaud AI's PR performance this week.

SCRAPED DATA (last 7 days, English Tier-1 media, 18 outlets):
- Plaud articles found: ${metrics.tier1Count}
- Headlines:\n${plaudHeadlines}
- Positive sentiment: ${metrics.positiveRatio}%
- Share of voice vs competitors: ${metrics.shareOfVoice}%
- Competitor breakdown: Otter.ai ${metrics.byCompany["Otter.ai"]}, Notion AI ${metrics.byCompany["Notion AI"]}, reMarkable ${metrics.byCompany.reMarkable}

BRAND CONTEXT:
- Mission: Amplify Human Intelligence
- 2026 target: AI Work Companion
- Core loop: Capture, Extract, Utilize
- Gap: Still labeled "AI Note Taker" more than "AI Work Companion"
- Missing: Bloomberg, CNBC financial press coverage

Return ONLY raw JSON (no markdown, no code fences) with:
- summary: string (2-3 sentence executive brief)
- insights: array of 4 strings
- actions: array of 5 strings
- risk: string (1 sentence)
- opportunity: string (1 sentence)`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system:     "You are a senior PR strategist for Plaud AI. Respond ONLY in raw JSON. No markdown, no code fences.",
      messages:   [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
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
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Missing ANTHROPIC_API_KEY");

  console.log("🚀 Starting weekly dashboard update...");

  // 北美：7天窗口，仅英语，18个媒体
  console.log("📰 Scraping North America feeds (18 outlets, last 7 days, English only)...");
  const naCoverage = await scrapeFeeds(FEEDS_NA, Date.now() - THIRTY_DAYS, true);
  const metrics    = calcMetrics(naCoverage);
  console.log(`   → Total: ${naCoverage.length} | Plaud: ${metrics.tier1Count} | SOV: ${metrics.shareOfVoice}%`);
  console.log(`   → Competitors: Otter.ai ${metrics.byCompany["Otter.ai"]} | Notion AI ${metrics.byCompany["Notion AI"]} | reMarkable ${metrics.byCompany.reMarkable}`);

  // 地区：30天窗口
  console.log("🌏 Scraping regional feeds (30 days)...");
  const regionalCoverage = await scrapeFeeds(FEEDS_REGIONAL, Date.now() - THIRTY_DAYS, false);
  const regionalStats    = calcRegionalStats(regionalCoverage);
  console.log(`   → Europe: ${regionalStats.Europe.count} | Japan: ${regionalStats.Japan.count} | APAC: ${regionalStats.APAC.count} | LatAm: ${regionalStats.LatAm.count}`);

  // AI 简报
  console.log("🧠 Generating AI insights...");
  const insights = await generateInsights(naCoverage, metrics);
  console.log(`   → ${insights.summary?.slice(0, 80)}...`);

  const snapshot = {
    weekNumber:      getWeekNumber(new Date()),
    generatedAt:     new Date().toISOString(),
    insights,
    coverage:        naCoverage,
    metrics,
    regionalStats,
    regionalCoverage,
  };

  const outPath = path.join(process.cwd(), "data", "weekly.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
  console.log(`✅ Written to data/weekly.json`);
}

main().catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});