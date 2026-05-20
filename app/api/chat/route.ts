import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/aws";
import { sessions } from "@/lib/sessions";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();

    if (!sessions[sessionId]) sessions[sessionId] = [];
    sessions[sessionId].push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
