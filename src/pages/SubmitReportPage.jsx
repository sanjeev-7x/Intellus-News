import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { submitReport } from "@/data/articles";
import { Upload, CheckCircle2, Shield, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";

export default function SubmitReportPage() {
  const { user, isConfigured } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("crime");
  const [sourceLinks, setSourceLinks] = useState("");
  const [submitterName, setSubmitterName] = useState(user?.name || "");
  const [submitterEmail, setSubmitterEmail] = useState(user?.email || "");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await submitReport({
        title,
        description,
        category,
        sourceLinks,
        submitterName: submitterName || "Anonymous Citizen",
        submitterEmail: submitterEmail || "",
        userId: user?.id || null,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setError("Failed to submit news lead. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while saving your report.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "CRIME", slug: "crime" },
    { name: "LAW", slug: "law" },
    { name: "TECH", slug: "tech" },
    { name: "INDIA", slug: "india" },
    { name: "WORLD", slug: "world" },
  ];

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#38ba9b] flex items-center justify-center mx-auto border border-[#38ba9b]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">Report Received</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your news lead has been saved to the {isConfigured ? "Supabase database" : "editorial queue"}.
            Our verification desk will review the sources against our editorial standards.
          </p>
        </div>
        <div className="p-4 bg-[#090c0e] border border-slate-800 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Lead Title:</span>
            <span className="text-white font-bold truncate max-w-[200px]">{title}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Status:</span>
            <span className="text-amber-400 font-mono font-bold">PENDING_REVIEW</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Category:</span>
            <span className="text-[#38ba9b] uppercase font-bold">{category}</span>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setTitle("");
              setDescription("");
              setSourceLinks("");
            }}
            className="px-5 py-2.5 rounded-full border border-slate-700 text-xs font-bold text-white hover:border-[#38ba9b] hover:text-[#38ba9b] transition-all"
          >
            Submit Another Report
          </button>
          <Link
            to="/dashboard/editorial"
            className="px-5 py-2.5 rounded-full bg-[#38ba9b] text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-[#2ea287] transition-all"
          >
            View Editorial Queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-slate-100">
      <div className="mb-8 space-y-2">
        <div className="flex items-center space-x-2 text-[11px] font-bold tracking-widest text-[#38ba9b] uppercase">
          <Shield className="w-4 h-4" />
          <span>Citizen Investigative Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Submit News Lead / Report
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Help build credible journalism. Share eyewitness reports, document leaks, public interest fraud alerts,
          or local developments. Submissions are stored in our secure Supabase database and audited by editors.
        </p>
      </div>

      <div className="bg-[#090c0e] rounded-2xl border border-[#161c22] p-6 sm:p-8 shadow-2xl">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Name / Pseudonym
              </label>
              <input
                type="text"
                placeholder="Optional or Anonymous"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="For confidential editor follow-up"
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              News Category *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                    category === c.slug
                      ? "border-[#38ba9b] bg-[#38ba9b]/10 text-[#38ba9b]"
                      : "border-slate-800 bg-[#050607] text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Headline / Summary *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unreported cyber breach at municipal data center"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Detailed Story / Lead Description *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Include who, what, when, where, and why. Be as specific as possible."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b] resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Evidence / Source Links / Document URLs
            </label>
            <input
              type="text"
              placeholder="e.g. Google Drive link, tweet, government portal link"
              value={sourceLinks}
              onChange={(e) => setSourceLinks(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Protected under Intellus Whistleblower Policy
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-[#38ba9b] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-[#2ea287] transition-all flex items-center space-x-2 shadow-lg shadow-[#38ba9b]/20 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{loading ? "Submitting to Database..." : "Transmit News Lead"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
