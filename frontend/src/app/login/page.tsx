"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Fingerprint, User, Briefcase, Lock } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";
import Link from "next/link";

export default function LoginPage() {
  const [authState, setAuthState] = useState<"idle" | "scanning" | "success">("idle");
  const [accessType, setAccessType] = useState<"candidate" | "recruiter" | null>(null);

  const startScan = () => {
    setAuthState("scanning");
    setTimeout(() => {
      setAuthState("success");
    }, 3000);
  };

  return (
    <main className="h-screen w-screen bg-[#020617] overflow-hidden relative flex items-center justify-center font-mono">
      <NeuralBackground />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {authState !== "success" ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-10 w-[450px] bg-black/60 border border-white/10 rounded-3xl p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Scanning Overlay */}
            {authState === "scanning" && (
              <motion.div 
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-1 bg-[#00f5d4] shadow-[0_0_20px_#00f5d4] z-20 pointer-events-none"
              />
            )}

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className={`p-4 rounded-full border-2 transition-colors duration-500 ${authState === "scanning" ? "border-[#00f5d4] text-[#00f5d4] animate-pulse" : "border-white/10 text-white/20"}`}>
                  <Fingerprint size={48} />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-xl font-black tracking-[0.5em] text-white">GATEWAY_v4.0</h1>
                <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">Identity Verification Required</p>
              </div>

              <div className="space-y-4 pt-6">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="password" 
                    placeholder="ENTER_ENCRYPTION_KEY"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs text-[#00f5d4] focus:outline-none focus:border-[#00f5d4]/50 transition-all placeholder:text-white/10"
                  />
                </div>
                
                <button 
                  onClick={startScan}
                  disabled={authState === "scanning"}
                  className="w-full py-4 rounded-xl bg-white text-black font-black tracking-[0.4em] text-xs hover:bg-[#00f5d4] transition-colors disabled:opacity-50"
                >
                  {authState === "scanning" ? "VERIFYING..." : "INITIATE_SCAN"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 w-full max-w-5xl h-[500px] flex gap-6 px-10"
          >
            {/* CANDIDATE PORTAL */}
            <Link href="/" className="flex-1 group">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="h-full bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-10 flex flex-col items-center justify-center gap-6 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <User size={120} />
                </div>
                <div className="p-6 rounded-full bg-cyan-500/20 text-cyan-400 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
                  <User size={40} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white tracking-widest mb-2">INTERVIEWEE</h2>
                  <p className="text-[10px] text-cyan-400/60 tracking-widest uppercase">Access Neural Interview Stage</p>
                </div>
              </motion.div>
            </Link>

            {/* RECRUITER PORTAL */}
            <Link href="/recruiter" className="flex-1 group">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="h-full bg-purple-500/5 border border-purple-500/20 rounded-3xl p-10 flex flex-col items-center justify-center gap-6 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Briefcase size={120} />
                </div>
                <div className="p-6 rounded-full bg-purple-500/20 text-purple-400 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all">
                  <Briefcase size={40} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white tracking-widest mb-2">EVALUATOR</h2>
                  <p className="text-[10px] text-purple-400/60 tracking-widest uppercase">Access Command Center</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 text-[8px] tracking-[0.8em] opacity-20 uppercase">
        Protected by Neural-Shield // System_Ready
      </div>
    </main>
  );
}