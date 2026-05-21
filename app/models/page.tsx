"use client";

import { useState } from "react";
import "../nexus.css";

export default function Models() {
  const [models] = useState([
    { id: 1, name: "GPT-NEXUS", category: "NLP", accuracy: 96, status: "active", version: "v4.2" },
    { id: 2, name: "VISION-X", category: "Vision", accuracy: 94, status: "active", version: "v3.1" },
    { id: 3, name: "AUDIO-WAVE", category: "Audio", accuracy: 91, status: "training", version: "v2.5" },
    { id: 4, name: "CODE-GEN", category: "Code", accuracy: 98, status: "active", version: "v5.0" },
    { id: 5, name: "PREDICT-AI", category: "Forecast", accuracy: 89, status: "active", version: "v3.8" },
    { id: 6, name: "SENTIMENT-PRO", category: "NLP", accuracy: 93, status: "active", version: "v2.9" },
    { id: 7, name: "OBJECT-DETECT", category: "Vision", accuracy: 95, status: "inactive", version: "v4.1" },
    { id: 8, name: "TRANSLATE-MAX", category: "NLP", accuracy: 97, status: "active", version: "v6.2" },
  ]);

  const [selectedModel, setSelectedModel] = useState<any>(null);

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
            <a href="/trading">Trading</a>
            <a href="/models">Models</a>
            <a href="/reports">Reports</a>
            <a href="/settings">Settings</a>
          </div>
          <div className="nav-right">
            <button onClick={() => (window.location.href = "/")}>← Home</button>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: "100px", padding: "100px 2rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 className="section-title">AI Models</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
          {models.map((model) => (
            <div key={model.id} className="glass-card" style={{ cursor: "pointer" }} onClick={() => setSelectedModel(model)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0 }}>{model.name}</h3>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background:
                      model.status === "active"
                        ? "#00ff00"
                        : model.status === "training"
                        ? "#ff9500"
                        : "#666",
                    color: "#000",
                  }}
                >
                  {model.status.toUpperCase()}
                </span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <span
                  className={`category-tag ${model.category.toLowerCase()}`}
                  style={{ display: "inline-block" }}
                >
                  {model.category}
                </span>
                <span style={{ marginLeft: "1rem", color: "#aaa", fontSize: "0.9rem" }}>{model.version}</span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", color: "#aaa" }}>Accuracy</span>
                  <span style={{ color: "#00ffff", fontWeight: 600 }}>{model.accuracy}%</span>
                </div>
                <div className="feed-bar-bg">
                  <div className="feed-bar cyan" style={{ width: `${model.accuracy}%` }} />
                </div>
              </div>

              <button
                className="load-btn"
                style={{ width: "100%" }}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Loading ${model.name}...`);
                }}
              >
                {model.status === "active" ? "DEPLOY" : model.status === "training" ? "VIEW PROGRESS" : "ACTIVATE"}
              </button>
            </div>
          ))}
        </div>

        {selectedModel && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
            onClick={() => setSelectedModel(null)}
          >
            <div className="glass-card" style={{ maxWidth: "600px", width: "90%" }} onClick={(e) => e.stopPropagation()}>
              <h2>{selectedModel.name}</h2>
              <div style={{ marginTop: "2rem" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ color: "#aaa" }}>Category:</span>
                  <span style={{ marginLeft: "1rem", color: "#00ffff" }}>{selectedModel.category}</span>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ color: "#aaa" }}>Version:</span>
                  <span style={{ marginLeft: "1rem", color: "#00ffff" }}>{selectedModel.version}</span>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ color: "#aaa" }}>Status:</span>
                  <span style={{ marginLeft: "1rem", color: "#00ffff" }}>{selectedModel.status}</span>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ color: "#aaa" }}>Accuracy:</span>
                  <span style={{ marginLeft: "1rem", color: "#00ffff" }}>{selectedModel.accuracy}%</span>
                </div>
                <div style={{ marginTop: "2rem", padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "0.5rem" }}>Description</div>
                  <div>Advanced AI model optimized for {selectedModel.category} tasks with state-of-the-art performance.</div>
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: "2rem" }}
                onClick={() => setSelectedModel(null)}
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
