import React, { useState, useEffect } from "react";
import { LayoutDashboard, Image, FileText, MessageSquare, Languages, ChevronLeft, ChevronRight, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedSidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, shortcut: "D" },
    { id: "image-generator", label: "Image Gen", icon: <Image className="w-5 h-5" />, shortcut: "I" },
    { id: "summarizer", label: "Summarizer", icon: <FileText className="w-5 h-5" />, shortcut: "S" },
    { id: "rag-chat", label: "RAG Chat", icon: <MessageSquare className="w-5 h-5" />, shortcut: "C" },
    { id: "translator", label: "Translator", icon: <Languages className="w-5 h-5" />, shortcut: "T" }
  ];

  // Map keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        const item = menuItems.find(x => x.shortcut.toLowerCase() === e.key.toLowerCase());
        if (item) {
          e.preventDefault();
          setActiveTab(item.id);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="hidden md:flex flex-col h-[calc(100vh-64px)] premium-glass border-r border-white/5 relative select-none"
    >
      {/* Collapse Trigger */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-[-14px] flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110 z-10"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Menu Navigation */}
      <nav className="flex-1 flex flex-col gap-2.5 p-4 mt-6">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex items-center h-12 w-full rounded-xl text-left transition-all group overflow-hidden"
            >
              {/* Active Tab Glow */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-l-[3px] border-indigo-500"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}

              {/* Icon Container */}
              <span className={`pl-4 flex items-center justify-center transition-colors duration-300 z-10 ${
                isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
              }`}>
                {item.icon}
              </span>

              {/* Text Label */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`ml-4 text-sm font-medium transition-colors z-10 ${
                      isActive ? "text-white font-semibold" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Shortcut Indicator */}
              {!collapsed && (
                <div className="absolute right-4 text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Alt+{item.shortcut}
                </div>
              )}

              {/* Collapsed Tooltip */}
              {collapsed && (
                <div className="absolute left-16 px-3 py-2 bg-slate-950/95 border border-white/10 rounded-lg text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:left-[84px] transition-all duration-300 z-50 whitespace-nowrap shadow-2xl">
                  {item.label}
                  <span className="ml-2 px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-mono">Alt+{item.shortcut}</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar keyboard controls trigger */}
      <div className="p-4 border-t border-white/5 flex items-center justify-center">
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="flex items-center justify-center p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all w-full"
        >
          <Keyboard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3 text-xs font-medium">Keyboard Shortcuts</span>}
        </button>
      </div>

      {/* Keyboard Shortcuts Dialog modal */}
      <AnimatePresence>
        {showShortcuts && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm premium-glass border border-white/10 p-6 rounded-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <h3 className="font-bold text-white font-heading">Keyboard Navigation</h3>
                <button 
                  onClick={() => setShowShortcuts(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{item.label}</span>
                    <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-white shadow-inner">
                      Alt + {item.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
