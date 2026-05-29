"use client";

import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import WelcomeAssistant from "./components/WelcomeAssistant";
import OnboardingSystem from "./components/OnboardingSystem";
import AILearningAssistant from "./components/AILearningAssistant";
import MarketOverview from "./components/MarketOverview";
import AIAssistantPanel from "./components/AIAssistantPanel";
import LearningHub from "./components/LearningHub";
import LiveAnalysis from "./components/LiveAnalysis";
import PortfolioPreview from "./components/PortfolioPreview";
import ActivityFeed from "./components/ActivityFeed";

export default function Dashboard() {
  const [time, setTime] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [userLevel, setUserLevel] = useState<"beginner" | "intermediate" | "trader">("beginner");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("onboardingComplete");
    const savedLevel = localStorage.getItem("userLevel") as any;
    if (savedLevel) setUserLevel(savedLevel);
    
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowWelcome(true), 1000);
    } else {
      setOnboardingComplete(true);
    }
  }, []);

  const handleStartTour = () => {
    setShowWelcome(false);
    setShowTour(true);
  };

  const handleSkipOnboarding = () => {
    setShowWelcome(false);
    setOnboardingComplete(true);
    localStorage.setItem("onboardingComplete", "true");
  };

  const handleTourComplete = () => {
    setShowTour(false);
    setOnboardingComplete(true);
    localStorage.setItem("onboardingComplete", "true");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#020810] via-[#0a0f1e] to-[#020810] text-[var(--text)] overflow-hidden">
      {showWelcome && <WelcomeAssistant onStartTour={handleStartTour} onSkip={handleSkipOnboarding} />}
      {showTour && <OnboardingSystem onComplete={handleTourComplete} />}
      {onboardingComplete && <AILearningAssistant />}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[var(--panel)]/95 backdrop-blur-xl border-r border-[var(--border)] transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        data-tour="sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-[var(--border)]">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <div className="font-orbitron font-bold text-sm">NEXUS AI</div>
              <div className="text-[9px] text-[var(--muted)]">Stock Intelligence</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { icon: "🏠", label: "Home", active: true },
              { icon: "🤖", label: "AI Assistant" },
              { icon: "📊", label: "Market Analyzer" },
              { icon: "📚", label: "Learn" },
              { icon: "💼", label: "Portfolio" },
              { icon: "📈", label: "Reports" },
              { icon: "⚙️", label: "Settings" }
            ].map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                    : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* User Level Badge */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="glass p-3 rounded-lg">
              <div className="text-[10px] text-[var(--muted)] mb-1">Experience Level</div>
              <div className="text-xs font-bold text-[var(--accent)] uppercase">{userLevel}</div>
              <div className="mt-2 h-1 bg-[var(--panel)] rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)]" style={{ width: "45%" }} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 bg-[var(--panel)]/80 backdrop-blur-xl border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[var(--accent)] text-xl"
            >
              ☰
            </button>
            <div>
              <h1 className="text-sm font-bold">AI-Powered Stock Market Intelligence</h1>
              <p className="text-[10px] text-[var(--muted)]">Analyze markets, learn trading, get AI insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[var(--muted)]">{time}</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent2)]/10 border border-[var(--accent2)]/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" />
              <span className="text-[10px] text-[var(--accent2)] font-medium">LIVE</span>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
            
            {/* HERO SECTION */}
            <section className="glass p-6 lg:p-8 rounded-xl" data-tour="hero">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    Welcome to <span className="gradient-text">AI Stock Analysis</span>
                  </h2>
                  <p className="text-sm text-[var(--muted)] mb-4">
                    Get real-time market insights, learn trading concepts, and make informed decisions with AI assistance.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-6 py-2.5 bg-[var(--accent)] text-black font-bold text-sm rounded-lg hover:shadow-[0_0_20px_var(--accent)] transition-all">
                      Start Analysis
                    </button>
                    <button className="px-6 py-2.5 border border-[var(--border)] text-[var(--text)] text-sm rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
                      Ask AI Assistant
                    </button>
                  </div>
                </div>
                <div className="glass p-4 rounded-lg">
                  <div className="text-[10px] text-[var(--muted)] mb-2">MARKET STATUS</div>
                  <div className="space-y-2">
                    {[
                      { symbol: "NIFTY 50", price: "21,456.30", change: "+1.24%" },
                      { symbol: "SENSEX", price: "71,234.50", change: "+0.89%" },
                      { symbol: "BTC", price: "$43,210", change: "+2.15%" }
                    ].map((item) => (
                      <div key={item.symbol} className="flex items-center justify-between gap-4">
                        <span className="text-xs font-medium">{item.symbol}</span>
                        <span className="text-xs text-[var(--text)]">{item.price}</span>
                        <span className="text-xs text-[var(--accent2)]">{item.change}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* MARKET OVERVIEW */}
            <MarketOverview />

            {/* TWO COLUMN LAYOUT */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* LEFT: AI ASSISTANT + LEARNING */}
              <div className="lg:col-span-2 space-y-6">
                <AIAssistantPanel />
                <LearningHub userLevel={userLevel} />
              </div>

              {/* RIGHT: ACTIVITY + PORTFOLIO */}
              <div className="space-y-6">
                <ActivityFeed />
                <PortfolioPreview />
              </div>
            </div>

            {/* LIVE ANALYSIS */}
            <LiveAnalysis />

            {/* TRUST SECTION */}
            <section className="glass p-6 rounded-xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <span>🔒</span>
                Trust & Transparency
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: "📡", title: "Real-Time Data", desc: "Live market feeds from trusted sources" },
                  { icon: "🤖", title: "AI-Assisted", desc: "Predictions are educational, not financial advice" },
                  { icon: "🎓", title: "Educational", desc: "Platform designed for learning and analysis" },
                  { icon: "⚠️", title: "Risk Warning", desc: "Trading involves risk. Learn before investing" }
                ].map((item) => (
                  <div key={item.title} className="text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-xs font-bold mb-1">{item.title}</div>
                    <div className="text-[10px] text-[var(--muted)]">{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
