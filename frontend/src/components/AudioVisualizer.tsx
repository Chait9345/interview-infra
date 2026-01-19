"use client";
import { motion } from "framer-motion";

interface AudioVisualizerProps {
  isActive: boolean;
  volume: number;
}

export default function AudioVisualizer({ isActive, volume }: AudioVisualizerProps) {
  const bars = Array.from({ length: 24 });

  return (
    <div className="flex items-end justify-center gap-1.5 h-20 px-2">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-full"
          animate={{
            // Mixes real volume with a tiny bit of random jitter for a "natural" feel
            height: isActive ? `${Math.max(8, (volume * 1.2) + (Math.random() * 15))}%` : "6px",
            backgroundColor: !isActive ? "#1e293b" : volume > 80 ? "#f43f5e" : "#06b6d4",
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}