"use client";

export default function MarketOverview() {
  const marketData = [
    { title: "Top Gainers", stocks: [
      { symbol: "RELIANCE", change: "+3.45%", price: "₹2,456" },
      { symbol: "TCS", change: "+2.89%", price: "₹3,678" },
      { symbol: "INFY", change: "+2.12%", price: "₹1,543" }
    ]},
    { title: "Top Losers", stocks: [
      { symbol: "HDFC", change: "-1.87%", price: "₹1,678" },
      { symbol: "ICICI", change: "-1.45%", price: "₹987" },
      { symbol: "AXIS", change: "-0.98%", price: "₹1,123" }
    ]},
    { title: "Trending", stocks: [
      { symbol: "TSLA", change: "+4.23%", price: "$245.67" },
      { symbol: "AAPL", change: "+1.56%", price: "$189.43" },
      { symbol: "NVDA", change: "+5.67%", price: "$512.34" }
    ]}
  ];

  return (
    <section className="space-y-4" data-tour="market-overview">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Market Overview</h3>
        <button className="text-xs text-[var(--accent)] hover:underline">View All →</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Cards */}
        {marketData.map((section) => (
          <div key={section.title} className="glass p-4 rounded-lg">
            <div className="text-xs font-bold text-[var(--accent)] mb-3">{section.title}</div>
            <div className="space-y-2">
              {section.stocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium">{stock.symbol}</div>
                    <div className="text-[10px] text-[var(--muted)]">{stock.price}</div>
                  </div>
                  <div className={`text-xs font-bold ${stock.change.startsWith('+') ? 'text-[var(--accent2)]' : 'text-[var(--red)]'}`}>
                    {stock.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Fear & Greed Index */}
        <div className="glass p-4 rounded-lg">
          <div className="text-xs font-bold text-[var(--accent)] mb-3">Fear & Greed Index</div>
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none" stroke="var(--accent2)" strokeWidth="8"
                  strokeDasharray="251" strokeDashoffset="75" strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-[var(--accent2)]">68</div>
                  <div className="text-[8px] text-[var(--muted)]">GREED</div>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--muted)] mt-2 text-center">
              Market showing bullish sentiment
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
