import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getArticles, getReports, createArticle } from "@/data/articles";
import {
  FileText,
  Inbox,
  PlusCircle,
  Database,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

export default function EditorialDashboard() {
  const { user, login, isConfigured } = useAuth();
  const [articles, setArticles] = useState([]);
  const [reports, setReports] = useState([]);
  const [tab, setTab] = useState("articles"); // "articles" | "reports" | "new"
  const [loading, setLoading] = useState(true);

  // New Article Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("tech");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newHeroImage, setNewHeroImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(true);
  const [publishStatus, setPublishStatus] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [artList, repList] = await Promise.all([getArticles(), getReports()]);
      setArticles(artList || []);
      setReports(repList || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    setPublishStatus("publishing");
    try {
      const categoryNames = {
        crime: "Crime",
        law: "Law",
        tech: "Tech",
        india: "India",
        world: "World",
      };

      const res = await createArticle({
        title: newTitle,
        categorySlug: newCategory,
        categoryName: categoryNames[newCategory] || "India",
        summary: newSummary,
        content: newContent,
        heroImage: newHeroImage || `https://picsum.photos/seed/${newCategory}${Date.now() % 10}/900/560`,
        authorName: user?.name || "Editorial Desk",
        authorId: user?.id || null,
        isFeatured,
        isTrending,
        status: "PUBLISHED",
      });

      if (res.success) {
        setPublishStatus("success");
        setNewTitle("");
        setNewSummary("");
        setNewContent("");
        setNewHeroImage("");
        await loadData();
        setTimeout(() => {
          setTab("articles");
          setPublishStatus("");
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setPublishStatus("error");
    }
  };

  const handleSwitchToEditor = () => {
    login({
      id: "demo-editor",
      name: "Priya Nair",
      email: "priya.editor@intellus.in",
      role: "EDITOR",
      contributorId: "EDTR-0012",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-100 min-h-[75vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#14181c]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#38ba9b] uppercase tracking-widest mb-1">
            <span>Newsroom Desk</span>
            <span>•</span>
            <span className="flex items-center">
              <Database className="w-3 h-3 mr-1" />
              {isConfigured ? "Supabase Database Connected" : "Local Database Mode"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Editorial Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish verified stories, manage breaking news tickers, and audit incoming citizen leads.
          </p>
        </div>

        {/* User / Role info */}
        <div className="flex items-center space-x-3">
          {user?.role !== "EDITOR" ? (
            <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-xl text-xs">
              <span className="text-amber-400 font-semibold">Logged in as {user?.name || "Guest"}</span>
              <button
                onClick={handleSwitchToEditor}
                className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg hover:bg-amber-300 transition-colors"
              >
                Switch to Editor
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-[#090c0e] border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-2 h-2 rounded-full bg-[#38ba9b] animate-ping" />
              <span className="text-slate-300">Editor: </span>
              <span className="text-[#38ba9b] font-bold">{user.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#090c0e] border border-[#161c22] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Articles</div>
          <div className="text-2xl font-black text-white mt-1">{articles.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Stored in database</div>
        </div>
        <div className="bg-[#090c0e] border border-[#161c22] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Citizen Leads</div>
          <div className="text-2xl font-black text-[#38ba9b] mt-1">{reports.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Pending review & verification</div>
        </div>
        <div className="bg-[#090c0e] border border-[#161c22] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Trending Stories</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {articles.filter((a) => a.isTrending).length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Appearing on homepage</div>
        </div>
        <div className="bg-[#090c0e] border border-[#161c22] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Database Engine</div>
          <div className="text-sm font-bold text-emerald-400 mt-2 truncate">
            {isConfigured ? "Supabase PostgreSQL" : "Local Mock Storage"}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Real-time persistence</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs font-bold uppercase tracking-wider mb-8">
        <button
          onClick={() => setTab("articles")}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            tab === "articles"
              ? "border-[#38ba9b] text-[#38ba9b]"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Articles Directory ({articles.length})</span>
        </button>
        <button
          onClick={() => setTab("reports")}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            tab === "reports"
              ? "border-[#38ba9b] text-[#38ba9b]"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Citizen Leads & Reports ({reports.length})</span>
        </button>
        <button
          onClick={() => setTab("new")}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            tab === "new"
              ? "border-[#38ba9b] text-[#38ba9b]"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Story</span>
        </button>
      </div>

      {/* Tab: Articles */}
      {tab === "articles" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Published Articles Catalog
            </h2>
            <button
              onClick={() => setTab("new")}
              className="px-4 py-2 bg-[#38ba9b] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#2ea287] transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Article</span>
            </button>
          </div>

          <div className="bg-[#090c0e] border border-[#161c22] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050607] border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Flags</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center space-x-3">
                          <img
                            src={art.heroImage}
                            alt=""
                            className="w-12 h-8 rounded object-cover flex-shrink-0 bg-slate-800"
                          />
                          <div className="truncate font-bold text-white hover:text-[#38ba9b]">
                            <Link to={`/article/${art.slug}`}>{art.title}</Link>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono uppercase text-[#38ba9b]">
                        {art.category?.name || art.category?.slug}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{art.author?.name || "Desk"}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          {art.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#38ba9b] text-[9px] font-bold">
                              FEATURED
                            </span>
                          )}
                          {art.isTrending && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold">
                              TRENDING
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          {art.status || "PUBLISHED"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/article/${art.slug}`}
                          className="p-1.5 hover:text-[#38ba9b] text-slate-400 inline-block"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Citizen Reports */}
      {tab === "reports" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Community Leads & Whistleblower Reports
            </h2>
            <Link
              to="/submit-report"
              className="text-xs text-[#38ba9b] hover:underline flex items-center space-x-1"
            >
              <span>Test Submit Form</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {reports.length === 0 ? (
            <div className="bg-[#090c0e] border border-[#161c22] rounded-2xl p-12 text-center space-y-3">
              <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-white font-bold text-sm">No incoming leads right now</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Citizen news leads submitted through the Submit News portal will appear here for verification.
              </p>
              <Link
                to="/submit-report"
                className="inline-block px-4 py-2 bg-[#38ba9b] text-slate-950 rounded-xl text-xs font-bold"
              >
                Submit a Test Report
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-[#090c0e] border border-[#161c22] rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#38ba9b]/10 text-[#38ba9b] font-mono uppercase font-bold text-[10px]">
                      {rep.category || "General"}
                    </span>
                    <span className="text-amber-400 font-mono text-[10px] font-bold">
                      {rep.status || "PENDING"}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white">{rep.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {rep.description}
                  </p>
                  {rep.source_links && (
                    <div className="text-[11px] text-sky-400 flex items-center space-x-1 truncate">
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{rep.source_links}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                    <span>Submitter: {rep.submitter_name || "Anonymous"}</span>
                    <span>{new Date(rep.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: New Article */}
      {tab === "new" && (
        <div className="bg-[#090c0e] border border-[#161c22] rounded-2xl p-6 sm:p-8 max-w-3xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-black uppercase text-white">Create & Publish Story</h2>
            <p className="text-xs text-slate-400">
              Publish directly to the Supabase database. Stories will be immediately visible on the homepage.
            </p>
          </div>

          {publishStatus === "success" && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#38ba9b] text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Article published successfully to the database!</span>
            </div>
          )}

          <form onSubmit={handleCreateArticle} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Headline / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Supreme Court Delivers Verdict on Environmental Protection"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#38ba9b]"
                >
                  <option value="crime">Crime</option>
                  <option value="law">Law</option>
                  <option value="tech">Tech</option>
                  <option value="india">India</option>
                  <option value="world">World</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Hero Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://picsum.photos/seed/news/900/560"
                  value={newHeroImage}
                  onChange={(e) => setNewHeroImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Summary / Lead *
              </label>
              <input
                type="text"
                required
                placeholder="One sentence summary of the story"
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Full Article Content *
              </label>
              <textarea
                required
                rows={6}
                placeholder="Full news report text..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-4 py-3 bg-[#050607] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#38ba9b] resize-none"
              />
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-800 text-[#38ba9b] focus:ring-0"
                />
                <span>Set as Homepage Featured Story</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded border-slate-800 text-[#38ba9b] focus:ring-0"
                />
                <span>Mark as Trending Now</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={publishStatus === "publishing"}
                className="px-6 py-3 rounded-full bg-[#38ba9b] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-[#2ea287] transition-all flex items-center space-x-2 shadow-lg shadow-[#38ba9b]/20 cursor-pointer disabled:opacity-50"
              >
                <span>{publishStatus === "publishing" ? "Saving..." : "Publish to Database"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
