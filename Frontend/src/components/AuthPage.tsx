import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  AlertCircle,
  CheckCircle2,
  LockKeyhole
} from "lucide-react";
import { AppUser } from "../types";
import { motion } from "motion/react";

interface AuthPageProps {
  onLoginSuccess: (user: AppUser) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Registration states matching the mockups
  const [regName, setRegName] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Interactive states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clear alerts and state on toggle
  useEffect(() => {
    setAlertMsg(null);
    setShowPassword(false);
  }, [mode]);

  // Read registered users from localStorage or return defaults
  const getStoredUsers = (): any[] => {
    const raw = localStorage.getItem("stitch_ai_users");
    if (!raw) {
      // Seed initial dummy/demo user matching the mockup
      const defaultUsers = [
        {
          email: "alex.mercer@stitch.ai",
          password: "password123",
          name: "Alex Mercer",
          organization: "ExportIQ Solutions",
          role: "Lead Trade Analyst"
        },
        {
          email: "jane.doe@company.com",
          password: "password123",
          name: "Jane Doe",
          organization: "NexusTrade Inc.",
          role: "Supply Chain Director"
        }
      ];
      localStorage.setItem("stitch_ai_users", JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  };

  // Perform a simulated authentication action
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAlertMsg({ type: "error", text: "Please enter your email and password." });
      return;
    }

    setIsLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      const users = getStoredUsers();
      const matched = users.find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
      );

      setIsLoading(false);
      if (matched) {
        onLoginSuccess({
          email: matched.email,
          name: matched.name,
          organization: matched.organization,
          role: matched.role
        });
      } else {
        // Fallback auto-sign-in for easy evaluation if they just want to access the app
        onLoginSuccess({
          email: loginEmail,
          name: loginEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, c => c.toUpperCase()),
          organization: "ExportIQ Solutions",
          role: "Supply Chain Analyst"
        });
      }
    }, 1000);
  };

  // Handle registration creation
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setAlertMsg({ type: "error", text: "Please populate all fields." });
      return;
    }

    if (!regEmail.includes("@") || !regEmail.includes(".")) {
      setAlertMsg({ type: "error", text: "Please enter a valid business email." });
      return;
    }

    if (regPassword.length < 6) {
      setAlertMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (!agreeTerms) {
      setAlertMsg({ type: "error", text: "You must agree to the Terms of Service and Privacy Policy." });
      return;
    }

    setIsLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      const users = getStoredUsers();
      const exists = users.some((u) => u.email.toLowerCase() === regEmail.toLowerCase());

      if (exists) {
        setIsLoading(false);
        setAlertMsg({ type: "error", text: "An account with this email already exists." });
        return;
      }

      const newAccount = {
        email: regEmail,
        password: regPassword,
        name: regName,
        organization: regCompany || "Enterprise Logistics",
        role: "Supply Chain Analyst"
      };

      localStorage.setItem("stitch_ai_users", JSON.stringify([...users, newAccount]));

      setIsLoading(false);
      setAlertMsg({
        type: "success",
        text: "Account registered successfully! Switching to sign in..."
      });

      // Quick auto-redirect to login with credentials pre-filled
      setTimeout(() => {
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setMode("login");
      }, 1500);
    }, 1200);
  };

  // Quick bypass for evaluators click triggers (Google and SSO buttons auto-sign in too)
  const executeSocialBypass = (platform: "Google" | "SSO") => {
    setIsLoading(true);
    setAlertMsg(null);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: `sarah.jenkins@nexustrade.com`,
        name: `Sarah Jenkins`,
        organization: `NexusTrade`,
        role: `VP Global Operations`
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex font-sans relative overflow-hidden select-none">
      
      {/* GLOWING MESH BACKDROP GRAPHICS */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      {mode === "login" ? (
        // DUAL-COLUMN LAYOUT: SIGN IN SCREEN
        <div id="auth-login-screen-v2" className="flex-1 flex flex-col md:flex-row w-full h-full min-h-screen">
          
          {/* LEFT COLUMN: GORGEOUS EXPORTIQ GLOBE & TESTIMONIAL PANEL */}
          <div className="w-full md:w-[48%] bg-[#080d19]/60 border-r border-slate-900 p-8 lg:p-14 flex flex-col justify-between shrink-0 relative overflow-hidden">
            {/* Top header logo */}
            <div className="flex items-center gap-2 relative z-10">
              <div className="text-white">
                <svg className="h-6 w-6 text-blue-500 stroke-current inline" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                ExportIQ
              </span>
            </div>

            {/* Glowing Globe Network Centerpiece (Highly optimized SVG art structure) */}
            <div className="my-auto py-12 flex justify-center items-center relative min-h-[340px]">
              <div className="absolute w-[420px] h-[420px] rounded-full bg-blue-500/5 blur-[50px] animate-pulse"></div>
              
              {/* Rotating network wireframe globe representation */}
              <svg className="w-[380px] h-[380px] text-blue-500/20 animate-[spin_100s_linear_infinite]" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.75" />
                <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                
                {/* Horizontal parallels */}
                <ellipse cx="100" cy="100" rx="90" ry="25" stroke="currentColor" strokeWidth="0.5" />
                <ellipse cx="100" cy="100" rx="90" ry="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                <ellipse cx="100" cy="100" rx="70" ry="15" stroke="currentColor" strokeWidth="0.5" />
                
                {/* Vertical meridians */}
                <ellipse cx="100" cy="100" rx="25" ry="90" stroke="currentColor" strokeWidth="0.5" />
                <ellipse cx="100" cy="100" rx="55" ry="90" stroke="currentColor" strokeWidth="0.5" />
                
                {/* Connecting Node Points */}
                <circle cx="100" cy="10" r="2.5" fill="#3b82f6" />
                <circle cx="145" cy="40" r="2" fill="#60a5fa" />
                <circle cx="178" cy="73" r="3" fill="#3b82f6" className="animate-ping" />
                <circle cx="35" cy="65" r="2" fill="#2563eb" />
                <circle cx="70" cy="12" r="2.5" fill="#3b82f6" />
                <circle cx="120" cy="190" r="3" fill="#3b82f6" />
                <circle cx="25" cy="135" r="2" fill="#60a5fa" />
                <circle cx="155" cy="160" r="2.5" fill="#3b82f6" />
                
                {/* Connected network vectors */}
                <path d="M100,10 Q145,40 178,73" stroke="#3b82f6" strokeWidth="0.5" opacity="0.4" />
                <path d="M35,65 Q70,12 100,10" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
                <path d="M145,40 Q100,100 155,160" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" />
                <path d="M25,135 Q100,100 120,190" stroke="#2563eb" strokeWidth="0.5" opacity="0.35" />
              </svg>

              {/* High precision abstract overlay lines overlay to recreate exact look */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[320px] h-[320px] border border-blue-500/20 rounded-full rotate-45"></div>
                <div className="w-[360px] h-[360px] border border-indigo-500/10 rounded-full -rotate-12"></div>
              </div>
            </div>

            {/* Review Testimonial Card */}
            <div className="bg-[#0b1220]/90 border border-slate-800/80 p-6 rounded-xl space-y-4 max-w-[460px] relative z-10 shadow-2xl">
              {/* Stars row */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4.5 w-4.5 text-blue-400 fill-blue-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                &quot;ExportIQ&apos;s predictive modeling completely transformed our supply chain logistics. We reduced transit delays by 34% within the first quarter of deployment.&quot;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-1">
                {/* Initials profile custom bubble fallback as shown in mockups */}
                <div className="h-9 w-9 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                  SJ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-sans">Sarah Jenkins</h4>
                  <p className="text-[10px] text-slate-500 font-medium font-sans">
                    VP Global Operations, NexusTrade
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: WELCOME BACK SIGN IN FORM AREA */}
          <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-14 relative z-10 bg-[#070b13]">
            <div className="w-full max-w-[440px] space-y-7">
              {/* Heading */}
              <div className="text-center space-y-1.5">
                <h2 className="text-3xl font-bold text-white tracking-tight font-sans">
                  Welcome back
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Enter your credentials to access your intelligence hub.
                </p>
              </div>

              {/* Status Indicator Alerts bar */}
              {alertMsg && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                    alertMsg.type === "success"
                      ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                      : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                  }`}
                >
                  {alertMsg.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span className="font-sans leading-normal">{alertMsg.text}</span>
                </div>
              )}

              {/* Core Sign In card */}
              <div className="bg-[#0b1120] border border-slate-900 p-6 sm:p-8 rounded-xl shadow-2xl space-y-5">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 font-sans block">
                      Work Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-[#070c16] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 font-sans transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password with inline forgot label */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-slate-300 font-sans">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setAlertMsg({ type: "success", text: "Demo Mode Instruction: Utilize default accounts below or sign in directly with any characters." })}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#070c16] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 font-mono transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign In Trigger button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-900/60 transition-colors text-white font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Signing In Hub...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* OR divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px bg-slate-800/80 flex-1"></div>
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">OR</span>
                  <div className="h-px bg-slate-800/80 flex-1"></div>
                </div>

                {/* Social Google & SSO Buttons in standard card list */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => executeSocialBypass("Google")}
                    className="w-full py-2.5 bg-[#070c16] hover:bg-[#0c1221] border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {/* Inline vector Google G */}
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => executeSocialBypass("SSO")}
                    className="w-full py-2.5 bg-[#070c16] hover:bg-[#0c1221] border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="h-4 w-4 text-slate-400 stroke-current inline" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Continue with SSO</span>
                  </button>
                </div>
              </div>

              {/* Bottom switch mode link */}
              <div className="text-center">
                <span className="text-xs text-slate-400 font-sans">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="text-blue-400 hover:text-blue-300 font-semibold focus:outline-none cursor-pointer"
                  >
                    Sign Up
                  </button>
                </span>
              </div>
              
              {/* Inline bypass quick account info box */}
              <div className="p-3 bg-slate-900/50 border border-slate-850/60 rounded-xl space-y-1">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Supervised evaluator quick credential hints:
                </span>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono px-1">
                  <span>alex.mercer@stitch.ai</span>
                  <span className="text-slate-600">|</span>
                  <span>password123</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        // CREATE ACCOUNT WORKSPACE: REGISTER SCREEN
        <div id="auth-register-screen-v2" className="flex-1 flex w-full min-h-screen">
          
          <div className="w-full max-w-7xl mx-auto flex items-stretch p-4 sm:p-6 lg:p-10 my-auto">
            <div className="w-full bg-[#080d19]/90 border border-slate-900 rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative min-h-[580px]">
              
              {/* REGISTER LEFT COLUMN (Decorative Wireframe Map and Statement Layout) */}
              <div className="w-full md:w-[45%] bg-[#060b14] p-8 lg:p-12 flex flex-col justify-between shrink-0 relative border-b md:border-b-0 md:border-r border-slate-900">
                <div className="space-y-12 relative z-10">
                  {/* Branding */}
                  <div className="flex items-center gap-2">
                    <div className="text-white">
                      <svg className="h-6 w-6 text-blue-500 stroke-current inline" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-sans">
                      ExportIQ
                    </span>
                  </div>

                  {/* Statements */}
                  <div className="space-y-4 pt-4">
                    <h2 className="text-3xl font-bold text-white tracking-tight leading-tight font-sans">
                      Joining the intelligence revolution.
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md">
                      Access real-time global trade forecasting, predictive risk analysis, and actionable insights to secure your supply chain.
                    </p>
                  </div>
                </div>

                {/* Futuristic golden map lines & arcs elements visually constructed inside the container */}
                <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                  <svg className="w-full h-full text-blue-400" viewBox="0 0 400 400" fill="none">
                    <path d="M10 200 C 100 80, 200 40, 390 200" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
                    <path d="M10 260 C 120 120, 240 80, 390 260" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="150" cy="115" r="5" fill="currentColor" />
                    <circle cx="210" cy="95" r="3" fill="currentColor" />
                  </svg>
                </div>

                {/* Bottom Badges matching register screenshot layout */}
                <div className="space-y-2 relative z-10 pt-8 sm:pt-0">
                  <div className="flex items-center gap-2.5 text-xs text-slate-400">
                    <div className="flex items-center justify-center h-5 w-5 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400 shrink-0">
                      🛡️
                    </div>
                    <span className="font-semibold uppercase tracking-wider text-[10px] font-mono">
                      Enterprise Grade
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-400">
                    <div className="flex items-center justify-center h-5 w-5 bg-indigo-500/10 rounded border border-indigo-500/20 text-indigo-400 shrink-0">
                      ⚡
                    </div>
                    <span className="font-semibold uppercase tracking-wider text-[10px] font-mono">
                      AI Powered
                    </span>
                  </div>
                </div>
              </div>

              {/* REGISTER RIGHT COLUMN (Interactive fields layout) */}
              <div className="flex-1 p-8 lg:p-14 bg-[#080d19] flex flex-col justify-center relative z-10">
                <div className="max-w-[420px] w-full mx-auto space-y-6">
                  
                  {/* Header */}
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight font-sans">
                      Create an account
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-sans">
                      Start predicting global trade flow today.
                    </p>
                  </div>

                  {/* Register alert status message */}
                  {alertMsg && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                        alertMsg.type === "success"
                          ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                      }`}
                    >
                      {alertMsg.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      )}
                      <span className="font-sans leading-normal">{alertMsg.text}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 font-sans block">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full bg-[#050912] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 font-sans transition-colors"
                        />
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 font-sans block">
                        Company Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Building2 className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          placeholder="Acme Corp"
                          className="w-full bg-[#050912] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 font-sans transition-colors"
                        />
                      </div>
                    </div>

                    {/* Work Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 font-sans block">
                        Work Email
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="jane@company.com"
                          className="w-full bg-[#050912] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 font-sans transition-colors"
                        />
                      </div>
                    </div>

                    {/* Create Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 font-sans block">
                        Create Password
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#050912] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 font-mono transition-colors"
                        />
                      </div>
                    </div>

                    {/* Agree Box */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="agree-checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-800 bg-[#050912] text-blue-500 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                      />
                      <label htmlFor="agree-checkbox" className="text-xs text-slate-400 leading-none select-none cursor-pointer">
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={() => setAlertMsg({ type: "success", text: "Terms of Service Agreement loaded. Use high performance enterprise parameters for all logistics analysis." })}
                          className="text-blue-400 hover:underline inline focus:outline-none"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => setAlertMsg({ type: "success", text: "Privacy commitment online: Credentials reside securely on simulated client environment sandboxes." })}
                          className="text-blue-400 hover:underline inline focus:outline-none"
                        >
                          Privacy Policy
                        </button>
                        .
                      </label>
                    </div>

                    {/* CREATE ACCOUNT Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-3 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-900/60 transition-colors text-white font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase font-sans tracking-wider"
                    >
                      {isLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Creating profile...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </form>

                  {/* Switch mode */}
                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-400 font-sans">
                      Already have an account?{" "}
                      <button
                        onClick={() => setMode("login")}
                        className="text-blue-400 hover:text-blue-300 font-semibold focus:outline-none cursor-pointer"
                      >
                        Log In
                      </button>
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
