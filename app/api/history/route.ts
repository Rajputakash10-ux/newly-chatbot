import { NextRequest, NextResponse } from "next/server";
import { sessions } from "@/lib/sessions";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") || "";
  return NextResponse.json({ messages: sessions[sessionId] || [] });
}
