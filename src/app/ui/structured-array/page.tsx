"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonUISchema } from "@/app/api/structured-array/schema";
import { useState } from "react";
import {
  Layers,
  Sparkles,
  Loader2,
  Send,
  StopCircle,
  Zap,
  ShieldCheck,
  Flame,
} from "lucide-react";

export default function StructuredArrayPage() {
  const [type, setType] = useState("");
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/structured-array",
    schema: pokemonUISchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim()) return;
    submit({ type });
    setType("");
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
            <Layers className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus Array
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Multi-Object Neural Synthesis
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium border border-sky-500/20 bg-sky-500/5 text-sky-400">
          {isLoading ? "Batch Generation..." : "Engine Ready"}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pr-2 scrollbar-hide z-10 mb-32">
        {error && (
          <div className="w-full p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            Array Allocation Failure: {error?.message}
          </div>
        )}

        {isLoading && (!object || object.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center py-20 opacity-30 animate-pulse">
            <Zap className="w-16 h-16 mb-4 text-sky-400" />
            <p className="font-bold uppercase tracking-[0.2em] text-xs">
              Cloning Neural Objects...
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {object?.map((pokemon) => (
            <div
              key={pokemon?.name}
              className="nexus-glass p-6 rounded-2xl border-white/5 relative group hover:border-sky-500/30 transition-all overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all" />

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                  {pokemon?.name}
                </h2>
                <Flame className="w-5 h-5 text-fuchsia-500 opacity-50" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  <ShieldCheck className="w-3 h-3" />
                  Ability Matrix
                </div>
                <div className="flex flex-wrap gap-2">
                  {pokemon?.abilities?.map((ability) => (
                    <div
                      key={ability}
                      className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-sky-400 hover:border-sky-500/20 transition-all"
                    >
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && (!object || object.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
            <Layers className="w-16 h-16 mb-4" />
            <p className="font-bold uppercase tracking-[0.3em] text-[10px]">
              Awaiting Array Definition
            </p>
          </div>
        )}
      </main>

      {/* Fixed bottom input */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>

          <div className="relative flex gap-2 nexus-glass p-2 rounded-xl border-white/20">
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Designate entity type for mass neural synthesis..."
              className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-200 placeholder-slate-500 text-sm md:text-base"
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
                disabled={isLoading || !type.trim()}
                className="px-6 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all border border-sky-500/30 font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Synthesize</span>
              </button>
            )}
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
            Nexus Array Engine v2.4 • Distributed Synthesis Protocol
          </p>
        </div>
      </div>
    </div>
  );
}
