type Props = { role: "user" | "assistant"; content: string };

export default function ChatBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className="flex flex-col gap-1 max-w-[85%]">
        <span className={`text-[9px] font-bold uppercase tracking-wider ${
          isUser ? "text-right text-indigo-400" : "text-emerald-400"
        }`}>
          {isUser ? "You" : "AI"}
        </span>
        <div
          className={`px-3 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-md"
              : "bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl rounded-bl-md"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
