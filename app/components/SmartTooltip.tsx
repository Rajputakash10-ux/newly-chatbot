"use client";
import { useState } from "react";

type TooltipProps = {
  title: string;
  description: string;
  usage: string;
  interpretation: string;
  children: React.ReactNode;
};

export default function SmartTooltip({ title, description, usage, interpretation, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>

      {show && (
        <div className="absolute z-50 w-72 glass p-4 -top-2 left-full ml-3 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <h4 className="text-xs font-orbitron font-bold text-[var(--accent)] tracking-wider">
              {title}
            </h4>
          </div>
          
          <p className="text-xs text-[var(--text)] mb-3 leading-relaxed">
            {description}
          </p>

          <div className="space-y-2 text-[10px]">
            <div>
              <span className="text-[var(--accent2)] font-bold">Why traders use it:</span>
              <p className="text-[var(--muted)] mt-1">{usage}</p>
            </div>
            <div>
              <span className="text-[var(--magenta)] font-bold">How to interpret:</span>
              <p className="text-[var(--muted)] mt-1">{interpretation}</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute top-4 -left-2 w-2 h-2 bg-[var(--panel2)] border-l border-t border-[var(--accent)]/20 transform rotate-45" />
        </div>
      )}
    </div>
  );
}

export const INDICATOR_TOOLTIPS = {
  RSI: {
    title: "RSI (Relative Strength Index)",
    description: "Measures momentum to detect overbought or oversold conditions.",
    usage: "Helps identify potential reversal points in price trends.",
    interpretation: "Above 70 = Overbought (may drop). Below 30 = Oversold (may rise)."
  },
  MACD: {
    title: "MACD (Moving Average Convergence Divergence)",
    description: "Shows relationship between two moving averages to identify trend changes.",
    usage: "Traders use it to spot bullish or bearish momentum shifts.",
    interpretation: "Line crosses above signal = Bullish. Crosses below = Bearish."
  },
  VOLUME: {
    title: "Trading Volume",
    description: "Total number of shares/coins traded in a period.",
    usage: "Confirms strength of price movements and trends.",
    interpretation: "High volume + price rise = Strong trend. Low volume = Weak trend."
  },
  EMA: {
    title: "EMA (Exponential Moving Average)",
    description: "Smoothed average price that reacts faster to recent changes.",
    usage: "Identifies trend direction and potential support/resistance levels.",
    interpretation: "Price above EMA = Uptrend. Price below EMA = Downtrend."
  },
  BOLLINGER: {
    title: "Bollinger Bands",
    description: "Shows volatility and potential price breakout zones.",
    usage: "Helps identify when price is stretched too far from average.",
    interpretation: "Price at upper band = Overbought. At lower band = Oversold."
  },
  ATR: {
    title: "ATR (Average True Range)",
    description: "Measures market volatility and price movement range.",
    usage: "Helps set stop-loss levels and position sizing.",
    interpretation: "High ATR = High volatility. Low ATR = Low volatility."
  }
};
