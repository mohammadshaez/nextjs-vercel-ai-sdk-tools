"use client";
import { recipeSchema } from "@/app/api/structured-data/schema";
import { experimental_useObject } from "@ai-sdk/react";
import React, { useState } from "react";
import {
  Database,
  Sparkles,
  Loader2,
  Send,
  StopCircle,
  ChefHat,
  ListChecks,
  Utensils,
} from "lucide-react";

export default function StructuredDataPage() {
  const [dishName, setDishName] = useState("");

  const { submit, object, isLoading, error, stop } = experimental_useObject({
    api: "/api/structured-data",
    schema: recipeSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;
    submit({ dish: dishName });
    setDishName("");
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Header */}
      <header className="flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus Schema
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Structured Object Materializer
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/5 text-blue-400">
          {isLoading ? "Schema Mapping..." : "Validation Active"}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pr-2 scrollbar-hide z-10 mb-32">
        {error && (
          <div className="w-full p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            Parse Failure: {error?.message}
          </div>
        )}

        {isLoading && !object?.recipe && (
          <div className="h-full flex flex-col items-center justify-center py-20 opacity-30 animate-pulse">
            <ChefHat className="w-16 h-16 mb-4 text-sky-400" />
            <p className="font-bold uppercase tracking-[0.2em] text-xs">
              Architecting Recipe Object...
            </p>
          </div>
        )}

        {object?.recipe && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-8 nexus-glass rounded-3xl border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Utensils className="w-24 h-24" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-2 text-white">
                {object.recipe.name}
              </h2>
              <div className="flex items-center gap-2 text-sky-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" />
                Neural Synthetic Recipe
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {object?.recipe?.ingredients && (
                <div className="p-6 nexus-glass rounded-2xl border-white/5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-2">
                    <ListChecks className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">
                      Molecular Ingredients
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {object.recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/5 p-3 rounded-xl flex justify-between items-center group hover:border-sky-500/30 transition-all"
                      >
                        <p className="font-bold text-slate-200">
                          {ingredient?.name}
                        </p>
                        <p className="text-[10px] font-black uppercase text-sky-400 bg-sky-500/10 px-2 py-1 rounded-md">
                          {ingredient?.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {object?.recipe?.steps && (
                <div className="p-6 nexus-glass rounded-2xl border-white/5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-2">
                    <Database className="w-4 h-4 text-fuchsia-400" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">
                      Execution Protocol
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {object.recipe.steps.map((step, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/5 p-4 rounded-xl flex gap-4 group hover:bg-white/10 transition-all"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 flex items-center justify-center text-[10px] font-black">
                          {index + 1}
                        </span>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!isLoading && !object?.recipe && (
          <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
            <Utensils className="w-16 h-16 mb-4" />
            <p className="font-bold uppercase tracking-[0.3em] text-[10px]">
              Awaiting Recipe Objective
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
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="Designate target dish for schema generation..."
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
                disabled={isLoading || !dishName.trim()}
                className="px-6 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all border border-sky-500/30 font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Assemble</span>
              </button>
            )}
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
            Nexus Schema Engine v1.0.2 • Verified Object Structure
          </p>
        </div>
      </div>
    </div>
  );
}
