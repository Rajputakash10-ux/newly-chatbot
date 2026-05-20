"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import AnalysisPanel from "./AnalysisPanel";

type Stock = { symbol: string; price: number; change: number; changePct: number };

export default function StockPanel() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selected, setSelected] = useState<string>("AAPL");
  const [chartData, setChartData] = useState<{ t: string; p: number }[]>([]);

  useEffect(() => {
    fetch("/api/stocks").then((r) => r.json()).then((d) => setStocks(d.stocks || []));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${selected}?interval=5m&range=1d`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    })
      .then((r) => r.json())
      .then((d) => {
        const result = d?.chart?.result?.[0];
        if (!result) return;
        const timestamps = result.timestamp || [];
        const prices = result.indicators?.quote?.[0]?.close || [];
        const data = timestamps.map((t: number, i: number) => ({
          t: new Date(t * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          p: prices[i] ? parseFloat(prices[i].toFixed(2)) : null,
        })).filter((d: { p: number | null }) => d.p !== null);
        setChartData(data);
      })
      .catch(() => {});
  }, [selected]);

  const stock = stocks.find((s) => s.symbol === selected);

  return (
    <div className="panel flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[var(--border)] shrink-0">
        <span className="text-xs text-[var(--accent)] font-bold tracking-widest">MARKET WATCH</span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-0">
        {/* Stock list */}
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-hidden p-2 shrink-0 border-b border-[var(--border)]">
          {stocks.map((s) => (
            <div
              key={s.symbol}
              onClick={() => setSelected(s.symbol)}
              className={`flex md:flex-row flex-col items-start md:items-center justify-between px-2 py-1.5 rounded cursor-pointer text-xs transition-all shrink-0 md:shrink min-w-[90px] md:min-w-0 ${
                selected === s.symbol
                  ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                  : "border border-transparent hover:bg-white/5"
              }`}
            >
              <span className="text-[var(--accent)] font-bold">{s.symbol}</span>
              <span className="text-[var(--text)] hidden md:inline">${s.price.toFixed(2)}</span>
              <span className={s.change >= 0 ? "text-[var(--accent2)]" : "text-[var(--red)]"}>
                {s.change >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        {stock && (
          <div className="p-3 border-b border-[var(--border)] shrink-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[var(--accent)] font-bold text-sm">{stock.symbol}</span>
              <span className={`text-xs font-bold ${stock.change >= 0 ? "text-[var(--accent2)] glow-green" : "text-[var(--red)] glow-red"}`}>
                {stock.change >= 0 ? "▲" : "▼"} ${Math.abs(stock.change).toFixed(2)}
              </span>
            </div>
            <div className="text-xl font-bold glow-text mb-2">${stock.price.toFixed(2)}</div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="p" stroke={stock.change >= 0 ? "#00ff88" : "#ff3b5c"} dot={false} strokeWidth={1.5} />
                  <Tooltip
                    contentStyle={{ background: "#0a1628", border: "1px solid #0d2d4a", fontSize: 10 }}
                    labelStyle={{ color: "#00d4ff" }}
                    itemStyle={{ color: "#e0f0ff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Analysis Panel */}
        {selected && (
          <div className="p-2">
            <AnalysisPanel symbol={selected} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 px-3 py-1.5 border-t border-[var(--border)] text-xs text-[var(--muted)] flex justify-between">
        <span>LIVE DATA</span>
        <span className="text-[var(--accent2)] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)] inline-block animate-pulse" />
          MARKET OPEN
        </span>
      </div>
    </div>
  );
}
