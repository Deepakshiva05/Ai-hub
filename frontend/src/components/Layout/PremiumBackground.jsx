import React from "react";
import ParticleBackground from "../PremiumUI/ParticleBackground";

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-[#070b19]">
      {/* Network Particle Canvas */}
      <ParticleBackground />

      {/* Ambient Morphing Gradient Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[65%] h-[65%] rounded-full bg-indigo-500/10 blur-[130px] animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[60%] rounded-full bg-purple-600/10 blur-[140px] animate-float-medium" />
      <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-cyan-500/7 blur-[110px] animate-pulse" />

      {/* Subtle Matrix Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />
    </div>
  );
}
