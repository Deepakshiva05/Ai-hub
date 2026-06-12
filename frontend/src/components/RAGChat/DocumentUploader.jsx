import React, { useState, useRef } from "react";
import { UploadCloud, File } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

export default function DocumentUploader({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  
  const addToast = useToastStore((state) => state.addToast);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (selectedFile) => {
    if (!selectedFile.name.endsWith(".txt") && !selectedFile.name.endsWith(".pdf")) {
      addToast("Unsupported format. Please upload PDF or TXT.", "error");
      return;
    }
    
    setFile(selectedFile);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/rag/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        addToast(`Document context ${selectedFile.name} indexed!`, "success");
        onUploadSuccess();
      } else {
        addToast("Failed to index document content.", "error");
      }
    } catch (err) {
      addToast("Server connection error during upload.", "error");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
      className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
        dragActive 
          ? "border-indigo-500 bg-indigo-500/5 shadow-premium-glow" 
          : "border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf"
        onChange={handleChange}
        className="hidden"
      />

      <UploadCloud className={`w-8 h-8 mb-3 transition-colors ${dragActive ? "text-indigo-400" : "text-slate-500"}`} />
      
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 animate-pulse">Ingesting context dataset...</span>
          <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-[shimmer_1.5s_infinite] origin-left" style={{ width: "100%" }} />
          </div>
        </div>
      ) : file ? (
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
          <File className="w-4 h-4" />
          <span>{file.name}</span>
        </div>
      ) : (
        <div className="select-none">
          <p className="text-xs font-semibold text-slate-300">Drag & drop files or click to browse</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Supports PDF and TXT data up to 10MB</span>
        </div>
      )}
    </div>
  );
}
