import React from "react";
import { Sparkles, MessageSquare, FileText, Languages, Info } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../hooks/usePremiumAnimation";
import HoverCard from "../PremiumUI/HoverCard";

export default function RecentActivity({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case "image_generation":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "summarization":
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case "rag_chat":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "translation":
        return <Languages className="w-4 h-4 text-indigo-400" />;
      case "document_upload":
        return <FileText className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Recent";
    }
  };

  return (
    <HoverCard className="p-6 h-[360px] flex flex-col">
      <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase">Telemetry Logs</h4>
      <p className="text-[11px] text-slate-500 mt-1">Live execution tracking of API resources</p>

      <div className="flex-1 overflow-y-auto mt-5 pr-1">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-3"
        >
          {activities && activities.length ? (
            activities.map((act) => (
              <motion.div
                key={act.id}
                variants={staggerItem}
                className="flex items-center gap-3.5 p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <div className="p-2 bg-slate-900 border border-white/5 rounded-lg flex-shrink-0">
                  {getIcon(act.activity_type)}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs text-slate-200 font-medium truncate">{act.description}</p>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{formatTime(act.created_at)}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              No telemetry events recorded.
            </div>
          )}
        </motion.div>
      </div>
    </HoverCard>
  );
}
