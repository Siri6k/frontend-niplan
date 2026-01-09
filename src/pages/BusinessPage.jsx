import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { ProductGrid } from "../components/HomeComponents";
import { MapPin, MessageCircle, Share2 } from "lucide-react";

const BusinessPage = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    // 1. Récupérer les détails de la boutique
    api.get(`/business/${slug}/`).then((res) => {
      setBusiness(res.data);
      // 2. Récupérer les produits de cette boutique uniquement
      // Assure-toi que ton backend filtre par boutique dans ce endpoint
    });
  }, [slug]);

  if (!business) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="pb-20">
      {/* HEADER BOUTIQUE */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-500 pt-12 pb-24 px-4 text-center text-white">
        <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-4 shadow-xl overflow-hidden p-1">
          <img
            src={
              business.logo ||
              "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            }
            className="w-full h-full object-cover rounded-2xl"
            alt="logo"  
          />
        </div>
        <h1 className="text-2xl font-black">{business.name}</h1>
        <div className="flex items-center justify-center gap-1 opacity-90 text-sm mt-1">
          <MapPin size={14} />
          <span>{business.location || "Kinshasa, RDC"}</span>
        </div>
      </div>

      {/* STATISTIQUES OU BIO */}
      <div className="mx-4 -mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border dark:border-slate-800 relative z-10 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {business.description ||
            "Bienvenue dans notre boutique officielle sur Niplan."}
        </p>
        <a
          href={`https://wa.me/${business.owner_phone}`}
          className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-2xl font-bold hover:bg-green-600 transition-all"
        >
          <MessageCircle size={20} />
          Discuter sur WhatsApp
        </a>
      </div>

      {/* GRILLE PRODUITS */}
      <div className="px-4 mt-10">
        <h2 className="font-bold text-lg mb-4 dark:text-white">Catalogue</h2>
        <ProductGrid products={business.products} />
      </div>
    </div>
  );
};

export default BusinessPage;
