import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/aws";
import { sessions } from "@/lib/sessions";
import { analyzeStock } from "@/lib/analysis";

async function fetchAnalysisContext(message: string): Promise<string> {
  // Extract stock symbols from message (e.g. AAPL, TSLA, NVDA)
  const symbols = message.match(/\b[A-Z]{2,5}\b/g) || [];
  const knownSymbols = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "GOOGL", "META", "SPY", "BTC-USD", "ETH-USD"];
  const matched = symbols.filter((s) => knownSymbols.includes(s));

  if (!matched.length) return "";

  const analyses = await Promise.all(
    matched.map(async (symbol) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2y`;
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const data = await res.json();
        const closes: number[] = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
        const valid = closes.filter((c: number) => c != null && !isNaN(c));
        const result = analyzeStock(symbol, valid);
        if (!result) return null;
        return `${symbol}: Signal=${result.signal}, Price=$${result.price.toFixed(2)}, EMA50=${result.ema50.toFixed(2)}, EMA100=${result.ema100.toFixed(2)}, EMA200=${result.ema200.toFixed(2)}, RSI50=${result.rsi50.toFixed(1)}, RSI10=${result.rsi10.toFixed(1)}. ${result.summary}`;
      } catch {
        return null;
      }
    })
  );

  const valid = analyses.filter(Boolean);
  if (!valid.length) return "";
  return `\n\nLIVE TECHNICAL ANALYSIS DATA:\n${valid.join("\n")}`;
}

const SYSTEM_PROMPT = `You are an expert AI trading analyst for newly.com. You analyze stocks using EMA ribbon strategy (50/100/200 EMA) and RSI indicators (10 and 50 period). 

When given live technical data, use it to provide specific BUY/SELL/HOLD recommendations with clear reasoning based on:
- EMA ribbon alignment (50>100>200 = bullish, 50<100<200 = bearish)
- RSI 50 above/below 50 for trend strength
- RSI 10 crossovers for entry timing

Always be concise, data-driven, and include risk warnings. Format responses clearly.`;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();

    if (!sessions[sessionId]) sessions[sessionId] = [];

    const analysisContext = await fetchAnalysisContext(message);
    const enrichedMessage = message + analysisContext;

    sessions[sessionId].push({ role: "user", content: enrichedMessage });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...sessions[sessionId],
      ],
    });

    const aiResponse = completion.choices[0].message.content || "";
    // Store original message (not enriched) for display
    sessions[sessionId][sessions[sessionId].length - 1] = { role: "user", content: message };
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
