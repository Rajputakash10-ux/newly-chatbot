"use client";
import { useState } from "react";

export default function AIAssistantPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "Explain RSI in simple words",
    "Analyze Tesla stock",
    "What is support and resistance?",
    "Predict Bitcoin trend",
    "Teach me candlestick patterns",
    "How to read MACD?"
  ];

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm analyzing your query. This is a demo response. In production, this would connect to your AI backend for real stock analysis and educational content."
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="glass p-6 rounded-xl" data-tour="ai-assistant">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <h3 className="text-sm font-bold">AI Assistant</h3>
          <p className="text-[10px] text-[var(--muted)]">Ask anything about stocks, trading, or market analysis</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-xs text-[var(--muted)]">Start a conversation with AI</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg text-xs ${
                  msg.role === "user"
                    ? "bg-[var(--accent)]/20 text-[var(--text)] border border-[var(--accent)]/30"
                    : "bg-[var(--panel)] text-[var(--text)] border border-[var(--border)]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--panel)] border border-[var(--border)] px-4 py-2 rounded-lg text-xs animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="mb-4">
        <div className="text-[10px] text-[var(--muted)] mb-2">Suggested questions:</div>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.slice(0, 4).map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[10px] px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-black/30 border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]"
          placeholder="Ask AI about stocks, indicators, or trading..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="px-6 py-2.5 bg-[var(--accent)] text-black font-bold text-sm rounded-lg hover:shadow-[0_0_15px_var(--accent)] transition-all disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </section>
  );
}
