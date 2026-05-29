"use client";
import { useEffect, useState } from "react";

export default function PortfolioPreview() {
  const [animatedProfit, setAnimatedProfit] = useState(0);
  
  const portfolio = {
    balance: 100000,
    invested: 45000,
    profit: 3250,
    profitPercent: 7.22,
    holdings: [
      { symbol: "AAPL", shares: 50, avgPrice: 180, currentPrice: 189.43, profit: 471.5, allocation: 35 },
      { symbol: "TSLA", shares: 30, avgPrice: 235, currentPrice: 245.67, profit: 320.1, allocation: 28 },
      { symbol: "MSFT", shares: 25, avgPrice: 405, currentPrice: 412.89, profit: 197.25, allocation: 22 },
      { symbol: "NVDA", shares: 15, avgPrice: 480, currentPrice: 512.34, profit: 485.1, allocation: 15 }
    ],
    riskLevel: "Moderate",
    diversificationScore: 72
  };

  useEffect(() => {
    let current = 0;
    const increment = portfolio.profit / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= portfolio.profit) {
        setAnimatedProfit(portfolio.profit);
        clearInterval(timer);
      } else {
        setAnimatedProfit(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="glass p-5 rounded-xl" data-tour="portfolio">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold">Virtual Portfolio</h3>
        <span className="text-[9px] px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full font-bold">
          DEMO MODE
        </span>
      </div>

      {/* Balance Card */}
      <div className="mb-5 p-4 bg-gradient-to-br from-[var(--accent)]/10 via-[var(--magenta)]/5 to-transparent border border-[var(--accent)]/20 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="text-[10px] text-[var(--muted)] mb-1 font-medium">Total Portfolio Value</div>
          <div className="text-3xl font-bold mb-2">₹{portfolio.balance.toLocaleString()}</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--accent2)] text-lg">↗</span>
              <span className="text-sm font-bold text-[var(--accent2)]">+₹{animatedProfit.toFixed(0).toLocaleString()}</span>
            </div>
            <div className="px-2 py-0.5 bg-[var(--accent2)]/20 border border-[var(--accent2)]/30 rounded text-[10px] font-bold text-[var(--accent2)]">
              +{portfolio.profitPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Mini Growth Chart */}
      <div className="mb-5 p-4 bg-[var(--panel)] border border-[var(--border)] rounded-lg">
        <div className="text-[10px] text-[var(--muted)] mb-3 font-medium">30-Day Performance</div>
        <div className="h-20 flex items-end gap-1">
          {[45, 52, 48, 65, 58, 72, 68, 80, 75, 88, 82, 95, 90, 98, 92, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-[var(--accent)] to-[var(--accent)]/30 rounded-t transition-all hover:from-[var(--magenta)] hover:to-[var(--magenta)]/30"
              style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[var(--panel)] border border-[var(--border)] p-3 rounded-lg">
          <div className="text-[10px] text-[var(--muted)] mb-1">Invested</div>
          <div className="text-sm font-bold">₹{portfolio.invested.toLocaleString()}</div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] p-3 rounded-lg">
          <div className="text-[10px] text-[var(--muted)] mb-1">Available Cash</div>
          <div className="text-sm font-bold">₹{(portfolio.balance - portfolio.invested).toLocaleString()}</div>
        </div>
      </div>

      {/* Allocation Donut */}
      <div className="mb-5 p-4 bg-[var(--panel)] border border-[var(--border)] rounded-lg">
        <div className="text-[10px] text-[var(--muted)] mb-3 font-medium">Portfolio Allocation</div>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              {portfolio.holdings.map((holding, i) => {
                const colors = ['var(--accent)', 'var(--magenta)', 'var(--accent2)', '#ff8800'];
                const prevTotal = portfolio.holdings.slice(0, i).reduce((sum, h) => sum + h.allocation, 0);
                const dashArray = (holding.allocation / 100) * 251;
                const dashOffset = 251 - (prevTotal / 100) * 251;
                return (
                  <circle
                    key={holding.symbol}
                    cx="50" cy="50" r="40" fill="none"
                    stroke={colors[i]}
                    strokeWidth="12"
                    strokeDasharray={`${dashArray} 251`}
                    strokeDashoffset={-dashOffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-bold">{portfolio.diversificationScore}%</div>
                <div className="text-[8px] text-[var(--muted)]">Diversified</div>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {portfolio.holdings.map((holding, i) => {
              const colors = ['var(--accent)', 'var(--magenta)', 'var(--accent2)', '#ff8800'];
              return (
                <div key={holding.symbol} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
                  <span className="text-[10px] font-medium flex-1">{holding.symbol}</span>
                  <span className="text-[10px] text-[var(--muted)]">{holding.allocation}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="mb-5">
        <div className="text-[10px] text-[var(--muted)] mb-2 font-medium">Top Holdings</div>
        <div className="space-y-2">
          {portfolio.holdings.slice(0, 3).map((holding) => (
            <div key={holding.symbol} className="flex items-center justify-between p-2.5 bg-[var(--panel)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/30 transition-all">
              <div>
                <div className="text-xs font-bold">{holding.symbol}</div>
                <div className="text-[9px] text-[var(--muted)]">{holding.shares} shares @ ${holding.avgPrice}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold">${holding.currentPrice}</div>
                <div className="text-[9px] text-[var(--accent2)]">+${holding.profit.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Meter */}
      <div className="mb-5 p-3 bg-gradient-to-r from-[var(--accent)]/5 to-[var(--magenta)]/5 border border-[var(--accent)]/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[var(--muted)] font-medium">Risk Level</span>
          <span className="text-xs font-bold text-[var(--accent)]">{portfolio.riskLevel}</span>
        </div>
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--accent2)] via-yellow-500 to-[var(--red)]" style={{ width: "60%" }} />
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="p-3 bg-[var(--accent2)]/5 border border-[var(--accent2)]/20 rounded-lg mb-4">
        <div className="flex items-start gap-2">
          <span className="text-base">💡</span>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-[var(--accent2)] mb-1">AI RECOMMENDATION</div>
            <div className="text-[10px] text-[var(--muted)] leading-relaxed">
              Your portfolio is well-balanced. Consider adding more tech exposure. NVDA showing strong momentum with 92% AI confidence.
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button className="px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)] text-white rounded-lg hover:shadow-[0_0_20px_var(--accent)] transition-all">
          Add Funds
        </button>
        <button className="px-4 py-2.5 text-xs font-medium border border-[var(--border)] text-[var(--text)] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
          View Details
        </button>
      </div>

      <div className="text-center p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
        <div className="text-[9px] text-yellow-500/80 flex items-center justify-center gap-1">
          <span>⚠️</span>
          <span>Virtual portfolio for educational purposes only</span>
        </div>
      </div>
    </section>
  );
}
