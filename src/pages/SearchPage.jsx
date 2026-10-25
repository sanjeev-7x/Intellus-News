import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getArticles } from "@/data/articles";
import { Search, ArrowUpRight, X } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then((data) => {
      setArticles(data || []);
      setLoading(false);
    });
  }, []);

  const categories = [
    { label: "All Stories", value: "all" },
    { label: "Crime", value: "crime" },
    { label: "Law", value: "law" },
    { label: "Tech", value: "tech" },
    { label: "India", value: "india" },
    { label: "World", value: "world" },
  ];

  const filtered = articles.filter((a) => {
    const matchesCategory =
      selectedCategory === "all" ||
      a.category?.slug?.toLowerCase() === selectedCategory.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesTitle = a.title?.toLowerCase().includes(q);
    const matchesSummary = a.summary?.toLowerCase().includes(q);
    const matchesContent = a.content?.toLowerCase().includes(q);
    const matchesCatName = a.category?.name?.toLowerCase().includes(q);

    return matchesCategory && (matchesTitle || matchesSummary || matchesContent || matchesCatName);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-100 min-h-[75vh]">
      <div className="max-w-3xl mb-8 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Search Intellus
        </h1>
        <p className="text-xs text-slate-400">
          Search investigative articles, legal updates, policy frameworks, and cyber intelligence bulletins.
        </p>

        {/* Search Input */}
        <div className="relative pt-2">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams(e.target.value ? { q: e.target.value } : {});
            }}
            placeholder="Search by keywords, laws, companies, officials..."
            className="w-full pl-12 pr-10 py-3.5 bg-[#090c0e] border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#38ba9b] shadow-xl transition-colors"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSearchParams({});
              }}
              className="absolute right-4 top-5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === c.value
                  ? "bg-[#38ba9b] text-slate-950 shadow"
                  : "bg-[#090c0e] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="text-xs text-slate-500 font-medium">
          Showing {filtered.length} stories
          {query && <span> for &ldquo;{query}&rdquo;</span>}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-[#090c0e] border border-[#161c22] rounded-2xl p-12 text-center text-slate-400 text-xs">
            No stories matching your query. Try different keywords or switch categories.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a) => (
              <Link
                key={a.id}
                to={`/article/${a.slug}`}
                className="bg-[#090c0e] rounded-xl border border-[#161c22] overflow-hidden hover:border-[#38ba9b]/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] bg-slate-900 overflow-hidden relative">
                    <img
                      src={a.heroImage}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono font-bold text-[#38ba9b] uppercase">
                      {a.category?.name}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h2 className="font-bold text-white group-hover:text-[#38ba9b] transition-colors line-clamp-2">
                      {a.title}
                    </h2>
                    {a.summary && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {a.summary}
                      </p>
                    )}
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900">
                  <span>By {a.author?.name || "Desk"}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:text-[#38ba9b] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
