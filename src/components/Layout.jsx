import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, User, Sun, Moon } from "lucide-react";
import { Outlet } from "react-router-dom";
import ChatSupport from "./ChatSupport";

const Layout = ({ children }) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --- LOGIQUE MODE SOMBRE OPTIMISÉE ---
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const nextMode = !prev;
      document.documentElement.classList.toggle("dark", nextMode);
      localStorage.setItem("theme", nextMode ? "dark" : "light");
      return nextMode;
    });
  };

  // Évite le flash en attendant le montage
  if (!mounted) {
    return <div className="min-h-screen bg-bg-primary" />;
  }

  const isAuthenticated = !!localStorage.getItem("access_token");

  const navItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: ShoppingBag, label: "Boutique", path: "/dashboard" },
    {
      icon: User,
      label: isAuthenticated ? "Profil" : "Connexion",
      path: isAuthenticated ? "/profile" : "/login",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col transition-colors duration-300">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-bg-secondary border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-1">
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="text-accent">Niplan</span>
              <span className="text-green-500">.</span>
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            {/* TOGGLE DARK MODE */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={
                isDark ? "Passer en mode clair" : "Passer en mode sombre"
              }
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <span className="text-xs font-bold bg-accent/10 text-accent px-2.5 py-1 rounded-full">
              RDC
            </span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-4 pb-28 pt-4 max-w-7xl mx-auto w-full">
        {children || <Outlet />}
      </main>
      {/* CHAT SUPPORT */}
      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="max-w-md mx-auto bg-bg-secondary/95 dark:bg-slate-900/95 backdrop-blur-lg border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl flex justify-between px-2 py-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path.split("?")[0];

            return (
              <Link
                key={path}
                to={path}
                className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-accent scale-105"
                    : "text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "animate-pulse" : ""}
                />
                <span className="text-[11px] font-medium leading-none">
                  {label}
                </span>

                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
