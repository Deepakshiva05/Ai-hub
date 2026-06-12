import React, { useState } from "react";
import { Bell, Sparkles, User, Menu, X, LayoutDashboard, Image as ImageIcon, FileText, MessageSquare, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GradientText from "../PremiumUI/GradientText";

export default function PremiumNavbar({ activeTab, setActiveTab }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "System fully operational", date: "Just now" },
    { id: 2, text: "Image generated successfully", date: "4 mins ago" },
  ]);

  const navItems = [
    { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "image-generator", label: "IMAGE GEN", icon: ImageIcon },
    { id: "summarizer", label: "SUMMARIZER", icon: FileText },
    { id: "rag-chat", label: "RAG CHAT", icon: MessageSquare },
    { id: "translator", label: "TRANSLATOR", icon: Globe }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/45 border-b border-white/5 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* 3D Rotating Logo */}
        <div onClick={() => setActiveTab("dashboard")} className="flex items-center gap-2.5 cursor-pointer group">
          <motion.div
            whileHover={{ rotateY: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-premium-glow"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <span className="text-lg font-bold font-heading text-white tracking-wider flex items-center gap-1.5">
            AI <GradientText variant="brand" className="font-bold">Hub</GradientText>
          </span>
        </div>

        {/* Sliding Navigation tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-1.5 py-2 text-xs font-semibold tracking-widest transition-all duration-300 ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-premium-glow"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Header Right elements */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Pulsing Gold Badge */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400/10 to-orange-500/10 border border-amber-500/20 rounded-full shadow-gold-glow animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 font-mono tracking-widest uppercase">PREMIUM</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <Bell className="w-4.5 h-4.5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-[-40px] sm:right-0 mt-2.5 w-72 premium-glass border border-white/10 rounded-xl shadow-2xl p-4 z-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-white uppercase font-heading">Notifications</h4>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                          <p className="text-xs text-slate-300 font-medium">{n.text}</p>
                          <span className="text-[9px] text-slate-500 font-mono mt-1 block">{n.date}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User profile avatar */}
          <div className="relative group cursor-pointer hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-[2px] opacity-70 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
            <div className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-slate-300">
              <User className="w-4 h-4" />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-slate-900/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 gap-2">
              {navItems.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30" 
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : ""}`} />
                    <span className="text-sm font-semibold tracking-wide">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-premium-glow"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
