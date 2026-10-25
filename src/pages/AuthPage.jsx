import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User, Shield, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, Sparkles, Database, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, resetPassword, login, isConfigured } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CONTRIBUTOR"); // "CONTRIBUTOR" | "EDITOR"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const redirectPath = location.state?.from?.pathname || (role === "EDITOR" ? "/dashboard/editorial" : "/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (isConfigured) {
          await signIn(email, password);
          setSuccessMessage("Authentication successful. Redirecting to workspace...");
          setTimeout(() => navigate(redirectPath), 600);
        } else {
          // Fallback demo login when Supabase credentials are not yet entered
          login({
            id: "user-" + Date.now(),
            name: email.split("@")[0],
            email,
            role: "CONTRIBUTOR",
            contributorId: "CONT-" + Math.floor(1000 + Math.random() * 9000),
          });
          setSuccessMessage("Signed in in demo mode. Redirecting...");
          setTimeout(() => navigate(redirectPath), 600);
        }
      } else if (mode === "signup") {
        if (isConfigured) {
          const res = await signUp(email, password, { name, role });
          if (res?.session) {
            setSuccessMessage("Account created successfully! Redirecting...");
            setTimeout(() => navigate(redirectPath), 800);
          } else {
            setSuccessMessage(
              "Account registered! If email confirmation is enabled in your Supabase project, check your inbox for the link, then sign in below."
            );
            setMode("login");
          }
        } else {
          login({
            id: "user-" + Date.now(),
            name: name || email.split("@")[0],
            email,
            role,
            contributorId: "CONT-" + Math.floor(1000 + Math.random() * 9000),
          });
          setSuccessMessage("Demo account created! Redirecting...");
          setTimeout(() => navigate(redirectPath), 600);
        }
      } else if (mode === "forgot") {
        if (isConfigured) {
          await resetPassword(email);
          setSuccessMessage("Password reset email sent! Please check your inbox for the reset link.");
        } else {
          setSuccessMessage("Reset instructions simulated. (Demo Mode)");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      const msg = err.message || "";
      if (msg.toLowerCase().includes("email not confirmed")) {
        setErrorMessage(
          "Your email address has not been confirmed yet. Please check your email inbox for the Supabase confirmation link (or disable 'Confirm email' under Supabase Dashboard -> Authentication -> Providers -> Email for instant logins)."
        );
      } else if (msg.toLowerCase().includes("invalid login credentials")) {
        setErrorMessage(
          "Invalid email or password. If you haven't created an account yet, click the 'Sign Up' tab above to register first."
        );
      } else if (msg.toLowerCase().includes("user already registered")) {
        setErrorMessage("An account with this email already exists. Please switch to 'Sign In'.");
      } else {
        setErrorMessage(msg || "Failed to authenticate. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole) => {
    if (demoRole === "EDITOR") {
      login({
        id: "demo-editor",
        name: "Priya Nair",
        email: "priya.editor@intellus.in",
        role: "EDITOR",
        contributorId: "EDTR-0012",
      });
      navigate("/dashboard/editorial");
    } else {
      login({
        id: "demo-contributor",
        name: "Aarav Sharma",
        email: "aarav.reporter@intellus.in",
        role: "CONTRIBUTOR",
        contributorId: "CONT-8492",
      });
      navigate("/dashboard/contributor");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[#050607]">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#090c0e] border border-[#38ba9b]/40 shadow-xl mb-1">
            <img src="/logo.webp" alt="Intellus Logo" width={34} height={34} className="object-contain" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            {mode === "login" && "Access Intellus"}
            {mode === "signup" && "Create Newsroom Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === "login" && "Sign in to access your contributor or editorial workspace"}
            {mode === "signup" && "Join India's verified investigative news community"}
            {mode === "forgot" && "Enter your email to receive recovery instructions"}
          </p>

          {/* Database connection badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0a0d0f] border border-slate-800 text-[11px]">
            <Database className={`w-3 h-3 ${isConfigured ? "text-[#38ba9b]" : "text-amber-400"}`} />
            <span className={isConfigured ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
              {isConfigured ? "Supabase Auth & Database Live" : "Demo Mode (Configure .env for Supabase)"}
            </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#090c0e] border border-[#161c22] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Tab Switcher */}
          {mode !== "forgot" ? (
            <div className="grid grid-cols-2 p-1 bg-[#050607] rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode("login"); setErrorMessage(""); setSuccessMessage(""); }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-[#38ba9b] text-slate-950 shadow font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setErrorMessage(""); setSuccessMessage(""); }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-[#38ba9b] text-slate-950 shadow font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setMode("login"); setErrorMessage(""); }}
              className="text-xs text-[#38ba9b] font-bold flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          )}

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#38ba9b] text-xs flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Role in Newsroom
                  </label>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setRole("CONTRIBUTOR")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        role === "CONTRIBUTOR"
                          ? "border-[#38ba9b] bg-[#38ba9b]/10 text-white"
                          : "border-slate-800 bg-[#050607] text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">Contributor</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Submit citizen reports</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("EDITOR")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        role === "EDITOR"
                          ? "border-[#38ba9b] bg-[#38ba9b]/10 text-white"
                          : "border-slate-800 bg-[#050607] text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">Desk Editor</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Review & publish articles</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b] transition-colors"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); setErrorMessage(""); setSuccessMessage(""); }}
                      className="text-[10px] text-[#38ba9b] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#38ba9b] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-[#2ea287] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#38ba9b]/20 cursor-pointer disabled:opacity-50"
            >
              <span>
                {loading
                  ? "Processing..."
                  : mode === "login"
                  ? "Sign In to Workspace"
                  : mode === "signup"
                  ? "Create Newsroom Account"
                  : "Send Password Reset Link"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Section */}
          <div className="border-t border-[#14181c] pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <Sparkles className="w-3 h-3 text-amber-400 mr-1" /> Quick One-Click Demo
              </span>
              <span className="text-[9px] text-slate-500">Test dashboards instantly</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("CONTRIBUTOR")}
                className="p-2.5 bg-[#050607] border border-slate-800 hover:border-[#38ba9b] rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-[#38ba9b]">Demo Contributor</div>
                <div className="text-[10px] text-slate-500 truncate">Aarav Sharma</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("EDITOR")}
                className="p-2.5 bg-[#050607] border border-slate-800 hover:border-[#38ba9b] rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-[#38ba9b]">Demo Editor</div>
                <div className="text-[10px] text-slate-500 truncate">Priya Nair (Desk)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500">
          Intellus News India · Secure Auth Powered by Supabase
        </div>
      </div>
    </div>
  );
}
