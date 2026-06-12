import React from "react";

export default function GradientText({ children, variant = "primary", className = "" }) {
  const gradients = {
    primary: "from-indigo-400 via-purple-400 to-pink-500",
    secondary: "from-cyan-400 to-blue-500",
    gold: "from-amber-300 via-yellow-400 to-orange-500",
    brand: "from-indigo-400 to-cyan-400"
  };

  return (
    <span className={`bg-gradient-to-r ${gradients[variant]} bg-clip-text text-transparent select-none transition-all duration-300 hover:brightness-110 ${className}`}>
      {children}
    </span>
  );
}
