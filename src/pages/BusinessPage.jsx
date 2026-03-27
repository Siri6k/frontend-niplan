// pages/BusinessPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { ProductGrid } from "../components/HomeComponents";
import {
  MapPin,
  MessageCircle,
  Settings as SettingsIcon,
  Share2,
  Zap,
  Info,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

const BusinessPage = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [isMyBusiness, setIsMyBusiness] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/business/${slug}/`)
      .then((res) => {
        setBusiness(res.data);
        if (res.data.slug === localStorage.getItem("business_slug")) {
          setIsMyBusiness(true);
        }
      })
      .catch((err) => {
        toast.error("Boutique introuvable");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business?.name,
        text: `Découvrez la boutique ${business?.name} sur Niplan !`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien de la boutique copié !");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30"
        >
          <Zap
            size={24}
            className="text-green-600 dark:text-green-500 fill-green-500"
          />
        </motion.div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
          Chargement de la boutique...
        </p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-slate-900 dark:text-white font-black text-2xl mb-2">
          Boutique introuvable
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Le lien semble incorrect ou la boutique n'existe plus.
        </p>
        <Link
          to="/"
          className="text-green-600 dark:text-green-500 font-bold uppercase tracking-widest text-xs"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-green-500/30 overflow-x-hidden pb-10 sm:pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10">
        {/* --- DYNAMIC HEADER --- */}
        <div className="relative pt-12 pb-24 px-6 overflow-hidden">
          {/* Banner/Overlay Decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent -z-10" />

          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] p-1.5 shadow-2xl border border-slate-200 dark:border-white/10 group overflow-hidden">
                <img
                  src={
                    business.logo ||
                    "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  }
                  className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-700"
                  alt="logo"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 p-2 rounded-2xl border-4 border-white dark:border-slate-950 shadow-lg">
                <ShieldCheck size={18} className="text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4"
            >
              {business.name}
            </motion.h1>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-md">
                <MapPin size={12} className="text-red-500" />
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                  {business.location || "Kinshasa, RDC"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-md">
                {localStorage.getItem("is_phone_verified") === "true" ? (
                  <>
                    {" "}
                    <Star
                      size={12}
                      className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400"
                    />{" "}
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                      Boutique Vérifiée
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-black text-red-600 dark:text-red-300 uppercase tracking-widest">
                    Non Vérifiée
                  </span>
                )}
              </div>
            </div>

            {isMyBusiness && (
              <Link
                to={`/dashboard`}
                className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-slate-200 dark:border-white/10 transition-all active:scale-95"
              >
                <SettingsIcon size={14} /> Gérer ma boutique
              </Link>
            )}
          </div>
        </div>

        {/* --- INFO CARD --- */}
        <div className="max-w-4xl mx-auto px-4 -mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card bg-white/90 dark:bg-white/5 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 text-slate-400 dark:text-white">
              <Info size={120} />
            </div>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium mb-10 leading-relaxed italic max-w-2xl mx-auto">
              "
              {business.description ||
                "Bienvenue dans notre boutique officielle. Nous vous proposons les meilleurs articles avec un service de qualité supérieure."}
              "
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`https://wa.me/${business.owner_phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all group"
              >
                <MessageCircle
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                Contacter sur WhatsApp
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border border-slate-200 dark:border-white/5 active:scale-95 transition-all"
              >
                <Share2 size={18} /> Partager la boutique
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- CATALOGUE --- */}
        <div className="max-w-7xl mx-auto px-6 mt-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-transparent text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/10">
                <Zap size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Catalogue Privé
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Explorez nos articles disponibles
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-700 text-[10px] font-black uppercase tracking-widest">
              {business.listings?.length || 0} Articles{" "}
              <ChevronRight size={14} />
            </div>
          </div>

          {business.listings && business.listings.length > 0 ? (
            <div className="pb-20">
              <ProductGrid products={business.listings} />
            </div>
          ) : (
            <div className="p-20 glass-card bg-white/80 dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/5 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500 dark:text-slate-700">
                <Zap size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
                Catalogue bientôt en ligne
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="relative z-10 text-center py-10 opacity-40 dark:opacity-30">
        <p className="text-[9px] text-slate-600 dark:text-white font-black uppercase tracking-[0.3em]">
          Niplan Marketplace RDC • Excellence Commerciale
        </p>
      </footer>
    </div>
  );
};

export default BusinessPage;
