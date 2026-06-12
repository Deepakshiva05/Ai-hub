import React from "react";
import { Folder, Database, RefreshCcw } from "lucide-react";

export default function ContextWindow({ documents, onRefresh }) {
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="p-6 premium-glass border border-white/5 rounded-2xl flex flex-col justify-between h-full min-h-[300px] select-none">
      <div>
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Context Database</span>
          </h4>
          <button
            type="button"
            onClick={onRefresh}
            className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 mt-4 overflow-y-auto max-h-[160px] pr-1">
          {documents && documents.length > 0 ? (
            documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 rounded-lg text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-slate-300 font-medium truncate">{doc.filename}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 ml-2">{formatSize(doc.size)}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[11px] text-slate-500">
              No files ingested. Ingest TXT/PDF context to load vectors.
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] text-slate-500 leading-normal mt-4">
        <span className="font-semibold text-slate-350 block mb-0.5">Memory Model:</span>
        Raw contents are cataloged and segmented. Chat checks semantic term-frequency matches across docs.
      </div>
    </div>
  );
}
