import React, { useState, useEffect } from "react";
import { Languages, Copy, Check } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import PronunciationGuide from "./PronunciationGuide";
import TranslationHistory from "./TranslationHistory";
import GlowingButton from "../PremiumUI/GlowingButton";
import { useToastStore } from "../../store/useToastStore";

export default function PremiumTranslator() {
  const [text, setText] = useState("");
  const [sourceLang] = useState("Auto");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [translatedText, setTranslatedText] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  
  const addToast = useToastStore((state) => state.addToast);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/translate/history");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleTranslate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          source_lang: sourceLang,
          target_lang: targetLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translated_text);
        setPronunciation(data.pronunciation_guide);
        addToast("Translated successfully!", "success");
        fetchHistory();
      } else {
        addToast("Failed to compile translation. Check API Key.", "error");
      }
    } catch (err) {
      addToast("Server connection failure.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadItem = (item) => {
    setText(item.original_text);
    setTargetLang(item.target_lang);
    setTranslatedText(item.translated_text);
    setPronunciation(item.pronunciation_guide || "");
  };

  const handleCopyTranslated = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    addToast("Translation copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-2 w-full">
      <div className="text-center md:text-left select-none">
        <h2 className="text-2xl font-bold text-white font-heading tracking-wide">Language Translation</h2>
        <p className="text-xs text-slate-400 mt-1">Translate sentences with high accuracy and generate pronunciation guides</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Input fields */}
        <div className="lg:col-span-2 flex flex-col gap-6 p-6 premium-glass border border-white/5 rounded-2xl">
          <div className="grid grid-cols-2 gap-4 select-none">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-slate-500 font-heading uppercase tracking-widest">Source Lang</span>
              <div className="px-4 py-3 bg-slate-900/35 border border-white/5 rounded-xl text-xs text-slate-400 select-none font-semibold">
                🌐 English (Auto)
              </div>
            </div>
            <LanguageSelector
              label="Target Lang"
              value={targetLang}
              onChange={setTargetLang}
            />
          </div>

          <form onSubmit={handleTranslate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter sentences to translate..."
                rows={4}
                required
                className="w-full px-4 py-3 bg-slate-900/35 border border-white/5 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition-all duration-300"
              />
            </div>
            
            <GlowingButton type="submit" variant="primary" disabled={loading} className="w-full" icon={<Languages className="w-4 h-4" />}>
              {loading ? "Translating Text..." : "Translate Text"}
            </GlowingButton>
          </form>

          {/* Results displays */}
          {translatedText && (
            <div className="flex flex-col gap-4 border-t border-white/5 pt-5 animate-float-medium">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl select-none">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-2">Output Target</span>
                <button
                  type="button"
                  onClick={handleCopyTranslated}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-lg text-xs font-semibold transition-all border border-white/5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900/40 border border-indigo-500/10 rounded-xl min-h-[90px] text-xs text-slate-100 leading-relaxed font-semibold">
                {translatedText}
              </div>

              <PronunciationGuide
                text={translatedText}
                pronunciation={pronunciation}
                targetLang={targetLang}
              />
            </div>
          )}
        </div>

        {/* History widgets */}
        <TranslationHistory history={history} onLoadItem={handleLoadItem} />

      </div>
    </div>
  );
}
