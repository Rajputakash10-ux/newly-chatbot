export function calcEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [];
  let prev = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(prev);
  for (let i = period; i < prices.length; i++) {
    prev = prices[i] * k + prev * (1 - k);
    ema.push(prev);
  }
  return ema;
}

export function calcRSI(prices: number[], period: number): number[] {
  const rsi: number[] = [];
  for (let i = period; i < prices.length; i++) {
    const slice = prices.slice(i - period, i + 1);
    let gains = 0, losses = 0;
    for (let j = 1; j < slice.length; j++) {
      const diff = slice[j] - slice[j - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }
  return rsi;
}

export type Signal = "BUY" | "SELL" | "HOLD";

export type AnalysisResult = {
  symbol: string;
  signal: Signal;
  price: number;
  ema50: number;
  ema100: number;
  ema200: number;
  rsi50: number;
  rsi10: number;
  prevRsi10: number;
  conditions: {
    ema50AboveEma100: boolean;
    ema100AboveEma200: boolean;
    priceAboveRibbon: boolean;
    rsi50Above50: boolean;
    rsi10CrossAbove50: boolean;
    rsi10CrossBelow50: boolean;
  };
  summary: string;
};

export function analyzeStock(symbol: string, closes: number[]): AnalysisResult | null {
  if (closes.length < 210) return null;

  const ema50Arr = calcEMA(closes, 50);
  const ema100Arr = calcEMA(closes, 100);
  const ema200Arr = calcEMA(closes, 200);
  const rsi50Arr = calcRSI(closes, 50);
  const rsi10Arr = calcRSI(closes, 10);

  const price = closes[closes.length - 1];
  const ema50 = ema50Arr[ema50Arr.length - 1];
  const ema100 = ema100Arr[ema100Arr.length - 1];
  const ema200 = ema200Arr[ema200Arr.length - 1];
  const rsi50 = rsi50Arr[rsi50Arr.length - 1];
  const rsi10 = rsi10Arr[rsi10Arr.length - 1];
  const prevRsi10 = rsi10Arr[rsi10Arr.length - 2];

  const ema50AboveEma100 = ema50 > ema100;
  const ema100AboveEma200 = ema100 > ema200;
  const priceAboveRibbon = price > ema50 && price > ema100 && price > ema200;
  const priceBelowRibbon = price < ema50 && price < ema100 && price < ema200;
  const rsi50Above50 = rsi50 > 50;
  const rsi10CrossAbove50 = prevRsi10 < 50 && rsi10 >= 50;
  const rsi10CrossBelow50 = prevRsi10 > 50 && rsi10 <= 50;

  const bullishTrend = ema50AboveEma100 && ema100AboveEma200 && priceAboveRibbon;
  const bearishTrend = !ema50AboveEma100 && !ema100AboveEma200 && priceBelowRibbon;

  let signal: Signal = "HOLD";
  let summary = "";

  if (bullishTrend && rsi50Above50 && (rsi10CrossAbove50 || (rsi10 > 50 && rsi10 < 65))) {
    signal = "BUY";
    summary = `Strong bullish setup. EMA ribbon aligned (50>100>200), price above ribbon, RSI50 at ${rsi50.toFixed(1)} (above 50), RSI10 at ${rsi10.toFixed(1)} — entry trigger confirmed.`;
  } else if (bearishTrend && !rsi50Above50 && (rsi10CrossBelow50 || (rsi10 < 50 && rsi10 > 35))) {
    signal = "SELL";
    summary = `Strong bearish setup. EMA ribbon inverted (50<100<200), price below ribbon, RSI50 at ${rsi50.toFixed(1)} (below 50), RSI10 at ${rsi10.toFixed(1)} — sell trigger confirmed.`;
  } else {
    summary = `No clear signal. EMA50=${ema50.toFixed(2)}, EMA100=${ema100.toFixed(2)}, EMA200=${ema200.toFixed(2)}. RSI50=${rsi50.toFixed(1)}, RSI10=${rsi10.toFixed(1)}. Wait for trend alignment.`;
  }

  return {
    symbol, signal, price,
    ema50, ema100, ema200,
    rsi50, rsi10, prevRsi10,
    conditions: {
      ema50AboveEma100, ema100AboveEma200, priceAboveRibbon,
      rsi50Above50, rsi10CrossAbove50, rsi10CrossBelow50,
    },
    summary,
  };
}
