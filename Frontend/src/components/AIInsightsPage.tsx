import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Cpu, Sparkles, BookOpen, Clock, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";
import { SMART_ANSWERS } from "../data/mockData";

interface AIInsightsPageProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export default function AIInsightsPage({ initialPrompt, onClearInitialPrompt }: AIInsightsPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Welcome to Stitch AI Decision Advisor. I am your generative trade logistics copilot. You can query me on historical export volumes, predictive lane delays, or ask me to draft multi-modal mitigation solutions for active geopolitical bottlenecks. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Execute a simulated response based on question
  const submitQuery = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Identify keyword context
    let selectedResponse = SMART_ANSWERS.custom;
    const lowerPrompt = promptText.toLowerCase();

    if (lowerPrompt.includes("red sea") || lowerPrompt.includes("suez") || lowerPrompt.includes("mitigate")) {
      selectedResponse = SMART_ANSWERS.red_sea;
    } else if (lowerPrompt.includes("apparel") || lowerPrompt.includes("usa") || lowerPrompt.includes("predict")) {
      selectedResponse = SMART_ANSWERS.apparel;
    } else if (lowerPrompt.includes("rubber") || lowerPrompt.includes("weather") || lowerPrompt.includes("assessment")) {
      selectedResponse = SMART_ANSWERS.rubber;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: selectedResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitQuery(userInput);
      setUserInput("");
    }
  };

  // If we came from another page with a preloaded prompt, trigger it immediately
  useEffect(() => {
    if (initialPrompt) {
      submitQuery(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  return (
    <div className="space-y-6 animate-fade-in" id="ai-insights-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-sans flex items-center gap-2">
          <Cpu className="h-6 w-6 text-indigo-400 animate-pulse" />
          Decision Advisor Chat
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-sans">
          Generative model specializing in intermodal rerouting models, port congestion mitigation matrices, and demand trends.
        </p>
      </div>

      {/* Main Splitscreen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Side: ChatGPT Layout (Col Span 8) */}
        <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden h-[540px]">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">
                  Stitch AI Gen-2 Co-Advisor
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">Online • Decision Logic Model</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 font-mono">
              Temperature=0.2 (Precise)
            </div>
          </div>

          {/* Messages block */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/10 scrollbar-thin">
            {messages.map((m) => {
              const isAi = m.sender === "ai";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  <div
                    className={`h-8 h-8 w-8 shrink-0 rounded-lg flex items-center justify-center p-1 border shadow-sm ${
                      isAi
                        ? "bg-indigo-950/20 text-indigo-400 border-indigo-400/20"
                        : "bg-slate-900 text-slate-300 border-slate-800"
                    }`}
                  >
                    {isAi ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                  </div>
                  <div
                    className={`p-3.5 rounded-xl border text-sm leading-relaxed font-sans ${
                      isAi
                        ? "bg-slate-950/80 text-slate-200 border-slate-850"
                        : "bg-indigo-600/90 text-white border-indigo-500"
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="text-[9px] text-slate-500 font-mono mt-2 block text-right">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-indigo-950/20 text-indigo-400 border border-indigo-400/20 flex items-center justify-center p-1">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="p-3.5 rounded-xl border bg-slate-950/80 text-slate-300 border-slate-850 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-xs text-slate-500 font-mono">Synthesizing diagnostic variables...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input field */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about Ceylon Tea routing alternatives, US apparel trends, etc."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none placeholder:text-slate-500 font-sans"
            />
            <button
              onClick={() => {
                submitQuery(userInput);
                setUserInput("");
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Quick Diagnostic Trigger Buttons (Col Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 h-full">
            <div className="pb-2 border-b border-slate-850">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                Advisor Short-Cuts
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Trigger high-performance diagnostic queries directly with pre-compiled models.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => submitQuery("Mitigate Red Sea Suez Route delays for Colombo to Hamburg exports")}
                className="w-full text-left p-3 rounded-lg bg-slate-950 hover:bg-indigo-950/10 border border-slate-850 hover:border-indigo-500/20 transition-all font-sans text-xs group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 group-hover:text-indigo-400">
                    Mitigate Suez Route Delays
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 opacity-60" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Draft Cape of Good Hope intermodal routing options for tea shipments.
                </p>
              </button>

              <button
                onClick={() => submitQuery("Predict USA Apparel winter sourcing trends and port buffer needs")}
                className="w-full text-left p-3 rounded-lg bg-slate-950 hover:bg-indigo-950/10 border border-slate-850 hover:border-indigo-500/20 transition-all font-sans text-xs group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 group-hover:text-indigo-400">
                    Predict USA Apparel Trends
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 opacity-60" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Forecast stock replenishment spikes and recommend port buffer capacity.
                </p>
              </button>

              <button
                onClick={() => submitQuery("Analyze SEA weather threat index for bulk Rubber loading yards")}
                className="w-full text-left p-3 rounded-lg bg-slate-950 hover:bg-indigo-950/10 border border-slate-850 hover:border-indigo-500/20 transition-all font-sans text-xs group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 group-hover:text-indigo-400">
                    Weather Vulnerability Check
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 opacity-60" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Check rain indices and recommended logistics margins for raw material hubs.
                </p>
              </button>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl mt-4 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed font-sans">
              <AlertCircle className="h-5 w-5 text-indigo-400 shrink-0" />
              <p>
                <strong>Tip:</strong> Quick triggers immediately update the diagnostic context and retrieve the highly specialized ML rule responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
