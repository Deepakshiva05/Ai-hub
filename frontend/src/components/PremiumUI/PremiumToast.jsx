import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

export default function PremiumToast() {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />
  };

  const borders = {
    success: "border-emerald-500/20 bg-emerald-950/20 shadow-emerald-500/5",
    error: "border-rose-500/20 bg-rose-950/20 shadow-rose-500/5",
    warning: "border-amber-500/20 bg-amber-950/20 shadow-amber-500/5",
    info: "border-sky-500/20 bg-sky-950/20 shadow-sky-500/5"
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`pointer-events-auto relative flex items-start p-4 bg-slate-900/85 backdrop-blur-xl border rounded-xl shadow-lg overflow-hidden ${borders[toast.type]}`}
          >
            <div className="mr-3 flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-grow text-sm font-medium text-slate-100 pr-2">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: toast.duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
                toast.type === "success" ? "bg-emerald-500" :
                toast.type === "error" ? "bg-rose-500" :
                toast.type === "warning" ? "bg-amber-500" : "bg-sky-500"
              }`}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
