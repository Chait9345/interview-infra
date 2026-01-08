"use client";

import { useEffect, useRef, useState } from "react";

interface SiriWaveProps {
  status: "idle" | "listening" | "speaking" | "thinking";
}

export default function SiriWave({ status }: SiriWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isMounted, setIsMounted] = useState(false);
  
  // Use a ref to track status so we don't restart the animation loop on prop change
  const statusRef = useRef(status);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update the ref whenever the prop changes
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    let time = 0;
    const waves = [
      { amplitude: 0, frequency: 0.008, phase: 0, speed: 0.05 },
      { amplitude: 0, frequency: 0.012, phase: Math.PI / 3, speed: 0.035 },
      { amplitude: 0, frequency: 0.006, phase: (Math.PI * 2) / 3, speed: 0.02 },
    ];

    const resizeCanvas = () => {
      if (!canvas) return;
      const width = canvas.offsetWidth || window.innerWidth;
      const height = canvas.offsetHeight || 128;

      if (width === 0 || height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    // Initial Resize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      if (!canvas) return;

      const width = canvas.offsetWidth || window.innerWidth;
      const height = canvas.offsetHeight || 128;

      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Determine target amplitude based on current status ref
      const currentStatus = statusRef.current;
      const targetAmplitude =
        currentStatus === "listening" ? 60 : currentStatus === "speaking" ? 45 : 10;
      
      // Smoothly interpolate amplitude
      waves.forEach((wave) => {
        wave.amplitude += (targetAmplitude - wave.amplitude) * 0.1;
      });

      waves.forEach((wave, waveIndex) => {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const centerY = height / 2;
        
        // Start the path
        ctx.moveTo(0, centerY);

        for (let x = 0; x <= width; x += 3) { // Optimization: step by 3px instead of 2
          // 1. Calculate base Sine Wave
          const sineValue = Math.sin(x * wave.frequency + time * wave.speed + wave.phase);
          
          // 2. Calculate Attenuation (Parabolic curve)
          // This forces the wave to 0 at the edges (x=0 and x=width) and 1 in the center
          const normX = x / width; // 0 to 1
          const attenuation = 4 * normX * (1 - normX); // Parabolic formula: 4x(1-x)
          // Use Math.pow for steeper falloff if desired: Math.pow(4 * normX * (1 - normX), 2)

          const y = centerY + sineValue * wave.amplitude * attenuation;
          
          ctx.lineTo(x, y);
        }

        // Gradient Stroke
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(0, 245, 212, ${0.1})`); // Fade out start
        gradient.addColorStop(0.2, `rgba(0, 245, 212, ${0.8 - waveIndex * 0.2})`);
        gradient.addColorStop(0.5, `rgba(123, 44, 191, ${0.6 - waveIndex * 0.15})`);
        gradient.addColorStop(0.8, `rgba(0, 245, 212, ${0.8 - waveIndex * 0.2})`);
        gradient.addColorStop(1, `rgba(0, 245, 212, ${0.1})`); // Fade out end
        
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // Optional: Add a subtle glow
        if (currentStatus !== "idle") {
           ctx.shadowBlur = 10;
           ctx.shadowColor = `rgba(0, 245, 212, ${0.3})`;
           ctx.stroke();
           ctx.shadowBlur = 0;
        }
      });

      time += 0.15; // Animation speed
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMounted]); // Dependency array empty ensures loop runs once and persists

  if (!isMounted) return <div className="h-32 w-full" />;

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 right-0 h-32 w-full pointer-events-none"
      style={{
        mixBlendMode: "screen",
        opacity: status === "idle" ? 0.4 : 1,
        transition: "opacity 0.5s ease-in-out"
      }}
    />
  );
}