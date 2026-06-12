import React from "react";

export default function LoadingSkeleton({ variant = "card", count = 1, className = "" }) {
  const shimmer = "relative overflow-hidden bg-slate-800 rounded-lg before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  const renderSingle = (index) => {
    switch (variant) {
      case "card":
        return (
          <div key={index} className={`p-6 premium-glass rounded-2xl flex flex-col gap-4 border border-white/5 ${className}`}>
            <div className={`h-7 w-1/3 ${shimmer}`} />
            <div className={`h-20 w-full ${shimmer}`} />
            <div className="flex gap-2">
              <div className={`h-9 w-20 ${shimmer}`} />
              <div className={`h-9 w-24 ${shimmer}`} />
            </div>
          </div>
        );
      case "text":
        return (
          <div key={index} className={`flex flex-col gap-3 ${className}`}>
            <div className={`h-4 w-full ${shimmer}`} />
            <div className={`h-4 w-11/12 ${shimmer}`} />
            <div className={`h-4 w-10/12 ${shimmer}`} />
            <div className={`h-4 w-8/12 ${shimmer}`} />
          </div>
        );
      case "avatar-row":
        return (
          <div key={index} className={`flex items-center gap-4 ${className}`}>
            <div className={`h-11 w-11 rounded-full ${shimmer}`} />
            <div className="flex-1 flex flex-col gap-2">
              <div className={`h-4 w-1/3 ${shimmer}`} />
              <div className={`h-3 w-1/2 ${shimmer}`} />
            </div>
          </div>
        );
      case "grid":
        return (
          <div key={index} className={`premium-glass rounded-2xl p-5 border border-white/5 flex flex-col gap-4 ${className}`}>
            <div className={`h-40 w-full rounded-xl ${shimmer}`} />
            <div className={`h-5 w-2/3 ${shimmer}`} />
            <div className={`h-4 w-11/12 ${shimmer}`} />
          </div>
        );
      default:
        return <div key={index} className={`h-8 w-full ${shimmer} ${className}`} />;
    }
  };

  if (count > 1 && variant !== "grid") {
    return (
      <div className="flex flex-col gap-4 w-full">
        {Array.from({ length: count }).map((_, i) => renderSingle(i))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => renderSingle(i))}
      </div>
    );
  }

  return renderSingle(0);
}
