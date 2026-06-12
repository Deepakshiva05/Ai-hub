import React, { useState } from "react";
import { Copy, Check, Sparkles, User } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

export default function MessageBubble({ message }) {
  const { sender, text, contextUsed } = message;
  const isUser = sender === "user";
  const [copied, setCopied] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast("Message copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3.5 w-full ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar icons */}
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border select-none ${
        isUser 
          ? "bg-slate-900 border-white/10 text-slate-350" 
          : "bg-gradient-to-tr from-indigo-500 to-purple-600 border-indigo-500/20 text-white shadow-premium-glow"
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Bubble block */}
      <div className="flex flex-col gap-1.5 max-w-[82%] group">
        <div className={`relative px-4 py-3 rounded-2xl text-xs leading-relaxed font-medium select-text ${
          isUser 
            ? "bg-indigo-600 text-white rounded-tr-none shadow-premium-glow" 
            : "bg-slate-900/60 border border-white/5 text-slate-200 rounded-tl-none"
        }`}>
          <p className="whitespace-pre-wrap">{text}</p>

          {/* Copy option */}
          {!isUser && (
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 p-1 bg-slate-950/50 hover:bg-slate-950/80 text-slate-400 hover:text-white rounded-lg transition-all border border-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* References chips */}
        {!isUser && contextUsed && contextUsed.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 text-[9px] text-slate-500 pl-1 font-mono select-none">
            <span>Sources:</span>
            {contextUsed.map((src, idx) => (
              <span key={idx} className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400">
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
