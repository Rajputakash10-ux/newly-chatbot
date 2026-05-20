import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "AAPL";
  const interval = req.nextUrl.searchParams.get("interval") || "5m";
  const range = req.nextUrl.searchParams.get("range") || "1d";

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return NextResponse.json({ candles: [] });

    const timestamps: number[] = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    const opens: number[] = quote.open || [];
    const highs: number[] = quote.high || [];
    const lows: number[] = quote.low || [];
    const closes: number[] = quote.close || [];
    const volumes: number[] = quote.volume || [];

    const candles = timestamps
      .map((t, i) => ({
        time: t as number,
        open: opens[i],
        high: highs[i],
        low: lows[i],
        close: closes[i],
        volume: volumes[i] || 0,
      }))
      .filter((c) => c.open != null && c.high != null && c.low != null && c.close != null);

    return NextResponse.json({ candles });
  } catch (err) {
    console.error("OHLC error:", err);
    return NextResponse.json({ candles: [] });
  }
}
