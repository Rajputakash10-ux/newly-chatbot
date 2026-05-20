"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sid = localStorage.getItem("chatSessionId");
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem("chatSessionId", sid);
    }
    setSessionId(sid);
    loadHistory(sid);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = async (sid: string) => {
    try {
      const res = await fetch(`/api/chat?sessionId=${sid}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Failed to get response" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>💬 NEXUS Chat</h1>
        <button onClick={() => (window.location.href = "/")}>← Back to Dashboard</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-avatar">{msg.role === "user" ? "👤" : "🤖"}</div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about stocks, analysis, predictions..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? "⏳" : "➤"}
        </button>
      </div>

      <style jsx>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #000;
          color: #fff;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(0, 255, 255, 0.1);
          border-bottom: 1px solid #00ffff;
        }
        .chat-header h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #00ffff;
        }
        .chat-header button {
          background: transparent;
          border: 1px solid #00ffff;
          color: #00ffff;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .message {
          display: flex;
          gap: 1rem;
          max-width: 70%;
          animation: slideIn 0.3s ease;
        }
        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .message.assistant {
          align-self: flex-start;
        }
        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .message-content {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 12px;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .message.user .message-content {
          background: rgba(0, 255, 255, 0.2);
        }
        .typing {
          display: flex;
          gap: 0.3rem;
          padding: 1rem 1.5rem;
        }
        .typing span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00ffff;
          animation: bounce 1.4s infinite;
        }
        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }
        .chat-input-container {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          background: rgba(0, 255, 255, 0.05);
          border-top: 1px solid #00ffff;
        }
        .chat-input-container input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #00ffff;
          color: #fff;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1rem;
        }
        .chat-input-container input:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        .chat-input-container button {
          background: #00ffff;
          border: none;
          color: #000;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          transition: all 0.3s;
        }
        .chat-input-container button:hover:not(:disabled) {
          background: #00cccc;
          transform: scale(1.05);
        }
        .chat-input-container button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
