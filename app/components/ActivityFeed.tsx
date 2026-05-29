"use client";
import { useEffect, useState } from "react";

export default function ActivityFeed() {
  const [activities, setActivities] = useState([
    { icon: "🚀", text: "AI detected bullish momentum in TSLA", time: "2m ago", type: "signal" },
    { icon: "⚠️", text: "Bitcoin volatility increased by 4%", time: "15m ago", type: "alert" },
    { icon: "📚", text: "New lesson: Understanding MACD", time: "1h ago", type: "learning" },
    { icon: "📊", text: "Portfolio risk score updated to Low", time: "2h ago", type: "portfolio" },
    { icon: "💡", text: "NVDA breaking resistance level", time: "3h ago", type: "signal" }
  ]);

  return (
    <section className="glass p-4 rounded-lg" data-tour="activity">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold">Activity Feed</h3>
        <button className="text-[10px] text-[var(--accent)] hover:underline">View All</button>
      </div>

      <div className="space-y-2">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-[var(--panel)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/30 transition-all"
          >
            <div className="text-lg shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--text)] mb-1">{activity.text}</div>
              <div className="text-[9px] text-[var(--muted)]">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-3 px-4 py-2 text-xs font-medium border border-[var(--border)] text-[var(--muted)] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
        Load More
      </button>
    </section>
  );
}
