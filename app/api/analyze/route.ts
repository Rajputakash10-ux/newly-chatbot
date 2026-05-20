import { NextRequest, NextResponse } from "next/server";
import { analyzeStock } from "@/lib/analysis";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2y`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return NextResponse.json({ error: "No data" }, { status: 404 });

    const closes: number[] = result.indicators?.quote?.[0]?.close || [];
    const validCloses = closes.filter((c: number) => c != null && !isNaN(c));

    const analysis = analyzeStock(symbol, validCloses);
    if (!analysis) return NextResponse.json({ error: "Not enough data" }, { status: 422 });

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}
