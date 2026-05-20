"use client";
import { useEffect, useState, useRef } from "react";

export default function NexusPage() {
  const [time, setTime] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMetricsVisible(true); },
      { threshold: 0.3 }
    );
    if (metricsRef.current) observer.observe(metricsRef.current);
    return () => observer.disconnect();
  }, []);

  const countUp = (target: number, duration = 2000) => {
    if (!metricsVisible) return 0;
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!metricsVisible) return;
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(timer);
    }, [metricsVisible]);
    return count;
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <div className="scanline" />

      {/* NAVBAR */}
      <nav className="navbar-glass fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg className="hex-glow w-8 h-8" viewBox="0 0 100 100">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]" />
              <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--magenta)]" />
            </svg>
            <span className="font-orbitron text-xl font-bold glow-text">NEXUS AI</span>
          </div>

          {/* Center Nav - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {["DASHBOARD", "ANALYZER", "MODELS", "REPORTS", "SETTINGS"].map((link) => (
              <a key={link} href="#" className="nav-link">{link}</a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono hidden md:inline">{time}</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" />
              <span className="text-[10px] font-orbitron tracking-wider text-[var(--accent2)] hidden sm:inline">SYSTEM ONLINE</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] cursor-pointer" />
            
            {/* Mobile Hamburger */}
            <button className="lg:hidden text-2xl text-[var(--accent)]" onClick={() => setMobileNavOpen(!mobileNavOpen)}>☰</button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`mobile-nav lg:hidden bg-[var(--panel)] mt-4 rounded ${mobileNavOpen ? "open" : ""}`}>
          <div className="flex flex-col gap-4 p-4">
            {["DASHBOARD", "ANALYZER", "MODELS", "REPORTS", "SETTINGS"].map((link) => (
              <a key={link} href="#" className="text-[var(--accent)] font-orbitron text-sm tracking-widest">{link}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="particle-grid" />
        <div className="scanline-hero" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="text-[var(--accent)] text-xs tracking-[0.3em] mb-6 font-orbitron">NEXT-GEN INTELLIGENCE PLATFORM</div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black mb-6 leading-tight">
            ANALYZE. PREDICT. <span className="gradient-text glitch">EVOLVE.</span>
          </h1>
          <p className="text-[var(--muted)] text-sm md:text-base mb-8 max-w-2xl mx-auto">
            Harness the power of 2.4 billion parameters. Real-time neural processing at 0.3ms latency. The future of AI is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">LAUNCH TERMINAL</button>
            <button className="btn-ghost">VIEW DOCUMENTATION</button>
          </div>
          <div className="mt-16 bounce">
            <div className="text-[var(--accent)] text-2xl">↓</div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="glass py-8 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "2.4B", label: "Parameters", color: "cyan" },
            { num: "99.7%", label: "Accuracy", color: "magenta" },
            { num: "0.3ms", label: "Latency", color: "cyan" },
            { num: "150+", label: "Models", color: "magenta" }
          ].map((stat, i) => (
            <div key={i} className="text-center fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`text-3xl md:text-5xl font-orbitron font-black mb-2 ${stat.color === "cyan" ? "gradient-text-green" : "gradient-text"}`}>
                {stat.num}
              </div>
              <div className="text-xs text-[var(--muted)] tracking-widest mb-3">{stat.label}</div>
              <div className="h-1 bg-[var(--panel)] rounded overflow-hidden">
                <div className={`progress-fill h-full ${stat.color === "cyan" ? "bg-[var(--accent)]" : "bg-[var(--magenta)]"}`} style={{ width: "85%" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN DASHBOARD GRID */}
      <section className="max-w-[1400px] mx-auto px-4 py-16 grid lg:grid-cols-3 gap-6">
        {/* Live Analysis Feed */}
        <div className="lg:col-span-2 glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="live-badge px-2 py-1 bg-[var(--red)] text-white text-[9px] font-bold rounded">LIVE</div>
            <h3 className="font-orbitron text-sm tracking-widest">LIVE ANALYSIS FEED</h3>
          </div>
          <div className="space-y-4">
            {[
              { icon: "◆", label: "Neural Network Training", progress: 87, color: "var(--accent)" },
              { icon: "◈", label: "Data Pipeline Processing", progress: 64, color: "var(--magenta)" },
              { icon: "◇", label: "Model Inference Queue", progress: 92, color: "var(--accent2)" },
              { icon: "◉", label: "GPU Cluster Utilization", progress: 78, color: "#ff8800" },
              { icon: "◊", label: "Real-time Predictions", progress: 95, color: "var(--accent)" }
            ].map((item, i) => (
              <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" style={{ color: item.color }}>{item.icon}</span>
                    <span className="text-xs text-[var(--muted)]">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--panel)] rounded overflow-hidden">
                  <div className="progress-fill h-full" style={{ width: `${item.progress}%`, background: item.color, animationDelay: `${i * 0.2}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Model Performance */}
          <div className="glass p-6">
            <h3 className="font-orbitron text-sm tracking-widest mb-6">MODEL PERFORMANCE</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "GPT-X", pct: 94 },
                { label: "Vision", pct: 88 },
                { label: "Audio", pct: 91 },
                { label: "Code", pct: 96 },
                { label: "Predict", pct: 89 }
              ].map((model, i) => (
                <div key={i} className="flex flex-col items-center fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <svg className="w-16 h-16 mb-2" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" strokeWidth="8"
                      strokeDasharray="283" strokeDashoffset={283 - (283 * model.pct) / 100}
                      strokeLinecap="round" transform="rotate(-90 50 50)"
                      className="ring-animate"
                      style={{ "--dash-offset": `${283 - (283 * model.pct) / 100}` } as any}
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent)" />
                        <stop offset="100%" stopColor="var(--magenta)" />
                      </linearGradient>
                    </defs>
                    <text x="50" y="55" textAnchor="middle" className="text-xs font-bold fill-[var(--accent)]">{model.pct}%</text>
                  </svg>
                  <span className="text-[9px] text-[var(--muted)] tracking-wider">{model.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Strength */}
          <div className="glass p-6">
            <h3 className="font-orbitron text-sm tracking-widest mb-6">SIGNAL STRENGTH</h3>
            <div className="flex items-end justify-around h-24 gap-2">
              {[60, 85, 70, 95, 75, 88].map((h, i) => (
                <div
                  key={i}
                  className="signal-bar flex-1 bg-gradient-to-t from-[var(--accent)] to-[var(--magenta)]"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI INPUT ANALYZER */}
      <section className="max-w-[900px] mx-auto px-4 py-16">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-2">
          <span className="gradient-text">AI INPUT ANALYZER</span>
        </h2>
        <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mb-8" />

        <textarea
          className="w-full h-40 glass p-4 text-sm font-mono resize-none focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all mb-4"
          placeholder="Feed data to NEXUS AI..."
        />

        <div className="flex gap-2 mb-4 justify-center flex-wrap">
          {["TEXT", "VISION", "NEURAL"].map((mode, i) => (
            <button
              key={mode}
              className={`px-6 py-2 rounded-full text-xs font-orbitron tracking-widest transition-all ${
                i === 0
                  ? "bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)] text-white"
                  : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button className="btn-scan mb-6">ANALYZE</button>

        <div className="result-panel">
          <div className="text-[var(--accent2)]">{"{"}</div>
          <div className="ml-4">
            <span className="text-[var(--magenta)]">"status"</span>: <span className="text-[var(--accent2)]">"success"</span>,
          </div>
          <div className="ml-4">
            <span className="text-[var(--magenta)]">"confidence"</span>: <span className="text-[var(--accent)]">0.987</span>,
          </div>
          <div className="ml-4">
            <span className="text-[var(--magenta)]">"model"</span>: <span className="text-[var(--accent2)]">"nexus-v4.2"</span>,
          </div>
          <div className="ml-4">
            <span className="text-[var(--magenta)]">"latency"</span>: <span className="text-[var(--accent)]">0.3</span>
          </div>
          <div className="text-[var(--accent2)]">{"}"}</div>
        </div>
      </section>

      {/* 3-COLUMN FEATURES */}
      <section className="max-w-[1400px] mx-auto px-4 py-16">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-12">
          <span className="gradient-text">CORE CAPABILITIES</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Sub-millisecond inference with optimized neural pathways" },
            { icon: "🧠", title: "Deep Learning", desc: "Multi-layer transformer architecture with 2.4B parameters" },
            { icon: "🔒", title: "Secure by Design", desc: "End-to-end encryption with zero-knowledge architecture" },
            { icon: "📊", title: "Real-time Analytics", desc: "Live data streaming and instant predictive insights" },
            { icon: "🎯", title: "99.7% Accuracy", desc: "Industry-leading precision across all model types" },
            { icon: "🚀", title: "Scalable Infrastructure", desc: "Auto-scaling GPU clusters for unlimited throughput" }
          ].map((feat, i) => (
            <div key={i} className={`feature-card p-6 fade-in delay-${i + 1}`}>
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="font-orbitron text-lg font-bold mb-2 text-[var(--accent)]">{feat.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HORIZONTAL MODEL CARDS */}
      <section className="max-w-[1400px] mx-auto px-4 py-16">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-12">
          <span className="gradient-text">AVAILABLE MODELS</span>
        </h2>
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {[
              { name: "GPT-NEXUS", cat: "NLP", acc: 96, desc: "Advanced language understanding and generation" },
              { name: "VISION-X", cat: "VISION", acc: 94, desc: "Real-time image recognition and analysis" },
              { name: "AUDIO-CORE", cat: "AUDIO", acc: 91, desc: "Speech-to-text with emotion detection" },
              { name: "CODE-GEN", cat: "CODE", acc: 98, desc: "Intelligent code completion and debugging" },
              { name: "PREDICT-AI", cat: "FORECAST", acc: 89, desc: "Time-series prediction and anomaly detection" },
              { name: "NEURAL-SEARCH", cat: "SEARCH", acc: 93, desc: "Semantic search across massive datasets" },
              { name: "SENTIMENT-PRO", cat: "NLP", acc: 95, desc: "Multi-language sentiment analysis" },
              { name: "QUANTUM-NET", cat: "RESEARCH", acc: 87, desc: "Experimental quantum-inspired algorithms" }
            ].map((model, i) => (
              <div key={i} className="glass p-6 flex flex-col" style={{ width: window.innerWidth < 768 ? "240px" : "280px", minWidth: window.innerWidth < 768 ? "240px" : "280px" }}>
                <h3 className="font-orbitron text-lg font-bold mb-2 text-[var(--accent)]">{model.name}</h3>
                <div className="inline-block px-2 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded text-[9px] text-[var(--accent)] tracking-widest mb-4 w-fit">
                  {model.cat}
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--muted)]">Accuracy</span>
                    <span className="text-[var(--accent)] font-bold">{model.acc}%</span>
                  </div>
                  <div className="h-1 bg-[var(--panel)] rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)]" style={{ width: `${model.acc}%` }} />
                  </div>
                </div>
                <p className="text-xs text-[var(--muted)] mb-4 flex-1">{model.desc}</p>
                <button className="btn-primary text-[9px] py-2">LOAD MODEL</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-[900px] mx-auto px-4 py-16">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-12">
          <span className="gradient-text">ACTIVITY FEED</span>
        </h2>
        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent)] via-[var(--magenta)] to-[var(--accent)]" />
          <div className="space-y-8 pl-8 md:pl-20">
            {[
              { time: "2m ago", title: "Model Training Completed", desc: "GPT-NEXUS v4.2 training finished with 99.7% validation accuracy" },
              { time: "15m ago", title: "New Dataset Ingested", desc: "2.4TB of training data processed and indexed" },
              { time: "1h ago", title: "System Upgrade", desc: "GPU cluster expanded to 512 nodes for increased throughput" },
              { time: "3h ago", title: "API Request Spike", desc: "Handled 1.2M requests/sec with 0.3ms average latency" },
              { time: "6h ago", title: "Security Audit Passed", desc: "Zero vulnerabilities detected in latest penetration test" },
              { time: "12h ago", title: "Model Deployed", desc: "VISION-X v3.1 deployed to production environment" }
            ].map((event, i) => (
              <div key={i} className={`relative fade-in delay-${i + 1}`}>
                <div className="timeline-dot absolute -left-[30px] md:-left-[46px] w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[var(--bg)]" />
                <div className={`glass p-4 ${i % 2 === 0 ? "bg-[var(--panel)]/50" : ""}`}>
                  <div className="text-[10px] text-[var(--accent)] font-mono mb-1">{event.time}</div>
                  <h4 className="font-orbitron text-sm font-bold mb-1">{event.title}</h4>
                  <p className="text-xs text-[var(--muted)]">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM METRICS */}
      <section ref={metricsRef} className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: 1247893, unit: "REQUESTS/SEC", icon: "⚡" },
            { num: 512, unit: "GPU NODES", icon: "🖥️" },
            { num: 99, unit: "UPTIME %", icon: "✓" },
            { num: 2400, unit: "TB PROCESSED", icon: "📊" }
          ].map((metric, i) => {
            const MetricCounter = () => {
              const count = countUp(metric.num);
              return <>{metric.num > 100 ? count.toLocaleString() : count}</>;
            };
            return (
              <div key={i} className="glass p-6 text-center">
                <div className="text-4xl mb-2">{metric.icon}</div>
                <div className="text-4xl font-orbitron font-black gradient-text mb-1">
                  <MetricCounter />
                </div>
                <div className="text-[10px] text-[var(--muted)] tracking-widest mb-4">{metric.unit}</div>
                <svg className="w-full h-8" viewBox="0 0 100 30">
                  <polyline
                    points="0,25 20,15 40,20 60,8 80,12 100,5"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] bg-[var(--panel)] py-8 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[var(--accent)]" viewBox="0 0 100 100">
                <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="font-orbitron font-bold">NEXUS AI</span>
            </div>
            <div className="flex gap-6 text-xs text-[var(--muted)]">
              {["Dashboard", "Analyzer", "Models", "Reports", "Settings"].map((link) => (
                <a key={link} href="#" className="hover:text-[var(--accent)] transition-colors">{link}</a>
              ))}
            </div>
            <div className="flex gap-4 text-xl">
              {["◐", "◑", "◒", "◓"].map((icon, i) => (
                <a key={i} href="#" className="text-[var(--accent)] hover:text-[var(--magenta)] transition-colors">{icon}</a>
              ))}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--muted)]">
            <div>© 2024 NEXUS AI. All rights reserved.</div>
            <div className="font-mono text-[var(--accent)]">POWERED BY NEXUS AI ENGINE v4.2</div>
            <div className="flex gap-4">
              {["Privacy", "Terms", "Legal"].map((link) => (
                <a key={link} href="#" className="hover:text-[var(--accent)] transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
