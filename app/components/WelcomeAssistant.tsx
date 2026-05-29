"use client";
import { useState, useEffect } from "react";

type WelcomeAssistantProps = {
  onStartTour: () => void;
  onSkip: () => void;
};

export default function WelcomeAssistant({ onStartTour, onSkip }: WelcomeAssistantProps) {
  const [text, setText] = useState("");
  const [step, setStep] = useState(0);
  const fullText = "Welcome to NEXUS AI Stock Intelligence. I'll guide you through the platform and help you learn stock market analysis step by step.";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="glass p-8 max-w-lg mx-4 text-center">
        {/* AI Avatar */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--magenta)] flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 text-white" viewBox="0 0 100 100">
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="15" fill="currentColor" />
          </svg>
        </div>

        <h2 className="text-2xl font-orbitron font-bold gradient-text mb-4">
          NEXUS AI STOCK ASSISTANT
        </h2>

        <p className="text-sm text-[var(--text)] mb-6 min-h-[60px] leading-relaxed">
          {text}<span className="animate-pulse">|</span>
        </p>

        {text.length >= fullText.length && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-xs text-[var(--muted)] mb-4">What's your stock market experience?</p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setStep(1)}
                  className="px-4 py-3 text-xs border border-[var(--border)] text-[var(--text)] rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-orbitron"
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-3 animate-fade-in">
                <button
                  onClick={onStartTour}
                  className="w-full px-6 py-3 bg-[var(--accent)] text-black font-bold text-sm rounded hover:shadow-[0_0_30px_var(--accent)] transition-all font-orbitron tracking-wider"
                >
                  START GUIDED TOUR
                </button>
                <button
                  onClick={onSkip}
                  className="w-full px-6 py-3 border border-[var(--border)] text-[var(--muted)] text-xs rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                >
                  Skip for now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
