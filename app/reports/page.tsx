"use client";

import { useState } from "react";
import "../nexus.css";

export default function Reports() {
  const [reports] = useState([
    { id: 1, title: "Monthly Performance Report", date: "2024-05-20", type: "Performance", status: "completed" },
    { id: 2, title: "Model Accuracy Analysis", date: "2024-05-19", type: "Analysis", status: "completed" },
    { id: 3, title: "System Health Check", date: "2024-05-18", type: "Health", status: "completed" },
    { id: 4, title: "API Usage Statistics", date: "2024-05-17", type: "Usage", status: "completed" },
    { id: 5, title: "Security Audit Report", date: "2024-05-16", type: "Security", status: "pending" },
    { id: 6, title: "Cost Optimization Report", date: "2024-05-15", type: "Finance", status: "completed" },
  ]);

  const [selectedReport, setSelectedReport] = useState<any>(null);

  const generateReport = () => {
    alert("Generating new report...");
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

      <div style={{ paddingTop: "100px", padding: "100px 2rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <h1 className="section-title" style={{ margin: 0 }}>Reports</h1>
          <button className="btn-primary" onClick={generateReport}>
            + Generate Report
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {reports.map((report) => (
            <div
              key={report.id}
              className="glass-card"
              style={{ cursor: "pointer", transition: "all 0.3s" }}
              onClick={() => setSelectedReport(report)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>{report.title}</h3>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem", color: "#aaa" }}>
                    <span>📅 {report.date}</span>
                    <span>📊 {report.type}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      background: report.status === "completed" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 149, 0, 0.2)",
                      color: report.status === "completed" ? "#00ff00" : "#ff9500",
                    }}
                  >
                    {report.status.toUpperCase()}
                  </span>
                  <button
                    className="btn-ghost"
                    style={{ padding: "0.5rem 1.5rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Downloading ${report.title}...`);
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedReport && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: "2rem",
            }}
            onClick={() => setSelectedReport(null)}
          >
            <div
              className="glass-card"
              style={{ maxWidth: "800px", width: "100%", maxHeight: "80vh", overflow: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{selectedReport.title}</h2>
              <div style={{ display: "flex", gap: "2rem", marginTop: "1rem", marginBottom: "2rem", color: "#aaa" }}>
                <span>📅 {selectedReport.date}</span>
                <span>📊 {selectedReport.type}</span>
                <span
                  style={{
                    color: selectedReport.status === "completed" ? "#00ff00" : "#ff9500",
                  }}
                >
                  ● {selectedReport.status}
                </span>
              </div>

              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Executive Summary</h3>
                <p style={{ lineHeight: 1.8, color: "#ccc" }}>
                  This report provides comprehensive insights into system performance, model accuracy, and operational metrics.
                  Key findings indicate strong performance across all monitored parameters with 99.7% uptime and optimal resource utilization.
                </p>

                <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Key Metrics</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                  <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Total Requests</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00ffff", marginTop: "0.5rem" }}>1.25M</div>
                  </div>
                  <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Avg Response Time</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00ffff", marginTop: "0.5rem" }}>0.3ms</div>
                  </div>
                  <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Success Rate</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00ffff", marginTop: "0.5rem" }}>99.7%</div>
                  </div>
                  <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Active Models</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00ffff", marginTop: "0.5rem" }}>150+</div>
                  </div>
                </div>

                <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Recommendations</h3>
                <ul style={{ lineHeight: 2, color: "#ccc" }}>
                  <li>Continue monitoring model performance for optimization opportunities</li>
                  <li>Scale infrastructure to handle projected 20% growth in Q3</li>
                  <li>Implement additional security measures for enhanced data protection</li>
                  <li>Optimize API endpoints for improved latency</li>
                </ul>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert("Downloading report...")}>
                  Download PDF
                </button>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedReport(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
