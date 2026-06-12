import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../hooks/usePremiumAnimation";

export default function KeyPointsExtractor({ keyPoints }) {
  if (!keyPoints || keyPoints.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mt-5 border-t border-white/5 pt-5 w-full">
      <h5 className="text-xs font-bold text-white uppercase tracking-widest font-heading select-none">Key Points Extract</h5>
      <motion.ul
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
      >
        {keyPoints.map((point, index) => (
          <motion.li
            key={index}
            variants={staggerItem}
            className="flex items-start gap-3 text-xs text-slate-350 leading-relaxed font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>{point}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
