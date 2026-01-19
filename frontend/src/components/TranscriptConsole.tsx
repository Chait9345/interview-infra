"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface TranscriptConsoleProps {
  transcript: string[];
  isActive: boolean;
}

export default function TranscriptConsole({ transcript, isActive }: TranscriptConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom as new words appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="w-full h-32 bg-black/20 border-t border-b border-[#00f0ff]/10 overflow-hidden relative">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
      
      <div 
        ref={scrollRef}
        className="h-full overflow-y-auto p-4 flex flex-col gap-2 no-scrollbar"
      >
        {!isActive && transcript.length === 0 ? (
          <div className="text-[#00f0ff]/20 text-[10px] italic flex items-center gap-2">
            <span className="w-1 h-1 bg-[#00f0ff]/20 rounded-full animate-ping" />
            AWAITING_VOICE_CAPTURE...
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <AnimatePresence mode="popLayout">
              {transcript.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, y: 5, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  className={`text-xs font-mono tracking-tight ${
                    i === transcript.length - 1 
                      ? "text-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" 
                      : "text-[#00f0ff]/50"
                  }`}
                >
                  {word.toUpperCase()}
                </motion.span>
              ))}
            </AnimatePresence>
            {isActive && (
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-[#00f0ff] inline-block ml-1"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}