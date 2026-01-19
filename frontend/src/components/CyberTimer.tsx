"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CyberTimer({ isRunning }: { isRunning: boolean }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0); // Reset timer when stopped
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-black/40 border border-[#00f5d4]/20 rounded-lg backdrop-blur-md">
      {/* Blinking Recording Dot */}
      {isRunning && (
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"
        />
      )}
      
      <div className="flex flex-col">
        <span className="text-[8px] tracking-[0.3em] opacity-40 uppercase">Session_Time</span>
        <span className="text-sm font-black tracking-widest text-[#00f5d4] drop-shadow-[0_0_8px_rgba(0,245,212,0.5)]">
          {isRunning ? `[ ${formatTime(seconds)} ]` : "[ 00:00:00 ]"}
        </span>
      </div>
    </div>
  );
}