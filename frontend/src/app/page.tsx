"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DroidAvatar from "@/components/DroidAvatar";
import CameraFeed from "@/components/CameraFeed";
import AudioVisualizer from "@/components/AudioVisualizer";
import TranscriptConsole from "@/components/TranscriptConsole";
import VoiceWaveform from "@/components/VoiceWaveform";
import CyberTimer from "@/components/CyberTimer";
import NeuralBackground from "@/components/NeuralBackground";
import { useMicrophone } from "../hooks/mic-logic";

export default function Home() {
  const [aiMode, setAiMode] = useState<"idle" | "listening" | "speaking" | "thinking">("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [thinkingProgress, setThinkingProgress] = useState(0);

  // Connect to our newly named mic logic file
  const { volume, error: micError } = useMicrophone(isRunning && aiMode === "listening");

  // Logic to simulate AI "Thinking" state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiMode === "thinking") {
      setThinkingProgress(0);
      interval = setInterval(() => {
        setThinkingProgress((prev) => {
          if (prev >= 100) {
            setAiMode("speaking");
            return 100;
          }
          return prev + 2;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [aiMode]);

  const toggleAI = () => {
    if (isRunning) {
      setIsRunning(false);
      setAiMode("idle");
      setTranscript([]);
    } else {
      setIsRunning(true);
      setAiMode("listening");
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#020617] text-[#00f5d4] font-mono relative p-6 select-none">
      {/* LAYER 0: Interactive Neural Background */}
      <NeuralBackground />
      
      {/* LAYER 1: Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none z-0" />
      
      <div className="relative z-10 h-full grid grid-cols-[400px_1fr] gap-6">
        
        {/* LEFT SIDEBAR: BIOMETRICS & CAMERA */}
        <aside className="flex flex-col gap-4">
          {/* Module: Video Feed */}
          <div className="bg-black/60 border border-[#00f5d4]/30 p-1 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,245,212,0.1)]">
            <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden relative border border-white/5">
              <CameraFeed />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]" />
                <span className="text-[9px] text-white/70 tracking-[0.2em] font-bold">LIVE_FEED_01</span>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center text-[10px]">
              <span className="opacity-40 uppercase">Encrypted</span>
              <span className="text-cyan-400 font-bold tracking-widest">AES-256-BIT</span>
            </div>
          </div>

          {/* Module: Voice Analysis */}
          <div className="flex-1 bg-black/60 border border-[#00f5d4]/20 rounded-xl p-6 flex flex-col backdrop-blur-md">
            <h3 className="text-[10px] tracking-[0.4em] opacity-40 mb-10 font-black uppercase">Vocal_Analysis</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <AudioVisualizer isActive={isRunning && aiMode === "listening"} volume={volume} />
            </div>

            <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
               <div className="flex justify-between text-[10px] font-bold">
                  <span className="opacity-40">INPUT_GAIN</span>
                  <span className="text-cyan-400">{Math.round(volume)}%</span>
               </div>
               <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#00f5d4]" 
                    animate={{ width: `${Math.min(volume, 100)}%` }} 
                  />
               </div>
            </div>
          </div>
        </aside>

        {/* CENTER STAGE: AI INTERVIEWER */}
        <section className="border border-[#00f5d4]/20 rounded-3xl bg-black/40 backdrop-blur-xl flex flex-col relative overflow-hidden">
          {/* Visual Scanline */}
          <div className="scanline pointer-events-none" />
          
          {/* Header UI: Transcript & Timer */}
          <div className="absolute top-8 left-10 right-10 flex justify-between items-start z-30">
            <div className="max-w-[65%]">
              <TranscriptConsole transcript={transcript} isActive={aiMode === "listening"} />
            </div>
            <CyberTimer isRunning={isRunning} />
          </div>

          {/* Center: Droid Avatar */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <DroidAvatar state={aiMode} volume={volume} />
            
            {/* Thinking Progress Bar */}
            <AnimatePresence>
              {aiMode === "thinking" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-24 flex flex-col items-center gap-2"
                >
                  <span className="text-[9px] tracking-[0.6em] text-purple-400 animate-pulse font-bold">NEURAL_PROCESSING...</span>
                  <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${thinkingProgress}%` }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer UI: Waveform & Technical Metadata */}
          <div className="h-40 flex flex-col items-center justify-center relative">
             <VoiceWaveform volume={volume} isActive={isRunning && aiMode === "listening"} />
             <div className="absolute bottom-6 w-full px-12 flex justify-between items-center text-[8px] tracking-[0.5em] font-bold opacity-20">
                <span>INTEL_PROC_V.9</span>
                <div className="flex gap-8">
                  <span>SSL_SECURE</span>
                  <span>LATENCY: 12ms</span>
                </div>
             </div>
          </div>
        </section>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={toggleAI}
          className={`group px-20 py-5 rounded-full font-black tracking-[0.8em] transition-all duration-500 border-2 ${
            isRunning 
            ? "bg-red-500/10 text-red-500 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]" 
            : "bg-[#00f5d4]/10 text-[#00f5d4] border-[#00f5d4] shadow-[0_0_40px_rgba(0,245,212,0.2)]"
          } hover:scale-105 active:scale-95`}
        >
          <span className="relative z-10">{isRunning ? "TERMINATE" : "INITIALIZE"}</span>
        </button>
      </div>
    </main>
  );
}