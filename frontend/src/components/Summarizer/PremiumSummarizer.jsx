import React, { useState } from "react";
import { Sliders, FileText } from "lucide-react";
import GlowingButton from "../PremiumUI/GlowingButton";
import DocumentViewer from "./DocumentViewer";
import LoadingSkeleton from "../PremiumUI/LoadingSkeleton";
import { useToastStore } from "../../store/useToastStore";

export default function PremiumSummarizer() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("summary");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  const addToast = useToastStore((state) => state.addToast);

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (text.trim().length < 20) {
      addToast("Please enter at least 20 characters.", "warning");
      return;
    }

    setLoading(true);
    setResults(null);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, length })
      });

      if (response.ok) {
        const data = await response.json();
        setResults({
          original: text,
          summary: data.summary,
          keyPoints: data.key_points
        });
        addToast("Document compressed successfully!", "success");
      } else {
        addToast("Model failed to summarize text. Check API Key.", "error");
      }
    } catch (err) {
      addToast("Server connection failure.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-2 w-full">
      
      {/* Title */}
      <div className="text-center md:text-left select-none">
        <h2 className="text-2xl font-bold text-white font-heading tracking-wide">Document Summarization</h2>
        <p className="text-xs text-slate-400 mt-1">Condense large articles and reports using transformer compression models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Input Parameters form */}
        <form onSubmit={handleSummarize} className="lg:col-span-2 flex flex-col gap-6 p-6 premium-glass border border-white/5 rounded-2xl">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 font-heading uppercase tracking-wider select-none">Source Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your documents or text segments here (minimum 20 characters)..."
              rows={8}
              required
              className="w-full px-4 py-3 bg-slate-900/35 border border-white/5 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 font-heading uppercase tracking-wider select-none">Report Style</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="px-3 py-2.5 bg-slate-900/35 border border-white/5 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
              >
                <option value="summary">Paragraph Summary</option>
                <option value="key_points">Key Bullet Points</option>
                <option value="outline">Document Outline</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 font-heading uppercase tracking-wider select-none">Target length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="px-3 py-2.5 bg-slate-900/35 border border-white/5 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
              >
                <option value="short">Short (~2 sentences)</option>
                <option value="medium">Medium (~4 sentences)</option>
                <option value="long">Long (~6 sentences)</option>
              </select>
            </div>
          </div>

          <GlowingButton type="submit" variant="primary" disabled={loading} className="w-full mt-2" icon={<FileText className="w-4 h-4" />}>
            {loading ? "Compressing Document..." : "Generate AI Summary"}
          </GlowingButton>
        </form>

        {/* Info card */}
        <div className="p-6 premium-glass border border-white/5 rounded-2xl flex flex-col justify-between h-full min-h-[290px] select-none">
          <div>
            <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>BART Processor</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">Core State: <span className="text-emerald-400 font-semibold font-mono">ONLINE</span></p>

            <ul className="flex flex-col gap-3.5 mt-6 text-xs text-slate-450">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Model Engine:</span>
                <span className="font-semibold text-white font-mono">BART-Large-CNN</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Context Limit:</span>
                <span className="font-semibold text-white font-mono">1024 Tokens</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>Channel:</span>
                <span className="font-semibold text-white font-mono">Hugging Face</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] text-slate-500 mt-4 leading-relaxed">
            <span className="font-semibold text-slate-350 block mb-0.5">Tip:</span>
            Pre-cleaning markdown and boilerplate metadata will generate cleaner reports.
          </div>
        </div>

      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="mt-4 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading animate-pulse select-none">Executing Model...</h4>
          <LoadingSkeleton variant="card" />
        </div>
      )}

      {/* Viewer results */}
      {!loading && results && (
        <div className="mt-4">
          <DocumentViewer
            original={results.original}
            summary={results.summary}
            keyPoints={results.keyPoints}
          />
        </div>
      )}

    </div>
  );
}
