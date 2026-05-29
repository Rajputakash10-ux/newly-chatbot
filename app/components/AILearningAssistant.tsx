"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
  "What is AI?",
  "How does NEXUS work?",
  "What is neural network?",
  "Explain machine learning",
  "What is Bitcoin?",
  "How to use models?"
];

const EDUCATIONAL_RESPONSES: Record<string, string> = {
  "what is bitcoin": "Bitcoin is a digital currency (cryptocurrency) that operates without a central bank. It's traded 24/7 on exchanges and its price fluctuates based on supply and demand.",
  "how do indicators work": "Technical indicators are mathematical calculations based on price, volume, or open interest. They help traders identify trends, momentum, and potential reversal points.",
  "what is macd": "MACD shows the relationship between two moving averages. When the MACD line crosses above the signal line, it's bullish. When it crosses below, it's bearish.",
  "explain candlestick": "Each candlestick shows 4 prices: Open, High, Low, Close. Green = price went up. Red = price went down. The body shows open/close, wicks show high/low.",
  "what is market cap": "Market capitalization = Current Price × Total Supply. It represents the total value of all coins/shares. Higher market cap usually means more stable asset.",
  "how to read rsi": "RSI ranges from 0-100. Above 70 means overbought (may drop soon). Below 30 means oversold (may rise soon). It helps spot potential reversals.",
  "what is ai": "Artificial Intelligence (AI) is technology that enables machines to learn from data, recognize patterns, and make decisions. NEXUS AI uses neural networks with 2.4B parameters.",
  "what is neural network": "A neural network is a machine learning model inspired by the human brain. It learns patterns from data through layers of interconnected nodes.",
  "what is machine learning": "Machine learning is AI that improves automatically through experience. It analyzes data, identifies patterns, and makes predictions without explicit programming.",
  "how does nexus work": "NEXUS AI processes data through advanced neural networks, analyzes patterns in real-time, and provides predictions with 99.7% accuracy at 0.3ms latency."
};

export default function AILearningAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const key = msg.toLowerCase().replace(/[?]/g, "");
      const response = Object.keys(EDUCATIONAL_RESPONSES).find((k) => key.includes(k))
        ? EDUCATIONAL_RESPONSES[Object.keys(EDUCATIONAL_RESPONSES).find((k) => key.includes(k))!]
        : "I can help you learn about trading! Try asking about Bitcoin, indicators, charts, or market concepts.";

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setTyping(false);
    }, 1000);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] flex items-center justify-center shadow-[0_0_30px_var(--accent)] hover:scale-110 transition-transform animate-pulse"
      >
        <span className="text-2xl">🤖</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 glass transition-all ${minimized ? "w-80 h-14" : "w-96 h-[500px]"} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <div>
            <div className="text-xs font-orbitron font-bold text-[var(--accent)]">AI LEARNING ASSISTANT</div>
            <div className="text-[9px] text-[var(--accent2)] flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)] animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMinimized(!minimized)} className="text-[var(--muted)] hover:text-[var(--accent)] text-sm">
            {minimized ? "□" : "−"}
          </button>
          <button onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--red)] text-sm">
            ✕
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">📚</div>
                <p className="text-xs text-[var(--muted)] mb-4">Ask me anything about AI and NEXUS!</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_QUESTIONS.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-[9px] px-2 py-1 border border-[var(--accent)]/30 text-[var(--accent)] rounded hover:bg-[var(--accent)]/10 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-xs ${
                    msg.role === "user"
                      ? "bg-[var(--accent)]/20 text-[var(--text)] border border-[var(--accent)]/30"
                      : "bg-[var(--panel)] text-[var(--text)] border border-[var(--border)]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-[var(--panel)] border border-[var(--border)] px-3 py-2 rounded-lg text-xs text-[var(--accent)] animate-pulse">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-2 py-1 border-t border-[var(--border)] flex gap-1 overflow-x-auto">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[8px] px-2 py-1 border border-[var(--border)] text-[var(--muted)] rounded whitespace-nowrap hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-[var(--border)] flex gap-2">
            <input
              className="flex-1 bg-black/30 border border-[var(--border)] rounded px-2 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]"
              placeholder="Ask about AI, models, or analysis..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={() => sendMessage()}
              className="px-3 py-1.5 bg-[var(--accent)] text-black text-xs font-bold rounded hover:shadow-[0_0_15px_var(--accent)] transition-all"
            >
              →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
