import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Footer() {
  const [storeModal, setStoreModal] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) { setStatus("success"); setEmail(""); } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const hover = "hover:text-[#38ba9b]";
  const storeBtn = "px-5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs font-semibold text-white hover:border-[#38ba9b] hover:text-[#38ba9b] transition-all cursor-pointer active:scale-95";

  return (
    <footer className="bg-[#050607] text-slate-400 border-t border-[#14181c] pt-14 pb-8 relative">
      <AnimatePresence>
        {storeModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-[#090c0e] rounded-2xl border border-[#38ba9b]/50 p-6 max-w-md w-full space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#38ba9b]/20 text-[#38ba9b] flex items-center justify-center mx-auto border border-[#38ba9b]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-white uppercase tracking-tight">Mobile App Notice</h3>
                <p className="text-xs font-semibold text-[#38ba9b]">{storeModal} app coming soon</p>
              </div>
              <div className="p-3 rounded-xl bg-[#050607] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                The Intellus News India app is under final review and isn't on {storeModal} yet. Please use our web platform for now.
              </div>
              <button
                onClick={() => setStoreModal(null)}
                className="w-full py-2.5 rounded-xl bg-[#38ba9b] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#2ea287] transition-all"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* App banner */}
        <div className="bg-[#0a0d0f] rounded-2xl border border-[#1b2228] p-6 md:p-8 mb-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 flex-shrink-0 bg-[#050607] rounded-xl border border-[#38ba9b]/30 p-2 flex items-center justify-center">
              <img src="/logo.webp" alt="Intellus Logo" width={48} height={48} className="object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white tracking-tight">INTELLUS NEWS INDIA ON THE GO.</h3>
              <p className="text-xs text-slate-400 mt-1">Download the app for real-time updates, breaking alerts & personalized news.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setStoreModal("Apple App Store")} className={storeBtn}> App Store</button>
            <button onClick={() => setStoreModal("Google Play Store")} className={storeBtn}>▶ Google Play</button>
          </div>
        </div>

        {/* 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.webp" alt="Intellus Logo" width={28} height={28} className="object-contain" />
              <span className="font-bold text-white tracking-tight text-lg">INTELLUS</span>
            </div>
            <p className="text-xs leading-relaxed">
              Intellus News India is an in-house brand of Intellus Design, Noida. Our mission is to deliver credible news and empower voices from across India.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="https://www.facebook.com/share/19N9gqwynv/" target="_blank" rel="noopener noreferrer"
                title="Follow Intellus News India on Facebook"
                className="w-9 h-9 rounded-full bg-[#0a0d0f] border border-slate-800 text-[#38ba9b] flex items-center justify-center font-bold text-sm hover:bg-[#38ba9b] hover:text-slate-950 transition-all"
              >f</a>
              <a
                href="https://www.instagram.com/intellusnewsindia?stkn=MXRuYXk3OXptZDBuaw==" target="_blank" rel="noopener noreferrer"
                title="Follow Intellus News India on Instagram"
                className="w-9 h-9 rounded-full bg-[#0a0d0f] border border-slate-800 text-[#38ba9b] flex items-center justify-center font-bold text-xs hover:bg-[#38ba9b] hover:text-slate-950 transition-all"
              >ig</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Quick links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/policy/verification" className={hover}>Editorial Policy</Link></li>
              <li><Link to="/policy/verification" className={hover}>Verification Standards</Link></li>
              <li><Link to="/submit-report" className={hover}>Submit News Lead</Link></li>
              <li><Link to="/trends" className={hover}>Trending Index</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Categories</h4>
            <ul className="space-y-2 text-xs">
              {["crime", "law", "tech", "india", "world"].map((c) => (
                <li key={c}><Link to={`/category/${c}`} className={`${hover} capitalize`}>{c}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Subscribe</h4>
            <p className="text-xs">Get the latest news updates in your inbox.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" aria-label="Email address"
                className="w-full px-4 py-2.5 rounded-full bg-[#0a0d0f] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38ba9b]"
              />
              <button
                type="submit" disabled={status === "loading"} aria-label="Subscribe"
                className="absolute right-1 top-1 w-7 h-7 rounded-full bg-[#38ba9b] text-slate-950 flex items-center justify-center font-bold text-xs hover:scale-105 transition-transform"
              >
                {status === "loading" ? "..." : "→"}
              </button>
            </form>
            {status === "success" && <p className="text-[11px] text-[#38ba9b] font-medium pt-1">✓ Subscribed to the Intellus newsletter!</p>}
            {status === "error" && <p className="text-[11px] text-rose-400 font-medium pt-1">Couldn't subscribe. Please try again.</p>}
          </div>
        </div>

        <div className="border-t border-[#14181c] pt-6 flex flex-col md:flex-row justify-between text-[11px] text-slate-500">
          <span>© 2026 Intellus News India. All rights reserved.</span>
          <span>Made in India, For India.</span>
        </div>
      </div>
    </footer>
  );
}
