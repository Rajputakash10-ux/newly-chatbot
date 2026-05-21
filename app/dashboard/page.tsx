"use client";

import { useEffect, useState } from "react";
import "../nexus.css";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    activeUsers: 2847,
    modelsDeployed: 15234,
    uptime: 99.9,
    dataProcessed: 847,
    apiCalls: 1250000,
    avgLatency: 0.3,
  });

  const [activities, setActivities] = useState([
    { time: "2 min ago", event: "Model Training Complete", status: "success" },
    { time: "15 min ago", event: "Analysis Finished", status: "success" },
    { time: "1 hour ago", event: "Dataset Uploaded", status: "info" },
    { time: "3 hours ago", event: "System Upgrade", status: "warning" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 1000),
        avgLatency: +(prev.avgLatency + (Math.random() * 0.1 - 0.05)).toFixed(2),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

      <div style={{ paddingTop: "100px", padding: "100px 2rem 2rem" }}>
        <h1 className="section-title">System Dashboard</h1>

        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-number gradient-text">{metrics.activeUsers}</div>
            <div className="stat-label">Active Users</div>
            <div className="stat-progress" style={{ width: "85%" }} />
          </div>
          <div className="stat-card">
            <div className="stat-number gradient-text">{metrics.modelsDeployed}</div>
            <div className="stat-label">Models Deployed</div>
            <div className="stat-progress" style={{ width: "92%" }} />
          </div>
          <div className="stat-card">
            <div className="stat-number gradient-text">{metrics.uptime}%</div>
            <div className="stat-label">Uptime</div>
            <div className="stat-progress" style={{ width: "99%" }} />
          </div>
          <div className="stat-card">
            <div className="stat-number gradient-text">{metrics.dataProcessed}TB</div>
            <div className="stat-label">Data Processed</div>
            <div className="stat-progress" style={{ width: "78%" }} />
          </div>
        </div>

        <div className="dashboard-grid" style={{ marginTop: "3rem" }}>
          <div className="glass-card">
            <h3>Real-Time Metrics</h3>
            <div style={{ marginTop: "2rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>API Calls Today</span>
                  <span className="gradient-text">{metrics.apiCalls.toLocaleString()}</span>
                </div>
                <div className="feed-bar-bg">
                  <div className="feed-bar cyan" style={{ width: "75%" }} />
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Avg Latency</span>
                  <span className="gradient-text">{metrics.avgLatency}ms</span>
                </div>
                <div className="feed-bar-bg">
                  <div className="feed-bar green" style={{ width: "95%" }} />
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Success Rate</span>
                  <span className="gradient-text">99.7%</span>
                </div>
                <div className="feed-bar-bg">
                  <div className="feed-bar purple" style={{ width: "99.7%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3>Recent Activity</h3>
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activities.map((activity, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background:
                        activity.status === "success"
                          ? "#00ff00"
                          : activity.status === "warning"
                          ? "#ff9500"
                          : "#00ffff",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{activity.event}</div>
                    <div style={{ fontSize: "0.8rem", color: "#aaa" }}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ marginTop: "2rem" }}>
          <h3>System Health</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginTop: "2rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🟢</div>
              <div style={{ fontWeight: 600 }}>Database</div>
              <div style={{ color: "#00ff00", fontSize: "0.9rem" }}>Operational</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🟢</div>
              <div style={{ fontWeight: 600 }}>API Gateway</div>
              <div style={{ color: "#00ff00", fontSize: "0.9rem" }}>Operational</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🟢</div>
              <div style={{ fontWeight: 600 }}>ML Pipeline</div>
              <div style={{ color: "#00ff00", fontSize: "0.9rem" }}>Operational</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
