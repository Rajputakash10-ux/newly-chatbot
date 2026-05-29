"use client";

type LearningHubProps = {
  userLevel: "beginner" | "intermediate" | "trader";
};

export default function LearningHub({ userLevel }: LearningHubProps) {
  const courses = [
    {
      icon: "📈",
      title: "Stock Market Basics",
      desc: "Learn what stocks are, how markets work, and basic terminology",
      progress: 35,
      lessons: 12
    },
    {
      icon: "📊",
      title: "Technical Analysis",
      desc: "Master chart patterns, indicators, and trend analysis",
      progress: 0,
      lessons: 18
    },
    {
      icon: "🎯",
      title: "Risk Management",
      desc: "Understand position sizing, stop-loss, and portfolio protection",
      progress: 0,
      lessons: 8
    },
    {
      icon: "🕯️",
      title: "Candlestick Patterns",
      desc: "Identify bullish and bearish patterns for better entries",
      progress: 20,
      lessons: 15
    },
    {
      icon: "💼",
      title: "Portfolio Building",
      desc: "Create diversified portfolios and manage investments",
      progress: 0,
      lessons: 10
    },
    {
      icon: "🧠",
      title: "Trading Psychology",
      desc: "Control emotions, avoid FOMO, and develop discipline",
      progress: 0,
      lessons: 6
    }
  ];

  return (
    <section className="glass p-6 rounded-xl" data-tour="learning-hub">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold">Learning Hub</h3>
          <p className="text-[10px] text-[var(--muted)]">Master trading concepts step by step</p>
        </div>
        <span className="text-[10px] px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full text-[var(--accent)] font-medium">
          {userLevel.toUpperCase()}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.title} className="bg-[var(--panel)] border border-[var(--border)] p-4 rounded-lg hover:border-[var(--accent)]/30 transition-all group">
            <div className="text-3xl mb-3">{course.icon}</div>
            <h4 className="text-sm font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
              {course.title}
            </h4>
            <p className="text-[10px] text-[var(--muted)] mb-3 leading-relaxed">
              {course.desc}
            </p>
            <div className="mb-3">
              <div className="flex items-center justify-between text-[9px] text-[var(--muted)] mb-1">
                <span>{course.progress}% Complete</span>
                <span>{course.lessons} lessons</span>
              </div>
              <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)] transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
            <button className="w-full px-4 py-2 text-xs font-medium border border-[var(--border)] text-[var(--text)] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
              {course.progress > 0 ? "Continue Learning" : "Start Learning"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
