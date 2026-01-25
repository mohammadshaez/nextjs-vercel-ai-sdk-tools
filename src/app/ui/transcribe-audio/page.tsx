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
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto px-4">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Neural Voice Transcriber</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Record up to 10 seconds of audio for instant transcription.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          {error}
        </div>
      )}

      {transcript && !isLoading && (
        <div className="mb-8 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Transcript
          </h3>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900">
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {transcript.text}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
            {transcript.language && (
              <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 uppercase tracking-wider">
                Lang: {transcript.language}
              </div>
            )}
            {transcript.durationInSeconds && (
              <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 uppercase tracking-wider">
                Length: {transcript.durationInSeconds.toFixed(1)}s
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recording Interface */}
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 transition-all">
        {!selectedFile && !isRecording ? (
          <button
            onClick={startRecording}
            className="group relative flex flex-col items-center justify-center gap-4 focus:outline-none"
          >
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
              Click to Start Recording
            </span>
          </button>
        ) : isRecording ? (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
              <button
                onClick={stopRecording}
                className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 hover:scale-105 transition-transform"
              >
                <Square className="w-8 h-8 text-white fill-current" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold tracking-wide uppercase text-red-500">
                  Recording... {recordingSeconds}s / {MAX_RECORDING_SECONDS}s
                </span>
              </div>
              <div className="w-48 h-1.5 bg-red-500/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(recordingSeconds / MAX_RECORDING_SECONDS) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full max-w-sm flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Play className="w-5 h-5 text-blue-500 fill-current" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Recording Ready</div>
                <div className="text-xs text-slate-500">
                  {recordingSeconds.toFixed(1)}s recorded
                </div>
                {audioUrl && (
                  <audio src={audioUrl} controls className="mt-2 h-8 w-full" />
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handleRecordNew}
                  title="Record New"
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-slate-400 hover:text-blue-500 transition-colors"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={resetAudio}
                  title="Delete"
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold tracking-wide uppercase shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  "Init Transcription"
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-slate-500">
        Nexus Audio Module v1.0.4 • Stream encrypted
      </div>
    </div>
  );
}
