import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const img = (seed) => `https://picsum.photos/seed/${seed}/900/560`;

export const articles = [
  {
    id: "1",
    title: "New Criminal Laws Come Into Effect: What Changes for Citizens",
    slug: "new-criminal-laws-come-into-effect-what-changes",
    heroImage: img("law1"),
    category: { name: "Law", slug: "law" },
    author: { name: "Desk" },
    isFeatured: true,
    isTrending: true,
    summary: "India ushers in three landmark criminal statutes reforming procedures and definitions.",
    content: "India has officially replaced its colonial-era criminal penal codes with three new landmark statutes: Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA). Key overhauls include electronic summons, prioritized forensic examination for severe offenses, streamlined FIR procedures with zero-FIR provisions across all police stations, and codified timelines for investigations.",
  },
  {
    id: "2",
    title: "CERT-In Issues High-Severity Advisory for Critical Infrastructure",
    slug: "cert-in-high-severity-advisory-critical-infrastructure",
    heroImage: img("tech1"),
    category: { name: "Tech", slug: "tech" },
    author: { name: "Desk" },
    isTrending: true,
    summary: "Urgent warning issued regarding state-sponsored threat actors targeting essential utilities.",
    content: "The Indian Computer Emergency Response Team (CERT-In) has published a high-severity alert cautioning government entities, power grid operators, and banking networks of targeted multi-vector cyber operations. Organizations are instructed to mandate multi-factor authentication, audit external-facing assets, and isolate legacy operational technologies.",
  },
  {
    id: "3",
    title: "RBI Strengthens Digital Banking Security Framework",
    slug: "rbi-strengthens-digital-banking-security-framework",
    heroImage: img("india1"),
    category: { name: "India", slug: "india" },
    author: { name: "Desk" },
    isTrending: true,
    summary: "New real-time anomaly detection mandates for high-value fund transfers.",
    content: "The Reserve Bank of India has introduced updated guidelines directing all scheduled commercial banks and digital payment service providers to integrate behavioral biometrics and real-time fraud mitigation telemetry. The mandate aims to arrest account takeover attempts and protect digital payment consumers.",
  },
  {
    id: "4",
    title: "Cyber Fraud Ring Busted Across Three States",
    slug: "cyber-fraud-ring-busted",
    heroImage: img("crime1"),
    category: { name: "Crime", slug: "crime" },
    author: { name: "Desk" },
    isTrending: true,
    summary: "Joint inter-state police operation arrests 14 operatives in complex mule account syndicate.",
    content: "Law enforcement agencies across Delhi, Haryana, and Rajasthan dismantled an inter-state syndicate operating dozens of mule bank accounts for laundering money obtained through fraudulent investment schemes and fake parcel scams.",
  },
  {
    id: "5",
    title: "High Court Seeks Response on Data Protection Rules",
    slug: "high-court-data-protection-rules",
    heroImage: img("law2"),
    category: { name: "Law", slug: "law" },
    author: { name: "Desk" },
    summary: "Judicial notice issued regarding compliance deadlines under DPDP legislation.",
    content: "The High Court has issued notices to key central ministries seeking clarification on rules formulated under the Digital Personal Data Protection Act, highlighting user consent mechanisms and grievance redressal timelines.",
  },
  {
    id: "6",
    title: "India's AI Policy Roadmap: What Startups Should Know",
    slug: "india-ai-policy-roadmap",
    heroImage: img("tech2"),
    category: { name: "Tech", slug: "tech" },
    author: { name: "Desk" },
    summary: "Government allocates compute subsidies and outlines ethical AI deployment guardrails.",
    content: "Under the IndiaAI Mission, the Ministry of Electronics and Information Technology has opened compute grants for domestic artificial intelligence startups and established benchmarks for safety evaluations.",
  },
  {
    id: "7",
    title: "Global Markets React to Fresh Trade Talks",
    slug: "global-markets-trade-talks",
    heroImage: img("world1"),
    category: { name: "World", slug: "world" },
    author: { name: "Desk" },
    summary: "Asian equities rise as bilateral discussions suggest relaxed tariff thresholds.",
    content: "Stock indices across Asian and European markets posted gains following high-level bilateral trade negotiations focusing on supply chain diversification and reduced tariffs on electronic components.",
  },
  {
    id: "8",
    title: "Police Launch Awareness Drive on Online Scams",
    slug: "police-awareness-drive-online-scams",
    heroImage: img("crime2"),
    category: { name: "Crime", slug: "crime" },
    author: { name: "Desk" },
    summary: "Community workshops and digital advisories to prevent digital arrest frauds.",
    content: "City police have initiated comprehensive awareness campaigns addressing rising digital arrest impersonation scams, cautioning citizens that statutory authorities never demand money over video calls.",
  },
];

// Helper to normalize Supabase article row to frontend shape
function mapDbArticle(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    heroImage: row.hero_image || img("default"),
    summary: row.summary || "",
    content: row.content || "",
    category: {
      name: row.category_name || (row.category_slug ? row.category_slug.toUpperCase() : "General"),
      slug: row.category_slug || "general",
    },
    author: {
      name: row.author_name || "Desk",
    },
    isFeatured: Boolean(row.is_featured),
    isTrending: Boolean(row.is_trending),
    status: row.status,
    createdAt: row.created_at,
  };
}

/**
 * Fetch all articles, querying Supabase if available with fallback to mock data
 */
export async function getArticles(categorySlug) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (categorySlug) {
        query = query.eq("category_slug", categorySlug);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(mapDbArticle);
      }
      if (error) {
        console.warn("Supabase getArticles query error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase connection error in getArticles:", err);
    }
  }

  // Graceful fallback to static/mock articles
  if (categorySlug) {
    return articles.filter((a) => a.category.slug === categorySlug);
  }
  return articles;
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return mapDbArticle(data);
      }
    } catch (err) {
      console.warn("Supabase getArticleBySlug error:", err);
    }
  }

  return articles.find((a) => a.slug === slug) || null;
}

/**
 * Submit citizen news lead / report to Supabase
 */
export async function submitReport(reportData) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("reports").insert([
        {
          title: reportData.title,
          description: reportData.description,
          category: reportData.category,
          source_links: reportData.sourceLinks,
          submitter_name: reportData.submitterName,
          submitter_email: reportData.submitterEmail,
          user_id: reportData.userId || null,
          status: "PENDING",
        },
      ]).select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (err) {
      console.warn("Supabase submitReport error:", err);
      // Fallback: save to local storage
      saveLocalReport(reportData);
      return { success: true, isLocalFallback: true };
    }
  }

  // Local fallback
  saveLocalReport(reportData);
  return { success: true, isLocalFallback: true };
}

function saveLocalReport(reportData) {
  try {
    const existing = JSON.parse(localStorage.getItem("intellus_reports") || "[]");
    existing.unshift({
      id: "rep-" + Date.now(),
      ...reportData,
      status: "PENDING",
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("intellus_reports", JSON.stringify(existing));
  } catch (e) {
    console.error("Local report save error:", e);
  }
}

/**
 * Fetch reports (for editorial dashboard)
 */
export async function getReports() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn("Supabase getReports error:", err);
    }
  }

  try {
    return JSON.parse(localStorage.getItem("intellus_reports") || "[]");
  } catch {
    return [];
  }
}

/**
 * Create article (for editorial / contributor dashboard)
 */
export async function createArticle(articleData) {
  const slug =
    articleData.slug ||
    articleData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("articles").insert([
        {
          title: articleData.title,
          slug,
          summary: articleData.summary || "",
          content: articleData.content || "",
          hero_image: articleData.heroImage || img("default"),
          category_slug: articleData.categorySlug || "india",
          category_name: articleData.categoryName || "India",
          author_name: articleData.authorName || "Contributor",
          author_id: articleData.authorId || null,
          is_featured: Boolean(articleData.isFeatured),
          is_trending: Boolean(articleData.isTrending),
          status: articleData.status || "PUBLISHED",
        },
      ]).select();

      if (error) throw error;
      return { success: true, article: mapDbArticle(data[0]) };
    } catch (err) {
      console.warn("Supabase createArticle error:", err);
    }
  }

  // Fallback local memory article
  const newArt = {
    id: "art-" + Date.now(),
    title: articleData.title,
    slug,
    heroImage: articleData.heroImage || img("default"),
    summary: articleData.summary || "",
    content: articleData.content || "",
    category: {
      name: articleData.categoryName || "India",
      slug: articleData.categorySlug || "india",
    },
    author: {
      name: articleData.authorName || "Desk",
    },
    isFeatured: Boolean(articleData.isFeatured),
    isTrending: Boolean(articleData.isTrending),
    status: articleData.status || "PUBLISHED",
  };
  articles.unshift(newArt);
  return { success: true, article: newArt };
}
