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

const QUICK_PROMPTS = ["Analyze NVDA", "Market trends?", "Explain RSI", "Best stocks?"];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [time, setTime] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selected, setSelected] = useState("AAPL");
  const [view, setView] = useState<View>("CHART");
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

    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="glass-card m-3 mb-0 p-4 flex items-center justify-between shrink-0 fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
            N
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">NEWLY</h1>
            <p className="text-xs text-slate-400">Trading Terminal</p>
          </div>
        </div>
        {selectedStock && view !== "WATCHLIST" && (
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold">{selectedStock.symbol}</div>
              <div className="text-xs text-slate-400">Live Price</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">${selectedStock.price.toFixed(2)}</div>
              <div className={`text-sm font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? "↑" : "↓"} {Math.abs(selectedStock.changePct).toFixed(2)}%
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="status-dot online" />
          <span className="text-sm font-mono text-slate-400">{time}</span>
        </div>
      </header>

      {/* Ticker */}
      <div className={view === "WATCHLIST" ? "block" : "hidden lg:block"}>
        <StockTicker />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-3 pt-2">
        
        {/* Mobile Views */}
        <div className="lg:hidden h-full">
          {/* WATCHLIST */}
          {view === "WATCHLIST" && (
            <div className="h-full overflow-y-auto space-y-2 slide-up">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Watchlist</h2>
                <span className="badge badge-success">{stocks.length} stocks</span>
              </div>
              {stocks.map((s, i) => (
                <div
                  key={s.symbol}
                  onClick={() => { setSelected(s.symbol); setView("CHART"); }}
                  className={`stock-card ${selected === s.symbol ? "active" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold">{s.symbol}</span>
                    <span className={`badge ${s.change >= 0 ? "badge-success" : "badge-danger"}`}>
                      {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.changePct).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${s.price.toFixed(2)}</span>
                    <span className={`text-sm ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {s.change >= 0 ? "+" : ""}${s.change.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CHART */}
          {view === "CHART" && (
            <div className="h-full flex flex-col slide-up">
              <div className="glass-card p-3 mb-2 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">{selected}</div>
                  {selectedStock && (
                    <div className="text-sm text-slate-400">
                      ${selectedStock.price.toFixed(2)} 
                      <span className={`ml-2 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                        {isPositive ? "↑" : "↓"} {Math.abs(selectedStock.changePct).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <span className="badge badge-warning">Live</span>
              </div>
              <div className="flex-1 chart-container">
                <CandlestickChart key={selected} symbol={selected} isPositive={isPositive} />
              </div>
            </div>
          )}

          {/* ANALYSIS */}
          {view === "ANALYSIS" && (
            <div className="h-full overflow-y-auto slide-up">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Strategy Analysis</h2>
                <span className="text-sm text-slate-400">{selected}</span>
              </div>
              <AnalysisPanel symbol={selected} />
            </div>
          )}

          {/* CHAT */}
          {view === "CHAT" && (
            <div className="h-full flex flex-col slide-up">
              <div className="glass-card p-3 mb-2">
                <h2 className="text-base font-bold">AI Trading Assistant</h2>
                <p className="text-xs text-slate-400">Powered by Groq AI</p>
              </div>

              <div className="flex-1 overflow-y-auto glass-card p-3 mb-2">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl float">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">AI Assistant Ready</h3>
                      <p className="text-sm text-slate-400">Ask me anything about stocks and trading</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {QUICK_PROMPTS.map((p) => (
                        <button key={p} onClick={() => sendMessage(p)} className="btn-secondary text-xs py-2">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => <ChatBubble key={i} role={msg.role} content={msg.content} />)}
                {loading && (
                  <div className="flex items-center gap-2 p-3 glass-card mb-2">
                    <div className="spinner" />
                    <span className="text-sm text-slate-400">Analyzing...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="glass-card p-3 flex gap-2">
                <input
                  className="flex-1"
                  placeholder="Ask about any stock..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={() => sendMessage()} disabled={loading} className="btn-primary">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-3 h-full">
          {/* Left: Watchlist */}
          <div className="col-span-3 glass-card p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Watchlist</h2>
              <span className="badge badge-success">{stocks.length}</span>
            </div>
            <div className="space-y-2">
              {stocks.map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => setSelected(s.symbol)}
                  className={`stock-card ${selected === s.symbol ? "active" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{s.symbol}</span>
                    <span className={`text-xs font-semibold ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.changePct).toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-lg font-bold">${s.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Chart */}
          <div className="col-span-6 flex flex-col gap-3">
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selected}</h2>
                {selectedStock && (
                  <p className="text-sm text-slate-400">
                    ${selectedStock.price.toFixed(2)} 
                    <span className={`ml-2 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                      {isPositive ? "↑" : "↓"} {Math.abs(selectedStock.changePct).toFixed(2)}%
                    </span>
                  </p>
                )}
              </div>
              <span className="badge badge-warning">Live Data</span>
            </div>
            <div className="flex-1 chart-container">
              <CandlestickChart key={selected} symbol={selected} isPositive={isPositive} />
            </div>
          </div>

          {/* Right: Analysis + Chat */}
          <div className="col-span-3 flex flex-col gap-3 overflow-hidden">
            <div className="glass-card p-4 overflow-y-auto max-h-[45%]">
              <h3 className="text-sm font-bold mb-3">Strategy Analysis</h3>
              <AnalysisPanel symbol={selected} />
            </div>

            <div className="flex-1 flex flex-col glass-card overflow-hidden">
              <div className="p-3 border-b border-slate-700/50">
                <h3 className="text-sm font-bold">AI Assistant</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl">
                      🤖
                    </div>
                    <p className="text-xs text-slate-400">Ask me anything</p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {QUICK_PROMPTS.map((p) => (
                        <button key={p} onClick={() => sendMessage(p)} className="btn-secondary text-xs py-1 px-2">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => <ChatBubble key={i} role={msg.role} content={msg.content} />)}
                {loading && (
                  <div className="flex items-center gap-2 p-2 glass-card mb-2">
                    <div className="spinner" />
                    <span className="text-xs text-slate-400">Analyzing...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div className="p-3 border-t border-slate-700/50 flex gap-2">
                <input
                  className="flex-1 text-sm"
                  placeholder="Ask..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={() => sendMessage()} disabled={loading} className="btn-primary text-sm px-3">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden glass-card m-3 mt-0 p-2 flex items-center justify-around safe-area-bottom">
        {[
          { view: "WATCHLIST" as View, icon: "📊", label: "List" },
          { view: "CHART" as View, icon: "📈", label: "Chart" },
          { view: "ANALYSIS" as View, icon: "🎯", label: "Signal" },
          { view: "CHAT" as View, icon: "🤖", label: "AI" },
        ].map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              view === item.view
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                : "text-slate-400"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
