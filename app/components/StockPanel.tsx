"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

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
    <div className="panel p-3 flex flex-col gap-3 h-full">
      <div className="text-xs text-[var(--accent)] font-bold tracking-widest">MARKET WATCH</div>

      {/* Stock list */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-48">
        {stocks.map((s) => (
          <div
            key={s.symbol}
            onClick={() => setSelected(s.symbol)}
            className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer text-xs transition-all ${
              selected === s.symbol
                ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                : "hover:bg-white/5"
            }`}
          >
            <span className="text-[var(--accent)] font-bold w-16">{s.symbol}</span>
            <span className="text-[var(--text)]">${s.price.toFixed(2)}</span>
            <span className={s.change >= 0 ? "text-[var(--accent2)]" : "text-[var(--red)]"}>
              {s.change >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      {stock && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-[var(--accent)] font-bold text-sm">{stock.symbol}</span>
            <span className={`text-xs font-bold ${stock.change >= 0 ? "text-[var(--accent2)] glow-green" : "text-[var(--red)] glow-red"}`}>
              {stock.change >= 0 ? "▲" : "▼"} ${Math.abs(stock.change).toFixed(2)}
            </span>
          </div>
          <div className="text-2xl font-bold glow-text">${stock.price.toFixed(2)}</div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="p"
                  stroke={stock.change >= 0 ? "#00ff88" : "#ff3b5c"}
                  dot={false}
                  strokeWidth={1.5}
                />
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

      {/* Market status */}
      <div className="mt-auto text-xs text-[var(--muted)] flex justify-between">
        <span>LIVE DATA</span>
        <span className="text-[var(--accent2)] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)] inline-block animate-pulse" />
          MARKET OPEN
        </span>
      </div>
    </div>
  );
}
