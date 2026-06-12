import React, { useState, useRef } from "react";

export default function HoverCard({ children, className = "", spotlightColor = "rgba(139, 92, 246, 0.12)" }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoords({ x, y });

    // Limit rotation to max 6 degrees for subtle premium feel
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -(y - centerY) / centerY * 6;
    const rotateY = (x - centerX) / centerX * 6;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? "transform 0.05s ease-out" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      className={`relative premium-glass border border-white/5 rounded-2xl overflow-hidden shadow-xl ${className}`}
    >
      {/* Dynamic spotlight layer */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
