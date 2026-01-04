"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MoveRight, Cpu, MessageSquare, Zap, ImageIcon, Mic, LayoutGrid, Database, Wrench, FileAudio, Layers, AlertCircle, X } from "lucide-react";

const FeatureCard = ({ title, description, icon: Icon, href, color }: any) => (
  <Link href={href}>
    <div className="group relative p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 overflow-hidden cursor-pointer h-full backdrop-blur-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-zinc-800 border border-zinc-700 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-zinc-100" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-100 mb-3 group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">{description}</p>
        <div className="flex items-center text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">
          Explore Feature
          <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
    </div>
  </Link>
);

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenUsageWarning");
    if (!hasSeenModal) {
      setShowModal(true);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem("hasSeenUsageWarning", "true");
  };

  const features = [
    {
      title: "Intelligent Chat",
      description: "Build robust AI chat interfaces with real-time streaming and message history management.",
      icon: MessageSquare,
      href: "/ui/chat",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Smart Completion",
      description: "Harness the power of text completion for predictive writing and automated content generation.",
      icon: Zap,
      href: "/ui/completion",
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Visual Synthesis",
      description: "Generate stunning imagery directly from text prompts using state-of-the-art visual models.",
      icon: ImageIcon,
      href: "/ui/generate-image",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Voice Integration",
      description: "Transform text into natural-sounding speech with ultra-low latency voice synthesis.",
      icon: Mic,
      href: "/ui/generate-speech",
      color: "from-red-500 to-rose-500"
    },
    {
      title: "Multi-Modal Logic",
      description: "Engage with models that understand both text and visual inputs simultaneously.",
      icon: Layers,
      href: "/ui/multi-modal-chat",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Data Streaming",
      description: "Implement high-performance streaming for real-time AI responses and dynamic updates.",
      icon: Cpu,
      href: "/ui/stream",
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Structured Arrays",
      description: "Generate validated array schemas for complex data extraction and list management.",
      icon: LayoutGrid,
      href: "/ui/structured-array",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Structured Typed Objects",
      description: "Receive strictly typed JSON objects from LLMs for seamless application integration.",
      icon: Database,
      href: "/ui/structured-data",
      color: "from-lime-500 to-green-600"
    },
    {
      title: "Tool Augmentation",
      description: "Empower your AI with custom tools to perform actions and fetch external data.",
      icon: Wrench,
      href: "/ui/tools",
      color: "from-sky-500 to-indigo-600"
    },
    {
      title: "Audio Processing",
      description: "Convert spoken words into accurate text with high-performance audio transcription.",
      icon: FileAudio,
      href: "/ui/transcribe-audio",
      color: "from-fuchsia-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-zinc-100 selection:text-black">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* Warning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50" />
            
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 animate-pulse">
                <AlertCircle className="w-8 h-8 text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">Premium AI Resource</h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                The features in this ecosystem balance powerful AI logic with significant computational costs. 
                <span className="text-zinc-100 font-medium"> Please use these tools wisely </span> 
                as they utilize paid API resources for every interaction.
              </p>

              <button 
                onClick={closeModal}
                className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all duration-300 shadow-lg shadow-white/5 active:scale-[0.98]"
              >
                Access Ecosystem
              </button>
            </div>

            <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl" />
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
            AI Interface Ecosystem 2.0
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Next-Gen AI <br /> Development Kit
          </h1>
          <p className="max-w-2xl text-zinc-400 text-lg sm:text-xl leading-relaxed">
            A comprehensive suite of powerful UI features powered by the Vercel AI SDK. 
            Build, scale, and deploy futuristic AI experiences with ease.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-16 border-t border-zinc-900 text-center">
          <p className="text-zinc-500 text-sm">
            Built with Vercel AI SDK & Next.js 15
          </p>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

