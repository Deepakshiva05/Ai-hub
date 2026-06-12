import React from "react";
import { Eye, FileText } from "lucide-react";
import ExportOptions from "./ExportOptions";
import KeyPointsExtractor from "./KeyPointsExtractor";

export default function DocumentViewer({ original, summary, keyPoints }) {
  const calcReadingTime = (text) => {
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getCompression = () => {
    if (!original || !summary) return 0;
    const ratio = (1 - (summary.length / original.length)) * 100;
    return Math.max(0, Math.floor(ratio));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-4 select-none">
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-heading block">Read Time</span>
          <p className="text-xl font-bold text-indigo-400 mt-1 font-mono">{calcReadingTime(summary)} min</p>
          <span className="text-[9px] text-slate-600 block mt-0.5">down from {calcReadingTime(original)} min</span>
        </div>
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-heading block">Compression</span>
          <p className="text-xl font-bold text-cyan-400 mt-1 font-mono">-{getCompression()}%</p>
          <span className="text-[9px] text-slate-600 block mt-0.5">characters reduced</span>
        </div>
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-heading block">Sentences</span>
          <p className="text-xl font-bold text-purple-400 mt-1 font-mono">{summary.split(".").filter(Boolean).length}</p>
          <span className="text-[9px] text-slate-600 block mt-0.5">structured units</span>
        </div>
      </div>

      {/* Main View Panels */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-2 select-none">Document Viewports</span>
          <ExportOptions text={summary} title={summary} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Original Viewport */}
          <div className="p-5 bg-slate-900/20 border border-white/5 rounded-2xl flex flex-col h-[340px]">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-3 font-heading flex items-center gap-1.5 select-none">
              <FileText className="w-3.5 h-3.5" />
              <span>Original Source</span>
            </span>
            <div className="flex-grow overflow-y-auto text-xs text-slate-400 leading-relaxed pr-1 select-text">
              {original}
            </div>
          </div>

          {/* Summary Viewport */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 rounded-2xl flex flex-col h-[340px] shadow-premium-glow">
            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-3 font-heading flex items-center gap-1.5 select-none">
              <Eye className="w-3.5 h-3.5" />
              <span>AI Condensed Report</span>
            </span>
            <div className="flex-grow overflow-y-auto text-xs text-slate-200 leading-relaxed pr-1 select-text">
              {summary}
            </div>
          </div>
        </div>
      </div>

      <KeyPointsExtractor keyPoints={keyPoints} />
    </div>
  );
}
