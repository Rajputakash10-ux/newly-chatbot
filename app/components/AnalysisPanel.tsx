"use client";
import { useEffect, useState } from "react";
import type { AnalysisResult } from "@/lib/analysis";

type Props = { symbol: string };

export default function AnalysisPanel({ symbol }: Props) {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setData(null);
    fetch(`/api/analyze?symbol=${symbol}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return (
    <div className="panel p-3 text-xs text-[var(--muted)] animate-pulse">
      ◈ RUNNING ANALYSIS...
    </div>
  );

  if (!data || "error" in data) return (
    <div className="panel p-3 text-xs text-[var(--muted)]">
      Insufficient data for analysis
    </div>
  );

  const signalColor =
    data.signal === "BUY" ? "var(--accent2)" :
    data.signal === "SELL" ? "var(--red)" : "var(--accent)";

  const Check = ({ ok }: { ok: boolean }) => (
    <span className={ok ? "text-[var(--accent2)]" : "text-[var(--red)]"}>{ok ? "✓" : "✗"}</span>
  );

  return (
    <div className="panel p-3 flex flex-col gap-3 text-xs">
      {/* Signal badge */}
      <div className="flex items-center justify-between">
        <span className="text-[var(--muted)] tracking-widest">SIGNAL</span>
        <span
          className="font-bold text-sm px-3 py-0.5 rounded border tracking-widest"
          style={{ color: signalColor, borderColor: signalColor, boxShadow: `0 0 8px ${signalColor}` }}
        >
          {data.signal}
        </span>
      </div>

      {/* EMA Ribbon */}
      <div>
        <div className="text-[var(--accent)] tracking-widest mb-1 font-bold">EMA RIBBON</div>
        <div className="flex flex-col gap-0.5 text-[var(--muted)]">
          <div className="flex justify-between">
            <span>EMA 50</span>
            <span className="text-[var(--text)]">{data.ema50.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>EMA 100</span>
            <span className="text-[var(--text)]">{data.ema100.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>EMA 200</span>
            <span className="text-[var(--text)]">{data.ema200.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* RSI */}
      <div>
        <div className="text-[var(--accent)] tracking-widest mb-1 font-bold">RSI</div>
        <div className="flex flex-col gap-0.5 text-[var(--muted)]">
          <div className="flex justify-between">
            <span>RSI 50</span>
            <span className={data.rsi50 > 50 ? "text-[var(--accent2)]" : "text-[var(--red)]"}>
              {data.rsi50.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>RSI 10</span>
            <span className="text-[var(--text)]">{data.rsi10.toFixed(1)}</span>
          </div>
        </div>
        {/* RSI bar */}
        <div className="mt-1 h-1.5 bg-[var(--border)] rounded overflow-hidden">
          <div
            className="h-full rounded transition-all"
            style={{
              width: `${Math.min(data.rsi10, 100)}%`,
              background: data.rsi10 > 70 ? "var(--red)" : data.rsi10 < 30 ? "var(--accent)" : "var(--accent2)",
            }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-[var(--muted)] mt-0.5">
          <span>OVERSOLD</span><span>NEUTRAL</span><span>OVERBOUGHT</span>
        </div>
      </div>

      {/* Strategy Conditions */}
      <div>
        <div className="text-[var(--accent)] tracking-widest mb-1 font-bold">STRATEGY BREAKDOWN</div>
        <div className="flex flex-col gap-0.5 text-[var(--muted)]">
          <div className="flex justify-between">
            <span>50 EMA &gt; 100 EMA</span>
            <Check ok={data.conditions.ema50AboveEma100} />
          </div>
          <div className="flex justify-between">
            <span>100 EMA &gt; 200 EMA</span>
            <Check ok={data.conditions.ema100AboveEma200} />
          </div>
          <div className="flex justify-between">
            <span>Price above ribbon</span>
            <Check ok={data.conditions.priceAboveRibbon} />
          </div>
          <div className="flex justify-between">
            <span>RSI 50 &gt; 50</span>
            <Check ok={data.conditions.rsi50Above50} />
          </div>
          <div className="flex justify-between">
            <span>RSI 10 cross above 50</span>
            <Check ok={data.conditions.rsi10CrossAbove50} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-[var(--border)] pt-2 text-[var(--muted)] leading-relaxed">
        {data.summary}
      </div>
    </div>
  );
}
