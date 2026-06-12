import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

export default function PronunciationGuide({ text, pronunciation, targetLang }) {
  const [playing, setPlaying] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleSpeak = () => {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (!synth) {
      addToast("Text-to-speech not supported in this browser.", "warning");
      return;
    }

    if (playing) {
      synth.cancel();
      setPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const langCodes = {
      Spanish: "es-ES",
      French: "fr-FR",
      German: "de-DE",
      Japanese: "ja-JP",
      Hindi: "hi-IN",
      Chinese: "zh-CN"
    };
    
    utterance.lang = langCodes[targetLang] || "en-US";
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => {
      setPlaying(false);
    };

    synth.speak(utterance);
  };

  return (
    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between mt-4 w-full select-none">
      <div>
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block font-heading">Pronunciation Guide</span>
        <p className="text-xs text-indigo-400 font-semibold mt-1 font-mono">{pronunciation || "phonetics-un-a-vail-a-ble"}</p>
      </div>
      <button
        type="button"
        onClick={handleSpeak}
        className={`p-2.5 rounded-xl border transition-all ${
          playing
            ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400 shadow-premium-glow"
            : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
        }`}
      >
        {playing ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
