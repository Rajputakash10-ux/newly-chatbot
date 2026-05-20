import { NextRequest, NextResponse } from "next/server";
import { getSQL } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") || "";
  
  try {
    const sql = getSQL();
    const messages = await sql`
      SELECT role, content FROM chat_messages
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
    `;
    
    return NextResponse.json({ messages });
  } catch (err) {
    console.error("History error:", err);
    return NextResponse.json({ messages: [] });
  }
}
