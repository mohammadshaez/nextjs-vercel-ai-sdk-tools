"use client";

import { useCompletion } from "@ai-sdk/react";
import {
  Activity,
  Sparkles,
  Loader2,
  Send,
  StopCircle,
  Zap,
} from "lucide-react";

export default function StreamPage() {
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    setInput,
    stop,
  } = useCompletion({
    api: "/api/stream/",
  });

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
        @keyframes stream-glow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .streaming-indicator {
          animation: stream-glow 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Header */}
      <header className="flex items-center justify-between mb-12 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus Stream
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Real-Time Pulse Stream
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/5 text-blue-400">
          {isLoading && (
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full streaming-indicator" />
          )}
          {isLoading ? "Active Data Flow" : "Connection Prime"}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10 max-w-3xl mx-auto w-full mb-32">
        {error && (
          <div className="w-full p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            Stream Interruption: {error?.message}
          </div>
        )}

        <div className="flex-1 nexus-glass rounded-2xl p-6 md:p-8 border-white/5 relative flex flex-col min-h-[400px]">
          <div className="flex items-center gap-2 mb-6 opacity-40">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">
              Neural Signal
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {isLoading && !completion ? (
              <div className="flex flex-col gap-4 items-center justify-center h-full opacity-30">
                <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Bridging Neural Gap...
                </p>
              </div>
            ) : completion ? (
              <div className="text-slate-200 leading-relaxed text-sm md:text-base selection:bg-sky-500/30">
                <p className="whitespace-pre-wrap">{completion}</p>
                {isLoading && (
                  <span className="inline-block w-1.5 h-4 bg-sky-500 ml-1 animate-pulse align-middle" />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-20">
                <Sparkles className="w-16 h-16 mb-4" />
                <p className="font-bold uppercase tracking-[0.3em] text-[10px]">
                  Awaiting Signal Transmission
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fixed bottom input */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-20 transition-all duration-300">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const currentInput = input;
            setInput("");
            handleSubmit(e);
          }}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>

          <div className="relative flex gap-2 nexus-glass p-2 rounded-xl border-white/20">
            <input
              className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-200 placeholder-slate-500 text-sm md:text-base"
              placeholder="Inject signal into the stream..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30 font-bold flex items-center gap-2"
              >
                <StopCircle className="w-4 h-4" />
                <span>Abort</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all border border-sky-500/30 font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Inject</span>
              </button>
            )}
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
            Nexus Stream Matrix v3.4 • Verified Encryption Active
          </p>
        </div>
      </div>
    </div>
  );
}
