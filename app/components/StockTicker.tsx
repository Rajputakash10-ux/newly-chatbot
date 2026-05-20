"use client";
import { useEffect, useState } from "react";

type Stock = { symbol: string; price: number; change: number; changePct: number };

export default function StockTicker() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const load = () =>
      fetch("/api/stocks").then((r) => r.json()).then((d) => setStocks(d.stocks || []));
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!stocks.length) return null;

  const items = [...stocks, ...stocks];

  return (
    <div className="ticker-wrap border-b border-[var(--border)] py-1 bg-[var(--panel)]">
      <div className="ticker-content flex gap-8 text-xs">
        {items.map((s, i) => (
          <span key={i} className="flex gap-2 items-center">
            <span className="text-[var(--accent)] font-bold">{s.symbol}</span>
            <span>${s.price.toFixed(2)}</span>
            <span className={s.change >= 0 ? "text-[var(--accent2)]" : "text-[var(--red)]"}>
              {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.changePct).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
