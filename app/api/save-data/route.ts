import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const body = JSON.parse(text);
    const { key, data } = body;
    if (!key || !data) return NextResponse.json({ error: "Missing key or data" }, { status: 400 });
    await redis.set(key, JSON.stringify(data));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}