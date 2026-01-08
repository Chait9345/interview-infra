"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AudioVisualizerProps {
  isActive: boolean;
}

export default function AudioVisualizer({ isActive }: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array.from({ length: 32 }, () => 0));

  useEffect(() => {
    if (!isActive) {
      setBars(Array.from({ length: 32 }, () => 0));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          // Simulate random audio levels with more variation
          const base = Math.random() * 0.35 + 0.25;
          const spike = Math.random() > 0.75 ? Math.random() * 0.6 + 0.4 : 0;
          return Math.min(base + spike, 1);
        })
      );
    }, 80);

    return () => clearInterval(interval);
  }, [isActive]);

  const getBarColor = (index: number, height: number) => {
    // Create a gradient effect across bars
    const position = index / 32;
    if (position < 0.33) {
      return `linear-gradient(to top, rgb(56, 189, 248), rgb(147, 197, 253))`;
    } else if (position < 0.66) {
      return `linear-gradient(to top, rgb(168, 85, 247), rgb(196, 181, 253))`;
    } else {
      return `linear-gradient(to top, rgb(34, 197, 94), rgb(134, 239, 172))`;
    }
  };

  return (
    <div className="flex items-end justify-center gap-[3px] h-20 px-4">
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="rounded-sm"
          style={{
            width: "8px",
            minHeight: "6px",
            background: getBarColor(index, height),
            opacity: isActive ? 0.7 + height * 0.3 : 0.2,
            boxShadow: isActive && height > 0.5
              ? `0 0 ${8 + height * 8}px rgba(56, 189, 248, ${0.3 + height * 0.2})`
              : "none",
          }}
          animate={{
            height: isActive ? `${Math.max(height * 100, 8)}%` : "6px",
            opacity: isActive ? 0.7 + height * 0.3 : 0.2,
          }}
          transition={{
            duration: 0.08,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
