"use client";
import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from "lightweight-charts";

type Props = { symbol: string; isPositive: boolean };
type Range = "1D" | "5D" | "1M" | "3M" | "1Y";

const RANGE_MAP: Record<Range, { interval: string; range: string }> = {
  "1D": { interval: "5m", range: "1d" },
  "5D": { interval: "15m", range: "5d" },
  "1M": { interval: "1d", range: "1mo" },
  "3M": { interval: "1d", range: "3mo" },
  "1Y": { interval: "1wk", range: "1y" },
};

export default function CandlestickChart({ symbol, isPositive }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const ema50Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const ema100Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const ema200Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const volRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const [range, setRange] = useState<Range>("1D");
  const [ohlc, setOhlc] = useState({ o: 0, h: 0, l: 0, c: 0, v: 0 });
  const [loading, setLoading] = useState(true);

  function calcEMA(prices: number[], period: number): number[] {
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

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#050a0f" },
        textColor: "#4a7a9b",
      },
      grid: {
        vertLines: { color: "#0d2d4a55" },
        horzLines: { color: "#0d2d4a55" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#0d2d4a", scaleMargins: { top: 0.1, bottom: 0.25 } },
      timeScale: { borderColor: "#0d2d4a", timeVisible: true, secondsVisible: false },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    candleRef.current = chart.addSeries(CandlestickSeries, {
      upColor: "#00ff88", downColor: "#ff3b5c",
      borderUpColor: "#00ff88", borderDownColor: "#ff3b5c",
      wickUpColor: "#00ff8888", wickDownColor: "#ff3b5c88",
    });

    volRef.current = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "vol",
    });
    chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

    ema50Ref.current = chart.addSeries(LineSeries, { color: "#00d4ff", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    ema100Ref.current = chart.addSeries(LineSeries, { color: "#f59e0b", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    ema200Ref.current = chart.addSeries(LineSeries, { color: "#a855f7", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); chart.remove(); };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !candleRef.current) return;
    const { interval, range: r } = RANGE_MAP[range];
    setLoading(true);

    fetch(`/api/ohlc?symbol=${symbol}&interval=${interval}&range=${r}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.candles?.length) return;

        const candles: CandlestickData[] = data.candles;
        const closes = candles.map((c) => c.close as number);
        const times = candles.map((c) => c.time as Time);

        candleRef.current!.setData(candles);

        // Volume
        volRef.current!.setData(
          data.candles.map((c: { time: Time; open: number; close: number; volume: number }) => ({
            time: c.time,
            value: c.volume,
            color: c.close >= c.open ? "#00ff8833" : "#ff3b5c33",
          }))
        );

        // EMAs (only if enough data)
        if (closes.length >= 50) {
          const ema50 = calcEMA(closes, Math.min(50, closes.length - 1));
          const offset50 = closes.length - ema50.length;
          ema50Ref.current!.setData(ema50.map((v, i) => ({ time: times[i + offset50], value: v })));
        }
        if (closes.length >= 100) {
          const ema100 = calcEMA(closes, Math.min(100, closes.length - 1));
          const offset100 = closes.length - ema100.length;
          ema100Ref.current!.setData(ema100.map((v, i) => ({ time: times[i + offset100], value: v })));
        }
        if (closes.length >= 200) {
          const ema200 = calcEMA(closes, Math.min(200, closes.length - 1));
          const offset200 = closes.length - ema200.length;
          ema200Ref.current!.setData(ema200.map((v, i) => ({ time: times[i + offset200], value: v })));
        }

        chartRef.current!.timeScale().fitContent();

        const last = data.candles[data.candles.length - 1];
        setOhlc({ o: last.open, h: last.high, l: last.low, c: last.close, v: last.volume });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [symbol, range]);

  const color = isPositive ? "#00ff88" : "#ff3b5c";

  return (
    <div className="flex flex-col h-full">
      {/* OHLC bar */}
      <div className="flex items-center gap-3 px-2 py-1 text-[10px] text-[var(--muted)] border-b border-[var(--border)] shrink-0 flex-wrap">
        <span>O <span className="text-[var(--text)]">{ohlc.o.toFixed(2)}</span></span>
        <span>H <span className="text-[var(--accent2)]">{ohlc.h.toFixed(2)}</span></span>
        <span>L <span className="text-[var(--red)]">{ohlc.l.toFixed(2)}</span></span>
        <span>C <span style={{ color }}>{ohlc.c.toFixed(2)}</span></span>
        <span>V <span className="text-[var(--text)]">{ohlc.v > 1e6 ? (ohlc.v / 1e6).toFixed(1) + "M" : ohlc.v.toLocaleString()}</span></span>
        <div className="flex gap-1 ml-auto">
          <span className="flex items-center gap-1"><span className="w-3 h-px bg-[#00d4ff] inline-block" />EMA50</span>
          <span className="flex items-center gap-1"><span className="w-3 h-px bg-[#f59e0b] inline-block" />EMA100</span>
          <span className="flex items-center gap-1"><span className="w-3 h-px bg-[#a855f7] inline-block" />EMA200</span>
        </div>
      </div>

      {/* Range selector */}
      <div className="flex gap-1 px-2 py-1 border-b border-[var(--border)] shrink-0">
        {(Object.keys(RANGE_MAP) as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`text-[10px] px-2 py-0.5 rounded transition-all ${
              range === r
                ? "bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/50"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[var(--bg)]/80">
            <span className="text-xs text-[var(--accent)] animate-pulse">◈ LOADING CHART...</span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
