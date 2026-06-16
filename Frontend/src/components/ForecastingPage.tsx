import React, { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from "recharts";
import { Filter, Calendar, BarChart2, TrendingUp, Sparkles, HelpCircle } from "lucide-react";
import { HISTORICAL_FORECAST_DATA } from "../data/mockData";

export default function ForecastingPage() {
  const [category, setCategory] = useState<"Apparel" | "Ceylon Tea" | "Rubber">("Ceylon Tea");
  const [horizon, setHorizon] = useState<"3" | "6" | "12">("12");

  // Filter the points depending on selected horizon (since dates go from Jan to Dec, let's slice them)
  const currentData = useMemo(() => {
    const fullYear = HISTORICAL_FORECAST_DATA[category] || [];
    if (horizon === "3") {
      return fullYear.slice(0, 9); // Limit values to show 3 months forecast (Jul, Aug, Sep)
    } else if (horizon === "6") {
      return fullYear.slice(0, 12); // Displays full 6 months forecast (up to Dec)
    }
    return fullYear; // Default full set
  }, [category, horizon]);

  // Forecast table rows calculated from current data points (focusing on forecasted period)
  const forecastTableRows = useMemo(() => {
    return currentData.filter(pt => pt.historicalValue === undefined);
  }, [currentData]);

  return (
    <div className="space-y-6 animate-fade-in" id="forecasting-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-sans flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          Prophet AI Forecasting
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-sans">
          Generative seasonal decomposition curve with Prophet confidence band offsets for aggregate trade values.
        </p>
      </div>

      {/* Controls panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Model Parameters
          </span>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Product Category dropdown */}
          <div className="flex flex-col gap-1 flex-1 md:flex-none">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
              Product Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-2 px-3 text-slate-200 focus:border-indigo-500 focus:outline-none min-w-[150px] font-sans"
            >
              <option value="Ceylon Tea">Ceylon Tea</option>
              <option value="Apparel">Apparel</option>
              <option value="Rubber">Rubber</option>
            </select>
          </div>

          {/* Horizon Dropdown */}
          <div className="flex flex-col gap-1 flex-1 md:flex-none">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
              Forecast Horizon
            </label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-2 px-3 text-slate-200 focus:border-indigo-500 focus:outline-none min-w-[150px] font-sans"
            >
              <option value="3">3 Months Future</option>
              <option value="6">6 Months Future</option>
              <option value="12">12 Months Future</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Graphic */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-xl relative">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5 font-sans">
              Prophet Model Curve &amp; Uncertainty Polygons
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Shaded polygon represents 95% Confidence Band range boundary (yhat_lower to yhat_upper)
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Prophet V2 Optimization Live
          </span>
        </div>

        {/* Shaded Confidence band Recharts representation */}
        <div className="h-[360px] w-full" id="prophet-curves-container">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                labelStyle={{ fontWeight: "bold", fontSize: "12px", color: "#94a3b8" }}
              />

              {/* Confidence interval Range: Shaded light green polygon */}
              <Area
                name="Confidence Range (yhat_lower &harr; yhat_upper)"
                type="monotone"
                dataKey="yhat_upper"
                stroke="none"
                fill="#10b981"
                fillOpacity={0.12}
                // Recharts area range boundary logic using dataKey mapping
                // For a robust uncertainty band, we set the area's base to yhat_lower using the range coordinate property
                strokeWidth={0}
                connectNulls
              />
              {/* This is the alternative or helper area curve to render the lower margin cleanly */}
              <Area
                name="Lower Confidence Level"
                type="monotone"
                dataKey="yhat_lower"
                stroke="none"
                fill="#0f172a"
                fillOpacity={0.4}
                connectNulls
              />

              {/* Historical exact values representation */}
              <Area
                name="Historical Trade Actuals"
                type="linear"
                dataKey="historicalValue"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="none"
                connectNulls
              />

              {/* Forecast curve representation */}
              <Area
                name="Forecast Expectation (yhat)"
                type="monotone"
                dataKey="forecastValue"
                stroke="#10b981"
                strokeWidth={3}
                fill="none"
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend custom guidelines block */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs justify-center text-slate-400 font-sans border-t border-slate-800 pt-3">
          <div className="flex items-center gap-1.5 align-middle">
            <span className="inline-block h-3 w-8 bg-indigo-600 rounded"></span>
            <span>Historical Actuals</span>
          </div>
          <div className="flex items-center gap-1.5 align-middle">
            <span className="inline-block h-3 w-8 bg-emerald-500 rounded"></span>
            <span>Prophet Expectation (yhat)</span>
          </div>
          <div className="flex items-center gap-1.5 align-middle">
            <span className="inline-block h-3 w-8 bg-emerald-400/20 rounded border border-emerald-500/25"></span>
            <span>95% Confidence Band (yhat_upper/lower Range)</span>
          </div>
        </div>
      </div>

      {/* Variance forecast data list */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-900 border-b border-slate-800">
          <h4 className="text-base font-bold text-slate-200">
            Active Forecast Metrics &amp; Expected Variance (Q3-Q4)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-350 border-collapse">
            <thead>
              <tr className="bg-slate-950 font-mono text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-850">
                <th className="py-3 px-4 font-semibold">Forecast Period</th>
                <th className="py-3 px-4 font-semibold">Expected Value (yhat)</th>
                <th className="py-3 px-4 font-semibold">Lower Conf Buffer</th>
                <th className="py-3 px-4 font-semibold">Upper Conf Ceiling</th>
                <th className="py-3 px-4 font-semibold text-right">Variance Variance Span</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 font-mono">
              {forecastTableRows.map((row, idx) => {
                const varianceSpan = (row.yhat_upper - row.yhat_lower).toFixed(2);
                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans text-xs font-semibold text-slate-200">
                      {row.date} 2026 Proj
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">
                      ${row.forecastValue.toFixed(2)}M
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">${row.yhat_lower.toFixed(2)}M</td>
                    <td className="py-3.5 px-4 text-slate-400">${row.yhat_upper.toFixed(2)}M</td>
                    <td className="py-3.5 px-4 text-slate-300 text-right font-bold">
                      &plusmn;{varianceSpan}M
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
