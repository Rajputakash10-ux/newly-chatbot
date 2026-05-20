"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatBubble from "./components/ChatBubble";
import StockTicker from "./components/StockTicker";
import StockPanel from "./components/StockPanel";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = ["Analyze NVDA", "Best stocks today?", "Explain RSI", "Bull vs Bear market"];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [time, setTime] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sid = localStorage.getItem("chatSessionId");
    if (!sid) { sid = uuidv4(); localStorage.setItem("chatSessionId", sid); }
    setSessionId(sid);
    fetch(`/api/history?sessionId=${sid}`)
      .then((r) => r.ok ? r.json() : { messages: [] })
      .then((d) => setMessages(d.messages || []))
      .catch(() => setMessages([]));

    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg?: string) => {
    const text = msg || input;
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: text }),
    });
    if (!res.ok) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠ Connection error. Please retry." }]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] overflow-hidden">
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-[var(--accent)] font-bold tracking-widest text-sm glow-text">NEWLY.COM</span>
          <span className="text-[var(--muted)] text-xs">AI TRADING TERMINAL</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <span>SESSION: <span className="text-[var(--accent)]">{sessionId.slice(0, 8).toUpperCase()}</span></span>
          <span className="text-[var(--accent2)] font-bold cursor text-sm">{time}</span>
        </div>
      </header>

      {/* Ticker */}
      <StockTicker />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden gap-2 p-2">

        {/* Left: Stock Panel */}
        <div className="w-64 shrink-0 overflow-hidden">
          <StockPanel />
        </div>

        {/* Right: Chat */}
        <div className="flex flex-col flex-1 overflow-hidden panel">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
            <span className="text-xs text-[var(--accent)] tracking-widest font-bold">AI ANALYST TERMINAL</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-[var(--red)]" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-[var(--accent2)]" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="text-4xl glow-text text-[var(--accent)]">◈</div>
                <p className="text-[var(--muted)] text-xs tracking-widest">AI TRADING ANALYST READY</p>
                <p className="text-[var(--muted)] text-xs">Ask about stocks, markets, strategies...</p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="text-xs px-3 py-1 border border-[var(--accent)]/30 text-[var(--accent)] rounded hover:bg-[var(--accent)]/10 transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="border border-[var(--accent2)]/20 bg-[var(--accent2)]/5 px-4 py-2 rounded-tr-xl rounded-bl-xl rounded-br-xl text-xs text-[var(--accent2)] animate-pulse">
                  ◈ ANALYZING MARKET DATA...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 px-4 py-1 border-t border-[var(--border)] overflow-x-auto">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-[10px] px-2 py-0.5 border border-[var(--border)] text-[var(--muted)] rounded whitespace-nowrap hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-[var(--border)]">
            <div className="flex-1 flex items-center border border-[var(--border)] rounded bg-black/30 px-3 focus-within:border-[var(--accent)] transition-all">
              <span className="text-[var(--accent)] text-xs mr-2">▶</span>
              <input
                className="flex-1 bg-transparent text-xs text-[var(--text)] outline-none py-2 placeholder:text-[var(--muted)]"
                placeholder="Enter market query..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold border border-[var(--accent)] text-[var(--accent)] rounded hover:bg-[var(--accent)] hover:text-black transition-all disabled:opacity-30 tracking-widest pulse-border"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
