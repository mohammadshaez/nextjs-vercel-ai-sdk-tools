"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Send, StopCircle, Sparkles, User, Bot } from "lucide-react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen w-full max-w-5xl mx-auto p-4 md:p-8 relative overflow-hidden text-slate-50 font-sans">
      <style jsx global>{`
        @keyframes nexus-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes nexus-pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(14, 165, 233, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.6);
          }
        }
        .nexus-glass {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .nexus-futuristic-text {
          background: linear-gradient(to right, #0ea5e9, #d946ef);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Header */}
      <header className="flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20">
            <Sparkles className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus AI
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Neural Gateway Pulse
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium border border-sky-500/20 bg-sky-500/5 text-sky-400">
          {status === "ready" ? "Link Online" : "Executing Function"}
        </div>
      </header>

      {/* Messages Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-24 pr-2 scrollbar-hide z-10"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <Bot className="w-12 h-12 mb-4 text-sky-400 animate-bounce" />
            <h2 className="text-xl font-semibold mb-2">Initialize Nexus AI</h2>
            <p className="max-w-xs text-sm text-slate-400">
              Quantum-accelerated neural gateway ready for interaction. How can
              I assist your objective today?
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role !== "user" && (
              <div className="p-2 nexus-glass rounded-lg border-sky-500/30">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-4 rounded-2xl nexus-glass transition-all hover:border-sky-500/40 ${
                message.role === "user"
                  ? "bg-sky-500/10 border-sky-500/20 rounded-tr-none"
                  : "bg-white/5 border-white/10 rounded-tl-none shadow-2xl"
              }`}
            >
              <div className="text-xs font-bold mb-1 uppercase tracking-widest opacity-40">
                {message.role === "user" ? "Operator" : "Nexus"}
              </div>

              {message.role === "assistant" &&
                message.parts.map(
                  (part, index) =>
                    part.type === "text" && (
                      <div
                        key={index}
                        className="text-sm md:text-base leading-relaxed text-slate-200 whitespace-pre-wrap"
                      >
                        {part.text}
                      </div>
                    ),
                )}

              {message.role === "user" && (
                <div className="text-sm md:text-base text-slate-100 whitespace-pre-wrap">
                  {message.parts.map((part, i) =>
                    part.type === "text" ? part.text : "",
                  )}
                </div>
              )}
            </div>

            {message.role === "user" && (
              <div className="p-2 nexus-glass rounded-lg border-fuchsia-500/30">
                <User className="w-5 h-5 text-fuchsia-400" />
              </div>
            )}
          </div>
        ))}

        {/* Loading/Streaming Indicator */}
        {(status === "submitted" || status === "streaming") && (
          <div className="flex items-center gap-3">
            <div className="p-2 nexus-glass rounded-lg border-sky-500/30 animate-spin">
              <Sparkles className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            System Override Error: {error?.message}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-20 transition-all duration-300">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative flex gap-2 nexus-glass p-2 rounded-xl border-white/20">
            <input
              className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-200 placeholder-slate-500 text-sm md:text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Transmit neural request..."
              disabled={status === "submitted" || status === "streaming"}
            />

            {status === "submitted" || status === "streaming" ? (
              <button
                type="button"
                onClick={stop}
                className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="p-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all border border-sky-500/30 group-hover:border-sky-500/60 disabled:opacity-50"
                disabled={!input.trim() || status !== "ready"}
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
        <div className="mt-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Nexus OS v4.2.0 • Quantum Encryption Active
          </p>
        </div>
      </div>
    </div>
  );
}
