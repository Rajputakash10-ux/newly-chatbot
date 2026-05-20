"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatBubble from "./components/ChatBubble";
import StockTicker from "./components/StockTicker";
import CandlestickChart from "./components/CandlestickChart";
import AnalysisPanel from "./components/AnalysisPanel";

type Message = { role: "user" | "assistant"; content: string };
type Stock = { symbol: string; price: number; change: number; changePct: number };
type View = "WATCHLIST" | "CHART" | "ANALYSIS" | "CHAT";

const QUICK_PROMPTS = ["Analyze NVDA", "Best stocks today?", "Explain RSI", "Bull vs Bear"];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [time, setTime] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selected, setSelected] = useState("AAPL");
  const [view, setView] = useState<View>("CHART");
  const [showInput, setShowInput] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedStock = stocks.find((s) => s.symbol === selected);
  const isPositive = (selectedStock?.change ?? 0) >= 0;

  useEffect(() => {
    let sid = localStorage.getItem("chatSessionId");
    if (!sid) { sid = uuidv4(); localStorage.setItem("chatSessionId", sid); }
    setSessionId(sid);
    fetch(`/api/history?sessionId=${sid}`)
      .then((r) => r.ok ? r.json() : { messages: [] })
      .then((d) => setMessages(d.messages || []))
      .catch(() => {});

    fetch("/api/stocks").then((r) => r.json()).then((d) => setStocks(d.stocks || []));
    const stockInterval = setInterval(() =>
      fetch("/api/stocks").then((r) => r.json()).then((d) => setStocks(d.stocks || [])), 60000);

    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const t = setInterval(tick, 1000);
    return () => { clearInterval(t); clearInterval(stockInterval); };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (msg?: string) => {
    const text = msg || input;
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setShowInput(false);

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
      <div className="scanline" />

      {/* Compact Header */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--panel)] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-[var(--accent)] font-bold tracking-widest text-xs glow-text">NEWLY</span>
        </div>
        {selectedStock && view !== "WATCHLIST" && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--accent)] font-bold">{selectedStock.symbol}</span>
            <span className="text-[var(--text)] font-bold">${selectedStock.price.toFixed(2)}</span>
            <span className={`text-xs font-bold ${isPositive ? "text-[var(--accent2)]" : "text-[var(--red)]"}`}>
              {isPositive ? "▲" : "▼"} {Math.abs(selectedStock.changePct).toFixed(2)}%
            </span>
          </div>
        )}
        <span className="text-[var(--accent2)] font-bold text-xs cursor">{time}</span>
      </header>

      {/* Ticker - hide on mobile when not on watchlist */}
      <div className={view === "WATCHLIST" ? "block" : "hidden lg:block"}>
        <StockTicker />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* WATCHLIST VIEW */}
        <div className={`absolute inset-0 overflow-y-auto ${view === "WATCHLIST" ? "block" : "hidden"}`}>
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[var(--accent)] tracking-widest">WATCHLIST</h2>
              <span className="text-xs text-[var(--muted)]">{stocks.length} stocks</span>
            </div>
            {stocks.map((s) => (
              <div
                key={s.symbol}
                onClick={() => { setSelected(s.symbol); setView("CHART"); }}
                className={`panel p-3 cursor-pointer transition-all active:scale-95 ${
                  selected === s.symbol ? "border-l-2 border-l-[var(--accent)] bg-[var(--accent)]/5" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[var(--accent)]">{s.symbol}</span>
                  <span className={`text-sm font-bold ${s.change >= 0 ? "text-[var(--accent2)]" : "text-[var(--red)]"}`}>
                    {s.change >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[var(--text)]">${s.price.toFixed(2)}</span>
                  <span className={`text-xs ${s.change >= 0 ? "text-[var(--accent2)]" : "text-[var(--red)]"}`}>
                    {s.change >= 0 ? "▲" : "▼"} ${Math.abs(s.change).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART VIEW */}
        <div className={`absolute inset-0 flex flex-col ${view === "CHART" ? "flex" : "hidden"}`}>
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--panel)] shrink-0">
            <span className="text-xs font-bold text-[var(--accent)]">{selected}</span>
            <span className="text-[9px] text-[var(--muted)] tracking-widest">CANDLESTICK · EMA · VOL</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <CandlestickChart key={selected} symbol={selected} isPositive={isPositive} />
          </div>
        </div>

        {/* ANALYSIS VIEW */}
        <div className={`absolute inset-0 overflow-y-auto ${view === "ANALYSIS" ? "block" : "hidden"}`}>
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[var(--accent)] tracking-widest">STRATEGY ANALYSIS</h2>
              <span className="text-xs text-[var(--muted)]">{selected}</span>
            </div>
            <AnalysisPanel symbol={selected} />
          </div>
        </div>

        {/* CHAT VIEW */}
        <div className={`absolute inset-0 flex flex-col ${view === "CHAT" ? "flex" : "hidden"}`}>
          <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--panel)] shrink-0">
            <h2 className="text-xs font-bold text-[var(--accent)] tracking-widest">AI ANALYST</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="text-4xl glow-text text-[var(--accent)]">◈</div>
                <p className="text-[var(--muted)] text-xs tracking-widest">AI TRADING ANALYST</p>
                <p className="text-[var(--muted)] text-[10px]">Ask about stocks, markets, strategies</p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {QUICK_PROMPTS.map((p) => (
                    <button key={p} onClick={() => sendMessage(p)}
                      className="text-xs px-3 py-2 border border-[var(--accent)]/30 text-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/10 transition-all active:scale-95">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => <ChatBubble key={i} role={msg.role} content={msg.content} />)}
            {loading && (
              <div className="flex justify-start mb-2">
                <div className="border border-[var(--accent2)]/20 bg-[var(--accent2)]/5 px-4 py-2 rounded-tr-xl rounded-bl-xl rounded-br-xl text-xs text-[var(--accent2)] animate-pulse">
                  ◈ ANALYZING...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 px-3 py-2 border-t border-[var(--border)] overflow-x-auto shrink-0">
            {QUICK_PROMPTS.map((p) => (
              <button key={p} onClick={() => sendMessage(p)}
                className="text-[10px] px-3 py-1 border border-[var(--border)] text-[var(--muted)] rounded whitespace-nowrap hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shrink-0 active:scale-95">
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout (lg+) */}
        <div className="hidden lg:flex absolute inset-0">
          {/* Left: Watchlist */}
          <div className="w-56 border-r border-[var(--border)] flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--border)] shrink-0">
              <span className="text-[10px] text-[var(--accent)] font-bold tracking-widest">WATCHLIST</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {stocks.map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => setSelected(s.symbol)}
                  className={`flex flex-col px-3 py-2 cursor-pointer border-b border-[var(--border)]/50 transition-all ${
                    selected === s.symbol ? "bg-[var(--accent)]/10 border-l-2 border-l-[var(--accent)]" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[var(--accent)]">{s.symbol}</span>
                    <span className={`text-[10px] font-bold ${s.change >= 0 ? "text-[var(--accent2)]" : "text-[var(--red)]"}`}>
                      {s.change >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text)] mt-0.5">${s.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Chart */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-[var(--border)]">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)] shrink-0 bg-[var(--panel)]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--accent)]">{selected}</span>
                {selectedStock && (
                  <>
                    <span className="text-xs text-[var(--text)]">${selectedStock.price.toFixed(2)}</span>
                    <span className={`text-xs ${isPositive ? "text-[var(--accent2)]" : "text-[var(--red)]"}`}>
                      {isPositive ? "▲" : "▼"} {Math.abs(selectedStock.changePct).toFixed(2)}%
                    </span>
                  </>
                )}
              </div>
              <span className="text-[10px] text-[var(--muted)] tracking-widest">CANDLESTICK · EMA 50/100/200 · VOLUME</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <CandlestickChart key={selected} symbol={selected} isPositive={isPositive} />
            </div>
          </div>

          {/* Right: Analysis + Chat */}
          <div className="w-80 xl:w-96 flex flex-col overflow-hidden">
            <div className="border-b border-[var(--border)] overflow-y-auto max-h-[45%]">
              <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--panel)] sticky top-0">
                <span className="text-[10px] text-[var(--accent)] font-bold tracking-widest">STRATEGY · {selected}</span>
              </div>
              <div className="p-2">
                <AnalysisPanel symbol={selected} />
              </div>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--panel)] shrink-0">
                <span className="text-[10px] text-[var(--accent)] font-bold tracking-widest">AI ANALYST</span>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="text-3xl glow-text text-[var(--accent)]">◈</div>
                    <p className="text-[var(--muted)] text-[10px] tracking-widest">AI ANALYST READY</p>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                      {QUICK_PROMPTS.map((p) => (
                        <button key={p} onClick={() => sendMessage(p)}
                          className="text-[10px] px-2 py-1 border border-[var(--accent)]/30 text-[var(--accent)] rounded hover:bg-[var(--accent)]/10 transition-all">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => <ChatBubble key={i} role={msg.role} content={msg.content} />)}
                {loading && (
                  <div className="flex justify-start mb-2">
                    <div className="border border-[var(--accent2)]/20 bg-[var(--accent2)]/5 px-3 py-1.5 rounded-tr-xl rounded-bl-xl rounded-br-xl text-[10px] text-[var(--accent2)] animate-pulse">
                      ◈ ANALYZING...
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="flex gap-1 px-2 py-1 border-t border-[var(--border)] overflow-x-auto shrink-0">
                {QUICK_PROMPTS.map((p) => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className="text-[9px] px-2 py-0.5 border border-[var(--border)] text-[var(--muted)] rounded whitespace-nowrap hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shrink-0">
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 p-2 border-t border-[var(--border)] shrink-0">
                <div className="flex-1 flex items-center border border-[var(--border)] rounded bg-black/30 px-2 focus-within:border-[var(--accent)] transition-all">
                  <span className="text-[var(--accent)] text-xs mr-1.5">▶</span>
                  <input
                    className="flex-1 bg-transparent text-xs text-[var(--text)] outline-none py-1.5 placeholder:text-[var(--muted)]"
                    placeholder="Ask about any stock..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                </div>
                <button onClick={() => sendMessage()} disabled={loading}
                  className="px-3 py-1.5 text-[10px] font-bold border border-[var(--accent)] text-[var(--accent)] rounded hover:bg-[var(--accent)] hover:text-black transition-all disabled:opacity-30 tracking-widest">
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden flex items-center justify-around border-t border-[var(--border)] bg-[var(--panel)] py-2 shrink-0 safe-area-bottom">
        <button
          onClick={() => setView("WATCHLIST")}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-all active:scale-95 ${
            view === "WATCHLIST" ? "text-[var(--accent)]" : "text-[var(--muted)]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[9px] font-bold tracking-wider">LIST</span>
        </button>

        <button
          onClick={() => setView("CHART")}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-all active:scale-95 ${
            view === "CHART" ? "text-[var(--accent)]" : "text-[var(--muted)]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[9px] font-bold tracking-wider">CHART</span>
        </button>

        <button
          onClick={() => setView("ANALYSIS")}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-all active:scale-95 ${
            view === "ANALYSIS" ? "text-[var(--accent)]" : "text-[var(--muted)]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-[9px] font-bold tracking-wider">SIGNAL</span>
        </button>

        <button
          onClick={() => setView("CHAT")}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-all active:scale-95 relative ${
            view === "CHAT" ? "text-[var(--accent)]" : "text-[var(--muted)]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-[9px] font-bold tracking-wider">AI</span>
          {messages.length > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-[var(--accent2)] rounded-full animate-pulse" />
          )}
        </button>
      </nav>

      {/* Floating Action Button for Chat Input (Mobile) */}
      {view === "CHAT" && (
        <>
          <button
            onClick={() => setShowInput(!showInput)}
            className="lg:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] text-white shadow-lg flex items-center justify-center z-50 active:scale-95 transition-all"
            style={{ boxShadow: "0 0 20px rgba(0,212,255,0.5)" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {showInput && (
            <div className="lg:hidden fixed inset-x-0 bottom-16 bg-[var(--panel)] border-t border-[var(--border)] p-3 z-40 safe-area-bottom">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center border border-[var(--border)] rounded-lg bg-black/30 px-3 focus-within:border-[var(--accent)] transition-all">
                  <span className="text-[var(--accent)] text-sm mr-2">▶</span>
                  <input
                    className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none py-3 placeholder:text-[var(--muted)]"
                    placeholder="Ask about any stock..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={loading}
                  className="px-4 py-3 text-xs font-bold border border-[var(--accent)] text-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-black transition-all disabled:opacity-30 tracking-widest active:scale-95"
                >
                  SEND
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
