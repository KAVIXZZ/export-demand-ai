import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, FileText, AlertCircle, RefreshCw, HelpCircle, Download } from "lucide-react";

export default function DataUploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateUploading = (name: string) => {
    setFileName(name);
    setUploadState("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("success");
          return 100;
        }
        return prev + 12;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateUploading(files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateUploading(files[0].name);
    }
  };

  const resetUpload = () => {
    setUploadState("idle");
    setProgress(0);
    setFileName("");
  };

  // Mock template content as base64 or download triggers
  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,date,value_usd,product_cat,destination\n2026-06-15,1420000,Ceylon Tea,Hamburg DE\n2026-06-16,3800000,Apparel,New York US\n2026-06-17,980000,Rubber,Shanghai CN\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stitch_ai_trade_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="upload-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-sans">
          Trade Dataset Ingestion
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-sans">
          Ingest new trade manifests, customs records, or local supplier logs into the Stitch AI forecasting engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Drag Field Dropzone (Col Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div
            id="drag-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all min-h-[340px] flex flex-col justify-center items-center relative gap-4 ${
              isDragging
                ? "border-indigo-500 bg-indigo-950/20"
                : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />

            {uploadState === "idle" && (
              <>
                <div className="bg-slate-950 p-4 rounded-full border border-slate-800 shadow-md">
                  <UploadCloud className="h-10 w-10 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Drag and Drop Trade CSV File Here
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports premium .csv files up to 100MB with standard headers.
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-all shadow-md cursor-pointer font-sans"
                  >
                    Select File
                  </button>
                  <button
                    onClick={downloadTemplate}
                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 font-medium text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <Download className="h-4 w-4" /> Template CSV
                  </button>
                </div>
              </>
            )}

            {uploadState === "uploading" && (
              <div className="w-full max-w-md space-y-4">
                <FileText className="h-12 w-12 text-indigo-400 mx-auto animate-bounce" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    Simulating parsing of {fileName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Checking headers schema, mapping categories, and parsing floating point columns...
                  </p>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm font-mono text-indigo-400 font-semibold">{progress}% COMPLETE</p>
              </div>
            )}

            {uploadState === "success" && (
              <div className="w-full max-w-lg space-y-4 animate-fade-in">
                <div className="bg-emerald-500/10 p-3 h-14 w-14 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-200">Parsed Successfully</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Stitch AI schema checker mapped 4 column headers with 100% confidence alignment.
                  </p>
                </div>

                {/* Parsed Metadata Table */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left font-sans">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">
                    Parsed Scheme Headers &amp; Sample Data
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-indigo-400 font-mono block">date</span>
                      <span className="text-slate-300 mt-1 block">Mapped: Date</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">Confidence: 100%</span>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-indigo-400 font-mono block">value_usd</span>
                      <span className="text-slate-300 mt-1 block">Mapped: USD Value</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">Confidence: 100%</span>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-indigo-400 font-mono block">product_cat</span>
                      <span className="text-slate-300 mt-1 block">Mapped: Category</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">Confidence: 98%</span>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-indigo-400 font-mono block">destination</span>
                      <span className="text-slate-300 mt-1 block">Mapped: Target Port</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">Confidence: 96%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Upload Another File
                  </button>
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 font-semibold text-slate-300 hover:text-white hover:bg-slate-900 text-xs rounded-lg cursor-pointer"
                  >
                    Clear Slate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Dashboard Guide Card (Col Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-200">
              CSV Field Guide &amp; Constraints
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              To trigger Prophet models correctly, your trade dataset must conform to standard database parameters. Stitch AI automatically identifies column syntax.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs">
                <div className="bg-slate-950 p-1 rounded border border-slate-850 text-indigo-400 font-mono shrink-0">
                  date
                </div>
                <p className="text-slate-300">
                  <strong className="block text-xs font-sans text-slate-200">Date Range</strong>
                  Supported formats: YYYY-MM-DD or YYYY/MM/DD. Must represent monthly or daily observations.
                </p>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className="bg-slate-950 p-1 rounded border border-slate-850 text-indigo-400 font-mono shrink-0">
                  value_usd
                </div>
                <p className="text-slate-300">
                  <strong className="block text-xs font-sans text-slate-200">Trade Value</strong>
                  Must represent numerical values in USD. Standard punctuation is ignored automatically.
                </p>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className="bg-slate-950 p-1 rounded border border-slate-850 text-indigo-400 font-mono shrink-0">
                  product_cat
                </div>
                <p className="text-slate-300">
                  <strong className="block text-xs font-sans text-slate-200">Product Categories</strong>
                  Recognized options: Ceylon Tea, Apparel, and Rubber for best model mapping.
                </p>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className="bg-slate-950 p-1 rounded border border-slate-850 text-indigo-400 font-mono shrink-0">
                  destination
                </div>
                <p className="text-slate-300">
                  <strong className="block text-xs font-sans text-slate-200">Destination Port</strong>
                  Name of destination country or shipping port (e.g. New York US or Hamburg DE).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
