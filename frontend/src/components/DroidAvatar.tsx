"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DroidAvatarProps {
  state: "idle" | "listening" | "speaking" | "thinking";
  volume?: number;
}

export default function DroidAvatar({ state, volume = 0 }: DroidAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // --- COOL FACTOR: Natural Blinking Logic ---
  useEffect(() => {
    const blinkLogic = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Duration of the blink
      
      // Randomly wait 2-6 seconds for the next blink
      const nextBlink = Math.random() * 4000 + 2000;
      setTimeout(blinkLogic, nextBlink);
    };

    const timer = setTimeout(blinkLogic, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Set colors based on the current state
  const colors = {
    listening: "#00f5d4", // Neon Cyan
    speaking: "#00f5d4",
    thinking: "#a855f7", // Purple
    idle: "#334155",     // Slate Gray
  };

  const activeColor = colors[state] || colors.idle;
  const isLive = state !== "idle";

  return (
    <div className="relative flex items-center justify-center">
      
      {/* 1. NEURAL GLOW: Expands and pulses based on your voice volume */}
      <motion.div
        className="absolute rounded-full blur-[80px]"
        animate={{
          width: isLive ? 280 + (volume * 1.5) : 200,
          height: isLive ? 180 + volume : 120,
          backgroundColor: activeColor,
          opacity: isLive ? [0.15, 0.35, 0.15] : 0.05,
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 2. THE EYES CONTAINER */}
      <div className="relative flex gap-16">
        {[0, 1].map((index) => (
          <div key={index} className="relative">
            
            {/* Background "Socket" Shadow */}
            <div className="absolute inset-0 bg-black/40 blur-xl rounded-full scale-125" />

            <motion.svg 
              width="130" 
              height="90" 
              viewBox="0 0 120 80"
              className="relative z-10"
            >
              {/* Eye Outer Ring (Fixed) */}
              <ellipse 
                cx="60" cy="40" rx="55" ry="38" 
                fill="none" 
                stroke={activeColor} 
                strokeWidth="0.5" 
                opacity="0.2" 
              />

              {/* MAIN EYE: This blinks and reacts to volume */}
              <motion.ellipse
                cx="60" cy="40" rx="50" ry="35"
                fill={activeColor}
                animate={{
                  // Scaling height for blinks or volume reactions
                  scaleY: isBlinking ? 0.05 : 1 + (volume / 250),
                  // Subtle "Glitch" vibration on the X-axis when live
                  x: isLive ? [0, -0.5, 0.5, 0] : 0,
                  filter: `drop-shadow(0 0 ${isLive ? 15 + (volume / 4) : 5}px ${activeColor})`,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25,
                  x: { duration: 0.1, repeat: isLive ? Infinity : 0 }
                }}
              />

              {/* Internal Pupil Detail (Cyber Style) */}
              <motion.rect
                x="30" y="38" width="60" height="4"
                fill="rgba(0,0,0,0.3)"
                animate={{ opacity: isBlinking ? 0 : 1 }}
              />
            </motion.svg>
          </div>
        ))}
      </div>

      {/* 3. CENTER STATUS LIGHT (Subtle detail) */}
      <motion.div 
        className="absolute -bottom-24 w-1 h-1 rounded-full"
        animate={{
          boxShadow: `0 0 20px 2px ${activeColor}`,
          opacity: isLive ? [0.2, 1, 0.2] : 0
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}