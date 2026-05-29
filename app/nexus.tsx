"use client";

import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import WelcomeAssistant from "./components/WelcomeAssistant";
import OnboardingSystem from "./components/OnboardingSystem";
import AILearningAssistant from "./components/AILearningAssistant";
import SmartTooltip, { INDICATOR_TOOLTIPS } from "./components/SmartTooltip";

type Message = { role: "user" | "assistant"; content: string };
type AnalysisResult = {
  status: string;
  confidence: number;
  predictions: { class: string; score: number }[];
  latency: string;
};

export default function Nexus() {
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState({ params: 0, accuracy: 0, latency: 0, models: 0 });
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"Text" | "Vision" | "Neural">("Text");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveMetrics, setLiveMetrics] = useState({
    neural: 85,
    vision: 92,
    pattern: 78,
    inference: 95,
    predictive: 88,
  });
  const metricsRef = useRef<HTMLDivElement>(null);
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Handle body scroll lock when menu is open
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    let sid = localStorage.getItem("nexusSessionId");
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem("nexusSessionId", sid);
    }
    setSessionId(sid);
    
    const hasSeenOnboarding = localStorage.getItem("onboardingComplete");
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowWelcome(true), 1500);
    } else {
      setOnboardingComplete(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateMetrics();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (metricsRef.current) observer.observe(metricsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics({
        neural: 80 + Math.random() * 15,
        vision: 88 + Math.random() * 10,
        pattern: 75 + Math.random() * 10,
        inference: 92 + Math.random() * 8,
        predictive: 85 + Math.random() * 10,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const animateMetrics = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setMetrics({
        params: Math.floor(2.4 * progress * 10) / 10,
        accuracy: Math.floor(99.7 * progress * 10) / 10,
        latency: Math.floor(0.3 * progress * 10) / 10,
        models: Math.floor(150 * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
  };

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

  const analyzeInput = async () => {
    if (!input.trim() || analyzing) return;
    setAnalyzing(true);

    try {
      const res = await fetch("/api/nexus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: input, mode }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          status: "success",
          confidence: 0.95 + Math.random() * 0.04,
          predictions: [
            { class: "positive", score: 0.9 + Math.random() * 0.09 },
            { class: "neutral", score: 0.05 + Math.random() * 0.05 },
          ],
          latency: `${(Math.random() * 0.5).toFixed(2)}ms`,
        });
        setMessages((prev) => [
          ...prev,
          { role: "user", content: input },
          { role: "assistant", content: data.response },
        ]);
      }
    } catch (error) {
      setResult({
        status: "error",
        confidence: 0,
        predictions: [],
        latency: "N/A",
      });
    }

    setAnalyzing(false);
  };

  return (
    <div className="nexus-container">
      {showWelcome && <WelcomeAssistant onStartTour={handleStartTour} onSkip={handleSkipOnboarding} />}
      {showTour && <OnboardingSystem onComplete={handleTourComplete} />}
      {onboardingComplete && <AILearningAssistant />}
      {/* NAVBAR */}
      <nav className="nexus-nav" data-tour="navbar">
        <div className="nav-content">
          <div className="nav-left">
            <svg className="logo-hex" viewBox="0 0 100 100">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
            </svg>
            <span className="logo-text">NEXUS AI</span>
          </div>
          <div className={`nav-center ${menuOpen ? "open" : ""}`}>
            <a href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
            <a href="/analyzer" onClick={() => setMenuOpen(false)}>Analyzer</a>
            <a href="/trading" onClick={() => setMenuOpen(false)}>Trading</a>
            <a href="/models" onClick={() => setMenuOpen(false)}>Models</a>
            <a href="/reports" onClick={() => setMenuOpen(false)}>Reports</a>
            <a href="/settings" onClick={() => setMenuOpen(false)}>Settings</a>
          </div>
          <div className="nav-right">
            <span className="clock">{time}</span>
            <div className="status">
              <div className="pulse-dot" />
              <span>SYSTEM ONLINE</span>
            </div>
            <div className="avatar" />
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="particle-grid" />
        <div className="scanline" />
        <div className="hero-content">
          <div className="tag">NEXT-GEN INTELLIGENCE PLATFORM</div>
          <h1 className="glitch-text">
            ANALYZE. PREDICT. <span className="gradient-text">EVOLVE.</span>
          </h1>
          <p className="hero-sub">Harness the power of advanced neural networks to transform data into actionable intelligence</p>
          <div className="cta-buttons">
            <button className="btn-primary">START ANALYZING</button>
            <button className="btn-ghost">VIEW DEMO</button>
          </div>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="stat-card">
          <div className="stat-number gradient-text">{metrics.params}B</div>
          <div className="stat-label">Parameters</div>
          <div className="stat-progress" style={{ width: `${(metrics.params / 2.4) * 100}%` }} />
        </div>
        <div className="stat-card">
          <div className="stat-number gradient-text">{metrics.accuracy}%</div>
          <div className="stat-label">Accuracy</div>
          <div className="stat-progress" style={{ width: `${(metrics.accuracy / 99.7) * 100}%` }} />
        </div>
        <div className="stat-card">
          <div className="stat-number gradient-text">{metrics.latency}ms</div>
          <div className="stat-label">Latency</div>
          <div className="stat-progress" style={{ width: `${(metrics.latency / 0.3) * 100}%` }} />
        </div>
        <div className="stat-card">
          <div className="stat-number gradient-text">{metrics.models}+</div>
          <div className="stat-label">Models</div>
          <div className="stat-progress" style={{ width: `${(metrics.models / 150) * 100}%` }} />
        </div>
      </section>

      {/* DASHBOARD GRID */}
      <section className="dashboard-grid" ref={metricsRef} data-tour="dashboard">
        <div className="feed-panel glass-card">
          <div className="panel-header">
            <span className="live-badge">LIVE</span>
            <h3>Live Analysis Feed</h3>
          </div>
          <div className="feed-items">
            {[
              { icon: "🧠", label: "Neural Processing", color: "cyan", width: liveMetrics.neural },
              { icon: "👁", label: "Vision Analysis", color: "purple", width: liveMetrics.vision },
              { icon: "🎯", label: "Pattern Recognition", color: "magenta", width: liveMetrics.pattern },
              { icon: "⚡", label: "Real-time Inference", color: "green", width: liveMetrics.inference },
              { icon: "🔮", label: "Predictive Modeling", color: "orange", width: liveMetrics.predictive },
            ].map((item, i) => (
              <div key={i} className="feed-item" style={{ animationDelay: `${i * 0.2}s` }}>
                <span className="feed-icon">{item.icon}</span>
                <span className="feed-label">{item.label}</span>
                <div className="feed-bar-bg">
                  <div className={`feed-bar ${item.color}`} style={{ width: `${item.width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-panels">
          <div className="glass-card performance-card">
            <h3>Model Performance</h3>
            <div className="rings-grid">
              {[
                { label: "GPT-X", value: 94 },
                { label: "Vision", value: 88 },
                { label: "Audio", value: 91 },
                { label: "Code", value: 96 },
                { label: "Predict", value: 89 },
              ].map((ring, i) => (
                <div key={i} className="ring-item">
                  <svg className="progress-ring" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      strokeDasharray={`${ring.value * 2.51} 251`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  </svg>
                  <div className="ring-label">{ring.label}</div>
                  <div className="ring-value">{ring.value}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card signal-card">
            <h3>Signal Strength</h3>
            <div className="signal-bars">
              {[65, 85, 45, 95, 70, 55].map((height, i) => (
                <div
                  key={i}
                  className="signal-bar"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI CHAT ANALYZER */}
      <section className="analyzer-section" data-tour="chat">
        <h2 className="section-title">
          AI Chat Interface
          <div className="title-glow" />
        </h2>
        <div className="analyzer-container">
          <div className="chat-messages-mini">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                <span className="bubble-icon">{msg.role === "user" ? "👤" : "🤖"}</span>
                <span className="bubble-text">{msg.content}</span>
              </div>
            ))}
            {analyzing && (
              <div className="chat-bubble assistant">
                <span className="bubble-icon">🤖</span>
                <span className="bubble-text typing-dots">
                  <span></span><span></span><span></span>
                </span>
              </div>
            )}
          </div>
          <div className="mode-toggles">
            <button className={`mode-btn ${mode === "Text" ? "active" : ""}`} onClick={() => setMode("Text")}>
              Text
            </button>
            <button className={`mode-btn ${mode === "Vision" ? "active" : ""}`} onClick={() => setMode("Vision")}>
              Vision
            </button>
            <button className={`mode-btn ${mode === "Neural" ? "active" : ""}`} onClick={() => setMode("Neural")}>
              Neural
            </button>
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input-field"
              placeholder="Ask NEXUS AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && analyzeInput()}
            />
            <button className="send-btn" onClick={analyzeInput} disabled={analyzing}>
              {analyzing ? "⏳" : "➤"}
            </button>
          </div>
          <button className="full-chat-btn" onClick={() => window.location.href = "/chat"}>
            Open Full Chat →
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2 className="section-title">Core Capabilities</h2>
        <div className="features-grid">
          {[
            { icon: "🚀", title: "Ultra-Fast Processing", desc: "Process millions of data points in milliseconds" },
            { icon: "🎯", title: "Precision Analytics", desc: "99.7% accuracy across all model types" },
            { icon: "🔒", title: "Enterprise Security", desc: "Military-grade encryption and compliance" },
            { icon: "🌐", title: "Global Scale", desc: "Deploy across 150+ regions worldwide" },
            { icon: "🤖", title: "AutoML Pipeline", desc: "Automated model training and optimization" },
            { icon: "📊", title: "Real-time Insights", desc: "Live dashboards and instant notifications" },
          ].map((feature, i) => (
            <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODEL CARDS */}
      <section className="models-section" data-tour="models">
        <h2 className="section-title">Available Models</h2>
        <div className="models-scroll">
          {[
            { name: "GPT-NEXUS", category: "NLP", accuracy: 96, desc: "Advanced language understanding" },
            { name: "VISION-X", category: "Vision", accuracy: 94, desc: "Image recognition and analysis" },
            { name: "AUDIO-WAVE", category: "Audio", accuracy: 91, desc: "Speech and sound processing" },
            { name: "CODE-GEN", category: "Code", accuracy: 98, desc: "Intelligent code generation" },
            { name: "PREDICT-AI", category: "Forecast", accuracy: 89, desc: "Time series prediction" },
            { name: "SENTIMENT-PRO", category: "NLP", accuracy: 93, desc: "Emotion detection" },
            { name: "OBJECT-DETECT", category: "Vision", accuracy: 95, desc: "Real-time object tracking" },
            { name: "TRANSLATE-MAX", category: "NLP", accuracy: 97, desc: "Multi-language translation" },
          ].map((model, i) => (
            <div key={i} className="model-card glass-card">
              <h3>{model.name}</h3>
              <span className={`category-tag ${model.category.toLowerCase()}`}>{model.category}</span>
              <div className="model-accuracy">
                <div className="accuracy-bar" style={{ width: `${model.accuracy}%` }} />
                <span>{model.accuracy}%</span>
              </div>
              <p>{model.desc}</p>
              <button className="load-btn">LOAD MODEL</button>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="timeline-section">
        <h2 className="section-title">Activity Feed</h2>
        <div className="timeline">
          <div className="timeline-line" />
          {[
            { time: "2 min ago", title: "Model Training Complete", desc: "GPT-NEXUS v4.2 deployed successfully" },
            { time: "15 min ago", title: "Analysis Finished", desc: "Processed 2.4M records with 99.1% accuracy" },
            { time: "1 hour ago", title: "New Dataset Uploaded", desc: "Training data synchronized across clusters" },
            { time: "3 hours ago", title: "System Upgrade", desc: "Infrastructure scaled to 500 nodes" },
            { time: "5 hours ago", title: "Alert Triggered", desc: "Anomaly detected in prediction pipeline" },
            { time: "8 hours ago", title: "Backup Complete", desc: "All models and data backed up to cloud" },
          ].map((event, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <span className="timeline-time">{event.time}</span>
                <h4>{event.title}</h4>
                <p>{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM METRICS */}
      <section className="bottom-metrics">
        {[
          { value: 2847, label: "Active Users", icon: "👥" },
          { value: 15234, label: "Models Deployed", icon: "🤖" },
          { value: 99.9, label: "Uptime %", icon: "⚡" },
          { value: 847, label: "TB Processed", icon: "💾" },
        ].map((metric, i) => (
          <div key={i} className="metric-card glass-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
            <svg className="sparkline" viewBox="0 0 100 30">
              <polyline points="0,20 20,15 40,18 60,10 80,12 100,8" />
            </svg>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="nexus-footer">
        <div className="footer-top">
          <div className="footer-logo">
            <svg className="logo-hex" viewBox="0 0 100 100">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
            </svg>
            <span>NEXUS AI</span>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#docs">Documentation</a>
            <a href="#api">API</a>
            <a href="#support">Support</a>
          </div>
          <div className="footer-social">
            <a href="#">𝕏</a>
            <a href="#">in</a>
            <a href="#">⚡</a>
          </div>
        </div>
        <div className="footer-divider" />
        <div className="footer-bottom">
          <span>© 2024 NEXUS AI. All rights reserved.</span>
          <span className="engine-version">POWERED BY NEXUS AI ENGINE v4.2</span>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
