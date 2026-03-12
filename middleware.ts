import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("dashboard_auth")?.value;
  if (auth === "true") return NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api")) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!login|_next|favicon.ico).*)"],
};