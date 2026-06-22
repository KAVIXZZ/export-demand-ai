import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  FileText, 
  Database, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Globe
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState({
    exportValue: "29.8M",
    accuracy: "94.2%",
    routes: "2 Routes",
    dbStatus: false,
    ingressStatus: "Initializing...",
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
        
        const response = await fetch('http://localhost:8000/api/dashboard-status', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Backend offline");

        const result = await response.json();
        
        setData({
          exportValue: result.exportValue || "29.8M",
          accuracy: result.accuracy || "94.2%",
          routes: result.routes || "2 Routes",
          dbStatus: result.dbConnected,
          ingressStatus: result.dbConnected ? "FastAPI Production Core Active" : "Mock Ingress Mode",
          loading: false
        });
      } catch (error) {
        console.warn("API Error, using fallback:", error.message);
        setData(prev => ({
          ...prev,
          dbStatus: false,
          ingressStatus: "Mock Ingress Mode (API Error)",
          loading: false
        }));
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-300 font-sans flex">
      <div className="w-64 bg-[#111827] p-4 flex flex-col border-r border-gray-800">
        <div className="text-white font-bold text-xl mb-8 flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-xs">EI</div> ExportIQ
        </div>
        
        <nav className="space-y-2 flex-grow">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <NavItem icon={<Upload size={18}/>} label="Data Upload" />
          <NavItem icon={<TrendingUp size={18}/>} label="Forecasting" />
          <NavItem icon={<AlertTriangle size={18}/>} label="Risk Analysis" />
          <NavItem icon={<Cpu size={18}/>} label="AI Insights" />
          <NavItem icon={<FileText size={18}/>} label="Reports" />
        </nav>

        <div className="mt-auto border border-gray-700 rounded-lg p-4 bg-[#0f172a]">
          <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-3">FastAPI Ingress</div>
          <div className="flex items-center justify-between">
            <div className={`text-xs font-medium ${data.dbStatus ? 'text-green-400' : 'text-yellow-500'}`}>
              {data.ingressStatus}
            </div>
            {data.dbStatus ? <CheckCircle size={14} className="text-green-500"/> : <XCircle size={14} className="text-yellow-500"/>}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Stitch AI Executive Dashboard</h1>
            <p className="text-sm text-gray-400">AI-Driven Export Demand Forecasting & Supply Chain Intelligence</p>
          </div>
          <div className="bg-[#111827] px-4 py-2 rounded-full text-sm border border-gray-700 flex items-center gap-2">
            <Database size={16} className={data.dbStatus ? "text-green-500" : "text-yellow-500"}/>
            {data.dbStatus ? "Connected" : "Disconnected"}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Export Value" value={`$${data.exportValue}`} icon={<BarChart3 className="text-blue-500"/>} />
          <StatCard title="Prophet AI Accuracy" value={data.accuracy} icon={<Cpu className="text-purple-500"/>} />
          <StatCard title="High-Risk Lanes" value={data.routes} icon={<Globe className="text-orange-500"/>} />
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-lg p-8 h-96 flex items-center justify-center text-gray-600">
          Analytics Visualization Layer
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <a href="#" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? 'text-white bg-blue-900/20 border-l-2 border-blue-500' : 'hover:text-white hover:bg-gray-800'}`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#111827] p-6 rounded-lg border border-gray-800 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-gray-500 text-xs uppercase font-semibold mb-1">{title}</div>
          <div className="text-3xl font-bold text-white mt-2">{value}</div>
        </div>
        <div className="p-2 bg-gray-900 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}