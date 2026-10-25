import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticles, getArticleBySlug } from "@/data/articles";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";

const wrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-slate-100 min-h-[60vh]";

export function CategoryPage() {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getArticles(slug).then((all) => {
      setItems(all.filter((a) => a.category.slug === slug));
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className={wrap}>
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center space-x-1.5 text-xs text-[#38ba9b] font-bold uppercase mb-4 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-tight text-white">{slug}</h1>
        <p className="text-xs text-slate-400 mt-2">Latest verified investigative reporting and updates in {slug}.</p>
      </div>

      {loading ? (
        <div className="text-slate-400 text-xs">Loading articles...</div>
      ) : items.length === 0 ? (
        <p className="text-slate-400 text-sm">No stories in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((a) => (
            <Link
              key={a.id}
              to={`/article/${a.slug}`}
              className="bg-[#090c0e] rounded-xl border border-[#161c22] overflow-hidden hover:border-[#38ba9b]/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <img src={a.heroImage} alt={a.title} className="aspect-[16/9] w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold text-[#38ba9b] uppercase tracking-widest">{a.category.name}</span>
                  <h2 className="font-bold text-white group-hover:text-[#38ba9b] transition-colors">{a.title}</h2>
                  {a.summary && <p className="text-xs text-slate-400 line-clamp-2">{a.summary}</p>}
                </div>
              </div>
              <div className="p-5 pt-0 text-[10px] text-slate-500 font-medium">By {a.author?.name || "Desk"}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getArticleBySlug(slug).then((res) => {
      setArticle(res || false);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className={`${wrap} text-center py-24 text-slate-400 text-xs`}>Loading story from database…</div>;
  if (article === false || !article) return (
    <div className={`${wrap} text-center py-24 space-y-4`}>
      <h2 className="text-2xl font-black text-white">Article Not Found</h2>
      <p className="text-xs text-slate-400">The story you are looking for may have moved or been updated.</p>
      <Link to="/" className="inline-block px-4 py-2 bg-[#38ba9b] text-slate-950 font-bold rounded-xl text-xs uppercase">
        Return to Front Page
      </Link>
    </div>
  );

  return (
    <article className={`${wrap} max-w-3xl`}>
      <div className="mb-6">
        <Link to={`/category/${article.category.slug}`} className="text-[10px] font-extrabold text-[#38ba9b] uppercase tracking-widest hover:underline">
          ← {article.category.name}
        </Link>
      </div>

      <h1 className="font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
        {article.title}
      </h1>

      {article.summary && (
        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed mb-6 border-l-2 border-[#38ba9b] pl-4">
          {article.summary}
        </p>
      )}

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 py-3 border-y border-[#161c22] mb-8 gap-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-[#38ba9b]" />
            <span className="font-semibold text-white">{article.author?.name || "Editorial Desk"}</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "Today"}</span>
          </div>
        </div>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: article.title, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Article link copied to clipboard!");
            }
          }}
          className="flex items-center space-x-1 text-slate-400 hover:text-[#38ba9b] text-xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden mb-8 border border-slate-800 bg-slate-950">
        <img src={article.heroImage} alt={article.title} className="w-full object-cover max-h-[480px]" />
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
        {article.content ? (
          article.content.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p>
            India ushers in landmark reforms and investigative reporting. This story is verified under
            Intellus News India editorial and whistleblower standards.
          </p>
        )}
      </div>
    </article>
  );
}

export function SimplePage({ title, children }) {
  return (
    <div className={wrap}>
      <h1 className="font-black text-4xl uppercase tracking-tight mb-4">{title}</h1>
      <p className="text-slate-400 text-sm max-w-xl">{children || "This page is ready to be built out."}</p>
    </div>
  );
}
