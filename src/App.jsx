import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import { CategoryPage, ArticlePage, SimplePage } from "@/pages/Pages";
import AuthPage from "@/pages/AuthPage";
import SubmitReportPage from "@/pages/SubmitReportPage";
import EditorialDashboard from "@/pages/EditorialDashboard";
import ContributorDashboard from "@/pages/ContributorDashboard";
import SearchPage from "@/pages/SearchPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050607]">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trends" element={<SimplePage title="Trending Index" />} />
          <Route path="/submit-report" element={<SubmitReportPage />} />
          <Route path="/policy/verification" element={<SimplePage title="Verification Standards" />} />
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/dashboard/editorial" element={<EditorialDashboard />} />
          <Route path="/dashboard/contributor" element={<ContributorDashboard />} />
          <Route path="*" element={<SimplePage title="Page not found" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
