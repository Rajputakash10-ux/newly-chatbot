"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatBubble from "./components/ChatBubble";
import StockTicker from "./components/StockTicker";
import CandlestickChart from "./components/CandlestickChart";
import AnalysisPanel from "./components/AnalysisPanel";

type Message = { role: "user" | "assistant"; content: string };
type Stock = { symbol: string; price: number; change: number; changePct: number };
type Tab = "CHART" | "ANALYSIS" | "CHAT";

const QUICK_PROMPTS = ["Analyze NVDA", "Best stocks today?", "Explain RSI", "Bull vs Bear market"];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [time, setTime] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selected, setSelected] = useState("AAPL");
  const [mobileTab, setMobileTab] = useState<Tab>("CHART");
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
    setMobileTab("CHAT");

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

      {/* Header */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--panel)] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-[var(--accent)] font-bold tracking-widest text-sm glow-text">NEWLY.COM</span>
          <span className="text-[var(--muted)] text-xs hidden sm:inline">TRADING TERMINAL</span>
        </div>
        {selectedStock && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[var(--accent)] font-bold">{selectedStock.symbol}</span>
            <span className="text-[var(--text)] font-bold">${selectedStock.price.toFixed(2)}</span>
            <span className={isPositive ? "text-[var(--accent2)]" : "text-[var(--red)]"}>
              {isPositive ? "▲" : "▼"} {Math.abs(selectedStock.changePct).toFixed(2)}%
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent2)] font-bold text-xs sm:text-sm cursor">{time}</span>
        </div>
      </header>

      {/* Ticker */}
      <StockTicker />

      {/* Mobile Tab Bar */}
      <div className="flex lg:hidden border-b border-[var(--border)] bg-[var(--panel)] shrink-0">
        {(["CHART", "ANALYSIS", "CHAT"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2 text-[10px] tracking-widest font-bold transition-all ${
              mobileTab === tab
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-[var(--muted)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Stock List */}
        <div className={`
          lg:w-48 lg:flex lg:flex-col lg:border-r lg:border-[var(--border)] shrink-0 overflow-hidden
          ${mobileTab === "CHART" ? "hidden lg:flex" : "hidden lg:flex"}
        `}>
          <div className="px-3 py-2 border-b border-[var(--border)] shrink-0">
            <span className="text-[10px] text-[var(--accent)] font-bold tracking-widest">WATCHLIST</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stocks.map((s) => (
              <div
                key={s.symbol}
                onClick={() => setSelected(s.symbol)}
                className={`flex flex-col px-3 py-2 cursor-pointer border-b border-[var(--border)]/50 transition-all ${
                  selected === s.symbol
                    ? "bg-[var(--accent)]/10 border-l-2 border-l-[var(--accent)]"
                    : "hover:bg-white/5"
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

        {/* CENTER: Chart */}
        <div className={`
          flex-1 flex flex-col overflow-hidden border-r border-[var(--border)]
          ${mobileTab === "CHART" ? "flex" : "hidden lg:flex"}
        `}>
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
            <span className="text-[10px] text-[var(--muted)] tracking-widest hidden md:inline">CANDLESTICK · EMA 50/100/200 · VOLUME</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <CandlestickChart key={selected} symbol={selected} isPositive={isPositive} />
          </div>
        </div>

        {/* RIGHT: Analysis + Chat */}
        <div className={`
          lg:w-80 xl:w-96 flex flex-col overflow-hidden
          ${mobileTab === "ANALYSIS" || mobileTab === "CHAT" ? "flex flex-1" : "hidden lg:flex"}
        `}>
          {/* Analysis */}
          <div className={`
            border-b border-[var(--border)] overflow-y-auto
            ${mobileTab === "CHAT" ? "hidden lg:block lg:max-h-[45%]" : "flex-1 lg:max-h-[45%]"}
          `}>
            <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--panel)] sticky top-0">
              <span className="text-[10px] text-[var(--accent)] font-bold tracking-widest">STRATEGY ANALYSIS · {selected}</span>
            </div>
            <div className="p-2">
              <AnalysisPanel symbol={selected} />
            </div>
          </div>

          {/* Chat */}
          <div className={`
            flex flex-col overflow-hidden
            ${mobileTab === "ANALYSIS" ? "hidden lg:flex lg:flex-1" : "flex flex-1"}
          `}>
            <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--panel)] shrink-0">
              <span className="text-[10px] text-[var(--accent)] font-bold tracking-widest">AI ANALYST</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div className="text-3xl glow-text text-[var(--accent)]">◈</div>
                  <p className="text-[var(--muted)] text-[10px] tracking-widest">AI TRADING ANALYST READY</p>
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

            {/* Quick prompts */}
            <div className="flex gap-1 px-2 py-1 border-t border-[var(--border)] overflow-x-auto shrink-0">
              {QUICK_PROMPTS.map((p) => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="text-[9px] px-2 py-0.5 border border-[var(--border)] text-[var(--muted)] rounded whitespace-nowrap hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shrink-0">
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
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
  );
}
