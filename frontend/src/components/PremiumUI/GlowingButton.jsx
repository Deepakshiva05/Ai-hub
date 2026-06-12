import React from "react";
import { motion } from "framer-motion";
import { buttonClick } from "../../hooks/usePremiumAnimation";

export default function GlowingButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon = null
}) {
  const baseStyle = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden select-none active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-premium-glow hover:shadow-premium-glow-strong",
    secondary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-glow hover:brightness-105",
    ghost: "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md",
    gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-premium-glow",
    gold: "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold shadow-gold-glow hover:brightness-110"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-7 py-3.5 text-base",
    xl: "px-9 py-4.5 text-lg"
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled ? {} : buttonClick}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {/* Light shine overlay */}
      <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {icon && <span className="mr-2 flex items-center justify-center text-current">{icon}</span>}
      <span className="relative z-10 flex items-center">{children}</span>
    </motion.button>
  );
}
