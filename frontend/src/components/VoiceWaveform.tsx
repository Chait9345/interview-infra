"use client";
import React, { useRef, useEffect } from "react";

export default function VoiceWaveform({ volume, isActive }: { volume: number; isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Adjust wave intensity based on real volume
      // We add a base "breathing" movement even when quiet
      const amplitude = isActive ? (volume * 0.8) + 5 : 2; 
      
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isActive ? "#00f5d4" : "#1e293b";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00f5d4";

      for (let x = 0; x < width; x++) {
        // Siri-style math: Combination of multiple sine waves
        const sin1 = Math.sin(x * 0.02 + phase);
        const sin2 = Math.sin(x * 0.01 - phase * 0.5);
        const y = centerY + (sin1 * sin2) * amplitude;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      phase += 0.15; // Speed of the wave
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [volume, isActive]);

  return <canvas ref={canvasRef} width={800} height={100} className="w-full h-24 opacity-80" />;
}