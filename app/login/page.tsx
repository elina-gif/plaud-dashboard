import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const body = JSON.parse(text);
    const { key, data } = body;
    if (!key || !data) return NextResponse.json({ error: "Missing key or data" }, { status: 400 });

    // 保存当前数据为"上周"备份
    try {
      const current = await redis.get(key);
      if (current) await redis.set(`${key}_prev`, current);
    } catch {}

    // 压缩 GA4 数据
    let compressed = data;
    if (key === "ga4" && data.keywords) {
      compressed = {
        ...data,
        keywords: data.keywords.map((r: any) => ({
          Query:       r.Query       || "",
          Clicks:      r.Clicks      || "0",
          Impressions: r.Impressions || "0",
          CTR:         r.CTR         || "0",
          Position:    r.Position    || "0",
        })),
        pages: data.pages.map((r: any) => ({
          Page:  r.Page  || r["Page path and screen class"] || "/",
          Views: r.Views || r.views || "0",
          Users: r.Users || r.users || "0",
        })),
      };
    }

    await redis.set(key, JSON.stringify(compressed));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}