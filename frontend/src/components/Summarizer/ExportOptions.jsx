import React, { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

export default function ExportOptions({ text, title = "summary" }) {
  const [copied, setCopied] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast("Copied content to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `ai-hub_${title.slice(0, 15).replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast("TXT report downloaded!", "success");
  };

  return (
    <div className="flex gap-2 select-none">
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all border border-white/5"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      <button
        type="button"
        onClick={handleDownloadText}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-premium-glow"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Export Text</span>
      </button>
    </div>
  );
}
