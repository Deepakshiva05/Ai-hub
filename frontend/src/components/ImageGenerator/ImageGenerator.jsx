import React, { useState, useEffect } from "react";
import { Sparkles, Sliders, Image as ImageIcon } from "lucide-react";
import confetti from "canvas-confetti";
import GlowingButton from "../PremiumUI/GlowingButton";
import AnimatedInput from "../PremiumUI/AnimatedInput";
import PromptEnhancer from "./PromptEnhancer";
import GalleryView from "./GalleryView";
import LoadingSkeleton from "../PremiumUI/LoadingSkeleton";
import { useToastStore } from "../../store/useToastStore";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [size, setSize] = useState("1:1");
  const [batchSize, setBatchSize] = useState(1);
  const [enhancePrompt, setEnhancePrompt] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const addToast = useToastStore((state) => state.addToast);

  const styles = [
    { id: "realistic", label: "Realistic", thumb: "📸" },
    { id: "neon", label: "Neon Cyber", thumb: "🎆" },
    { id: "cyber", label: "Futuristic", thumb: "🏙️" },
    { id: "abstract", label: "Abstract", thumb: "🎨" },
    { id: "gold", label: "Gold Style", thumb: "🏆" }
  ];

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/image/history");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleEnhancePrompt = () => {
    if (!prompt) return;
    const modifiers = {
      realistic: "ultra photorealistic camera detail, professional photography, natural shadows, volumetric raytracing, 8k Resolution",
      neon: "vibrant synthwave aesthetic, neon cyberpunk, octane render, glowing wireframes, retro-futuristic dark alleyway",
      cyber: "mecha cyberpunk theme, holographic displays, high-tech terminal console, raytraced digital render, concept design",
      abstract: "modern organic abstract expressionism, fluid vector gradients, geometric highlights, rich ambient colors",
      gold: "premium luxurious gold leaf gradients, elegant outlines, matte black backdrop, ornate vector flourishes"
    };
    setEnhancedText(`${prompt}, ${modifiers[style]}`);
  };

  const handleApplyEnhancement = () => {
    setPrompt(enhancedText);
    setEnhancedText("");
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          size,
          batch_size: batchSize,
          enhance_prompt: enhancePrompt
        })
      });

      if (response.ok) {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#8b5cf6", "#06b6d4"]
        });
        addToast("Canvas synthesized successfully!", "success");
        fetchHistory();
      } else {
        addToast("Synthesizer failed to resolve prompt. Check API key.", "error");
      }
    } catch (err) {
      addToast("Server offline or MongoDB connection refused.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-2 w-full">
      <div className="text-center md:text-left select-none">
        <h2 className="text-2xl font-bold text-white font-heading tracking-wide">Image Synthesis</h2>
        <p className="text-xs text-slate-400 mt-1">Generate high-fidelity artwork and assets via Stable Diffusion engines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Creation parameters form */}
        <form onSubmit={handleGenerate} className="lg:col-span-2 flex flex-col gap-6 p-6 premium-glass border border-white/5 rounded-2xl">
          <AnimatedInput
            label="Creative Prompt"
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A golden holographic crown hovering in a dark sanctuary..."
            maxLength={180}
            required
          />

          <div className="flex justify-between items-center select-none">
            <button
              type="button"
              disabled={!prompt}
              onClick={handleEnhancePrompt}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enhance Prompt</span>
            </button>
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enhancePrompt}
                onChange={(e) => setEnhancePrompt(e.target.checked)}
                className="rounded border-white/5 bg-slate-900/50 accent-indigo-500 text-indigo-500 focus:ring-0 w-3.5 h-3.5"
              />
              <span>Auto-Enhance</span>
            </label>
          </div>

          <PromptEnhancer
            original={prompt}
            enhanced={enhancedText}
            onApply={handleApplyEnhancement}
          />

          {/* Artistic styles layout */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-slate-400 font-heading uppercase tracking-wider select-none">Art Style Selection</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {styles.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-medium gap-2 hover:bg-white/5 ${
                    style === s.id
                      ? "border-indigo-500 bg-indigo-500/10 text-white shadow-premium-glow"
                      : "border-white/5 bg-white/[0.01] text-slate-400"
                  }`}
                >
                  <span className="text-xl select-none">{s.thumb}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Setting dropboxes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 font-heading uppercase tracking-wider select-none">Canvas Aspect</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="px-3 py-2.5 bg-slate-900/35 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="1:1">1:1 Square</option>
                <option value="16:9">16:9 Landscape</option>
                <option value="9:16">9:16 Portrait</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 font-heading uppercase tracking-wider select-none">Batch Size</label>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="px-3 py-2.5 bg-slate-900/35 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value={1}>1 Image</option>
                <option value={2}>2 Images</option>
                <option value={4}>4 Images (Batch)</option>
              </select>
            </div>
          </div>

          <GlowingButton type="submit" variant="primary" disabled={loading} className="w-full mt-2" icon={<ImageIcon className="w-4 h-4" />}>
            {loading ? "Synthesizing Canvas..." : `Generate ${batchSize} Image(s)`}
          </GlowingButton>
        </form>

        {/* Synthesis Engine detail card */}
        <div className="p-6 premium-glass border border-white/5 rounded-2xl flex flex-col justify-between h-full min-h-[290px] select-none">
          <div>
            <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Synthesis Specs</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">Core State: <span className="text-emerald-400 font-semibold font-mono">ONLINE</span></p>
            
            <ul className="flex flex-col gap-3.5 mt-6 text-xs text-slate-450">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Model:</span>
                <span className="font-semibold text-white font-mono">SD 2.1 Latent</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Precision:</span>
                <span className="font-semibold text-white font-mono">FP16 Premium</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>API Channel:</span>
                <span className="font-semibold text-white font-mono">Hugging Face</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] text-slate-500 mt-4 leading-relaxed">
            <span className="font-semibold text-slate-300 block mb-0.5">Tip:</span>
            Add style modifiers or use prompt enhancement for rich details.
          </div>
        </div>

      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="mt-4 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading animate-pulse select-none">Rendering Canvas...</h4>
          <LoadingSkeleton variant="grid" count={batchSize} />
        </div>
      )}

      {/* Gallery Showcase */}
      {!loading && (
        <div className="mt-4">
          <GalleryView history={history} />
        </div>
      )}

    </div>
  );
}
