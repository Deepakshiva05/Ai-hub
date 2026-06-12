import React, { useState, useEffect } from "react";
import StatsCards from "./StatsCards";
import ActivityChart from "./ActivityChart";
import RecentActivity from "./RecentActivity";
import UsageAnalytics from "./UsageAnalytics";
import LoadingSkeleton from "../PremiumUI/LoadingSkeleton";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, actRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/activity")
      ]);
      
      if (statsRes.ok && actRes.ok) {
        const statsData = await statsRes.json();
        const actData = await actRes.json();
        setStats(statsData);
        setActivities(actData);
      }
    } catch (e) {
      // Fail silently, fallback data will render
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Poll stats every 8 seconds for real-time experience
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto py-2 w-full">
        <LoadingSkeleton variant="avatar-row" />
        <LoadingSkeleton variant="grid" count={3} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-2 w-full">
      {/* Title */}
      <div className="text-center md:text-left select-none">
        <h2 className="text-2xl font-bold text-white font-heading tracking-wide">Command Center</h2>
        <p className="text-xs text-slate-400 mt-1">Real-time system telemetry and models execution stats</p>
      </div>

      <StatsCards stats={stats?.summary} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="md:col-span-2">
          <ActivityChart data={stats?.usage_prediction} />
        </div>
        <RecentActivity activities={activities} />
      </div>

      <UsageAnalytics radialData={stats?.radial_metrics} topModels={stats?.top_models} />
    </div>
  );
}
