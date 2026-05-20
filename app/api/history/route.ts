import { NextRequest, NextResponse } from "next/server";

// History is now served directly from /api/chat GET
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") || "";
  const base = req.nextUrl.origin;
  const res = await fetch(`${base}/api/chat?sessionId=${sessionId}`);
  const data = await res.json();
  return NextResponse.json(data);
}
