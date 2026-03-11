// scripts/generate-brief.mjs
// 运行命令：node scripts/generate-brief.mjs

import fs   from "fs";
import path from "path";
import https from "https";

const API_KEY = "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";

function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "You are a senior PR strategist for Plaud AI. Respond ONLY in raw JSON. No markdown, no code fences, no extra text.",
      messages: [{ role: "user", content: prompt }],
    });

    const req = https.request({
      hostname: "api.anthropic.com",
      port:     443,
      path:     "/v1/messages",
      method:   "POST",
      headers: {
        "Content-Type":      "application/json",
        "Content-Length":    Buffer.byteLength(body),
        "x-api-key":         API_KEY,
        "anthropic-version": "2023-06-01",
      },
    }, res => {
      console.log("📥 Status:", res.statusCode);
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const raw    = parsed.content?.find(b => b.type === "text")?.text || "{}";
          resolve(JSON.parse(raw.replace(/```json|```/g, "").trim()));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message} | Raw: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on("error", e => reject(new Error(`Request error: ${e.message}`)));
    req.setTimeout(60000, () => { req.destroy(); reject(new Error("Timeout")); });
    req.write(body);
    req.end();
  });
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

async function main() {
  console.log("🧠 Generating AI brief...");

  const insights = await callClaude(`Analyze Plaud AI's PR performance this week.

BRAND CONTEXT:
- Mission: Amplify Human Intelligence
- 2026 positioning target: AI Work Companion
- Core loop: Capture, Extract, Utilize
- Narrative gap: Still labeled "AI Note Taker" more than "AI Work Companion"
- Key outlets missing: Bloomberg, CNBC
- Competitors: Otter.ai ($100M ARR, enterprise push), Notion AI, reMarkable

THIS WEEK'S SIGNALS:
- Plaud CES 2026 coverage still generating long-tail pickup
- Humane AI negative press cycle = opportunity to position Plaud as AI wearable that works
- AI Work Companion narrative underpenetrated (38% vs 70% target)

Return ONLY raw JSON with keys:
- summary: string (2-3 sentence executive brief)
- insights: array of 4 strings
- actions: array of 5 specific this-week action items
- risk: string (1 sentence biggest narrative risk)
- opportunity: string (1 sentence top opportunity)`);

  console.log("✅ Brief generated:", insights.summary?.slice(0, 80) + "...");

  const filePath = path.join(process.cwd(), "data", "weekly.json");
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch {}

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify({
    ...existing,
    weekNumber:  getWeekNumber(new Date()),
    generatedAt: new Date().toISOString(),
    insights,
  }, null, 2));
  console.log("💾 Saved to data/weekly.json");

  const { execSync } = await import("child_process");
  try {
    execSync("git add data/weekly.json", { stdio: "inherit" });
    execSync(`git commit -m "chore: AI brief update ${new Date().toLocaleDateString()}"`, { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });
    console.log("🚀 Pushed to GitHub — Vercel will redeploy in ~1 minute");
  } catch {
    console.log("⚠️  Git push skipped (nothing changed)");
  }
}

main().catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});