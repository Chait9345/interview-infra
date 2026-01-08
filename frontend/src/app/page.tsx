"use client";

import { useState, useEffect } from "react";
import DroidAvatar from "@/components/DroidAvatar";
import SiriWave from "@/components/SiriWave";
import CameraFeed from "@/components/CameraFeed";

type AIMode = "idle" | "listening" | "speaking" | "thinking";

export default function Home() {
  const [aiMode, setAiMode] = useState<AIMode>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [latency, setLatency] = useState<number>(0);
  const [connection, setConnection] = useState<"ONLINE" | "OFFLINE">("OFFLINE");

  // Simulate latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setLatency(Math.floor(Math.random() * 50) + 10);
        setConnection("ONLINE");
      } else {
        setLatency(0);
        setConnection("OFFLINE");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleAI = () => {
    if (!isRunning) {
      setIsRunning(true);
      setAiMode("listening");
    } else {
      setIsRunning(false);
      setAiMode("idle");
    }
  };

  // Auto-cycle states for demo
  useEffect(() => {
    if (!isRunning) return;
    const cycle = setInterval(() => {
      setAiMode((prev) => {
        if (prev === "listening") return "thinking";
        if (prev === "thinking") return "speaking";
        if (prev === "speaking") return "listening";
        return "idle";
      });
    }, 3000);
    return () => clearInterval(cycle);
  }, [isRunning]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#050505] text-[#00f0ff] font-mono relative">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />

      {/* Main Layout Grid */}
      <div className="relative z-10 h-full grid grid-cols-[350px_1fr] gap-6 p-6">
        
        {/* --- LEFT SIDEBAR (USER CONSOLE) --- */}
        <div className="flex flex-col gap-4 h-full">
          
          {/* 1. Camera Feed Widget (Reduced Size) */}
          <div className="relative bg-black/40 border border-[#00f0ff]/30 p-1 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.1)] backdrop-blur-sm overflow-hidden group">
            {/* Header Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50" />
            
            <div className="aspect-video w-full rounded border border-[#00f0ff]/10 relative overflow-hidden bg-black">
              <CameraFeed />
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]/50" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff]/50" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff]/50" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]/50" />
            </div>

            <div className="mt-2 flex justify-between items-center px-2 text-[10px] opacity-70">
              <span>SOURCE: USER_FEED_01</span>
              <span className={connection === "ONLINE" ? "text-green-400" : "text-red-400"}>
                ● {connection}
              </span>
            </div>
          </div>

          {/* 2. Audio Analysis Widget (Decorative) */}
          <div className="flex-1 bg-black/40 border border-[#00f0ff]/20 rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden">
             <div className="text-xs tracking-widest opacity-60 mb-2">AUDIO SPECTRUM ANALYSIS</div>
             {/* Fake Bars Animation */}
             <div className="flex items-end justify-between h-32 gap-1 opacity-80">
                {[...Array(12)].map((_, i) => (
                   <div 
                     key={i} 
                     className="w-full bg-[#00f0ff]/20 animate-pulse rounded-t-sm"
                     style={{ 
                       height: `${Math.random() * 80 + 20}%`,
                       animationDuration: `${Math.random() * 1 + 0.5}s`
                     }} 
                   />
                ))}
             </div>
             
             {/* System Text Block */}
             <div className="mt-auto space-y-1 text-[10px] text-[#00f0ff]/50 font-mono leading-tight">
                <p>{`> SYSTEM_CHECK: COMPLETED`}</p>
                <p>{`> ENCRYPTION: AES-256`}</p>
                <p>{`> PACKET_LOSS: 0.00%`}</p>
                <p className="animate-pulse">{`> AWAITING_INPUT...`}</p>
             </div>
          </div>

        </div>

        {/* --- RIGHT MAIN STAGE (AI AVATAR) --- */}
        <div className="relative flex flex-col border border-[#00f0ff]/10 rounded-2xl bg-[#00f0ff]/5 backdrop-blur-sm overflow-hidden">
          {/* Decorative Top Bar */}
          <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#00f0ff]/10 to-transparent flex items-center justify-between px-6 border-b border-[#00f0ff]/10">
             <span className="text-xs tracking-[0.2em] opacity-50">INTERVIEW_CORE_V2.1</span>
             <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00f0ff]/30" />
                <div className="w-2 h-2 rounded-full bg-[#00f0ff]/30" />
                <div className="w-2 h-2 rounded-full bg-[#00f0ff]" />
             </div>
          </div>

          {/* Avatar Center */}
          <div className="flex-1 flex items-center justify-center relative">
             {/* Glowing Orbit Effect behind avatar */}
             <div className="absolute w-[500px] h-[500px] bg-[#00f0ff]/5 rounded-full blur-3xl animate-pulse" />
             <DroidAvatar state={aiMode} />
          </div>

          {/* Waveform Bottom */}
          <div className="h-48 w-full relative">
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10" />
             <SiriWave status={aiMode} />
          </div>

        </div>

      </div>

      {/* --- FOOTER CONTROLS --- */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-black/80 backdrop-blur-md border border-[#00f0ff]/30 px-8 py-3 rounded-full shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-4 text-xs">
           <div className="flex flex-col items-end">
              <span className="opacity-50 text-[10px]">STATUS</span>
              <span className={isRunning ? "text-green-400" : "text-gray-500"}>{aiMode.toUpperCase()}</span>
           </div>
           <div className="h-6 w-[1px] bg-[#00f0ff]/30" />
           <div className="flex flex-col">
              <span className="opacity-50 text-[10px]">LATENCY</span>
              <span>{latency}ms</span>
           </div>
        </div>

        <button
          onClick={toggleAI}
          className={`
            px-8 py-2 rounded-full font-bold tracking-wider transition-all duration-300
            ${isRunning 
               ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30" 
               : "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 hover:bg-[#00f0ff]/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            }
          `}
        >
          {isRunning ? "TERMINATE" : "INITIALIZE"}
        </button>
      </footer>

    </main>
  );
}