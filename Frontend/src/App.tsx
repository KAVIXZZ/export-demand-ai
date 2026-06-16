import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Upload,
  TrendingDown,
  AlertTriangle,
  Cpu,
  FileText,
  ChevronRight,
  Menu,
  X,
  Compass,
  ArrowRight,
  User,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  LogOut
} from "lucide-react";

// Components
import DashboardPage from "./components/DashboardPage";
import DataUploadPage from "./components/DataUploadPage";
import ForecastingPage from "./components/ForecastingPage";
import RiskAnalysisPage from "./components/RiskAnalysisPage";
import AIInsightsPage from "./components/AIInsightsPage";
import ReportsPage from "./components/ReportsPage";
import AuthPage from "./components/AuthPage";
import { AppUser } from "./types";

// Mock database datasets
import { KPI_METRICS, RECENT_ALERTS, TRADE_ROUTES, HISTORICAL_FORECAST_DATA } from "./data/mockData";

// Preconfigured Axios API Endpoint instance targetting local FastAPI
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const raw = localStorage.getItem("stitch_ai_current_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [activePage, setActivePage] = useState<"dashboard" | "upload" | "forecasting" | "risk" | "insights" | "reports">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState(KPI_METRICS);
  const [alerts, setAlerts] = useState(RECENT_ALERTS);
  const [routes, setRoutes] = useState(TRADE_ROUTES);
  const [preloadedPrompt, setPreloadedPrompt] = useState<string>("");
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // Setup standard Axios test callback triggers
  useEffect(() => {
    // Attempt health check check on local http://127.0.0.1:8000/api so integration swaps are validated
    const checkApiHealth = async () => {
      try {
        const response = await api.get("/health");
        if (response.status === 200) {
          setApiOnline(true);
        }
      } catch (e) {
        // Fallback gracefully to offline status - expected since dashboard has default mock values
        setApiOnline(false);
      }
    };
    checkApiHealth();
  }, []);

  // Guard Clause to render login/register page if user is not authenticated
  if (!currentUser) {
    return (
      <AuthPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem("stitch_ai_current_user", JSON.stringify(user));
        }}
      />
    );
  }

  const handleTriggerMitigationFromRisk = (routeId: string) => {
    // Generate specialized expert advisor context prompt
    const chosenRoute = routes.find((r) => r.id === routeId);
    if (chosenRoute) {
      setPreloadedPrompt(
        `Draft multi-modal mitigation solutions for delays mapped along the route: "${chosenRoute.route}". Delay ETA stands at ${chosenRoute.delayEta} with variance factors: ${chosenRoute.delayFactor}.`
      );
    } else {
      setPreloadedPrompt("Mitigate Suez Canal shipping bottlenecks for apparel demand forecast.");
    }
    setActivePage("insights");
  };

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "upload", name: "Data Upload", icon: Upload },
    { id: "forecasting", name: "Forecasting", icon: TrendingUp },
    { id: "risk", name: "Risk Analysis", icon: AlertTriangle },
    { id: "insights", name: "AI Insights", icon: Cpu },
    { id: "reports", name: "Reports", icon: FileText }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 w-[240px] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-50 flex flex-col justify-between`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Top Title banner */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <svg className="h-5 w-5 text-white stroke-current inline" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white font-sans">
                  ExportIQ
                </h1>
                <span className="text-[10px] text-blue-400 font-mono font-semibold uppercase tracking-wider block">
                  Export Intelligence
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-100 p-1 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 select-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-[0_0_12px_rgba(79,70,229,0.1)] font-semibold"
                      : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar connection footer */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs">
              <div className="flex justify-between items-center text-slate-400 font-mono text-[10px] uppercase">
                <span>FastAPI Ingress</span>
                <span
                  className={`h-2 h-2 w-2 rounded-full ${
                    apiOnline ? "bg-emerald-400" : "bg-indigo-400 animate-pulse"
                  }`}
                ></span>
              </div>
              <p className="text-[11px] font-mono text-slate-300 mt-2 truncate">
                {apiOnline ? "http://127.0.0.1:8000" : "Mock Ingress Mode"}
              </p>
              <span className="text-[9px] text-slate-500 font-mono block mt-1">
                Axios preset targets ready
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 px-2 text-xs">
              <div className="flex items-center gap-3 truncate">
                <div className="h-8 w-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center p-1 text-indigo-455 shrink-0">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="truncate">
                  <h4 className="font-semibold text-slate-200 truncate">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{currentUser.role || "Lead Trade Analyst"}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  localStorage.removeItem("stitch_ai_current_user");
                }}
                className="p-1.5 hover:bg-slate-950/80 text-slate-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer shrink-0"
                title="Sign Out Workspace"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container viewport wrapper */}
      <div className="flex-1 lg:pl-[240px] flex flex-col min-h-screen bg-slate-950">
        {/* Top bar header */}
        <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md z-40 border-b border-slate-900 h-[64px] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-slate-100 p-1.5 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Intelligence Console
              </span>
              <span>/</span>
              <span className="font-medium capitalize">{activePage}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Model stats summary */}
            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <span>Prophet Engine:</span>
              <span className="text-emerald-400 font-bold">MAPv3</span>
            </div>
            <div className="h-4 w-px bg-slate-900 hidden sm:block"></div>
            <div className="flex items-center gap-1.5 text-slate-405 hover:text-slate-205 transition-colors cursor-pointer bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
              <span>FastAPI endpoint configuration logs</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </header>

        {/* Dynamic page component display slot */}
        <main className="flex-grow p-6 lg:p-10 max-w-7xl w-full mx-auto pb-20">
          {activePage === "dashboard" && (
            <DashboardPage
              metrics={metrics}
              alerts={alerts}
              onNavigateToRisk={() => setActivePage("risk")}
              onNavigateToForecast={() => setActivePage("forecasting")}
              chartData={HISTORICAL_FORECAST_DATA["Ceylon Tea"]}
            />
          )}

          {activePage === "upload" && <DataUploadPage />}

          {activePage === "forecasting" && <ForecastingPage />}

          {activePage === "risk" && (
            <RiskAnalysisPage
              routes={routes}
              onTriggerMitigation={handleTriggerMitigationFromRisk}
            />
          )}

          {activePage === "insights" && (
            <AIInsightsPage
              initialPrompt={preloadedPrompt}
              onClearInitialPrompt={() => setPreloadedPrompt("")}
            />
          )}

          {activePage === "reports" && <ReportsPage />}
        </main>
      </div>
    </div>
  );
}
