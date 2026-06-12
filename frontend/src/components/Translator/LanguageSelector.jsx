import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function LanguageSelector({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" },
    { name: "German", flag: "🇩🇪" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Hindi", flag: "🇮🇳" },
    { name: "Chinese", flag: "🇨🇳" }
  ];

  const current = languages.find((l) => l.name === value) || { name: value, flag: "🌐" };

  return (
    <div className="relative flex flex-col gap-1.5 w-full">
      {label && <span className="text-[9px] font-bold text-slate-500 font-heading uppercase tracking-widest select-none">{label}</span>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/35 border border-white/5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all select-none"
      >
        <div className="flex items-center gap-2">
          <span>{current.flag}</span>
          <span className="font-semibold">{current.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute top-16 left-0 right-0 p-1.5 premium-glass border border-white/10 rounded-xl shadow-2xl z-20 flex flex-col gap-0.5 max-h-[170px] overflow-y-auto">
            {languages.map((l) => (
              <button
                type="button"
                key={l.name}
                onClick={() => {
                  onChange(l.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                  value === l.name 
                    ? "bg-indigo-500/10 text-white font-semibold" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
