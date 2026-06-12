import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import HoverCard from "../PremiumUI/HoverCard";

export default function ActivityChart({ data }) {
  const chartData = data && data.length ? data : [
    { name: "Mon", used: 1, predicted: 3 },
    { name: "Tue", used: 2, predicted: 4 },
    { name: "Wed", used: 1, predicted: 5 },
    { name: "Thu", used: 3, predicted: 4 },
    { name: "Fri", used: 4, predicted: 6 },
    { name: "Sat", used: 1, predicted: 3 },
    { name: "Sun", used: 2, predicted: 2 }
  ];

  return (
    <HoverCard className="p-6 h-[360px] flex flex-col justify-between">
      <div>
        <h4 className="text-xs font-bold text-white font-heading tracking-widest uppercase">AI Telemetry Graph</h4>
        <p className="text-[11px] text-slate-500 mt-1">Observed API requests vs predictive capacity scaling</p>
      </div>

      <div className="flex-1 w-full mt-6 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="usedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.22}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                backdropFilter: "blur(12px)",
                color: "#fff",
                fontSize: "11px"
              }}
            />
            <Area type="monotone" dataKey="used" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#usedGrad)" name="Completed" />
            <Area type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#predGrad)" name="Capacity" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </HoverCard>
  );
}
