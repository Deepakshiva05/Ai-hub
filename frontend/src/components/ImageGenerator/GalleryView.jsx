import React, { useState } from "react";
import { Download, Sliders, Calendar, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedModal from "../PremiumUI/AnimatedModal";
import ImageEditor from "./ImageEditor";

export default function GalleryView({ history }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [timelineIndex, setTimelineIndex] = useState(0);

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Just now";
    }
  };

  const handleDownloadDirect = (url, prompt) => {
    const link = document.createElement("a");
    link.download = `ai-hub_${prompt.slice(0, 15).replace(/\s+/g, "_")}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Generation Time Machine */}
      {history && history.length > 0 && (
        <div className="p-6 premium-glass border border-white/5 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase flex items-center gap-2 select-none">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Generation Time Machine</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">Scroll back through your generation history timeline</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={timelineIndex === 0}
                onClick={() => setTimelineIndex(prev => prev - 1)}
                className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-slate-400 disabled:opacity-30 enabled:hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={timelineIndex === history.length - 1}
                onClick={() => setTimelineIndex(prev => prev + 1)}
                className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-slate-400 disabled:opacity-30 enabled:hover:text-white transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
            <div 
              className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-slate-900 flex items-center justify-center cursor-pointer group"
              onClick={() => setSelectedImage(history[timelineIndex])}
            >
              <img 
                src={history[timelineIndex]?.images[0]} 
                alt="Time Machine thumb" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-indigo-400 font-mono">{formatTime(history[timelineIndex]?.created_at)}</span>
              <p className="text-sm text-white font-semibold mt-1 truncate">{history[timelineIndex]?.prompt}</p>
              <div className="flex gap-4 mt-3 text-[11px] text-slate-500 font-medium">
                <span>Style: <strong className="text-slate-350 capitalize">{history[timelineIndex]?.style}</strong></span>
                <span>Size: <strong className="text-slate-350">{history[timelineIndex]?.size}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Showcase Grid */}
      <div>
        <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase mb-4.5 select-none">Artwork Showcase</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {history && history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="group relative premium-glass border border-white/5 rounded-2xl overflow-hidden aspect-square flex flex-col justify-end">
                <img
                  src={item.images[0]}
                  alt={item.prompt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10" />

                {/* Actions Panel */}
                <div className="relative z-20 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
                  <p className="text-xs text-white font-semibold line-clamp-2">{item.prompt}</p>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleDownloadDirect(item.images[0], item.prompt)}
                      className="flex-grow flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-premium-glow transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditImage(item)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(item)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 text-xs font-medium">
              Create an image above to start populating your gallery.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox inspection modal */}
      <AnimatedModal isOpen={selectedImage !== null} onClose={() => setSelectedImage(null)} title="Artwork Inspection">
        {selectedImage && (
          <div className="flex flex-col gap-4">
            <img 
              src={selectedImage.images[0]} 
              alt={selectedImage.prompt} 
              className="w-full max-h-[50vh] object-contain rounded-xl border border-white/10 shadow-2xl" 
            />
            <div>
              <p className="text-sm font-semibold text-slate-200">{selectedImage.prompt}</p>
              <span className="text-[10px] text-slate-500 font-mono block mt-1">{formatTime(selectedImage.created_at)}</span>
            </div>
          </div>
        )}
      </AnimatedModal>

      {/* Premium Image Studio Modal */}
      <AnimatedModal isOpen={editImage !== null} onClose={() => setEditImage(null)} title="Premium Image Studio" size="lg">
        {editImage && (
          <ImageEditor imageUrl={editImage.images[0]} prompt={editImage.prompt} />
        )}
      </AnimatedModal>

    </div>
  );
}
