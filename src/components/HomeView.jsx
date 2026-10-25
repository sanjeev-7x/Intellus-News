import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play, ChevronLeft, ChevronRight, Zap, Shield, Gavel, Cpu, Share2, Upload, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const breakingNewsList = [
  { text: "Supreme Court Refuses Interim Stay on New IT Rules", slug: "new-criminal-laws-come-into-effect-what-changes" },
  { text: "CERT-In Issues Urgent Advisory for Critical Infrastructure Operators", slug: "cert-in-high-severity-advisory-critical-infrastructure" },
  { text: "RBI Introduces Real-Time Fraud Mitigation Framework for Digital Transfers", slug: "rbi-strengthens-digital-banking-security-framework" },
];

const categoryList = [
  { icon: Shield, name: "CRIME", slug: "crime", desc: "Breaking crime updates, investigations & trends." },
  { icon: Gavel, name: "LAW", slug: "law", desc: "Court updates, legal insights & analysis." },
  { icon: Cpu, name: "TECH", slug: "tech", desc: "Latest tech news, innovations & reviews." },
];

const steps = [
  { icon: Upload, label: "SUBMIT", text: "Share your news with us", to: "/submit-report" },
  { icon: Shield, label: "VERIFY", text: "Our team verifies the facts", to: "/policy/verification" },
  { icon: Share2, label: "PUBLISH", text: "We bring it to millions", to: "/dashboard/editorial" },
];

const timeAgo = ["45m ago", "1h ago", "2h ago"];

export function HomeView({ featuredArticle, articles, trendingArticles }) {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isWatchLiveOpen, setIsWatchLiveOpen] = useState(false);
  const subTrending = trendingArticles.slice(1, 4);
  const ticker = breakingNewsList[tickerIndex];

  return (
    <div className="bg-[#050607] text-slate-100 min-h-screen relative">
      {/* Watch live modal */}
      <AnimatePresence>
        {isWatchLiveOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-[#090c0e] rounded-2xl border border-[#38ba9b]/40 p-6 max-w-3xl w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-[#38ba9b] text-xs font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38ba9b] animate-ping" />
                  <Radio className="w-4 h-4" />
                  <span>Intellus Live Newsroom</span>
                </div>
                <button
                  onClick={() => setIsWatchLiveOpen(false)} aria-label="Close"
                  className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold hover:bg-rose-600 transition-colors"
                >✕</button>
              </div>

              {/* Replace this block with an <iframe> of your YouTube/HLS live stream */}
              <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#38ba9b]/20 border border-[#38ba9b] text-[#38ba9b] flex items-center justify-center animate-pulse">
                  <Play className="w-8 h-8 fill-[#38ba9b] ml-1" />
                </div>
                <h3 className="font-extrabold text-lg text-white">LIVE BULLETIN: National Cyber Defense & Policy Briefing</h3>
                <p className="text-xs text-slate-400 max-w-md">Live from the Intellus Newsroom Studio, New Delhi.</p>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                <span>Intellus News Broadcast Network</span>
                <button onClick={() => setIsWatchLiveOpen(false)} className="px-4 py-1.5 rounded-lg bg-[#38ba9b] text-slate-950 font-bold">
                  Close live feed
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-black text-5xl sm:text-7xl leading-none text-white tracking-tighter uppercase">
              INTELLUS<br />NEWS<br />INDIA
            </h1>
            <div className="space-y-2">
              <h2 className="text-sm font-extrabold tracking-widest text-[#38ba9b] uppercase">
                BREAKING TODAY.<br />INSIGHTS FOR TOMORROW.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-medium">
                A hybrid news platform blending breaking news with community voices. Real-time updates. Real impact.
              </p>
            </div>
            <button onClick={() => setIsWatchLiveOpen(true)} className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wider text-slate-200 group text-left cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#38ba9b] text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#38ba9b]/20">
                <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
              </div>
              <div>
                <div className="text-white font-extrabold group-hover:text-[#38ba9b] transition-colors">WATCH LIVE</div>
                <div className="text-[10px] text-slate-400 font-normal normal-case">Latest broadcast</div>
              </div>
            </button>
          </div>

          {/* Radar graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[320px]">
            <div className="relative w-72 h-72 rounded-full border border-slate-800 flex items-center justify-center">
              <div className="w-56 h-56 rounded-full border border-slate-800/80 flex items-center justify-center">
                <div className="w-40 h-40 opacity-40 flex items-center justify-center">
                  <div className="w-32 h-32 bg-[radial-gradient(#38ba9b_2px,transparent_2px)] [background-size:12px_12px] rounded-full animate-pulse" />
                </div>
              </div>
              <div className="absolute top-4 right-12 w-2 h-2 rounded-full bg-[#38ba9b] animate-ping" />
              <div className="absolute bottom-8 left-6 w-2.5 h-2.5 rounded-full bg-[#38ba9b]" />
              <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-[#38ba9b]/60" />
              <button
                onClick={() => setIsWatchLiveOpen(true)}
                className="absolute top-4 right-2 w-32 h-32 rounded-full bg-[#38ba9b] text-slate-950 flex flex-col items-center justify-center p-2 text-center shadow-lg shadow-[#38ba9b]/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <span className="text-base font-black tracking-tight leading-none">LIVE</span>
                <span className="text-[10px] font-extrabold tracking-widest uppercase mt-0.5 leading-tight">BREAKING<br />NEWS</span>
              </button>
              <div className="absolute bottom-0 right-4 w-10 h-10 rounded-full border-2 border-[#38ba9b] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#38ba9b]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ticker */}
      <section className="border-y border-[#14181c] py-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="bg-[#38ba9b] text-slate-950 px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-wider flex items-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 mr-1 fill-slate-950" />BREAKING
          </div>
          <div className="flex-1 text-xs font-medium text-slate-200 truncate hover:text-[#38ba9b] transition-colors">
            <Link to={`/article/${ticker.slug}`}>{ticker.text}</Link>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-500 flex-shrink-0">
            <span className="hidden sm:inline">2m ago</span>
            <div className="flex items-center space-x-1 sm:border-l border-slate-800 sm:pl-3">
              <button aria-label="Previous" onClick={() => setTickerIndex((i) => (i - 1 + breakingNewsList.length) % breakingNewsList.length)} className="p-1 hover:text-[#38ba9b]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button aria-label="Next" onClick={() => setTickerIndex((i) => (i + 1) % breakingNewsList.length)} className="p-1 hover:text-[#38ba9b]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h2 className="font-extrabold text-2xl tracking-tight text-white uppercase flex items-center">
                TRENDING NOW <ArrowUpRight className="w-5 h-5 ml-2 text-[#38ba9b]" />
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">The biggest stories shaping India today.</p>
            </div>
            <Link to="/trends" className="inline-flex items-center px-4 py-2 rounded-full border border-slate-800 text-xs font-bold text-slate-300 hover:border-[#38ba9b] hover:text-[#38ba9b] transition-all uppercase tracking-wider">
              View all news
            </Link>
          </div>

          {featuredArticle && (
            <div className="lg:col-span-9 bg-[#090c0e] rounded-2xl border border-[#161c22] p-6 sm:p-8 hover:border-[#38ba9b]/40 transition-all group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6 space-y-4">
                  <div className="font-mono text-3xl font-bold text-[#38ba9b]">01</div>
                  <span className="text-[10px] font-bold text-[#38ba9b] uppercase tracking-widest block">{featuredArticle.category.name}</span>
                  <h3 className="font-extrabold text-2xl sm:text-3xl text-white group-hover:text-[#38ba9b] transition-colors leading-tight">
                    <Link to={`/article/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">15m ago</div>
                </div>
                <div className="md:col-span-6 relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <Link to={`/article/${featuredArticle.slug}`}>
                    {featuredArticle.heroImage && (
                      <img src={featuredArticle.heroImage} alt={featuredArticle.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#38ba9b] text-slate-950 flex items-center justify-center shadow-md">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {subTrending.map((art, idx) => (
            <div key={art.id} className="bg-[#090c0e] rounded-xl border border-[#161c22] overflow-hidden hover:border-[#38ba9b]/40 transition-all group">
              <Link to={`/article/${art.slug}`}>
                <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                  {art.heroImage && (
                    <img src={art.heroImage} alt={art.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090c0e] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 font-mono text-sm font-bold text-[#38ba9b]">0{idx + 2}</div>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold text-[#38ba9b] uppercase tracking-widest">{art.category.name}</span>
                  <h4 className="font-bold text-base text-white group-hover:text-[#38ba9b] transition-colors line-clamp-2 leading-snug">{art.title}</h4>
                  <div className="text-[11px] text-slate-500 font-medium pt-2">{timeAgo[idx]}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="flex items-center justify-between border-b border-[#14181c] pb-4">
          <h2 className="font-extrabold text-2xl tracking-tight text-white uppercase flex items-center">
            CATEGORIES <ArrowUpRight className="w-5 h-5 ml-2 text-[#38ba9b]" />
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            {categoryList.map((item) => (
              <Link key={item.name} to={`/category/${item.slug}`} className="p-4 rounded-xl bg-[#090c0e] border border-[#161c22] hover:border-[#38ba9b]/40 transition-colors flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-[#050607] border border-slate-800 text-[#38ba9b] flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-[#38ba9b]">{item.name}</h3>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-[#38ba9b]" />
              </Link>
            ))}
            <Link to="/category/crime" className="text-xs font-bold text-[#38ba9b] hover:underline flex items-center pt-2">
              EXPLORE ALL CATEGORIES <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {articles.slice(0, 6).map((art) => (
              <Link key={art.id} to={`/article/${art.slug}`} className="bg-[#090c0e] rounded-xl border border-[#161c22] p-3 hover:border-[#38ba9b]/40 transition-all group space-y-3 block">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-900">
                  {art.heroImage && <img src={art.heroImage} alt={art.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                </div>
                <div>
                  <span className="text-[9px] font-bold text-[#38ba9b] uppercase tracking-wider block">{art.category.name}</span>
                  <h4 className="font-bold text-xs text-white line-clamp-2 group-hover:text-[#38ba9b] mt-1">{art.title}</h4>
                  <div className="text-[10px] text-slate-500 mt-2">30m ago</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Community reporting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#090c0e] rounded-2xl border border-[#161c22] p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-black text-3xl sm:text-4xl text-white uppercase leading-tight">HAVE NEWS<br />TO SHARE?</h2>
            <div className="text-xs font-bold tracking-widest text-[#38ba9b] uppercase">YOU REPORT. WE VERIFY. INDIA KNOWS.</div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">Join thousands of citizens who contribute to a more informed India.</p>
            <Link to="/submit-report" className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#38ba9b] text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-[#2ea287] transition-all shadow-lg shadow-[#38ba9b]/20">
              <span>Submit news</span><ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-7 bg-[#050607] rounded-xl border border-slate-800/80 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {steps.map((s) => (
              <Link key={s.label} to={s.to} className="space-y-2 group block">
                <div className="w-10 h-10 rounded-full bg-[#38ba9b]/10 text-[#38ba9b] group-hover:bg-[#38ba9b] group-hover:text-slate-950 flex items-center justify-center mx-auto transition-colors">
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-white group-hover:text-[#38ba9b] transition-colors">{s.label}</div>
                <p className="text-[11px] text-slate-400">{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
