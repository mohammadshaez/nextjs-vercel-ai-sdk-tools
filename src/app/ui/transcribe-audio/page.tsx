"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Loader2,
  Play,
  Trash2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

interface TranscriptResult {
  text: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  durationInSeconds?: number;
}

export default function TranscribeAudioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RECORDING_SECONDS = 10;

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });
        setSelectedFile(file);
        setAudioUrl(URL.createObjectURL(audioBlob));

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      setRecordingSeconds(0);
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setTranscript(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access denied or not available");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please record an audio first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      setTranscript(data);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetAudio = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setTranscript(null);
    setError(null);
    setRecordingSeconds(0);
  };

  const handleRecordNew = () => {
    resetAudio();
    setTimeout(() => startRecording(), 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen w-full max-w-5xl mx-auto p-4 md:p-8 relative overflow-hidden text-slate-50 font-sans">
      <style jsx global>{`
        @keyframes nexus-glow {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(14, 165, 233, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(14, 165, 233, 0.7);
          }
        }
        .nexus-glass {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .nexus-futuristic-text {
          background: linear-gradient(to right, #0ea5e9, #d946ef);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }
        .nexus-card {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .nexus-card:hover {
          border-color: rgba(14, 165, 233, 0.3);
          background: rgba(30, 41, 59, 0.6);
        }
        .waveform-bar {
          animation: waveform 1s ease-in-out infinite;
        }
        @keyframes waveform {
          0%,
          100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Header */}
      <header className="flex items-center justify-between mb-12 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Mic className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight nexus-futuristic-text">
              Nexus Voice
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Neural Audio Analysis
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/5 text-blue-400 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
          />
          {isRecording ? "Recording Active" : "Ready"}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full z-10 space-y-8">
        {error && (
          <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            System Override Error: {error}
          </div>
        )}

        {transcript && !isLoading && (
          <div className="w-full p-6 rounded-2xl nexus-glass space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-slate-200">
                  Neural Transcript
                </h3>
              </div>
              <div className="flex gap-2">
                {transcript.language && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-slate-400">
                    {transcript.language}
                  </span>
                )}
                {transcript.durationInSeconds && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-slate-400">
                    {transcript.durationInSeconds.toFixed(1)}s
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-50" />
              <p className="text-slate-300 leading-relaxed pl-4 whitespace-pre-wrap">
                {transcript.text}
              </p>
            </div>
          </div>
        )}

        {/* Interaction Hub */}
        <div className="w-full aspect-video md:aspect-[21/9] nexus-glass rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {!selectedFile && !isRecording ? (
            <button
              onClick={startRecording}
              className="relative flex flex-col items-center gap-6 group cursor-pointer transition-transform hover:scale-105"
            >
              <div
                className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative z-10 nexus-glass transition-all group-hover:border-blue-500/50"
                style={{ animation: "nexus-glow 2s infinite" }}
              >
                <Mic className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-200 uppercase tracking-tighter">
                  Initialize Link
                </p>
                <p className="text-xs text-slate-500 tracking-[0.2em] font-medium">
                  Tap to start neural capture
                </p>
              </div>
            </button>
          ) : isRecording ? (
            <div className="flex flex-col items-center gap-8 relative z-10 w-full px-12">
              <div className="flex items-end gap-1.5 h-12">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-red-600 to-red-400 rounded-full waveform-bar"
                    style={{
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center hover:bg-red-500/30 transition-all hover:scale-105"
              >
                <Square className="w-8 h-8 text-red-500 fill-current" />
              </button>

              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-red-400">
                  <span>Data Capture</span>
                  <span>
                    {recordingSeconds}s / {MAX_RECORDING_SECONDS}s
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-linear"
                    style={{
                      width: `${(recordingSeconds / MAX_RECORDING_SECONDS) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full px-8 flex flex-col items-center gap-8 z-10">
              <div className="w-full max-w-md p-4 nexus-card rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Play className="w-6 h-6 text-blue-400 fill-current" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200">
                    Recording Payload Ready
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    {recordingSeconds.toFixed(1)}s length
                  </p>
                  {audioUrl && (
                    <audio
                      src={audioUrl}
                      controls
                      className="mt-3 h-8 w-full invert opacity-60 hover:opacity-100 transition-opacity"
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRecordNew}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                  >
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={resetAudio}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-blue-500/80 hover:bg-blue-500 text-white rounded-2xl font-black tracking-widest uppercase shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Transmit to Neural Core
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto py-8 text-center z-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600 font-bold">
          Nexus OS v4.2.0 • Neural Voice Processing Unit • Secure Stream Active
        </p>
      </footer>
    </div>
  );
}
