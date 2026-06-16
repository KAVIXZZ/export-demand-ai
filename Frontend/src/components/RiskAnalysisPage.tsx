import React, { useMemo } from "react";
import { AlertOctagon, HelpCircle, AlertTriangle, Play, ShieldAlert, Compass, Globe } from "lucide-react";
import { TradeAlert } from "../types";

interface RiskAnalysisPageProps {
  routes: TradeAlert[];
  onTriggerMitigation: (routeId: string) => void;
}

export default function RiskAnalysisPage({ routes, onTriggerMitigation }: RiskAnalysisPageProps) {
  // Highlight Suez bottlenecks as the absolute priority card at the top
  const topBottleneck = useMemo(() => {
    return routes.find((r) => r.id === "alert-1");
  }, [routes]);

  return (
    <div className="space-y-6 animate-fade-in" id="risk-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-sans flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-rose-500" />
          ML Supply Chain Risk Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-sans">
          Real-time geopolitical shipping classification metrics, delay factor forecasts, and spot rate variance logs.
        </p>
      </div>

      {/* Top Red Sea / Suez canal alert highlight */}
      {topBottleneck && (
        <div className="bg-rose-950/20 border-2 border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-105 duration-300">
            <AlertOctagon className="h-32 w-32 text-rose-500" />
          </div>
          <span className="bg-rose-500 text-white text-[10px] font-bold font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border border-rose-400/20 animate-pulse inline-block mb-3">
            Top Priority Geopolitical Bottleneck Alert
          </span>
          <h2 className="text-xl font-bold text-rose-350 tracking-tight font-sans">
            {topBottleneck.route}
          </h2>
          <p className="text-xs text-slate-350 mt-2 max-w-3xl leading-relaxed font-sans">
            {topBottleneck.description}
          </p>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/50 p-4 border border-rose-500/10 rounded-xl max-w-4xl">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block font-sans">
                Delay ETA
              </span>
              <strong className="text-rose-400 font-mono text-sm block mt-1">
                {topBottleneck.delayEta}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block font-sans">
                Spot Rate Premium
              </span>
              <strong className="text-rose-400 font-mono text-sm block mt-1">
                {topBottleneck.freightCostImpact}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block font-sans">
                Vessel Risk Index
              </span>
              <strong className="text-rose-400 font-mono text-sm block mt-1">
                {topBottleneck.impactScore}/100 Critical
              </strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block font-sans">
                Mitigation Potential
              </span>
              <span className="text-emerald-400 font-semibold block mt-1 font-sans">
                Active Alternative Lanes
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => onTriggerMitigation(topBottleneck.id)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg cursor-pointer flex items-center gap-1.5 font-sans"
            >
              <Play className="h-4 w-4" /> Simulate Mitigation Scenario
            </button>
          </div>
        </div>
      )}

      {/* Grid of Route Risk Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200 uppercase tracking-widest font-mono text-xs">
          Global Route Vulnerabilities Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route) => {
            const isHigh = route.severity === "high";
            const isMedium = route.severity === "medium";
            return (
              <div
                key={route.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between relative group ${
                  isHigh
                    ? "border-rose-500/20 hover:border-rose-500/40"
                    : isMedium
                    ? "border-amber-500/20 hover:border-amber-500/40"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded-full border ${
                        isHigh
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : isMedium
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {route.severity} Priority
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      Vessel Index: {route.impactScore}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 font-sans group-hover:text-indigo-400 transition-colors">
                    {route.route}
                  </h4>

                  <div className="mt-4 space-y-2 border-t border-slate-900 pt-3">
                    <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed">
                      <div>
                        <span className="text-slate-400 block font-sans">Origin</span>
                        <span className="text-slate-200 block font-mono">{route.origin}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-sans">Destination</span>
                        <span className="text-slate-200 block font-mono">{route.destination}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/50 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Expected Delay:</span>
                        <strong className="text-slate-200 font-mono">{route.delayEta}</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Delay Factor:</span>
                        <strong className="text-slate-300 truncate max-w-[120px] font-sans">
                          {route.delayFactor}
                        </strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Cost Impact:</span>
                        <strong className="text-rose-400 font-mono">{route.freightCostImpact}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850/50">
                  <button
                    onClick={() => onTriggerMitigation(route.id)}
                    className={`w-full py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 font-sans ${
                      isHigh
                        ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                        : isMedium
                        ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300"
                        : "bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    <Play className="h-3 w-3" /> Simulate Mitigations
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
