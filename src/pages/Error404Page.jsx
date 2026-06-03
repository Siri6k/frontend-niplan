import { useNavigate } from "react-router-dom";
import { Home, Frown, ArrowLeft } from "lucide-react";

const Error404Page = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Icône animée */}
      <div className="mb-2 animate-bounce">
        <Frown size={64} className="text-accent" strokeWidth={1.5} />
      </div>

      {/* 404 avec dégradé */}
      <h1 className="text-7xl md:text-9xl font-black mb-2 leading-none tracking-tighter bg-gradient-to-br from-orange-500 to-slate-900 dark:from-orange-400 dark:to-slate-700 bg-clip-text text-transparent">
        404
      </h1>

      <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 mb-6 font-medium">
        Oups 😅 - cette page n'existe pas !
      </p>

      {/* Vague décorative */}
      <svg
        width="120"
        height="40"
        viewBox="0 0 120 40"
        className="mb-8 text-orange-500/30"
        fill="currentColor"
      >
        <path d="M0 20 Q30 0 60 20 T120 20 L120 40 L0 40 Z" />
      </svg>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-sm uppercase tracking-wider hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-all duration-200 active:scale-95 shadow-lg shadow-black/5"
        >
          <Home size={18} />
          Accueil
        </button>
      </div>
    </div>
  );
};

export default Error404Page;
