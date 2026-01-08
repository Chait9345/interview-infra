"use client";

import { motion } from "framer-motion";

type InterviewState = "idle" | "listening" | "processing" | "speaking";

interface AvatarProps {
  state: InterviewState;
  caption?: string;
}

const statePalette: Record<
  InterviewState,
  { primary: string; secondary: string; glow: string }
> = {
  idle: {
    primary: "#5f6f92",
    secondary: "#7b8ba8",
    glow: "rgba(127, 146, 181, 0.4)",
  },
  listening: {
    primary: "#00f5d4", // cyan
    secondary: "#5af9e3",
    glow: "rgba(0, 245, 212, 0.5)",
  },
  processing: {
    primary: "#7b2cbf", // violet
    secondary: "#a76fe0",
    glow: "rgba(123, 44, 191, 0.55)",
  },
  speaking: {
    primary: "#0bd687", // emerald
    secondary: "#42e7aa",
    glow: "rgba(11, 214, 135, 0.55)",
  },
};

const orbitParticles = Array.from({ length: 16 }, (_, i) => i);
const dashedRings = [
  { size: 360, duration: 12, opacity: 0.7, rotateX: 12, rotateY: 8 },
  { size: 420, duration: 16, opacity: 0.5, rotateX: -18, rotateY: 4 },
  { size: 480, duration: 20, opacity: 0.4, rotateX: 22, rotateY: -12 },
];

export default function Avatar({ state, caption }: AvatarProps) {
  const colors = statePalette[state];

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Massive bloom behind the avatar */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          filter: "blur(90px)",
          background: `radial-gradient(circle at 50% 50%, ${colors.glow}, transparent 60%)`,
          width: 720,
          height: 720,
        }}
      />

      {/* Core container */}
      <div className="relative flex items-center justify-center">
        {/* Gyroscopic rings */}
        {dashedRings.map((ring, idx) => (
          <motion.div
            key={`ring-${idx}`}
            className="absolute rounded-full border border-dashed"
            style={{
              width: ring.size,
              height: ring.size,
              borderColor: colors.primary,
              opacity: ring.opacity,
              filter: "drop-shadow(0 0 12px rgba(0,0,0,0.4))",
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateZ: 360,
              rotateX: ring.rotateX,
              rotateY: ring.rotateY,
            }}
            transition={{
              duration: state === "speaking" ? 0.5 : ring.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Orbiting particles */}
        {orbitParticles.map((i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              background: colors.secondary,
              boxShadow: `0 0 18px ${colors.glow}`,
            }}
            animate={{
              rotateZ: 360,
              x: Math.cos((i / orbitParticles.length) * Math.PI * 2) * 200,
              y: Math.sin((i / orbitParticles.length) * Math.PI * 2) * 200,
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 14 + (i % 5),
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Core sphere */}
        <motion.div
          className="hyper-glass relative rounded-full"
          style={{
            width: 260,
            height: 260,
            background: `radial-gradient(circle at 35% 30%, ${colors.secondary}45, transparent 65%),
                        radial-gradient(circle at 70% 70%, ${colors.primary}40, transparent 55%),
                        radial-gradient(circle at 50% 50%, ${colors.primary}35, ${colors.primary}05)`,
            boxShadow: `0 0 120px ${colors.glow}, inset 0 0 80px ${colors.primary}20`,
            border: `1px solid ${colors.primary}55`,
            overflow: "hidden",
          }}
          animate={{
            scale:
              state === "speaking"
                ? [1, 1.08, 1]
                : state === "listening"
                  ? [1, 1.03, 1]
                  : [1, 1.1, 1],
          }}
          transition={{
            duration: state === "speaking" ? 0.5 : state === "idle" ? 2 : 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Audio reactive pulse */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${colors.primary}35, transparent 60%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: state === "speaking" ? 0.5 : 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner geometric layers */}
          <motion.div
            className="absolute inset-10 rounded-full border border-solid"
            style={{
              borderColor: `${colors.secondary}80`,
              boxShadow: `0 0 20px ${colors.glow}`,
            }}
            animate={{ rotateZ: state === "speaking" ? -720 : -360 }}
            transition={{ duration: state === "speaking" ? 0.5 : 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-dashed"
            style={{
              borderColor: `${colors.primary}aa`,
              boxShadow: `0 0 30px ${colors.glow}`,
            }}
            animate={{ rotateZ: state === "speaking" ? 720 : 360 }}
            transition={{ duration: state === "speaking" ? 0.5 : 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Core nucleus */}
          <motion.div
            layoutId="core-shockwave"
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, #ffffff, ${colors.secondary})`,
              boxShadow: `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}`,
            }}
            animate={{
              scale: state === "speaking" ? [1, 1.25, 0.95, 1.15, 1] : [1, 1.12, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: state === "speaking" ? 0.6 : 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Caption */}
      {state === "speaking" && caption && (
        <motion.div
          className="hyper-glass mt-8 max-w-2xl rounded-xl px-6 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
        >
          <p
            className="text-center text-base leading-relaxed text-white text-glow"
            style={{ fontFamily: '"Inter", var(--font-geist-sans), sans-serif' }}
          >
            {caption}
          </p>
        </motion.div>
      )}
    </div>
  );
}
