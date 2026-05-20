type Props = { role: "user" | "assistant"; content: string };

export default function ChatBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className="flex flex-col gap-1 max-w-[85%]">
        <span className={`text-[10px] tracking-widest ${isUser ? "text-right text-[var(--accent)]" : "text-[var(--accent2)]"}`}>
          {isUser ? "YOU" : "AI ANALYST"}
        </span>
        <div
          className={`px-4 py-2 text-xs whitespace-pre-wrap leading-relaxed ${
            isUser
              ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-tl-xl rounded-bl-xl rounded-br-xl text-[var(--text)]"
              : "bg-[var(--accent2)]/5 border border-[var(--accent2)]/20 rounded-tr-xl rounded-bl-xl rounded-br-xl text-[var(--text)]"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
