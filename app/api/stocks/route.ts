import { NextResponse } from "next/server";

const SYMBOLS = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "GOOGL", "META", "SPY", "BTC-USD", "ETH-USD"];

async function fetchQuote(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 60 } });
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) return null;
  const price = meta.regularMarketPrice;
  const prev = meta.chartPreviousClose;
  const change = price - prev;
  const changePct = (change / prev) * 100;
  return { symbol, price, change, changePct };
}

export async function GET() {
  try {
    const results = await Promise.all(SYMBOLS.map(fetchQuote));
    return NextResponse.json({ stocks: results.filter(Boolean) });
  } catch {
    return NextResponse.json({ stocks: [] });
  }
}
