"use client";

import { useState } from "react";
import TradingViewWidget from "../components/TradingViewWidget";
import TradingViewMiniChart from "../components/TradingViewMiniChart";
import "../nexus.css";

export default function TradingPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("NASDAQ:AAPL");
  const [watchlist] = useState([
    { symbol: "NASDAQ:AAPL", name: "Apple Inc." },
    { symbol: "NASDAQ:TSLA", name: "Tesla Inc." },
    { symbol: "NASDAQ:NVDA", name: "NVIDIA Corp." },
    { symbol: "NASDAQ:MSFT", name: "Microsoft Corp." },
    { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc." },
    { symbol: "NASDAQ:AMZN", name: "Amazon.com Inc." },
    { symbol: "NASDAQ:META", name: "Meta Platforms Inc." },
    { symbol: "NYSE:SPY", name: "S&P 500 ETF" },
  ]);

  return (
    <div className="nexus-container">
      <nav className="nexus-nav">
        <div className="nav-content">
          <div className="nav-left">
            <svg className="logo-hex" viewBox="0 0 100 100">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
            </svg>
            <span className="logo-text">NEXUS AI</span>
          </div>
          <div className="nav-center">
            <a href="/dashboard">Dashboard</a>
            <a href="/analyzer">Analyzer</a>
            <a href="/models">Models</a>
            <a href="/reports">Reports</a>
            <a href="/settings">Settings</a>
          </div>
          <div className="nav-right">
            <button onClick={() => (window.location.href = "/")}>← Home</button>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: "100px", padding: "100px 2rem 2rem" }}>
        <h1 className="section-title">Live Trading Charts</h1>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "2rem", marginTop: "3rem" }}>
          <div className="glass-card" style={{ height: "fit-content" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Watchlist</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {watchlist.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedSymbol(stock.symbol)}
                  style={{
                    padding: "0.75rem",
                    background: selectedSymbol === stock.symbol ? "rgba(0, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    border: selectedSymbol === stock.symbol ? "1px solid #00ffff" : "1px solid rgba(0, 255, 255, 0.2)",
                    color: "#fff",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{stock.symbol.split(":")[1]}</div>
                  <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "0.25rem" }}>{stock.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3>{selectedSymbol}</h3>
            </div>
            <TradingViewWidget symbol={selectedSymbol} height={600} />
          </div>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <h2 className="section-title" style={{ fontSize: "2rem" }}>Market Overview</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
            {watchlist.slice(0, 4).map((stock) => (
              <div key={stock.symbol} className="glass-card" style={{ cursor: "pointer" }} onClick={() => setSelectedSymbol(stock.symbol)}>
                <h4 style={{ marginBottom: "1rem", color: "#00ffff" }}>{stock.name}</h4>
                <TradingViewMiniChart symbol={stock.symbol} height={250} />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ marginTop: "3rem" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Market Statistics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "0.5rem" }}>Total Volume</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00ffff" }}>2.4B</div>
            </div>
            <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "0.5rem" }}>Market Cap</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00ffff" }}>$45.2T</div>
            </div>
            <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "0.5rem" }}>Active Traders</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00ffff" }}>1.2M</div>
            </div>
            <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "0.5rem" }}>Avg Volatility</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00ffff" }}>12.5%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
