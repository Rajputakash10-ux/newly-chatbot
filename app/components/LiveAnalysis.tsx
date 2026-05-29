"use client";

export default function LiveAnalysis() {
  const analyses = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: "$189.43",
      change: "+2.34%",
      trend: "Bullish",
      signal: "BUY",
      confidence: 78,
      reasons: ["RSI showing momentum", "Breaking resistance", "Volume increasing"]
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: "$245.67",
      change: "+4.23%",
      trend: "Strong Bullish",
      signal: "BUY",
      confidence: 85,
      reasons: ["MACD crossover", "Strong uptrend", "High buying pressure"]
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: "$412.89",
      change: "+1.12%",
      trend: "Neutral",
      signal: "HOLD",
      confidence: 62,
      reasons: ["Consolidating", "Mixed signals", "Wait for breakout"]
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: "$512.34",
      change: "+5.67%",
      trend: "Very Bullish",
      signal: "BUY",
      confidence: 92,
      reasons: ["Strong momentum", "All indicators bullish", "High volume"]
    }
  ];

  return (
    <section className="space-y-4" data-tour="live-analysis">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">AI Live Analysis</h3>
          <p className="text-[10px] text-[var(--muted)]">Real-time AI-powered stock insights</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent2)]/10 border border-[var(--accent2)]/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" />
          <span className="text-[10px] text-[var(--accent2)] font-medium">UPDATING</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyses.map((stock) => (
          <div key={stock.symbol} className="glass p-4 rounded-lg hover:border-[var(--accent)]/30 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-bold">{stock.symbol}</div>
                <div className="text-[10px] text-[var(--muted)]">{stock.name}</div>
              </div>
              <div
                className={`text-[9px] px-2 py-1 rounded font-bold ${
                  stock.signal === "BUY"
                    ? "bg-[var(--accent2)]/20 text-[var(--accent2)] border border-[var(--accent2)]/30"
                    : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                }`}
              >
                {stock.signal}
              </div>
            </div>

            {/* Price */}
            <div className="mb-3">
              <div className="text-lg font-bold">{stock.price}</div>
              <div className={`text-xs font-medium ${stock.change.startsWith('+') ? 'text-[var(--accent2)]' : 'text-[var(--red)]'}`}>
                {stock.change}
              </div>
            </div>

            {/* Mini Chart Placeholder */}
            <div className="h-12 mb-3 flex items-end gap-1">
              {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[var(--accent)] to-[var(--accent)]/30 rounded-t"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            {/* Trend */}
            <div className="mb-3">
              <div className="text-[10px] text-[var(--muted)] mb-1">Trend</div>
              <div className="text-xs font-medium text-[var(--accent)]">{stock.trend}</div>
            </div>

            {/* AI Confidence */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[10px] text-[var(--muted)] mb-1">
                <span>AI Confidence</span>
                <span className="font-bold text-[var(--accent)]">{stock.confidence}%</span>
              </div>
              <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)]"
                  style={{ width: `${stock.confidence}%` }}
                />
              </div>
            </div>

            {/* Reasons */}
            <div>
              <div className="text-[10px] text-[var(--muted)] mb-1">Key Signals</div>
              <ul className="space-y-1">
                {stock.reasons.map((reason, i) => (
                  <li key={i} className="text-[9px] text-[var(--text)] flex items-start gap-1">
                    <span className="text-[var(--accent)]">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <button className="w-full mt-3 px-4 py-2 text-xs font-medium bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/20 transition-all">
              View Full Analysis
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
