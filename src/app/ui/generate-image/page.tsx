"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Sparkles, Loader2, Send, Download } from "lucide-react";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImageSrc(null);
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setImageSrc(`data:image/png;base64,${data}`);
      setPrompt("");
    } catch (error) {
      console.error("Error generating image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen w-full max-w-6xl mx-auto p-4 md:p-8 relative overflow-hidden text-slate-50 font-sans">
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
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(1000%);
          }
        }
        .scanline {
          width: 100%;
          height: 2px;
          background: rgba(14, 165, 233, 0.3);
          position: absolute;
          top: 0;
          left: 0;
          animation: scanline 3s linear infinite;
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Header */}
      <header className="flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20">
            <ImageIcon className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus Canvas
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Neural Image Synthesis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-xs font-medium border border-sky-500/20 bg-sky-500/5 text-sky-400">
            {isLoading ? "Synthesizing..." : "Engine Ready"}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 mb-24">
        {error && (
          <div className="w-full max-w-2xl mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            System Override Error: {error}
          </div>
        )}

        <div className="w-full max-w-2xl aspect-square relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative w-full h-full nexus-glass rounded-2xl overflow-hidden flex items-center justify-center border-white/10">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-sky-500 animate-spin" />
                  <div className="absolute inset-0 bg-sky-500 blur-xl opacity-20" />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sky-400 font-bold tracking-tighter text-lg uppercase">
                    Materializing Pixels
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Neural weights aligning...
                  </p>
                </div>
                <div className="scanline" />
              </div>
            ) : imageSrc ? (
              <div className="relative w-full h-full group/image">
                <Image
                  alt="Generated Image"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                  src={imageSrc}
                  width={1024}
                  height={1024}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover/image:translate-y-0 transition-transform duration-300">
                  <a
                    href={imageSrc}
                    download="nexus-generation.png"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 transition-all font-bold text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Archive Asset
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-40">
                <div className="p-6 bg-white/5 rounded-full inline-block">
                  <Sparkles className="w-12 h-12 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Awaiting Input</h3>
                  <p className="text-sm">Define your visual objective below</p>
                </div>
              </div>
            )}
          </div>
        </div>
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
              className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-200 placeholder-slate-500 text-sm md:text-base"
              placeholder="Describe the neural projection..."
              type="text"
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
              <span>Manifest</span>
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
            Nexus Canvas Protocol v8.4 • High-Fidelity Neural Output
          </p>
        </div>
      </div>
    </div>
  );
}
