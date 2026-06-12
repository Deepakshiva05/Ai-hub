import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl w-fit select-none">
      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
