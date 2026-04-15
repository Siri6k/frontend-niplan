// pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Zap,
  Clock,
  Eye,
  Tag,
  Info,
  Maximize2,
  X,
  CreditCard,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";
import { useTimeAgo } from "../hooks/useTimeAgo";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/v2/public/listings/${slug}/`);
        setProduct(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Article introuvable");
        // navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  const handleWhatsApp = () => {
    if (!product) return;
    const phone = product.vendor_phone || "243899530506"; // Utilise le nouveau champ aplati
    const text = encodeURIComponent(
      `Bonjour, je suis intéressé par votre article "${product.title || product.name}" sur Niplan.\nLien : ${window.location.href}`,
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || product?.name,
        text: `Découvrez ${product?.title || product?.name} sur Niplan !`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié !");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20"
        >
          <Zap
            size={32}
            className="text-green-600 dark:text-green-500 fill-green-500"
          />
        </motion.div>
        <p className="mt-6 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Chargement des détails...
        </p>
      </div>
    );
  }

  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images.map((img) => img.image)
      : [product.main_image || product.image || "/placeholder-product.jpg"];

  const specs = product.specs || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group"
        >
          <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm group-hover:scale-110 transition-transform">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Retour
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square sm:aspect-video rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-2xl group"
            >
              <img
                src={images[activeImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowFullImage(true)}
                className="absolute bottom-6 right-6 p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
              >
                <Maximize2 size={24} />
              </button>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 uppercase tracking-widest">
                  <Zap size={14} fill="currentColor" /> Premium Pro
                </span>
                {product.is_for_barter && (
                  <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 uppercase tracking-widest border border-blue-400/30">
                    <Zap size={14} /> Échange Possible
                  </span>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === idx
                        ? "border-green-500 scale-105 shadow-lg shadow-green-500/20"
                        : "border-slate-200 dark:border-white/5 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                <Tag size={12} /> {product.category || "Général"}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
                {product.title || product.name}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {product.price}
                  </span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest">
                    {product.currency}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span className="text-xs font-bold">
                      {product.views || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span className="text-xs font-bold">
                      Posté il y a{" "}
                      {(product &&
                        product?.created_at &&
                        useTimeAgo(product.created_at)) ||
                        "quelques instants"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card bg-white/50 dark:bg-white/5 rounded-[2rem] p-8 border border-slate-200 dark:border-white/5">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} className="text-blue-500" /> Description
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {product.description ||
                  "Aucune description fournie par le vendeur."}
              </p>
            </div>

            {/* Accordion: Specs & Troc */}
            <div className="space-y-3">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full flex items-center justify-between p-6 bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-black text-[11px] uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Zap size={14} />
                  </div>
                  Fiche Technique & Troc
                </div>
                <motion.div
                  animate={{ rotate: isDetailsOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isDetailsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 glass-card bg-white/50 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 space-y-6">
                      {Object.keys(specs).length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(specs).map(([key, val]) => (
                            <div
                              key={key}
                              className="p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5"
                            >
                              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                                {key}
                              </p>
                              <p className="font-black text-slate-900 dark:text-white text-sm">
                                {val}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest py-4">
                          Aucune spécification technique
                        </p>
                      )}

                      {product.is_for_barter && (
                        <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                          <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Zap size={12} /> Échange souhaité
                          </h4>
                          <p className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-tight">
                            {product.barter_target || "Tout article équivalent"}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location & Seller */}
            <div className="glass-card bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                    Localisation
                  </p>
                  <p className="font-black text-slate-900 dark:text-white">
                    {product.commune}, {product.quartier}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        product.business_logo ||
                        "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                      }
                      className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-white/10"
                      alt="Seller"
                      onClick={(e) => navigate(`/b/${product?.business_slug}`)}
                    />
                    {product.is_verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white dark:border-slate-900">
                        <ShieldCheck size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                      Vendeur
                    </p>
                    <div className="flex items-center gap-1.5">
                      <p className="font-black text-slate-900 dark:text-white text-sm">
                        {product.business_name}
                      </p>
                      {product.is_verified && (
                        <CheckCircle2 size={12} className="text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleWhatsApp}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <MessageCircle
                  size={22}
                  className="group-hover:rotate-12 transition-transform"
                />
                Commander sur WhatsApp
              </button>

              <div className="flex items-center justify-center gap-2 py-4 opacity-50">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Paiement sécurisé via le vendeur
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4 backdrop-blur-xl"
          >
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-8 right-8 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={images[activeImage]}
              className="max-w-full max-h-full object-contain rounded-3xl"
              alt="Full Preview"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
