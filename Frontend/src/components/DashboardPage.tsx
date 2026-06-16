import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, AlertTriangle, Database, HelpCircle, ArrowUpRight, ArrowDownRight, Compass, CheckCircle2 } from "lucide-react";
import { KpiMetric, TradeAlert } from "../types";

interface DashboardPageProps {
  metrics: KpiMetric[];
  alerts: TradeAlert[];
  onNavigateToRisk: () => void;
  onNavigateToForecast: () => void;
  chartData: any[];
}

export default function DashboardPage({
  metrics,
  alerts,
  onNavigateToRisk,
  onNavigateToForecast,
  chartData
}: DashboardPageProps) {
  // Map standard icons to KPI blocks dynamically
  const getMetricIcon = (id: string, color: string) => {
    switch (id) {
      case "total_export":
        return <TrendingUp className={`h-6 w-6 text-${color}`} />;
      case "accuracy":
        return <CheckCircle2 className={`h-6 w-6 text-${color}`} />;
      case "risk_routes":
        return <AlertTriangle className={`h-6 w-6 text-${color}`} />;
      case "db_status":
        return <Database className={`h-6 w-6 text-${color}`} />;
      default:
        return <Compass className={`h-6 w-6 text-${color}`} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-page">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-sans">
            Stitch AI Executive Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            AI-Driven Export Demand Forecasting &amp; Supply Chain Risk Intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>PostgreSQL Active Instance Connected</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            id={`kpi-card-${metric.id}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-all cursor-pointer group hover:scale-[1.01] duration-200 shadow-xl relative overflow-hidden"
          >
            {/* Ambient light overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  {metric.name}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
                  {metric.value}
                </h3>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                {getMetricIcon(metric.id, metric.color)}
              </div>
            </div>

            {/* Custom display accents based on ID matching the Elegant Dark mock HTML */}
            {metric.id === "accuracy" ? (
              <div className="mt-3.5">
                <div className="w-full h-1 bg-slate-800 rounded-full">
                  <div className="w-[94%] h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-emerald-400 font-bold">{metric.change}</span>
                  <span className="text-slate-500 font-sans">{metric.subtext}</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-1.5 text-xs">
                <span
                  className={`font-mono font-bold flex items-center ${
                    metric.trend === "up"
                      ? "text-emerald-400"
                      : metric.trend === "down"
                      ? "text-rose-400"
                      : "text-sky-400"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 mr-0.5" />
                  ) : metric.trend === "down" ? (
                    <ArrowDownRight className="h-4 w-4 mr-0.5" />
                  ) : null}
                  {metric.change}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 truncate">{metric.subtext}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts & Recent Alerts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prophet & Historical Trade Comparison Chart (Col Span 8) */}
        <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-xl glass-panel relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight font-sans">
                Historical Trade Value vs Prophet AI Forecast
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Aggregate supply pipeline trends in Millions (USD) with forecasted projections
              </p>
            </div>
            <button
              onClick={onNavigateToForecast}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium font-mono hover:underline cursor-pointer"
            >
              Analyze Prophet Model &rarr;
            </button>
          </div>

          <div className="h-[340px] w-full" id="trade-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} label={{ value: 'Value (USD M)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, offset: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0f10",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc"
                  }}
                  itemStyle={{ fontSize: "12px" }}
                  labelStyle={{ fontWeight: "bold", fontSize: "12px", color: "#94a3b8" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area
                  name="Historical Trade Value"
                  type="monotone"
                  dataKey="historicalValue"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHistory)"
                />
                <Area
                  name="Prophet AI Forecast"
                  type="monotone"
                  dataKey="forecastValue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorForecast)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts Feed Panel (Col Span 4) */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h2 className="text-lg font-bold text-slate-100 tracking-tight font-sans">
                High-Severity Shipping Delays
              </h2>
              <span className="bg-rose-500/15 text-rose-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-500/20 animate-pulse">
                Active Alerts
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[310px] pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={onNavigateToRisk}
                  className="bg-slate-950 p-4 rounded-xl border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-start gap-1.5">
                    <span className="font-mono text-xs font-semibold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Critical
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{alert.delayEta} delay</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mt-1 font-sans">
                    {alert.route}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-1 bg-slate-900/50 p-2 rounded-lg text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-sans">Affected Capital:</span>
                      <strong className="text-slate-200 font-mono">{alert.affectedValue}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-sans">Freight Surcharge:</span>
                      <strong className="text-slate-200 font-mono">{alert.freightCostImpact}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateToRisk}
            className="w-full mt-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-slate-100 border border-slate-800 rounded-lg text-xs font-medium font-sans flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            Manage Risk Index &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
