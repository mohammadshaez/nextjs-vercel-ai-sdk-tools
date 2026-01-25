"use client";

import { useState } from "react";
import { Terminal, Sparkles, Loader2, Send, Zap, Cpu } from "lucide-react";

export default function CompletionPage() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    const currentPrompt = prompt;
    setPrompt("");

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!!");
      }

      setCompletion(result?.text);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(
          error.message || "Something went wrong. Please try again later!!",
        );
      }
    } finally {
      setIsLoading(false);
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
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Header */}
      <header className="flex items-center justify-between mb-12 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus Sync
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Direct Neural Completion
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/5 text-blue-400">
          {isLoading ? "Synchronizing" : "System Ready"}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10 max-w-3xl mx-auto w-full mb-32">
        {error && (
          <div className="w-full p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            Core Synapse Failure: {error}
          </div>
        )}

        <div className="flex-1 nexus-glass rounded-2xl p-6 md:p-8 border-white/5 relative overflow-hidden group min-h-[400px]">
          <div className="absolute top-0 right-0 p-4 border-l border-b border-white/5 bg-white/5 opacity-50">
            <Terminal className="w-4 h-4 text-sky-400" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="p-2 bg-sky-500/10 rounded-lg">
                <Cpu className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                Output Stream
              </span>
            </div>

            <div className="relative">
              {isLoading ? (
                <div className="flex flex-col gap-3 animate-pulse">
                  <div className="h-4 bg-white/5 rounded-full w-full" />
                  <div className="h-4 bg-white/5 rounded-full w-[90%]" />
                  <div className="h-4 bg-white/5 rounded-full w-[95%]" />
                  <div className="h-4 bg-white/5 rounded-full w-2/3" />
                </div>
              ) : completion ? (
                <div className="text-slate-200 leading-relaxed font-mono text-sm md:text-base animate-in fade-in duration-700">
                  <p className="whitespace-pre-wrap">{completion}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <Sparkles className="w-12 h-12 mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">
                    Waiting for prompt transmission
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed bottom input */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-20 transition-all duration-300">
        <form onSubmit={complete} className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>

          <div className="relative flex gap-2 nexus-glass p-2 rounded-xl border-white/20">
            <input
              className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-200 placeholder-slate-500 text-sm md:text-base"
              placeholder="Transmit prompt to neural core..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all border border-sky-500/30 font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Sync</span>
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
            Nexus Sync Engine v5.0 • Atomic Completion Cycle
          </p>
        </div>
      </div>
    </div>
  );
}
