import React, { useRef } from "react";
import { useParticleEffect } from "../../hooks/useParticleEffect";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  useParticleEffect(canvasRef, true);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-45"
    />
  );
}
