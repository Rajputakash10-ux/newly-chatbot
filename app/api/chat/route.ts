import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/aws";

type Message = { role: "user" | "assistant"; content: string };

// In-memory store (resets on server restart; replace with DB for persistence)
const sessions: Record<string, Message[]> = {};

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();

    if (!sessions[sessionId]) sessions[sessionId] = [];
    sessions[sessionId].push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: sessions[sessionId],
    });

    const aiResponse = completion.choices[0].message.content || "";
    sessions[sessionId].push({ role: "assistant", content: aiResponse });

    return NextResponse.json({ response: aiResponse });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") || "";
  return NextResponse.json({ messages: sessions[sessionId] || [] });
}
