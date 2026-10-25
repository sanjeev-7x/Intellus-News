import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const categories = [
  { name: "HOME", href: "/" },
  { name: "CRIME", href: "/category/crime" },
  { name: "LAW", href: "/category/law" },
  { name: "TECH", href: "/category/tech" },
  { name: "INDIA", href: "/category/india" },
  { name: "WORLD", href: "/category/world" },
];

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") ||
      (document.documentElement.classList.contains("light") ? "light" : "dark");
    setIsDarkMode(currentTheme === "dark");
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = isDarkMode ? "light" : "dark";
    root.classList.remove("dark", "light");
    root.classList.add(nextTheme);
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("intellus_theme", nextTheme);
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const linkCls = "block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-[#14181c] hover:text-[#38ba9b]";

  return (
    <header className="bg-[#050607] border-b border-[#14181c] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 flex-shrink-0 bg-[#050607] rounded-lg p-1 flex items-center justify-center">
            <img src="/logo.webp" alt="Intellus Logo" width={34} height={34} className="object-contain" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase group-hover:text-[#38ba9b] transition-colors">
            INTELLUS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-widest text-slate-300">
          {categories.map((cat) => {
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.href}
                to={cat.href}
                className={`relative py-1 transition-colors hover:text-[#38ba9b] ${isActive ? "text-[#38ba9b]" : ""}`}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#38ba9b]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center space-x-3 relative">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
            className="p-2 rounded-full border border-slate-800 text-slate-300 hover:text-[#38ba9b] hover:border-[#38ba9b] transition-all cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          <Link to="/search" aria-label="Search" className="text-slate-300 hover:text-[#38ba9b] p-1.5 transition-colors">
            <Search className="w-4 h-4" />
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#38ba9b]/50 bg-[#38ba9b]/10 text-xs font-bold text-white hover:border-[#38ba9b] transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#38ba9b] text-slate-950 flex items-center justify-center font-extrabold text-[10px]">
                  {user.name ? user.name[0] : "U"}
                </div>
                <span className="truncate max-w-[100px]">{user.name?.split(" ")[0]}</span>
                {user.contributorId && (
                  <span className="hidden lg:inline text-[9px] font-mono text-[#38ba9b]">({user.contributorId})</span>
                )}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#090c0e] border border-[#161c22] p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs">
                    <div className="font-bold text-white truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                    <div className="text-[9px] text-[#38ba9b] font-mono font-bold uppercase mt-0.5">Role: {user.role}</div>
                  </div>
                  <Link to={user.role === "EDITOR" ? "/dashboard/editorial" : "/dashboard/contributor"} className={linkCls}>
                    User Dashboard
                  </Link>
                  <Link to="/submit-report" className={linkCls}>Submit a Report</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center justify-between"
                  >
                    <span>Sign out</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="px-5 py-2 rounded-full border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-[#38ba9b] hover:text-[#38ba9b] transition-all"
            >
              SIGN IN
            </Link>
          )}

          {/* Menu button: toggles mobile nav on small screens */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Menu"
            className="md:hidden w-9 h-9 rounded-full bg-[#38ba9b] text-slate-950 flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link
            to="/dashboard/editorial"
            title="Editorial Queue"
            className="hidden md:flex w-9 h-9 rounded-full bg-[#38ba9b] text-slate-950 items-center justify-center font-bold hover:scale-105 transition-transform"
          >
            <Menu className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      {isMobileOpen && (
        <nav className="md:hidden border-t border-[#14181c] bg-[#050607] px-4 py-3 grid grid-cols-2 gap-1">
          {categories.map((cat) => (
            <Link key={cat.href} to={cat.href} className={linkCls}>{cat.name}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
