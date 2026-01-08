"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type DroidState = "idle" | "listening" | "speaking" | "thinking";

interface DroidAvatarProps {
  state: DroidState;
}

export default function DroidAvatar({ state }: DroidAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Random blinking for idle state
  useEffect(() => {
    if (state !== "idle") {
      setIsBlinking(false);
      return;
    }

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 2000 + Math.random() * 3000); // Random blink every 2-5 seconds

    return () => clearInterval(blinkInterval);
  }, [state]);

  // Eye color and glow based on state
  const getEyeStyle = () => {
    switch (state) {
      case "listening":
        return {
          fill: "#00f5d4",
          glow: "rgba(0, 245, 212, 0.8)",
          filter: "drop-shadow(0 0 20px rgba(0, 245, 212, 0.9))",
        };
      case "speaking":
        return {
          fill: "#00f5d4",
          glow: "rgba(0, 245, 212, 1)",
          filter: "drop-shadow(0 0 25px rgba(0, 245, 212, 1))",
        };
      case "thinking":
        return {
          fill: "#7b2cbf",
          glow: "rgba(123, 44, 191, 0.8)",
          filter: "drop-shadow(0 0 20px rgba(123, 44, 191, 0.9))",
        };
      default: // idle
        return {
          fill: "#7b8ba8",
          glow: "rgba(127, 146, 181, 0.6)",
          filter: "drop-shadow(0 0 15px rgba(127, 146, 181, 0.7))",
        };
    }
  };

  const eyeStyle = getEyeStyle();

  // Eye animations based on state
  const getEyeAnimation = () => {
    switch (state) {
      case "listening":
        return {
          scale: 1.2,
          transition: { duration: 0.3, ease: [0.42, 0, 1, 1] as const },
        };
      case "speaking":
        return {
          x: [0, -2, 2, -1, 1, 0],
          y: [0, -1, 1, -1, 1, 0],
          scale: [1, 1.05, 1, 1.05, 1],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1] as const,
          },
        };
      case "thinking":
        return {
          scaleY: 0.3,
          scaleX: 1.1,
          transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] as const },
        };
      default: // idle
        return {
          scaleY: isBlinking ? 0.1 : 1,
          transition: { duration: 0.15, ease: [0.42, 0, 0.58, 1] as const },
        };
    }
  };

  // Brightness modulation for speaking
  const getBrightnessAnimation = () => {
    if (state === "speaking") {
      return {
        opacity: [0.8, 1, 0.9, 1, 0.8],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };
    }
    return { opacity: 1 };
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Ambient glow behind eyes */}
      <motion.div
        className="absolute"
        style={{
          width: 400,
          height: 200,
          background: `radial-gradient(ellipse at center, ${eyeStyle.glow}, transparent 70%)`,
          filter: "blur(40px)",
          opacity: state === "idle" ? 0.3 : 0.6,
        }}
        animate={{
          opacity: state === "idle" ? 0.3 : state === "speaking" ? [0.6, 0.9, 0.6] : 0.6,
        }}
        transition={{ duration: 1, repeat: state === "speaking" ? Infinity : 0 }}
      />

      {/* Two Glowing Digital Eyes */}
      <div className="relative flex items-center justify-center gap-16">
        {/* Left Eye */}
        <motion.svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          className="relative"
          animate={getEyeAnimation()}
        >
          <defs>
            <radialGradient id="leftEyeGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor={eyeStyle.fill} stopOpacity="1" />
              <stop offset="70%" stopColor={eyeStyle.fill} stopOpacity="0.8" />
              <stop offset="100%" stopColor={eyeStyle.fill} stopOpacity="0.3" />
            </radialGradient>
            <filter id="leftEyeGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.ellipse
            cx="60"
            cy="40"
            rx="50"
            ry="35"
            fill="url(#leftEyeGradient)"
            filter={eyeStyle.filter}
            style={{ filter: eyeStyle.filter }}
            animate={getBrightnessAnimation()}
          />
          {/* Inner highlight */}
          <motion.ellipse
            cx="45"
            cy="30"
            rx="15"
            ry="12"
            fill="rgba(255, 255, 255, 0.6)"
            animate={{
              opacity: state === "speaking" ? [0.6, 1, 0.6] : 0.6,
            }}
            transition={{ duration: 0.5, repeat: state === "speaking" ? Infinity : 0 }}
          />
        </motion.svg>

        {/* Right Eye */}
        <motion.svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          className="relative"
          animate={getEyeAnimation()}
        >
          <defs>
            <radialGradient id="rightEyeGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor={eyeStyle.fill} stopOpacity="1" />
              <stop offset="70%" stopColor={eyeStyle.fill} stopOpacity="0.8" />
              <stop offset="100%" stopColor={eyeStyle.fill} stopOpacity="0.3" />
            </radialGradient>
            <filter id="rightEyeGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.ellipse
            cx="60"
            cy="40"
            rx="50"
            ry="35"
            fill="url(#rightEyeGradient)"
            filter={eyeStyle.filter}
            style={{ filter: eyeStyle.filter }}
            animate={getBrightnessAnimation()}
          />
          {/* Inner highlight */}
          <motion.ellipse
            cx="45"
            cy="30"
            rx="15"
            ry="12"
            fill="rgba(255, 255, 255, 0.6)"
            animate={{
              opacity: state === "speaking" ? [0.6, 1, 0.6] : 0.6,
            }}
            transition={{ duration: 0.5, repeat: state === "speaking" ? Infinity : 0 }}
          />
        </motion.svg>
      </div>

      {/* Subtle connecting line between eyes (optional tech detail) */}
      <motion.div
        className="absolute top-1/2 h-0.5 w-32 -translate-y-1/2"
        style={{
          background: `linear-gradient(90deg, transparent, ${eyeStyle.fill}40, transparent)`,
        }}
        animate={{
          opacity: state === "idle" ? 0.2 : 0.4,
        }}
      />
    </div>
  );
}
