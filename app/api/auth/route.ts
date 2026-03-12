import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password === process.env.DASHBOARD_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("dashboard_auth", "true", {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: "/",
    });
    return res;
  }
  return NextResponse.json({ error: "Wrong password" }, { status: 401 });
}