import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PromptEnhancer({ original, enhanced, onApply }) {
  if (!enhanced) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-xl flex flex-col gap-3 mt-3"
    >
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Smart Prompt Enhancement</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between text-xs">
        <div className="flex-1 p-2.5 bg-slate-900/30 border border-white/5 rounded-lg">
          <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Original</span>
          <p className="text-slate-400 italic mt-1 line-clamp-2">{original}</p>
        </div>
        <div className="flex items-center justify-center flex-shrink-0">
          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
        </div>
        <div className="flex-1 p-2.5 bg-indigo-950/20 border border-indigo-500/15 rounded-lg">
          <span className="text-indigo-400 font-bold uppercase text-[9px] tracking-wider">Enhanced</span>
          <p className="text-slate-200 font-medium mt-1 line-clamp-2">{enhanced}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onApply}
        className="self-end px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-premium-glow hover:scale-103"
      >
        Apply Suggestion
      </button>
    </motion.div>
  );
}
