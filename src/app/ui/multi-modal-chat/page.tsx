"use client";

import { useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import {
  Send,
  Paperclip,
  StopCircle,
  Sparkles,
  User,
  Bot,
  FileText,
  ImageIcon,
} from "lucide-react";

export default function MultiModalChatPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/multi-modal-chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !files?.length) return;
    sendMessage({ text: input, files });
    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      `}</style>

      {/* Background Decor */}
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
              Nexus Multi-Modal
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Universal Neural Gateway
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium border border-sky-500/20 bg-sky-500/5 text-sky-400">
          {status === "ready" ? "Link Online" : "Processing"}
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-32 pr-2 scrollbar-hide z-10"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Bot className="w-16 h-16 mb-4 text-sky-400 animate-bounce" />
            <h2 className="text-xl font-bold mb-2">
              Initialize Multi-Spectral Capture
            </h2>
            <p className="max-w-xs text-sm text-slate-400">
              Awaiting visual or textual payload. Neural sensors at 100%
              capacity.
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
                    case "file":
                      if (part.mediaType?.startsWith("image/")) {
                        return (
                          <div
                            key={index}
                            className="relative rounded-xl overflow-hidden border border-white/10 max-w-sm"
                          >
                            <Image
                              src={part.url}
                              alt={part.filename ?? `attachment-${index}`}
                              width={500}
                              height={500}
                              className="w-full h-auto"
                            />
                          </div>
                        );
                      }
                      if (part.mediaType?.startsWith("application/pdf")) {
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 max-w-sm hover:bg-white/10 transition-colors"
                          >
                            <FileText className="w-8 h-8 text-sky-400" />
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-300 truncate">
                                {part.filename || "Source Document.pdf"}
                              </p>
                              <p className="text-[10px] text-slate-500 uppercase">
                                Neural Context Loaded
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
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
            Neural Link Failure: {error?.message}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-20 transition-all duration-300">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
          {/* File Previews */}
          {files && files.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {[...Array(files.length)].map((_, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 nexus-glass rounded-lg border-sky-500/40 text-[10px] font-bold text-sky-400 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"
                >
                  {files[i].type.startsWith("image/") ? (
                    <ImageIcon className="w-3 h-3" />
                  ) : (
                    <FileText className="w-3 h-3" />
                  )}
                  {files[i].name}
                </div>
              ))}
            </div>
          )}

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>

            <div className="relative flex items-center gap-2 nexus-glass p-2 rounded-xl border-white/20">
              <label
                htmlFor="file-upload"
                className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-sky-400 rounded-lg transition-all cursor-pointer border border-white/5"
              >
                <Paperclip className="w-5 h-5" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files) {
                      setFiles(event.target.files);
                    }
                  }}
                  multiple
                  ref={fileInputRef}
                />
              </label>

              <input
                className="flex-1 bg-transparent px-2 py-3 outline-none text-slate-200 placeholder-slate-500 text-sm md:text-base"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Submit multi-spectral payload..."
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
                  disabled={status !== "ready"}
                  className="p-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all border border-sky-500/30 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
            Nexus Universal Interface v9.1 • Secure Hybrid Stream
          </p>
        </div>
      </div>
    </div>
  );
}
