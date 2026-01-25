"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  MessageSquare,
  Zap,
  ImageIcon,
  Mic,
  Layers,
  Cpu,
  LayoutGrid,
  Database,
  Wrench,
  FileAudio,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const features = [
  { name: "Home", href: "/", icon: Home },
  { name: "Intelligent Chat", href: "/ui/chat", icon: MessageSquare },
  { name: "Smart Completion", href: "/ui/completion", icon: Zap },
  { name: "Visual Synthesis", href: "/ui/generate-image", icon: ImageIcon },
  { name: "Voice Integration", href: "/ui/generate-speech", icon: Mic },
  { name: "Multi-Modal Logic", href: "/ui/multi-modal-chat", icon: Layers },
  { name: "Data Streaming", href: "/ui/stream", icon: Cpu },
  { name: "Structured Arrays", href: "/ui/structured-array", icon: LayoutGrid },
  { name: "Structured Data", href: "/ui/structured-data", icon: Database },
  { name: "Tool Augmentation", href: "/ui/tools", icon: Wrench },
  { name: "Audio Processing", href: "/ui/transcribe-audio", icon: FileAudio },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Ecosystem
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 bg-zinc-900 border-r border-zinc-800 transition-all duration-300
          ${sidebarCollapsed ? "w-20" : "w-64"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
            {!sidebarCollapsed && (
              <Link href="/" className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Ecosystem
                </span>
              </Link>
            )}
            {sidebarCollapsed && (
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mx-auto">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-300 ${
                  sidebarCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
            {features.map((feature) => {
              const isActive = pathname === feature.href;
              const Icon = feature.icon;

              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }
                  `}
                  title={sidebarCollapsed ? feature.name : ""}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? "mx-auto" : ""}`}
                  />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium truncate">
                      {feature.name}
                    </span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-zinc-800">
              <div className="text-xs text-zinc-500 text-center">
                Powered by Vercel AI SDK
              </div>
            </div>
          )}
        </div>
      </aside>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
