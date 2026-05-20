"use client";

import { useState } from "react";
import "../nexus.css";

export default function Analyzer() {
  const [input, setInput] = useState("");
  const [analysisType, setAnalysisType] = useState("sentiment");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setResult({
        type: analysisType,
        confidence: 0.92 + Math.random() * 0.07,
        sentiment: analysisType === "sentiment" ? (Math.random() > 0.5 ? "Positive" : "Negative") : null,
        entities: analysisType === "entity" ? ["Apple", "Tesla", "Microsoft"] : null,
        keywords: analysisType === "keyword" ? ["AI", "Machine Learning", "Data"] : null,
        summary: "Analysis completed successfully with high confidence.",
      });
      setLoading(false);
    }, 1500);
  };

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

      <div style={{ paddingTop: "100px", padding: "100px 2rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 className="section-title">AI Analyzer</h1>

        <div className="glass-card" style={{ marginTop: "3rem" }}>
          <h3>Analysis Type</h3>
          <div className="mode-toggles" style={{ marginTop: "1.5rem" }}>
            <button
              className={`mode-btn ${analysisType === "sentiment" ? "active" : ""}`}
              onClick={() => setAnalysisType("sentiment")}
            >
              Sentiment
            </button>
            <button
              className={`mode-btn ${analysisType === "entity" ? "active" : ""}`}
              onClick={() => setAnalysisType("entity")}
            >
              Entity
            </button>
            <button
              className={`mode-btn ${analysisType === "keyword" ? "active" : ""}`}
              onClick={() => setAnalysisType("keyword")}
            >
              Keyword
            </button>
            <button
              className={`mode-btn ${analysisType === "summary" ? "active" : ""}`}
              onClick={() => setAnalysisType("summary")}
            >
              Summary
            </button>
          </div>

          <textarea
            className="analyzer-input"
            placeholder="Enter text to analyze..."
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ marginTop: "2rem", width: "100%" }}
          />

          <button
            className="analyze-btn"
            onClick={analyze}
            disabled={loading || !input.trim()}
            style={{ marginTop: "1.5rem", width: "100%" }}
          >
            <span>{loading ? "ANALYZING..." : "ANALYZE"}</span>
          </button>
        </div>

        {result && (
          <div className="glass-card" style={{ marginTop: "2rem" }}>
            <h3>Analysis Results</h3>
            <div style={{ marginTop: "2rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ color: "#aaa" }}>Type:</span>
                <span style={{ marginLeft: "1rem", color: "#00ffff", fontWeight: 600 }}>
                  {result.type.toUpperCase()}
                </span>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ color: "#aaa" }}>Confidence:</span>
                <span style={{ marginLeft: "1rem", color: "#00ffff", fontWeight: 600 }}>
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              {result.sentiment && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ color: "#aaa" }}>Sentiment:</span>
                  <span
                    style={{
                      marginLeft: "1rem",
                      color: result.sentiment === "Positive" ? "#00ff00" : "#ff0000",
                      fontWeight: 600,
                    }}
                  >
                    {result.sentiment}
                  </span>
                </div>
              )}
              {result.entities && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ color: "#aaa" }}>Entities:</span>
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {result.entities.map((entity: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(0, 255, 255, 0.2)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                        }}
                      >
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {result.keywords && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ color: "#aaa" }}>Keywords:</span>
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {result.keywords.map((keyword: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(255, 0, 255, 0.2)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: "2rem", padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
                <div style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Summary</div>
                <div>{result.summary}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
