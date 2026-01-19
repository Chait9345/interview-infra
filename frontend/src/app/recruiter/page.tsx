"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ShieldCheck, Activity, Search, Play, Pause, FastForward, Rewind, BarChart3 } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";
import ReportExport from "@/components/ReportExport";

const MOCK_CANDIDATES = [
  { id: "001", name: "Alex Rivera", role: "Sr. Frontend Engineer", confidence: 92, status: "High Match", eval: "Strong architectural grasp. Exceptional React performance knowledge. Demonstrated deep understanding of low-level rendering cycles and state synchronization." },
  { id: "002", name: "Sarah Chen", role: "Product Designer", confidence: 88, status: "High Match", eval: "Fluid design-to-code workflow. Deep empathy for user accessibility. Strong visual communication but slightly lower score on system-level complexity." },
  { id: "003", name: "Jordan Smit", role: "Fullstack Dev", confidence: 64, status: "Developing", eval: "Solid backend logic, but struggled with CSS-in-JS implementation. Communication was inconsistent during technical deep-dive." },
];

export default function RecruiterDashboard() {
  const [selectedId, setSelectedId] = useState(MOCK_CANDIDATES[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeCandidate = MOCK_CANDIDATES.find(c => c.id === selectedId);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#020617] text-slate-300 font-mono relative p-6 select-none">
      <NeuralBackground />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 h-full grid grid-cols-[350px_1fr] gap-6">
        
        {/* SIDEBAR: CANDIDATE POOL */}
        <aside className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#00f5d4]" />
              <h2 className="text-xs tracking-[0.3em] font-black text-white uppercase">Neural_Pool</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 opacity-30" />
              <input 
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[10px] focus:outline-none focus:border-[#00f5d4]/50" 
                placeholder="FILTER_CANDIDATES..." 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {MOCK_CANDIDATES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  selectedId === c.id ? "bg-[#00f5d4]/10 border-[#00f5d4]/40 shadow-[0_0_15px_rgba(0,245,212,0.1)]" : "bg-transparent border-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-white tracking-wider">{c.name}</span>
                  <span className={`text-[8px] font-bold ${c.confidence > 80 ? 'text-[#00f5d4]' : 'text-orange-400'}`}>
                    {c.confidence}%
                  </span>
                </div>
                <div className="text-[9px] opacity-40 mt-1 uppercase tracking-tighter">{c.role}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN ANALYSIS AREA */}
        <section className="flex flex-col gap-6 overflow-hidden">
          
          <div className="grid grid-cols-2 gap-6 h-[420px]">
            {/* VIDEO REPLAY MODULE */}
            <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden relative group shadow-inner">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 px-2 py-1 rounded border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] font-bold text-white/70 tracking-[0.3em]">SESSION_REPLAY: {activeCandidate?.id}</span>
              </div>
              
              <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="text-center space-y-4">
                  <Users className="w-16 h-16 mx-auto opacity-10 text-[#00f5d4]" />
                  <p className="text-[8px] opacity-20 tracking-widest uppercase">Video_Encrypted_Source</p>
                </div>
                
                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-4">
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]" 
                      animate={{ width: isPlaying ? "100%" : "34%" }}
                      transition={{ duration: 15, ease: "linear" }}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-10">
                    <Rewind className="w-4 h-4 cursor-pointer hover:text-[#00f5d4] transition-colors" />
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)} 
                      className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                    <FastForward className="w-4 h-4 cursor-pointer hover:text-[#00f5d4] transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* NEURAL STATS BLOCK */}
            <div className="grid grid-rows-2 gap-6">
              <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group">
                <div className="scanline opacity-5" />
                <div className="flex items-center gap-3 mb-6 opacity-40">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] tracking-[0.4em] font-black uppercase">Confidence_Engine</span>
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {activeCandidate?.confidence}<span className="text-xl text-[#00f5d4]">%</span>
                </div>
                <div className="text-[9px] text-cyan-400/60 tracking-[0.3em] font-bold uppercase">Verdict: {activeCandidate?.status}</div>
              </div>
              
              <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6 opacity-40">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] tracking-[0.4em] font-black uppercase">Neural_Markers</span>
                </div>
                <div className="space-y-5">
                  {[
                    { m: 'Technical Fluency', v: activeCandidate?.confidence || 0 },
                    { m: 'Sentiment Stability', v: 84 },
                    { m: 'Logic Processing', v: 76 }
                  ].map((item) => (
                    <div key={item.m} className="space-y-2">
                      <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                        <span className="opacity-40">{item.m}</span>
                        <span className="text-[#00f5d4]">{item.v}%</span>
                      </div>
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.v}%` }}
                          className="h-full bg-gradient-to-r from-cyan-900 to-[#00f5d4]" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* READ-ONLY SUMMARY SECTION */}
          <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 relative flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black tracking-[0.5em] text-[#00f5d4] uppercase mb-4">Evaluation_Dossier</h3>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">{activeCandidate?.name}</h2>
                <p className="text-[10px] text-white/30 tracking-[0.2em]">{activeCandidate?.role} // AUTH_ID: {activeCandidate?.id}</p>
              </div>
              <ReportExport candidateName={activeCandidate?.name || "Unknown"} />
            </div>

            <div className="flex-1 border-l border-white/10 pl-8 relative">
              <div className="absolute top-0 left-[-2px] w-[3px] h-8 bg-[#00f5d4] shadow-[0_0_10px_#00f5d4]" />
              <p className="text-xl leading-relaxed text-slate-300 font-light max-w-4xl italic">
                "{activeCandidate?.eval}"
              </p>
            </div>

            <div className="mt-auto flex gap-10 text-[8px] uppercase tracking-[0.4em] font-bold opacity-20">
              <span>Security_Level: 4</span>
              <span>Data_Integrity: Verified</span>
              <span>Node: INTERVIEW_INFRA_01</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}