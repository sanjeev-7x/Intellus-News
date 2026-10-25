import { useEffect, useState } from "react";
import { HomeView } from "@/components/HomeView";
import { getArticles } from "@/data/articles";

// Replaces the Next.js server component + Prisma query.
export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0] || null;
  const trending = articles.filter((a) => a.isTrending);
  const trendingArticles = trending.length ? trending : articles.slice(0, 4);

  return <HomeView featuredArticle={featuredArticle} articles={articles} trendingArticles={trendingArticles} />;
}
