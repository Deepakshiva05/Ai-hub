import React, { useEffect, useState } from "react";
import { Cpu, Image, FileText, FolderOpen } from "lucide-react";
import HoverCard from "../PremiumUI/HoverCard";

function AnimatedCount({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 1200;
    const step = Math.max(1, Math.floor(end / 40));
    const increment = Math.ceil(duration / (end / step));
    
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, Math.max(increment, 25));

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}

export default function StatsCards({ stats }) {
  const data = [
    {
      title: "Total Requests",
      value: stats?.total_requests || 0,
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      desc: "Server API requests completed",
      glow: "rgba(99, 102, 241, 0.16)"
    },
    {
      title: "Images Generated",
      value: stats?.images_generated || 0,
      icon: <Image className="w-5 h-5 text-purple-400" />,
      desc: "SD model creations",
      glow: "rgba(139, 92, 246, 0.16)"
    },
    {
      title: "Summaries Created",
      value: stats?.summaries_created || 0,
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      desc: "BART compression requests",
      glow: "rgba(6, 182, 212, 0.16)"
    },
    {
      title: "Context Documents",
      value: stats?.documents_indexed || 0,
      icon: <FolderOpen className="w-5 h-5 text-blue-400" />,
      desc: "Ingested sources for RAG",
      glow: "rgba(59, 130, 246, 0.16)"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {data.map((item, idx) => (
        <HoverCard key={idx} spotlightColor={item.glow} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 font-heading tracking-widest uppercase">{item.title}</p>
              <h3 className="text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">
                <AnimatedCount value={item.value} />
              </h3>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
              {item.icon}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-4.5 font-medium">{item.desc}</p>
        </HoverCard>
      ))}
    </div>
  );
}
