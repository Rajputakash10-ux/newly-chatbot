import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, mode, sessionId } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const systemPrompt = `You are NEXUS AI, an advanced artificial intelligence system specializing in ${mode || "general"} analysis. 
You provide precise, technical responses with confidence scores and actionable insights. 
Respond in a professional, data-driven manner with clear predictions and recommendations.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || "Analysis complete.";

    return NextResponse.json({
      response,
      mode: mode || "Text",
      sessionId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Nexus AI error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: error.message },
      { status: 500 }
    );
  }
}
