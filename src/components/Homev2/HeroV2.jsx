import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HeroV2 = () => {
  let isAuthenticated = false;
  try {
    isAuthenticated = !!localStorage.getItem("access_token");
  } catch {}

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4 pt-20 pb-16 rounded-b-[3rem] lg:rounded-b-[5rem]">
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 animate-bounce-slow">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              L'élite du commerce en RDC
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Propulsez votre <br />
            <span className="text-gradient-green">Marque</span> à un <br />
            niveau <span className="italic font-serif">Supérieur</span>.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
            {isAuthenticated
              ? "Gérez votre empire commercial avec une élégance et une efficacité inégalées. Vos clients méritent le meilleur."
              : "Ne vous contentez pas d'une simple boutique. Créez une expérience d'achat WhatsApp de classe mondiale en moins de 2 minutes."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="group relative px-8 py-4 bg-green-550 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-bold shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:shadow-[0_20px_50px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                Tableau de Bord Pro
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-bold shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:shadow-[0_20px_50px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                Créer mon Empire gratuitement
                <ArrowRight size={18} />
              </Link>
            )}

            <div className="flex items-center gap-4 px-4 py-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-white overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-yellow-400">
                  {"★".repeat(5)}
                </div>
                <p className="text-[10px] text-slate-500 font-medium">+500 vendeurs actifs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Visual - Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative perspective-1000 hidden lg:block"
        >
          {/* Main Phone Mockup */}
          <div className="relative w-[320px] h-[650px] mx-auto bg-slate-900 border-[10px] border-slate-800 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Screen Content */}
            <div className="h-full w-full bg-slate-950 flex flex-col">
              {/* Fake WhatsApp Header */}
              <div className="h-16 bg-green-600 flex items-center px-6 gap-3 pt-6">
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div className="flex-1">
                    <div className="h-2 w-20 bg-white/40 rounded-full mb-1" />
                    <div className="h-1.5 w-12 bg-white/20 rounded-full" />
                </div>
              </div>
              {/* Fake Content Cards */}
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-slate-900 rounded-2xl border border-white/5">
                    <div className="w-full h-32 bg-slate-800 rounded-xl mb-3" />
                    <div className="h-3 w-3/4 bg-slate-700 rounded-full mb-2" />
                    <div className="h-2 w-1/2 bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-800 rounded-b-2xl" />
          </div>

          {/* Floating Element 1 - Stats */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -right-4 glass-card p-4 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-xl text-green-400">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Ventes directes</p>
                <p className="text-xl font-black text-white">+240%</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Element 2 - Verification */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-32 -left-8 glass-card p-4 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Confiance</p>
                <p className="text-sm font-bold text-white">Boutique Vérifiée</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-1 h-12 bg-gradient-to-b from-green-500 to-transparent rounded-full" />
      </div>
    </section>
  );
};

export default HeroV2;
