"use client";

import { useState, useRef, useEffect } from "react";
import {
  Volume2,
  Sparkles,
  Loader2,
  Send,
  Play,
  Headphones,
  WavesIcon,
} from "lucide-react";

export default function GenerateSpeechPage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState(false);

  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    const textToGenerate = text;
    setText("");

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    try {
      const response = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToGenerate }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const blob = await response.blob();
      audioUrlRef.current = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrlRef.current);

      setHasAudio(true);
      audioRef.current.play();
    } catch (error) {
      console.error("Error generating audio:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setHasAudio(false);
    } finally {
      setIsLoading(false);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

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
        @keyframes sound-wave {
          0%,
          100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }
        .wave-bar {
          animation: sound-wave 1s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Header */}
      <header className="flex items-center justify-between mb-12 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Volume2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus Vocals
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Neural Speech Synthesis
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/5 text-blue-400">
          {isLoading ? "Synthesizing" : "Standby"}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 space-y-8">
        {error && (
          <div className="w-full max-w-xl p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            System Override Error: {error}
          </div>
        )}

        <div className="w-full max-w-xl aspect-video nexus-glass rounded-3xl mb-24 flex flex-col items-center justify-center relative overflow-hidden group border-white/5">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {isLoading ? (
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="flex items-center gap-1.5 h-12">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-blue-400 rounded-full wave-bar"
                    style={{ animationDelay: `${i * 0.1}s`, height: "100%" }}
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-200 uppercase tracking-tighter">
                  Encoding Neural Path
                </p>
                <p className="text-xs text-slate-500 tracking-[0.2em] font-medium">
                  Linguistic mapping in progress
                </p>
              </div>
            </div>
          ) : hasAudio ? (
            <div className="flex flex-col items-center gap-8 relative z-10">
              <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40 relative">
                <WavesIcon className="w-10 h-10 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
              </div>
              <button
                onClick={replayAudio}
                className="group flex items-center gap-3 px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold transition-all hover:bg-sky-400 hover:scale-105 shadow-xl shadow-sky-500/20"
              >
                <Play className="w-5 h-5 fill-current" />
                INITIATE PLAYBACK
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center opacity-30 group-hover:opacity-50 transition-opacity">
              <Headphones className="w-20 h-20 text-slate-400" />
              <div className="space-y-1">
                <p className="text-xl font-bold uppercase tracking-tight">
                  Audio Core Offline
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em]">
                  Awaiting linguistic payload
                </p>
              </div>
            </div>
          )}
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
              placeholder="Transmit text for vocal synthesis..."
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="px-6 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all border border-sky-500/30 font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast</span>
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
            Nexus Vocal Protocol v2.1 • Multi-Spectral Speech Core
          </p>
        </div>
      </div>
    </div>
  );
}
