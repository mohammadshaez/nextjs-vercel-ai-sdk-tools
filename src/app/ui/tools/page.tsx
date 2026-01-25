"use client";

import { useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatMessage } from "@/app/api/tools/route";
import {
  Wrench,
  Sparkles,
  Loader2,
  Send,
  StopCircle,
  Cloud,
  MapPin,
  Search,
  Cpu,
  User,
  Bot,
  Terminal,
} from "lucide-react";

export default function ToolsChatPage() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/tools",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen w-full max-w-5xl mx-auto p-4 md:p-8 relative overflow-hidden text-slate-50 font-sans">
      <style jsx global>{`
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
        .tool-call-glow {
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.1);
          animation: tool-pulse 2s infinite;
        }
        @keyframes tool-pulse {
          0%,
          100% {
            border-color: rgba(14, 165, 233, 0.2);
          }
          50% {
            border-color: rgba(14, 165, 233, 0.5);
          }
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Header */}
      <header className="flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Wrench className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus Tools
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Autonomous Function Core
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/5 text-blue-400">
          {status === "ready" ? "Tools Armed" : "Executing Function"}
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-32 pr-2 scrollbar-hide z-10"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Cpu className="w-16 h-16 mb-4 text-sky-400 animate-spin-slow" />
            <h2 className="text-xl font-bold mb-2">Function Matrix Offline</h2>
            <p className="max-w-xs text-sm text-slate-400">
              Awaiting objective to initiate autonomous tool sequencing.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role !== "user" && (
              <div className="p-2 nexus-glass rounded-lg border-sky-500/30">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-4 rounded-2xl nexus-glass transition-all ${
                message.role === "user"
                  ? "bg-sky-500/10 border-sky-500/20 rounded-tr-none"
                  : "bg-white/5 border-white/10 rounded-tl-none"
              }`}
            >
              <div className="text-[10px] font-bold mb-2 uppercase tracking-widest opacity-40">
                {message.role === "user" ? "Operator" : "Nexus"}
              </div>

              <div className="space-y-4">
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <div
                          key={index}
                          className="text-sm md:text-base leading-relaxed text-slate-200 whitespace-pre-wrap"
                        >
                          {part.text}
                        </div>
                      );

                    case "tool-getWeather":
                      return (
                        <div
                          key={index}
                          className="tool-call-glow bg-sky-500/5 border border-sky-500/20 p-4 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-sky-500/10 pb-2">
                            <div className="flex items-center gap-2">
                              <Cloud className="w-4 h-4 text-sky-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                                Weather API Call
                              </span>
                            </div>
                            <div className="text-[8px] font-bold text-slate-500 bg-white/5 px-1.5 py-0.5 rounded uppercase">
                              {part.state}
                            </div>
                          </div>

                          {part.state === "input-streaming" && (
                            <div className="flex items-center gap-2 animate-pulse">
                              <Loader2 className="w-3 h-3 animate-spin text-sky-500" />
                              <span className="text-[10px] text-slate-400 italic">
                                Streaming parameters...
                              </span>
                            </div>
                          )}

                          {(part.state === "input-available" ||
                            part.state === "output-available") && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span className="text-xs font-bold text-slate-300">
                                Target: {part.input.city}
                              </span>
                            </div>
                          )}

                          {part.state === "output-available" && (
                            <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5 text-sm text-sky-100 font-medium">
                              {part.output}
                            </div>
                          )}

                          {part.state === "output-error" && (
                            <div className="mt-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-xs text-red-400">
                              Exception: {part.errorText}
                            </div>
                          )}
                        </div>
                      );

                    default:
                      return null;
                  }
                })}
              </div>
            </div>

            {message.role === "user" && (
              <div className="p-2 nexus-glass rounded-lg border-fuchsia-500/30">
                <User className="w-5 h-5 text-fuchsia-400" />
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            Protocol Error: {error?.message}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-20 transition-all duration-300">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>

          <div className="relative flex gap-2 nexus-glass p-2 rounded-xl border-white/20">
            <input
              className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-200 placeholder-slate-500 text-sm md:text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Assign objective for tool processing..."
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
                disabled={status !== "ready" || !input.trim()}
                className="p-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all border border-sky-500/30 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
            Nexus Toolbelt v4.2 • Autonomous Logic Core Active
          </p>
        </div>
      </div>
    </div>
  );
}

// Replace the messages rendering with below for all tool call states in the UI

// {messages.map((message) => (
//   <div key={message.id} className="mb-4">
//     <div className="font-semibold">
//       {message.role === "user" ? "You:" : "AI:"}
//     </div>
//     {message.parts.map((part, index) => {
//       switch (part.type) {
//         case "text":
//           return (
//             <div
//               key={`${message.id}-text-${index}`}
//               className="whitespace-pre-wrap"
//             >
//               {part.text}
//             </div>
//           );

//         case "tool-getLocation":
//           return (
//             <div key={`${message.id}-getLocation-${index}`} className="space-y-1 mt-1">
//               {/* Always show input-streaming as passed state */}
//               {(part.state === "input-streaming" || part.state === "input-available" || part.state === "output-available" || part.state === "output-error") && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded opacity-50">
//                   <div className="text-sm text-zinc-500">
//                     📍 [STATE: input-streaming] Receiving location request...
//                   </div>
//                   <pre className="text-xs text-zinc-600 mt-1">
//                     {JSON.stringify(part.input || {}, null, 2)}
//                   </pre>
//                 </div>
//               )}

//               {/* Show input-available if we're at or past that state */}
//               {(part.state === "input-available" || part.state === "output-available" || part.state === "output-error") && (
//                 <div className={`bg-zinc-800/50 border border-zinc-700 p-2 rounded ${part.state === "input-available" ? "" : "opacity-70"}`}>
//                   <div className="text-sm text-zinc-400">
//                     📍 [STATE: input-available] Getting location for {part.input.name}...
//                   </div>
//                 </div>
//               )}

//               {/* Show output-available if we're at that state */}
//               {part.state === "output-available" && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded">
//                   <div className="text-sm text-zinc-400">
//                     📍 [STATE: output-available] Location found
//                   </div>
//                   <div className="text-sm text-zinc-300">
//                     {part.output}
//                   </div>
//                 </div>
//               )}

//               {/* Show output-error if we're at that state */}
//               {part.state === "output-error" && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded">
//                   <div className="text-sm text-red-400">
//                     [STATE: output-error] Error: {part.errorText}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );

//         case "tool-getWeather":
//           return (
//             <div key={`${message.id}-getWeather-${index}`} className="space-y-1 mt-1">
//               {/* Always show input-streaming as passed state */}
//               {(part.state === "input-streaming" || part.state === "input-available" || part.state === "output-available" || part.state === "output-error") && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded opacity-50">
//                   <div className="text-sm text-zinc-500">
//                     🌤️ [STATE: input-streaming] Receiving weather request...
//                   </div>
//                   <pre className="text-xs text-zinc-600 mt-1">
//                     {JSON.stringify(part.input || {}, null, 2)}
//                   </pre>
//                 </div>
//               )}

//               {/* Show input-available if we're at or past that state */}
//               {(part.state === "input-available" || part.state === "output-available" || part.state === "output-error") && (
//                 <div className={`bg-zinc-800/50 border border-zinc-700 p-2 rounded ${part.state === "input-available" ? "" : "opacity-70"}`}>
//                   <div className="text-sm text-zinc-400">
//                     🌤️ [STATE: input-available] Getting weather for {part.input.city}...
//                   </div>
//                 </div>
//               )}

//               {/* Show output-available if we're at that state */}
//               {part.state === "output-available" && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded">
//                   <div className="text-sm text-zinc-400">🌤️ [STATE: output-available] Weather</div>
//                   <div className="text-sm text-zinc-300">
//                     <div>{part.output}</div>
//                   </div>
//                 </div>
//               )}

//               {/* Show output-error if we're at that state */}
//               {part.state === "output-error" && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded">
//                   <div className="text-sm text-red-400">
//                     [STATE: output-error] Error: {part.errorText}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );

//         default:
//           return null;
//       }
//     })}
//   </div>
// ))}
