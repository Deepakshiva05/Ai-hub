import React from "react";
import { Cpu } from "lucide-react";

export default function GlassFooter() {
  return (
    <footer className="w-full bg-slate-950/35 border-t border-white/5 py-6 mt-auto">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        
        {/* Left branding details */}
        <div className="flex items-center gap-2 select-none">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>© {new Date().getFullYear()} AI Hub Premium. Enterprise-Grade AI Stack.</span>
        </div>

        {/* Middle quick navigation links */}
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Use</a>
          <a href="#docs" className="hover:text-slate-350 transition-colors">API Specs</a>
        </div>

        {/* Right social icons */}
        <div className="flex items-center gap-3">
          <a 
            href="#github" 
            className="p-1.5 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg transition-all border border-white/5"
            aria-label="GitHub"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
          <a 
            href="#twitter" 
            className="p-1.5 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg transition-all border border-white/5"
            aria-label="Twitter"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}
