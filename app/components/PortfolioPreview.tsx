"use client";

export default function PortfolioPreview() {
  const portfolio = {
    balance: 100000,
    invested: 45000,
    profit: 3250,
    profitPercent: 7.22,
    holdings: [
      { symbol: "AAPL", shares: 50, avgPrice: 180, currentPrice: 189.43, profit: 471.5 },
      { symbol: "TSLA", shares: 30, avgPrice: 235, currentPrice: 245.67, profit: 320.1 },
      { symbol: "MSFT", shares: 25, avgPrice: 405, currentPrice: 412.89, profit: 197.25 }
    ]
  };

  return (
    <section className="glass p-4 rounded-lg" data-tour="portfolio">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold">Virtual Portfolio</h3>
        <span className="text-[9px] px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
          DEMO
        </span>
      </div>

      {/* Balance Overview */}
      <div className="mb-4 p-3 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--magenta)]/10 border border-[var(--accent)]/20 rounded-lg">
        <div className="text-[10px] text-[var(--muted)] mb-1">Total Balance</div>
        <div className="text-2xl font-bold mb-1">₹{portfolio.balance.toLocaleString()}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--accent2)]">+₹{portfolio.profit.toLocaleString()}</span>
          <span className="text-[var(--accent2)]">({portfolio.profitPercent}%)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[var(--panel)] border border-[var(--border)] p-3 rounded-lg">
          <div className="text-[10px] text-[var(--muted)] mb-1">Invested</div>
          <div className="text-sm font-bold">₹{portfolio.invested.toLocaleString()}</div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] p-3 rounded-lg">
          <div className="text-[10px] text-[var(--muted)] mb-1">Available</div>
          <div className="text-sm font-bold">₹{(portfolio.balance - portfolio.invested).toLocaleString()}</div>
        </div>
      </div>

      {/* Holdings */}
      <div className="mb-4">
        <div className="text-[10px] text-[var(--muted)] mb-2">Holdings</div>
        <div className="space-y-2">
          {portfolio.holdings.map((holding) => (
            <div key={holding.symbol} className="flex items-center justify-between p-2 bg-[var(--panel)] border border-[var(--border)] rounded">
              <div>
                <div className="text-xs font-medium">{holding.symbol}</div>
                <div className="text-[9px] text-[var(--muted)]">{holding.shares} shares</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold">${holding.currentPrice}</div>
                <div className="text-[9px] text-[var(--accent2)]">+${holding.profit.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="p-3 bg-[var(--accent2)]/5 border border-[var(--accent2)]/20 rounded-lg mb-3">
        <div className="flex items-start gap-2">
          <span className="text-sm">💡</span>
          <div>
            <div className="text-[10px] font-bold text-[var(--accent2)] mb-1">AI Recommendation</div>
            <div className="text-[9px] text-[var(--muted)]">
              Consider diversifying into tech sector. NVDA showing strong momentum.
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="px-3 py-2 text-xs font-medium bg-[var(--accent)] text-black rounded-lg hover:shadow-[0_0_15px_var(--accent)] transition-all">
          Add Funds
        </button>
        <button className="px-3 py-2 text-xs font-medium border border-[var(--border)] text-[var(--text)] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
          View Details
        </button>
      </div>

      <div className="mt-3 text-[9px] text-[var(--muted)] text-center">
        ⚠️ This is a virtual portfolio for learning purposes only
      </div>
    </section>
  );
}
