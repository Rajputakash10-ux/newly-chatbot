"use client";
import { useState, useEffect } from "react";

type Step = {
  target: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
};

const TOUR_STEPS: Step[] = [
  { target: "[data-tour='sidebar']", title: "Navigation Sidebar", content: "Access all platform features: Home, AI Assistant, Market Analyzer, Learning Hub, Portfolio, Reports, and Settings.", position: "right" },
  { target: "[data-tour='hero']", title: "Welcome Dashboard", content: "Your central hub for AI-powered stock analysis and market intelligence. Start here to analyze stocks or ask the AI assistant.", position: "bottom" },
  { target: "[data-tour='market-overview']", title: "Market Overview", content: "Real-time market data showing top gainers, losers, trending stocks, and the Fear & Greed Index.", position: "top" },
  { target: "[data-tour='ai-assistant']", title: "AI Assistant", content: "Ask questions about stocks, trading concepts, or market analysis. Get instant AI-powered educational responses.", position: "top" },
  { target: "[data-tour='learning-hub']", title: "Learning Hub", content: "Master trading with structured courses on stock basics, technical analysis, risk management, and more.", position: "top" },
  { target: "[data-tour='live-analysis']", title: "Live AI Analysis", content: "Real-time AI analysis of stocks with buy/sell signals, confidence scores, and key technical indicators.", position: "top" },
  { target: "[data-tour='portfolio']", title: "Virtual Portfolio", content: "Practice trading with virtual money. Track your holdings, profit/loss, and get AI recommendations.", position: "left" },
  { target: "[data-tour='activity']", title: "Activity Feed", content: "Stay updated with market alerts, AI signals, new lessons, and portfolio updates.", position: "left" }
];

type OnboardingProps = {
  onComplete: () => void;
};

export default function OnboardingSystem({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show || step >= TOUR_STEPS.length) return;
    const target = document.querySelector(TOUR_STEPS[step].target);
    if (target) {
      setTargetRect(target.getBoundingClientRect());
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [step, show]);

  if (!show || step >= TOUR_STEPS.length) return null;

  const currentStep = TOUR_STEPS[step];
  const progress = ((step + 1) / TOUR_STEPS.length) * 100;

  const getPopupPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const pos = currentStep.position || "bottom";
    const offset = 20;

    switch (pos) {
      case "right":
        return { top: targetRect.top, left: targetRect.right + offset };
      case "left":
        return { top: targetRect.top, right: window.innerWidth - targetRect.left + offset };
      case "top":
        return { bottom: window.innerHeight - targetRect.top + offset, left: targetRect.left };
      default:
        return { top: targetRect.bottom + offset, left: targetRect.left };
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm" onClick={() => {}} />
      
      {/* Highlight */}
      {targetRect && (
        <div
          className="fixed z-[101] pointer-events-none rounded-lg"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: "0 0 0 4px var(--accent), 0 0 40px var(--accent)",
            borderRadius: "8px",
            animation: "pulse-glow 2s ease-in-out infinite"
          }}
        />
      )}

      {/* Popup */}
      <div
        className="fixed z-[102] glass p-6 max-w-sm animate-fade-in"
        style={getPopupPosition()}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-[var(--accent)] font-orbitron tracking-widest">
            STEP {step + 1} OF {TOUR_STEPS.length}
          </span>
          <button onClick={onComplete} className="text-[var(--muted)] hover:text-[var(--red)] text-xs">
            ✕
          </button>
        </div>

        <h3 className="text-lg font-orbitron font-bold text-[var(--accent)] mb-2">
          {currentStep.title}
        </h3>
        <p className="text-sm text-[var(--text)] mb-4 leading-relaxed">
          {currentStep.content}
        </p>

        {/* Progress */}
        <div className="h-1 bg-[var(--panel)] rounded mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--magenta)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-2 text-xs border border-[var(--border)] text-[var(--muted)] rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              PREVIOUS
            </button>
          )}
          <button
            onClick={() => step === TOUR_STEPS.length - 1 ? onComplete() : setStep(step + 1)}
            className="flex-1 px-4 py-2 text-xs bg-[var(--accent)] text-black font-bold rounded hover:shadow-[0_0_20px_var(--accent)] transition-all"
          >
            {step === TOUR_STEPS.length - 1 ? "FINISH" : "NEXT"}
          </button>
        </div>
      </div>
    </>
  );
}
