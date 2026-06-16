import React, { useState } from "react";
import { FileText, Download, CheckSquare, ListFilter, AlertCircle, RefreshCw, FileArchive, Search } from "lucide-react";
import { MOCK_REPORTS } from "../data/mockData";
import { ReportItem } from "../types";

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(MOCK_REPORTS);
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("Custom AI Briefing");
  const [includeVolume, setIncludeVolume] = useState(true);
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeRisk, setIncludeRisk] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      const newReport: ReportItem = {
        id: Math.random().toString(),
        name: `Stitch AI compiled_${activeTemplate.toLowerCase().replace(/ /g, "_")}.pdf`,
        dateGenerated: "2026-06-16",
        type: activeTemplate,
        size: "2.1 MB",
        downloadTag: activeTemplate.toUpperCase().replace(/ /g, "_")
      };
      setReports((prev) => [newReport, ...prev]);
      setIsCompiling(false);
    }, 2000);
  };

  const filteredReports = reports.filter((rep) =>
    rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rep.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in" id="reports-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-sans">
          Analytics &amp; Document Compiler
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-sans">
          Lock, assemble, and export certified PDF briefings summarizing our active trade predictions and intermodal route buffers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Report Blueprint setup (Col Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
            <h3 className="text-base font-bold text-slate-200 uppercase tracking-widest font-mono text-xs pb-2 border-b border-slate-850">
              Compilation Workbench
            </h3>

            {/* Template select option */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Report Template
              </label>
              <select
                value={activeTemplate}
                onChange={(e) => setActiveTemplate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg text-xs py-2 px-3 text-slate-200 focus:border-indigo-500 focus:outline-none font-sans"
              >
                <option value="Monthly Export Summary">Monthly Export Summary</option>
                <option value="Tariff Impact Analysis">Tariff Impact Analysis</option>
                <option value="Regional Performance (APAC)">Regional Performance (APAC)</option>
                <option value="Custom AI Briefing">Custom AI Briefing</option>
              </select>
            </div>

            {/* Date parameter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Observation Date
              </label>
              <input
                type="date"
                defaultValue="2026-06-16"
                className="w-full bg-slate-950 border border-slate-850 rounded-lg text-xs py-2 px-3 text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            {/* Inclusions selection checkboxes */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                Include Parameters
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-305 cursor-pointer font-sans">
                  <input
                    type="checkbox"
                    checked={includeVolume}
                    onChange={(e) => setIncludeVolume(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  Volume Metrics (TEU)
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-305 cursor-pointer font-sans">
                  <input
                    type="checkbox"
                    checked={includeFinancials}
                    onChange={(e) => setIncludeFinancials(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  Financial Impact (Variance)
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-305 cursor-pointer font-sans">
                  <input
                    type="checkbox"
                    checked={includeRisk}
                    onChange={(e) => setIncludeRisk(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  Vulnerabilities Overlay (Suez bottlenecks)
                </label>
              </div>
            </div>

            {/* Generate PDF button displaying CircularProgress indicator */}
            <div className="pt-2 border-t border-slate-850">
              <button
                disabled={isCompiling}
                onClick={handleCompile}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/40 text-white font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer font-sans flex items-center justify-center gap-2"
              >
                {isCompiling ? (
                  <>
                    {/* MUI-styled CircularProgress spinning circle representation */}
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Assembling PDF Data blocks...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Generate PDF Export</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Archives Historical grid (Col Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
            {/* Header / Query selection */}
            <div className="p-4 bg-slate-900 border-b border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <FileArchive className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-205 font-sans">
                  Historical Briefings Archive
                </h3>
              </div>

              {/* Search filter input */}
              <div className="relative w-full sm:w-64">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter archives..."
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none placeholder:text-slate-500 font-sans"
                />
              </div>
            </div>

            {/* Table of PDF outputs */}
            <div className="overflow-x-auto flex-1 min-h-[300px]">
              <table className="w-full text-left text-xs text-slate-350 border-collapse">
                <thead>
                  <tr className="bg-slate-950 font-mono text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-850">
                    <th className="py-3 px-4 font-semibold">Document Name</th>
                    <th className="py-3 px-4 font-semibold">Date Created</th>
                    <th className="py-3 px-4 font-semibold">Classification</th>
                    <th className="py-3 px-4 font-semibold">Size</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 font-mono">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-900/45 transition-colors group">
                      <td className="py-3.5 px-4 font-sans text-xs font-semibold text-slate-100 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-[340px]">
                          {report.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {report.dateGenerated}
                      </td>
                      <td className="py-3.5 px-4 text-slate-305">
                        <span className="bg-slate-950 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-850">
                          {report.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {report.size}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-2 text-indigo-400">
                          <button
                            onClick={() => {
                              const base64Uri = `data:text/plain;charset=utf-8,Mock compiled export for ${report.name}`;
                              const link = document.createElement("a");
                              link.setAttribute("href", encodeURI(base64Uri));
                              link.setAttribute("download", report.name);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:text-white px-2.5 py-1.5 rounded text-[11px] flex items-center gap-1.5 cursor-pointer font-sans transition-colors"
                          >
                            <Download className="h-3 w-3" /> Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                        No historical archives match query parameter filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
