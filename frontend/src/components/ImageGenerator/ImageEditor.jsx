import React, { useState } from "react";
import { Sliders, Download, RotateCcw } from "lucide-react";
import GlowingButton from "../PremiumUI/GlowingButton";

export default function ImageEditor({ imageUrl, prompt }) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setBlur(0);
  };

  const handleDownload = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px)`;
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement("a");
      link.download = `ai-hub_${prompt.slice(0, 15).replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-stretch w-full">
      {/* Live Preview Pane */}
      <div className="flex-grow bg-slate-950/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-5 min-h-[260px]">
        <img
          src={imageUrl}
          alt={prompt}
          style={{
            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px)`
          }}
          className="max-h-[280px] w-auto object-contain rounded-xl shadow-2xl transition-all duration-100"
        />
      </div>

      {/* Editor Controls Pane */}
      <div className="w-full md:w-[280px] flex flex-col justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-white uppercase tracking-wider font-heading">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Image Adjustments</span>
        </div>

        <div className="flex flex-col gap-4 flex-grow justify-center">
          {/* Brightness */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>Brightness</span>
              <span className="font-mono text-[10px]">{brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Contrast */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>Contrast</span>
              <span className="font-mono text-[10px]">{contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Saturation */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>Saturation</span>
              <span className="font-mono text-[10px]">{saturate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={saturate}
              onChange={(e) => setSaturate(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Blur */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>Blur</span>
              <span className="font-mono text-[10px]">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-2.5 mt-6 border-t border-white/5 pt-4">
          <GlowingButton onClick={handleDownload} variant="primary" size="sm" className="flex-1" icon={<Download className="w-4 h-4" />}>
            Save
          </GlowingButton>
          <button
            type="button"
            onClick={resetFilters}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
