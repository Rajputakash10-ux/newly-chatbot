type Props = { role: "user" | "assistant"; content: string };

export default function ChatBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 fade-in`}>
      <div className="flex flex-col gap-1 max-w-[85%]">
        <span className={`text-[10px] font-semibold ${isUser ? "text-right text-indigo-400" : "text-emerald-400"}`}>
          {isUser ? "YOU" : "AI ASSISTANT"}
        </span>
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "glass-card bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-indigo-500/30"
              : "glass-card bg-slate-800/40 border-slate-700/50"
          }`}
          style={{ borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px" }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
