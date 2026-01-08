"use client";

import { useEffect, useRef, useState } from "react";

export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false, // We only want video for the feed, audio is usually handled separately
      });
      
      setStream(mediaStream);
      setIsActive(true);
    } catch (err) {
      console.error("Camera Error:", err);
      setError("ACCESS_DENIED: OPTICAL SENSORS OFFLINE");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsActive(false);
    }
  };

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black/90 overflow-hidden flex flex-col items-center justify-center border-r border-[#00f0ff]/20">
      {/* Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat" />

      {/* Video Feed */}
      {isActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover opacity-80"
          style={{ filter: "contrast(1.2) brightness(1.1) saturate(1.2)" }}
        />
      ) : (
        <div className="flex flex-col items-center gap-4 z-20">
          <div className="text-[#00f0ff]/50 font-mono text-sm tracking-widest animate-pulse">
            [ SIGNAL LOST ]
          </div>
          <button
            onClick={startCamera}
            className="group relative px-6 py-3 bg-[#00f0ff]/5 border border-[#00f0ff]/30 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-[#00f0ff]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative font-mono text-[#00f0ff] tracking-wider text-sm">
              INITIALIZE OPTICAL SENSORS
            </span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 p-2 bg-red-500/10 border border-red-500/50 text-red-500 font-mono text-xs z-30">
          {error}
        </div>
      )}

      {/* HUD Elements */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
          <span className="text-[10px] font-mono text-[#00f0ff]/70 tracking-widest">
            CAM_FEED_01
          </span>
        </div>
        <div className="h-[1px] w-24 bg-[#00f0ff]/20" />
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#00f0ff]/30" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#00f0ff]/30" />
    </div>
  );
}