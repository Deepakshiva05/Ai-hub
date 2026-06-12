import React from "react";
import { History, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../hooks/usePremiumAnimation";
import HoverCard from "../PremiumUI/HoverCard";

export default function TranslationHistory({ history, onLoadItem }) {
  return (
    <HoverCard className="p-6 h-[340px] flex flex-col justify-between select-none">
      <div>
        <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Translation History</span>
        </h4>
        <p className="text-[11px] text-slate-500 mt-1">Select earlier entries to restore context</p>
      </div>

      <div className="flex-grow overflow-y-auto mt-5 pr-1 max-h-[170px]">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-2.5"
        >
          {history && history.length > 0 ? (
            history.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onLoadItem(item)}
                className="w-full flex items-center justify-between p-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl transition-all text-left group"
              >
                <div className="min-w-0 flex-grow pr-2">
                  <p className="text-xs text-slate-350 truncate font-semibold">{item.original_text}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-500">
                    <span className="capitalize font-mono">{item.source_lang || "Auto"}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                    <span className="capitalize font-mono">{item.target_lang}</span>
                  </div>
                </div>
                <Globe className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-450 transition-colors flex-shrink-0" />
              </button>
            ))
          ) : (
            <div className="text-center py-12 text-[11px] text-slate-500">
              No translation history recorded.
            </div>
          )}
        </motion.div>
      </div>
    </HoverCard>
  );
}
