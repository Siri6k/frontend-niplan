import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, User } from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: ShoppingBag, label: "Boutique", path: "/dashboard" },
    { icon: User, label: "Profil", path: "/login" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-extrabold tracking-tight">
            <span className="text-blue-600">Niplan</span>
            <span className="text-green-500">.</span>
          </h1>

          <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            RDC
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-2 pb-24">{children}</main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-3 mb-3 rounded-2xl bg-white shadow-xl border flex justify-between px-4 py-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
                  active
                    ? "text-blue-600 scale-105"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[11px] font-medium">{label}</span>

                {active && (
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-0.5"></span>
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
