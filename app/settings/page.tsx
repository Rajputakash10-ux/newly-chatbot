"use client";

import { useState } from "react";
import "../nexus.css";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoSave: true,
    apiKey: "sk-nexus-••••••••••••••••",
    email: "user@nexusai.com",
    language: "en",
    timezone: "UTC",
    theme: "cyan",
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    alert("Settings saved successfully!");
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
        <h1 className="section-title">Settings</h1>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "2rem", marginTop: "3rem" }}>
          <div className="glass-card" style={{ height: "fit-content" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["general", "account", "api", "appearance", "security"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "1rem",
                    background: activeTab === tab ? "rgba(0, 255, 255, 0.2)" : "transparent",
                    border: activeTab === tab ? "1px solid #00ffff" : "1px solid transparent",
                    color: "#fff",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                    textTransform: "capitalize",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card">
            {activeTab === "general" && (
              <div>
                <h3>General Settings</h3>
                <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa" }}>Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(20, 20, 40, 0.6)",
                        border: "1px solid rgba(0, 255, 255, 0.3)",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa" }}>Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(20, 20, 40, 0.6)",
                        border: "1px solid rgba(0, 255, 255, 0.3)",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Notifications</div>
                      <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Receive system notifications</div>
                    </div>
                    <label style={{ position: "relative", display: "inline-block", width: "60px", height: "30px" }}>
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: settings.notifications ? "#00ffff" : "#666",
                          borderRadius: "30px",
                          transition: "0.3s",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            content: "",
                            height: "22px",
                            width: "22px",
                            left: settings.notifications ? "34px" : "4px",
                            bottom: "4px",
                            background: "#000",
                            borderRadius: "50%",
                            transition: "0.3s",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Auto Save</div>
                      <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Automatically save changes</div>
                    </div>
                    <label style={{ position: "relative", display: "inline-block", width: "60px", height: "30px" }}>
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: settings.autoSave ? "#00ffff" : "#666",
                          borderRadius: "30px",
                          transition: "0.3s",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            content: "",
                            height: "22px",
                            width: "22px",
                            left: settings.autoSave ? "34px" : "4px",
                            bottom: "4px",
                            background: "#000",
                            borderRadius: "50%",
                            transition: "0.3s",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div>
                <h3>Account Settings</h3>
                <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa" }}>Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(20, 20, 40, 0.6)",
                        border: "1px solid rgba(0, 255, 255, 0.3)",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa" }}>Change Password</label>
                    <input
                      type="password"
                      placeholder="New password"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(20, 20, 40, 0.6)",
                        border: "1px solid rgba(0, 255, 255, 0.3)",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <button className="btn-ghost" style={{ width: "fit-content" }}>
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div>
                <h3>API Configuration</h3>
                <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa" }}>API Key</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <input
                        type="text"
                        value={settings.apiKey}
                        readOnly
                        style={{
                          flex: 1,
                          padding: "0.75rem",
                          background: "rgba(20, 20, 40, 0.6)",
                          border: "1px solid rgba(0, 255, 255, 0.3)",
                          color: "#fff",
                          borderRadius: "8px",
                        }}
                      />
                      <button className="btn-ghost">Regenerate</button>
                    </div>
                  </div>
                  <div style={{ padding: "1rem", background: "rgba(0, 255, 255, 0.1)", borderRadius: "8px" }}>
                    <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>⚠️ API Usage</div>
                    <div style={{ fontSize: "0.9rem", color: "#aaa" }}>
                      Current usage: 1,250,000 / 5,000,000 requests this month
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div>
                <h3>Appearance</h3>
                <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "1rem", color: "#aaa" }}>Theme Color</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {["cyan", "purple", "green", "orange"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setSettings({ ...settings, theme: color })}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background:
                              color === "cyan"
                                ? "#00ffff"
                                : color === "purple"
                                ? "#9d00ff"
                                : color === "green"
                                ? "#00ff00"
                                : "#ff9500",
                            border: settings.theme === color ? "3px solid #fff" : "none",
                            cursor: "pointer",
                            transition: "all 0.3s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Dark Mode</div>
                      <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Use dark theme</div>
                    </div>
                    <label style={{ position: "relative", display: "inline-block", width: "60px", height: "30px" }}>
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: settings.darkMode ? "#00ffff" : "#666",
                          borderRadius: "30px",
                          transition: "0.3s",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            content: "",
                            height: "22px",
                            width: "22px",
                            left: settings.darkMode ? "34px" : "4px",
                            bottom: "4px",
                            background: "#000",
                            borderRadius: "50%",
                            transition: "0.3s",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h3>Security Settings</h3>
                <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div style={{ padding: "1rem", background: "rgba(0, 255, 0, 0.1)", borderRadius: "8px" }}>
                    <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>✓ Two-Factor Authentication</div>
                    <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Enabled</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: "1rem" }}>Active Sessions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div
                        style={{
                          padding: "1rem",
                          background: "rgba(20, 20, 40, 0.6)",
                          borderRadius: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div>Current Session</div>
                          <div style={{ fontSize: "0.9rem", color: "#aaa" }}>Chrome on macOS</div>
                        </div>
                        <span style={{ color: "#00ff00" }}>● Active</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-ghost" style={{ width: "fit-content" }}>
                    View Security Log
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: "3rem", display: "flex", gap: "1rem" }}>
              <button className="btn-primary" onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
