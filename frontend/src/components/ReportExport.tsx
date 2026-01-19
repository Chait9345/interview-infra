"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, Loader2 } from "lucide-react";

export default function ReportExport({ candidateName }: { candidateName: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState("GENERATE_DOSSIER");

  const handleExport = () => {
    setIsExporting(true);
    setStatus("COMPILING...");
    
    setTimeout(() => setStatus("ENCRYPTING..."), 1500);
    setTimeout(() => setStatus("FINALIZING..."), 3000);
    setTimeout(() => {
      setIsExporting(false);
      setStatus("GENERATE_DOSSIER");
      alert(`SUCCESS: Neural Dossier for ${candidateName} has been exported.`);
    }, 4000);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`relative group flex items-center gap-4 px-8 py-3 rounded-lg border transition-all duration-500 overflow-hidden ${
        isExporting 
        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400" 
        : "bg-white/5 border-white/10 text-white hover:border-[#00f5d4]/50 hover:bg-[#00f5d4]/5"
      }`}
    >
      {isExporting ? (
        <Loader2 className="w-3 h-3 animate-spin text-[#00f5d4]" />
      ) : (
        <FileDown className="w-3 h-3 transition-colors group-hover:text-[#00f5d4]" />
      )}
      
      <span className="text-[9px] font-black tracking-[0.4em] uppercase">
        {status}
      </span>

      {isExporting && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
          className="absolute bottom-0 left-0 h-[1px] bg-[#00f5d4] shadow-[0_0_10px_#00f5d4]"
        />
      )}
    </button>
  );
}