import React from "react";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts";
import HoverCard from "../PremiumUI/HoverCard";

export default function UsageAnalytics({ radialData, topModels }) {
  const chartData = radialData && radialData.length ? radialData : [
    { name: "Image Gen", value: 1, fill: "#6366f1" },
    { name: "Summarizer", value: 1, fill: "#8b5cf6" },
    { name: "RAG Chat", value: 1, fill: "#06b6d4" },
    { name: "Translator", value: 1, fill: "#3b82f6" }
  ];

  const models = topModels && topModels.length ? topModels : [
    { model: "Zephyr 7B Beta", type: "RAG Chat", count: 4, trophy: "🏆 Gold" },
    { model: "Stable Diffusion 2.1", type: "Image Gen", count: 3, trophy: "🥈 Silver" },
    { model: "BART Large CNN", type: "Summarization", count: 2, trophy: "🥉 Bronze" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      
      {/* Radial Chart */}
      <HoverCard className="p-6 h-[340px] flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase">Model Load Allocation</h4>
          <p className="text-[11px] text-slate-500 mt-1">Relative usage share by computing engine</p>
        </div>

        <div className="flex-1 w-full mt-4 min-h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="42%" cy="50%" innerRadius="25%" outerRadius="95%" barSize={8} data={chartData}>
              <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff', fontSize: 8 }}
                background={{ fill: "rgba(255,255,255,0.02)" }}
                clockWise
                dataKey="value"
              />
              <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </HoverCard>

      {/* Top Models list */}
      <HoverCard className="p-6 h-[340px] flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase">Subsystem Leaderboard</h4>
          <p className="text-[11px] text-slate-500 mt-1">Total requests routed to core processors</p>
        </div>

        <div className="flex-grow flex flex-col gap-3 mt-5">
          {models.map((m, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-lg select-none">{m.trophy.split(" ")[0]}</span>
                <div>
                  <p className="text-xs font-bold text-white">{m.model}</p>
                  <span className="text-[10px] text-slate-500">{m.type}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-indigo-400 font-mono">{m.count} requests</p>
                <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest font-semibold">{m.trophy.split(" ")[1] || "Runner"}</span>
              </div>
            </div>
          ))}
        </div>
      </HoverCard>

    </div>
  );
}
