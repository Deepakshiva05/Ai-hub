import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumBackground from "./components/Layout/PremiumBackground";
import PremiumNavbar from "./components/Layout/PremiumNavbar";
import AnimatedSidebar from "./components/Layout/AnimatedSidebar";
import GlassFooter from "./components/Layout/GlassFooter";
import Dashboard from "./components/Dashboard/Dashboard";
import ImageGenerator from "./components/ImageGenerator/ImageGenerator";
import PremiumSummarizer from "./components/Summarizer/PremiumSummarizer";
import PremiumChat from "./components/RAGChat/PremiumChat";
import PremiumTranslator from "./components/Translator/PremiumTranslator";
import PremiumToast from "./components/PremiumUI/PremiumToast";
import { pageTransition } from "./hooks/usePremiumAnimation";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Custom Cursor
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile) return;

    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", moveCursor);

    const handleHoverStart = () => {
      if (cursorRef.current) cursorRef.current.classList.add("hovered");
    };
    const handleHoverEnd = () => {
      if (cursorRef.current) cursorRef.current.classList.remove("hovered");
    };

    const binder = () => {
      const items = document.querySelectorAll("button, a, input, select, textarea, option, [role='button']");
      items.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    };

    // Periodically bind to dynamically generated elements
    const interval = setInterval(binder, 1500);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      clearInterval(interval);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard key="dashboard" />;
      case "image-generator":
        return <ImageGenerator key="image-generator" />;
      case "summarizer":
        return <PremiumSummarizer key="summarizer" />;
      case "rag-chat":
        return <PremiumChat key="rag-chat" />;
      case "translator":
        return <PremiumTranslator key="translator" />;
      default:
        return <Dashboard key="dashboard" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b19] text-slate-100 relative overflow-hidden">
      {/* Custom glow cursor */}
      <div className="hidden lg:block pointer-events-none">
        <div ref={cursorRef} className="custom-cursor" />
        <div ref={cursorDotRef} className="custom-cursor-dot" />
      </div>

      {/* Layer layout */}
      <PremiumBackground />

      <PremiumNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-1 relative h-[calc(100vh-64px)] overflow-hidden">
        <AnimatedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-grow px-4 sm:px-6 md:px-8 py-6 overflow-y-auto flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-grow flex flex-col"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          <GlassFooter />
        </main>
      </div>

      <PremiumToast />
    </div>
  );
}
