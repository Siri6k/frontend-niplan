import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, User, Sun, Moon } from "lucide-react"; // Ajout icones

const Layout = ({ children }) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  // --- LOGIQUE MODE SOMBRE ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const navItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: ShoppingBag, label: "Boutique", path: "/dashboard" },
    { icon: User, label: "Profil", path: "/login" },
  ];

  return (
    // Ajout de classes dark:... sur tous les conteneurs
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/">
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="text-blue-600">Niplan</span>
              <span className="text-green-500">.</span>
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            {/* BOUTON TOGGLE DARK MODE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-yellow-400 transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <span className="text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
              RDC
            </span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-2 pb-24 dark:text-slate-200">{children}</main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-3 mb-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border dark:border-slate-800 flex justify-between px-4 py-2 backdrop-blur-md dark:bg-opacity-80">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
                  active
                    ? "text-blue-600 dark:text-blue-400 scale-105"
                    : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[11px] font-medium">{label}</span>

                {active && (
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-0.5"></span>
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
