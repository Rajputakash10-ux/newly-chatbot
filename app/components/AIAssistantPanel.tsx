"use client";
import { useState, useRef, useEffect } from "react";

export default function AIAssistantPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; type?: string; data?: any }>>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { icon: "📊", text: "Analyze Tesla stock", category: "analysis" },
    { icon: "📚", text: "Explain RSI in simple words", category: "learn" },
    { icon: "🎯", text: "What is support and resistance?", category: "learn" },
    { icon: "🔮", text: "Predict Bitcoin trend", category: "analysis" },
    { icon: "🕯️", text: "Teach me candlestick patterns", category: "learn" },
    { icon: "💡", text: "How to read MACD?", category: "learn" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      
      if (msg.toLowerCase().includes("tesla") || msg.toLowerCase().includes("tsla")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Here's my analysis of Tesla (TSLA):",
            type: "analysis",
            data: {
              symbol: "TSLA",
              price: "$245.67",
              change: "+4.23%",
              trend: "Bullish",
              confidence: 85,
              signals: [
                "Strong upward momentum detected",
                "RSI at 68 - approaching overbought",
                "MACD showing bullish crossover",
                "Volume 25% above average"
              ],
              recommendation: "The stock is showing strong bullish momentum. For beginners: This means the price is trending upward with good buying pressure. However, RSI suggests caution as it's near overbought levels."
            }
          }
        ]);
      } else if (msg.toLowerCase().includes("rsi")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Let me explain RSI (Relative Strength Index) in simple terms:\n\n**What is it?**\nRSI measures how fast and how much a stock's price is changing. It gives you a number between 0 and 100.\n\n**How to read it:**\n• Above 70 = Overbought (price might drop soon)\n• Below 30 = Oversold (price might rise soon)\n• Between 30-70 = Normal range\n\n**Why traders use it:**\nIt helps spot when a stock might reverse direction. Think of it like a speedometer for price momentum!\n\n**Beginner tip:** Don't use RSI alone. Combine it with other indicators for better decisions."
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm your AI stock market mentor! I can help you:\n\n• Analyze any stock with technical indicators\n• Explain trading concepts in simple language\n• Provide market insights and trends\n• Guide you through learning resources\n\nTry asking me to analyze a specific stock or explain a trading concept!"
          }
        ]);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="glass p-6 rounded-xl border-2 border-[var(--accent)]/10" data-tour="ai-assistant">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--accent2)] rounded-full border-2 border-[var(--bg)] flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold">AI Stock Mentor</h3>
          <p className="text-[10px] text-[var(--muted)]">Ask me anything about stocks, trading, or market analysis</p>
        </div>
        <div className="px-3 py-1 bg-[var(--accent2)]/10 border border-[var(--accent2)]/30 rounded-full">
          <span className="text-[9px] text-[var(--accent2)] font-bold">ONLINE</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="mb-6 max-h-96 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--magenta)]/20 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <h4 className="text-sm font-bold mb-2">Start a conversation</h4>
            <p className="text-xs text-[var(--muted)] mb-4">I'm here to help you learn and analyze stocks</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] flex items-center justify-center shrink-0 mr-3">
                  <span className="text-sm">🤖</span>
                </div>
              )}
              <div
                className={`max-w-[85%] ${msg.role === "user"
                    ? "bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)] text-white"
                    : "bg-[var(--panel)] border border-[var(--border)]"
                  } px-4 py-3 rounded-2xl ${msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>
                
                {msg.type === "analysis" && msg.data && (
                  <div className="mt-4 p-4 bg-black/20 rounded-lg border border-[var(--accent)]/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold">{msg.data.symbol}</div>
                        <div className="text-xs text-[var(--muted)]">{msg.data.price}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[var(--accent2)]">{msg.data.change}</div>
                        <div className="text-xs text-[var(--muted)]">{msg.data.trend}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--muted)]">AI Confidence</span>
                        <span className="font-bold text-[var(--accent)]">{msg.data.confidence}%</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)]" style={{ width: `${msg.data.confidence}%` }} />
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {msg.data.signals.map((signal: string, idx: number) => (
                        <div key={idx} className="text-xs flex items-start gap-2">
                          <span className="text-[var(--accent)] mt-0.5">•</span>
                          <span>{signal}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-lg">
                      <div className="text-[10px] text-[var(--accent)] font-bold mb-1">💡 BEGINNER TIP</div>
                      <div className="text-xs text-[var(--muted)]">{msg.data.recommendation}</div>
                    </div>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-[var(--text)]/10 flex items-center justify-center shrink-0 ml-3">
                  <span className="text-sm">👤</span>
                </div>
              )}
            </div>
          ))
        )}
        
        {typing && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] flex items-center justify-center shrink-0 mr-3">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-[var(--panel)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="mb-4">
        <div className="text-[10px] text-[var(--muted)] mb-3 font-medium">Quick actions:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {suggestedPrompts.slice(0, 6).map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => handleSend(prompt.text)}
              className="flex items-center gap-2 text-[10px] px-3 py-2 border border-[var(--border)] text-[var(--text)] rounded-lg hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all text-left"
            >
              <span>{prompt.icon}</span>
              <span className="truncate">{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          className="flex-1 bg-[var(--panel)] border-2 border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]"
          placeholder="Ask about any stock or trading concept..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)] text-white font-bold text-sm rounded-xl hover:shadow-[0_0_20px_var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </section>
  );
}
