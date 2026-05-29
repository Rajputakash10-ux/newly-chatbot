"use client";
import { useState } from "react";

type GuideSection = {
  id: string;
  title: string;
  icon: string;
  duration: string;
  lessons: Lesson[];
};

type Lesson = {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  example?: string;
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
};

const STOCK_GUIDE: GuideSection[] = [
  {
    id: "basics",
    title: "Stock Market Basics",
    icon: "📚",
    duration: "15 min",
    lessons: [
      {
        id: "what-is-stock",
        title: "What is a Stock?",
        content: "A stock represents ownership in a company. When you buy a stock, you become a partial owner (shareholder) of that company. If the company does well, your stock value increases. If it struggles, the value decreases.",
        keyPoints: [
          "Stock = Ownership share in a company",
          "Shareholders can profit from company growth",
          "Stock prices change based on supply and demand",
          "You can buy and sell stocks on stock exchanges"
        ],
        example: "If Apple has 1 billion shares and you own 100 shares, you own 0.00001% of Apple. If Apple's value grows, your shares become more valuable.",
        quiz: {
          question: "What does owning a stock mean?",
          options: [
            "You lend money to the company",
            "You own a part of the company",
            "You work for the company",
            "You control the company"
          ],
          correct: 1
        }
      },
      {
        id: "how-stocks-work",
        title: "How Do Stocks Work?",
        content: "Companies issue stocks to raise money for growth. Investors buy these stocks hoping the company will succeed and the stock price will rise. Stock prices fluctuate based on company performance, market conditions, and investor sentiment.",
        keyPoints: [
          "Companies sell stocks to raise capital",
          "Stock prices reflect company value and investor confidence",
          "Prices change every second during market hours",
          "You profit when you sell at a higher price than you bought"
        ],
        example: "You buy Tesla stock at $200. Tesla announces record sales. Demand increases, price rises to $250. You sell and make $50 profit per share."
      },
      {
        id: "stock-exchanges",
        title: "Stock Exchanges",
        content: "Stock exchanges are marketplaces where stocks are bought and sold. Major exchanges include NYSE (New York Stock Exchange), NASDAQ, NSE (National Stock Exchange of India), and BSE (Bombay Stock Exchange).",
        keyPoints: [
          "Exchanges provide a regulated platform for trading",
          "Trading happens during specific market hours",
          "Each stock has a unique ticker symbol (e.g., AAPL for Apple)",
          "Exchanges ensure fair pricing and transparency"
        ],
        example: "NSE operates 9:15 AM - 3:30 PM IST. You can buy Reliance (ticker: RELIANCE) during these hours."
      }
    ]
  },
  {
    id: "trading",
    title: "How Trading Works",
    icon: "💹",
    duration: "20 min",
    lessons: [
      {
        id: "buying-selling",
        title: "Buying and Selling Stocks",
        content: "To trade stocks, you need a brokerage account. You place orders to buy or sell. Market orders execute immediately at current price. Limit orders execute only at your specified price.",
        keyPoints: [
          "Open a demat and trading account with a broker",
          "Market Order = Buy/Sell immediately at current price",
          "Limit Order = Buy/Sell only at your target price",
          "Stop Loss = Automatic sell if price drops to protect losses"
        ],
        example: "Market Order: Buy AAPL now at $189. Limit Order: Buy AAPL only if price drops to $180."
      },
      {
        id: "bid-ask",
        title: "Bid, Ask, and Spread",
        content: "Bid is the highest price buyers are willing to pay. Ask is the lowest price sellers will accept. The difference is called the spread. Narrow spreads indicate high liquidity.",
        keyPoints: [
          "Bid = What buyers offer",
          "Ask = What sellers want",
          "Spread = Ask - Bid",
          "Lower spread = easier to trade"
        ],
        example: "Stock XYZ: Bid $100, Ask $100.50. Spread is $0.50. You'll buy at $100.50 and sell at $100."
      },
      {
        id: "market-hours",
        title: "Market Hours and Sessions",
        content: "Stock markets operate during specific hours. Pre-market and after-hours trading also exist but with lower volume. Most trading happens during regular hours.",
        keyPoints: [
          "NSE/BSE: 9:15 AM - 3:30 PM IST",
          "US Markets: 9:30 AM - 4:00 PM EST",
          "Pre-market and after-hours have limited liquidity",
          "Major news often released after market close"
        ]
      }
    ]
  },
  {
    id: "analysis",
    title: "Stock Analysis",
    icon: "📊",
    duration: "30 min",
    lessons: [
      {
        id: "fundamental-analysis",
        title: "Fundamental Analysis",
        content: "Fundamental analysis evaluates a company's financial health, business model, competitive advantage, and growth potential. It helps determine if a stock is undervalued or overvalued.",
        keyPoints: [
          "Analyze company financials (revenue, profit, debt)",
          "Study business model and competitive advantage",
          "Check P/E ratio, EPS, market cap",
          "Long-term investment strategy"
        ],
        example: "Company A: P/E ratio 15, growing revenue, low debt. Company B: P/E ratio 50, declining sales, high debt. Company A may be better value."
      },
      {
        id: "technical-analysis",
        title: "Technical Analysis",
        content: "Technical analysis studies price charts and patterns to predict future movements. It uses indicators like RSI, MACD, moving averages, and volume to identify trends and entry/exit points.",
        keyPoints: [
          "Analyzes price charts and patterns",
          "Uses indicators (RSI, MACD, Moving Averages)",
          "Identifies support and resistance levels",
          "Short to medium-term trading strategy"
        ],
        example: "Stock breaks above resistance at $150 with high volume. Technical analysts see this as bullish signal to buy."
      },
      {
        id: "key-metrics",
        title: "Key Stock Metrics",
        content: "Important metrics help evaluate stocks: P/E Ratio (Price to Earnings), EPS (Earnings Per Share), Market Cap, Dividend Yield, P/B Ratio, and Debt-to-Equity ratio.",
        keyPoints: [
          "P/E Ratio: Stock price ÷ Earnings per share (valuation)",
          "EPS: Company profit ÷ Total shares (profitability)",
          "Market Cap: Stock price × Total shares (company size)",
          "Dividend Yield: Annual dividend ÷ Stock price (income)"
        ],
        example: "Stock at $100, EPS $5 → P/E = 20. Lower P/E may indicate undervalued stock (compare with industry average)."
      }
    ]
  },
  {
    id: "indicators",
    title: "Technical Indicators",
    icon: "📈",
    duration: "25 min",
    lessons: [
      {
        id: "rsi",
        title: "RSI (Relative Strength Index)",
        content: "RSI measures momentum on a scale of 0-100. It identifies overbought (>70) and oversold (<30) conditions, helping spot potential reversals.",
        keyPoints: [
          "Range: 0 to 100",
          "Above 70 = Overbought (may drop)",
          "Below 30 = Oversold (may rise)",
          "Divergence signals trend reversal"
        ],
        example: "Stock at $200, RSI at 75. Overbought signal. Price drops to $180. RSI now at 45 (neutral)."
      },
      {
        id: "macd",
        title: "MACD (Moving Average Convergence Divergence)",
        content: "MACD shows relationship between two moving averages. When MACD line crosses above signal line, it's bullish. Below is bearish. Histogram shows momentum strength.",
        keyPoints: [
          "MACD line crosses above signal = Buy signal",
          "MACD line crosses below signal = Sell signal",
          "Histogram shows momentum strength",
          "Works best in trending markets"
        ],
        example: "MACD crosses above signal line at $150. Stock trends up to $180. MACD crosses below at $180. Sell signal."
      },
      {
        id: "moving-averages",
        title: "Moving Averages (SMA & EMA)",
        content: "Moving averages smooth price data to identify trends. SMA (Simple) gives equal weight to all prices. EMA (Exponential) gives more weight to recent prices. Common periods: 50-day, 200-day.",
        keyPoints: [
          "SMA = Average price over period",
          "EMA = Weighted average (recent prices matter more)",
          "Price above MA = Uptrend",
          "Price below MA = Downtrend"
        ],
        example: "Stock at $200, 50-day MA at $180. Price above MA indicates uptrend. If price drops below $180, trend may reverse."
      },
      {
        id: "volume",
        title: "Volume Analysis",
        content: "Volume shows how many shares traded. High volume confirms price movements. Low volume suggests weak trends. Volume precedes price - big moves often start with volume spikes.",
        keyPoints: [
          "High volume + price rise = Strong uptrend",
          "High volume + price drop = Strong downtrend",
          "Low volume = Weak trend, possible reversal",
          "Volume confirms breakouts"
        ],
        example: "Stock breaks $150 resistance with 3x average volume. Strong bullish signal. Breaks with low volume? Likely false breakout."
      },
      {
        id: "support-resistance",
        title: "Support and Resistance",
        content: "Support is a price level where buying pressure prevents further decline. Resistance is where selling pressure prevents further rise. These levels act as psychological barriers.",
        keyPoints: [
          "Support = Price floor (buyers step in)",
          "Resistance = Price ceiling (sellers step in)",
          "Breakouts above resistance are bullish",
          "Breakdowns below support are bearish"
        ],
        example: "Stock bounces off $100 three times (support). Breaks above $120 twice (resistance). If it breaks $120 with volume, next target may be $140."
      }
    ]
  },
  {
    id: "risk",
    title: "Risk Management",
    icon: "🛡️",
    duration: "20 min",
    lessons: [
      {
        id: "position-sizing",
        title: "Position Sizing",
        content: "Never invest all your money in one stock. Diversify across sectors and companies. A common rule: don't put more than 5-10% of your portfolio in a single stock.",
        keyPoints: [
          "Diversify across 10-15 stocks minimum",
          "Max 5-10% per stock",
          "Spread across different sectors",
          "Balance risk and reward"
        ],
        example: "Portfolio: ₹1,00,000. Max per stock: ₹10,000. Buy 10 different stocks across tech, pharma, banking, etc."
      },
      {
        id: "stop-loss",
        title: "Stop Loss Orders",
        content: "A stop loss automatically sells your stock if price drops to a specified level, limiting your losses. Essential for risk management.",
        keyPoints: [
          "Set stop loss 5-10% below buy price",
          "Protects against major losses",
          "Removes emotion from selling decisions",
          "Adjust as stock price rises (trailing stop)"
        ],
        example: "Buy at ₹100. Set stop loss at ₹90. If price drops to ₹90, auto-sells. Max loss: ₹10 per share."
      },
      {
        id: "risk-reward",
        title: "Risk-Reward Ratio",
        content: "Before entering a trade, calculate potential profit vs potential loss. Aim for at least 1:2 ratio (risk ₹1 to make ₹2). This ensures profitability even with 50% win rate.",
        keyPoints: [
          "Risk-Reward = Potential Loss : Potential Gain",
          "Aim for minimum 1:2 ratio",
          "Higher ratio = better trade setup",
          "Calculate before every trade"
        ],
        example: "Buy at ₹100, stop loss ₹95 (risk ₹5), target ₹110 (gain ₹10). Risk-Reward = 1:2. Good trade."
      },
      {
        id: "emotions",
        title: "Managing Emotions",
        content: "Fear and greed are the biggest enemies in trading. Stick to your plan, don't chase pumps, don't panic sell. Use stop losses to remove emotion from decisions.",
        keyPoints: [
          "Don't let FOMO (Fear of Missing Out) drive decisions",
          "Avoid panic selling during dips",
          "Stick to your trading plan",
          "Take breaks after losses"
        ],
        example: "Stock drops 10%. Panic sellers exit. Patient investors who researched fundamentals hold or buy more at discount."
      }
    ]
  },
  {
    id: "strategies",
    title: "Trading Strategies",
    icon: "🎯",
    duration: "25 min",
    lessons: [
      {
        id: "day-trading",
        title: "Day Trading",
        content: "Day trading involves buying and selling stocks within the same day. Requires quick decisions, technical analysis skills, and strict discipline. High risk, high reward.",
        keyPoints: [
          "All positions closed before market close",
          "Requires full-time attention",
          "Uses technical analysis and charts",
          "High risk - not for beginners"
        ],
        example: "Buy TSLA at ₹240 at 10 AM. Sell at ₹245 at 2 PM. Profit: ₹5 per share. Repeat multiple times daily."
      },
      {
        id: "swing-trading",
        title: "Swing Trading",
        content: "Swing trading holds positions for days to weeks, capturing short-term price swings. Balances between day trading and long-term investing.",
        keyPoints: [
          "Hold for 2 days to 2 weeks",
          "Captures medium-term trends",
          "Less stressful than day trading",
          "Good for part-time traders"
        ],
        example: "Stock at ₹150 breaks resistance. Buy and hold for 1 week. Sell at ₹165. Profit: ₹15 per share."
      },
      {
        id: "long-term",
        title: "Long-Term Investing",
        content: "Buy quality companies and hold for years. Focus on fundamentals, not daily price movements. Compound growth over time. Warren Buffett's strategy.",
        keyPoints: [
          "Hold for 1+ years",
          "Focus on company fundamentals",
          "Ignore short-term volatility",
          "Benefit from compound growth"
        ],
        example: "Buy Apple at ₹150 in 2020. Hold through ups and downs. Sell at ₹300 in 2024. 100% return + dividends."
      },
      {
        id: "value-investing",
        title: "Value Investing",
        content: "Find undervalued stocks trading below their intrinsic value. Requires deep fundamental analysis. Buy when others are fearful, sell when others are greedy.",
        keyPoints: [
          "Buy undervalued quality companies",
          "Analyze P/E, P/B, debt ratios",
          "Requires patience",
          "Focus on margin of safety"
        ],
        example: "Company worth ₹200 per share trading at ₹120 due to temporary bad news. Value investor buys, waits for market to recognize true value."
      }
    ]
  },
  {
    id: "advanced",
    title: "Advanced Concepts",
    icon: "🚀",
    duration: "30 min",
    lessons: [
      {
        id: "market-cap",
        title: "Market Capitalization",
        content: "Market cap = Stock Price × Total Shares. Categorized as Large-cap (>₹20,000 Cr), Mid-cap (₹5,000-20,000 Cr), Small-cap (<₹5,000 Cr). Larger caps are generally more stable.",
        keyPoints: [
          "Large-cap: Stable, lower growth",
          "Mid-cap: Balanced risk-reward",
          "Small-cap: High risk, high growth potential",
          "Diversify across all three"
        ],
        example: "Reliance (Large-cap): Stable, 10-15% annual growth. Small pharma company (Small-cap): Volatile, potential 50%+ growth or loss."
      },
      {
        id: "dividends",
        title: "Dividends and Yields",
        content: "Dividends are cash payments companies distribute to shareholders from profits. Dividend yield = Annual Dividend ÷ Stock Price. Provides passive income.",
        keyPoints: [
          "Dividend = Share of company profits",
          "Paid quarterly or annually",
          "Dividend Yield = Annual dividend ÷ Price",
          "Good for income investors"
        ],
        example: "Stock at ₹100 pays ₹5 annual dividend. Yield = 5%. You own 100 shares = ₹500 annual passive income."
      },
      {
        id: "sectors",
        title: "Sector Analysis",
        content: "Economy divided into sectors: Technology, Healthcare, Finance, Energy, Consumer, etc. Different sectors perform differently in various economic cycles.",
        keyPoints: [
          "Tech: High growth, volatile",
          "Healthcare: Defensive, stable",
          "Finance: Cyclical, interest rate sensitive",
          "Diversify across sectors"
        ],
        example: "Recession: Healthcare and consumer staples outperform. Economic boom: Tech and finance lead."
      },
      {
        id: "bull-bear",
        title: "Bull vs Bear Markets",
        content: "Bull market = Rising prices, optimism, economic growth. Bear market = Falling prices, pessimism, economic slowdown. Each requires different strategies.",
        keyPoints: [
          "Bull Market: Buy and hold, ride the trend",
          "Bear Market: Defensive stocks, cash reserves",
          "Markets are cyclical",
          "Don't try to time perfectly"
        ],
        example: "Bull: 2020-2021 post-COVID rally. Bear: 2022 inflation-driven decline. Both are normal market cycles."
      },
      {
        id: "portfolio",
        title: "Building a Portfolio",
        content: "A well-balanced portfolio includes stocks across market caps, sectors, and geographies. Rebalance periodically. Include some defensive stocks for stability.",
        keyPoints: [
          "60% Large-cap, 30% Mid-cap, 10% Small-cap",
          "Diversify across 5-6 sectors",
          "Include 2-3 defensive stocks",
          "Rebalance every 6 months"
        ],
        example: "Portfolio: 6 large-caps (tech, banking, pharma), 3 mid-caps (manufacturing), 1 small-cap (emerging sector). Review quarterly."
      }
    ]
  }
];

export default function StockGuide() {
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [activeLesson, setActiveLesson] = useState<string>("what-is-stock");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const currentSection = STOCK_GUIDE.find(s => s.id === activeSection);
  const currentLesson = currentSection?.lessons.find(l => l.id === activeLesson);

  const markComplete = () => {
    setCompletedLessons(prev => new Set([...prev, activeLesson]));
    const currentIndex = currentSection?.lessons.findIndex(l => l.id === activeLesson) ?? -1;
    if (currentIndex < (currentSection?.lessons.length ?? 0) - 1) {
      setActiveLesson(currentSection!.lessons[currentIndex + 1].id);
    }
  };

  const handleQuizAnswer = (answer: number) => {
    setQuizAnswers(prev => ({ ...prev, [activeLesson]: answer }));
  };

  const progress = (completedLessons.size / STOCK_GUIDE.reduce((sum, s) => sum + s.lessons.length, 0)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020810] via-[#0a0f1e] to-[#020810] text-[var(--text)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--panel)]/95 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Complete Stock Market Guide</h1>
              <p className="text-xs text-[var(--muted)]">Master stocks from basics to advanced strategies</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-[var(--muted)]">Progress</div>
                <div className="text-sm font-bold text-[var(--accent)]">{progress.toFixed(0)}%</div>
              </div>
              <div className="w-32 h-2 bg-[var(--panel)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass p-4 rounded-xl sticky top-24">
              <h3 className="text-sm font-bold mb-4">Sections</h3>
              <div className="space-y-2">
                {STOCK_GUIDE.map((section) => {
                  const sectionCompleted = section.lessons.every(l => completedLessons.has(l.id));
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setActiveLesson(section.lessons[0].id);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{section.icon}</span>
                        <span className="text-xs font-medium flex-1">{section.title}</span>
                        {sectionCompleted && <span className="text-[var(--accent2)]">✓</span>}
                      </div>
                      <div className="text-[9px] text-[var(--muted)]">{section.duration}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="glass p-8 rounded-xl">
              {/* Lesson Navigation */}
              <div className="mb-6 pb-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-3">
                  <span>{currentSection?.icon}</span>
                  <span>{currentSection?.title}</span>
                  <span>•</span>
                  <span>{currentSection?.duration}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {currentSection?.lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson.id)}
                      className={`shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                        activeLesson === lesson.id
                          ? "bg-[var(--accent)] text-black"
                          : completedLessons.has(lesson.id)
                          ? "bg-[var(--accent2)]/20 text-[var(--accent2)] border border-[var(--accent2)]/30"
                          : "bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent)]"
                      }`}
                    >
                      {idx + 1}. {lesson.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson Content */}
              {currentLesson && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                    <p className="text-sm text-[var(--text)] leading-relaxed">{currentLesson.content}</p>
                  </div>

                  {/* Key Points */}
                  <div className="p-4 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-lg">
                    <h3 className="text-sm font-bold text-[var(--accent)] mb-3">🔑 Key Points</h3>
                    <ul className="space-y-2">
                      {currentLesson.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-[var(--accent)] mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Example */}
                  {currentLesson.example && (
                    <div className="p-4 bg-[var(--magenta)]/5 border border-[var(--magenta)]/20 rounded-lg">
                      <h3 className="text-sm font-bold text-[var(--magenta)] mb-2">💡 Example</h3>
                      <p className="text-sm text-[var(--text)]">{currentLesson.example}</p>
                    </div>
                  )}

                  {/* Quiz */}
                  {currentLesson.quiz && (
                    <div className="p-4 bg-[var(--panel)] border border-[var(--border)] rounded-lg">
                      <h3 className="text-sm font-bold mb-3">📝 Quick Quiz</h3>
                      <p className="text-sm mb-4">{currentLesson.quiz.question}</p>
                      <div className="space-y-2">
                        {currentLesson.quiz.options.map((option, idx) => {
                          const selected = quizAnswers[activeLesson] === idx;
                          const correct = idx === currentLesson.quiz!.correct;
                          const answered = quizAnswers[activeLesson] !== undefined;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(idx)}
                              disabled={answered}
                              className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                                answered
                                  ? correct
                                    ? "bg-[var(--accent2)]/20 border-2 border-[var(--accent2)]"
                                    : selected
                                    ? "bg-[var(--red)]/20 border-2 border-[var(--red)]"
                                    : "bg-[var(--panel)] border border-[var(--border)]"
                                  : "bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent)]"
                              }`}
                            >
                              {option}
                              {answered && correct && " ✓"}
                              {answered && selected && !correct && " ✗"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                    <button
                      onClick={() => {
                        const currentIndex = currentSection?.lessons.findIndex(l => l.id === activeLesson) ?? 0;
                        if (currentIndex > 0) {
                          setActiveLesson(currentSection!.lessons[currentIndex - 1].id);
                        }
                      }}
                      disabled={(currentSection?.lessons.findIndex(l => l.id === activeLesson) ?? 0) === 0}
                      className="px-6 py-2.5 border border-[var(--border)] text-sm rounded-lg hover:border-[var(--accent)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    
                    <button
                      onClick={markComplete}
                      className="px-8 py-2.5 bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)] text-white font-bold text-sm rounded-lg hover:shadow-[0_0_20px_var(--accent)] transition-all"
                    >
                      {completedLessons.has(activeLesson) ? "Next Lesson →" : "Mark Complete & Continue"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
