import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, MessageCircle } from "lucide-react";

export const Hero = () => {
  // On vérifie si le token existe
  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <div className="bg-green-600 text-white p-8 text-center rounded-b-3xl dark:bg-slate-800">
      <h1 className="text-3xl font-extrabold mb-2">
        {isAuthenticated ? "Content de vous revoir !" : "Vendez tout, partout."}
      </h1>

      <p className="opacity-90 mb-6">
        {isAuthenticated
          ? "Gérez vos produits et vos ventes en un clin d'œil."
          : "Créez votre boutique WhatsApp en 2 minutes."}
      </p>

      {isAuthenticated ? (
        <Link
          to="/dashboard"
          className="bg-white text-green-700 px-8 py-3 rounded-full font-bold shadow-lg inline-block animate-pulse"
        >
          Aller au Tableau de Bord
        </Link>
      ) : (
        <Link
          to="/login"
          className="bg-white text-green-700 px-6 py-3 rounded-full font-bold shadow-lg inline-block"
        >
          Créer ma boutique gratuitement
        </Link>
      )}
    </div>
  );
};

export const Categories = () => {
  const cats = [
    { name: "Boutiques", icon: "🛍️" },
    { name: "Troc / Échange", icon: "🔄" },
    { name: "Immobilier", icon: "🏠" },
    { name: "Services", icon: "🛠️" },
  ];
  return (
    <div className="flex space-x-4 overflow-x-auto p-4 no-scrollbar">
      {cats.map((cat) => (
        <div
          key={cat.name}
          className="flex-shrink-0 bg-gray-100 p-3 rounded-2xl text-center min-w-[100px] dark:bg-slate-800"
        >
          <span className="text-2xl">{cat.icon}</span>
          <p className="text-xs font-semibold mt-1">{cat.name}</p>
        </div>
      ))}
    </div>
  );
};

export const ProductGrid = ({ products }) => {
  const handleWhatsAppOrder = (product) => {
    // Numéro du vendeur (doit être au format international sans le +)
    const phone = product.vendeur_phone || "243899530506";

    // Message personnalisé avec le nom et le prix du produit
    const message = `Bonjour, je suis intéressé par votre produit : *${product.name}* au prix de ${product.price} ${product.currency}. Est-il toujours disponible ?\n\n_Vu sur Niplan Market_\n\n${product.image}`;

    // Génération du lien WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message,
    )}`;

    // Ouverture dans un nouvel onglet
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 ">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => handleWhatsAppOrder(product)} // Toute la carte est cliquable
          className="bg-white rounded-2xl overflow-hidden shadow-sm  active:scale-95 transition-transform cursor-pointer dark:bg-slate-900"
        >
          {/* Image du produit */}
          <div className="w-full h-44 bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Infos du produit */}
          <div className="p-3">
            <h3 className="font-bold text-sm text-gray-800 truncate mb-1 dark:text-slate-200">
              {product.name}
            </h3>

            <p className="text-green-600 font-black text-lg mb-1">
              {product.price} {product.currency}
            </p>

            <div className="flex flex-col gap-1">
              {/* Localisation */}
              <div className="flex items-center text-[10px] text-gray-500 gap-1">
                <MapPin size={10} className="text-red-400" />
                <span className="truncate">
                  {(product.location && product.location + ", RDC") ||
                    "Lubumbashi, RDC"}
                </span>
              </div>

              {/* Nom du Business */}
              <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                Boutique : {product.business_name}
              </p>
            </div>

            {/* Bouton d'action visuel */}
            <div className="mt-3 bg-green-50 text-green-600 py-1.5 rounded-lg flex items-center justify-center gap-1 text-[10px] font-bold hover:bg-green-100 transition-colors">
              <MessageCircle size={12} />
              Commander
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const StatusTeaser = () => {
  // Liste d'images d'exemple (Produits typiques : Téléphone, Mode, Wax, Électronique)
  const demoImages = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  ];

  // On double la liste pour un défilement infini fluide
  const scrollingItems = [...demoImages, ...demoImages];

  return (
    <div className="bg-gray-50 py-10 px-6 rounded-3xl my-1 border-2 border-dashed border-green-200 overflow-hidden dark:bg-slate-800 dark:border-green-700">
      <h3 className="text-center font-bold text-xl mb-6 text-gray-800 dark:text-slate-200">
        Fini les captures d'écran désordonnées !
      </h3>

      <div className="flex justify-center">
        {/* Simulation du Téléphone */}
        <div className="w-64 h-[400px] bg-white rounded-[3rem] border-[8px] border-black shadow-2xl overflow-hidden relative">
          {/* Header WhatsApp Style */}
          <div className="bg-green-600 h-14 flex items-center px-4 gap-2 z-10 relative">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="logo"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-white text-[10px] font-bold">
                Ma Boutique Pro
              </div>
              <div className="text-green-200 text-[8px]">En ligne</div>
            </div>
          </div>

          {/* Carousel Vertical de Produits */}
          <div className="p-3 h-full bg-gray-50">
            <div className="grid grid-cols-2 gap-2 animate-scroll">
              {scrollingItems.map((src, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden h-28 border border-gray-100"
                >
                  <img
                    src={src}
                    className="w-full h-20 object-cover"
                    alt="product"
                  />
                  <div className="p-1">
                    <div className="h-1 w-8 bg-gray-200 rounded-full mb-1"></div>
                    <div className="h-2 w-12 bg-green-100 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay dégradé pour cacher la coupure basse */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>

          {/* Bouton CTA fixe */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 py-2.5 bg-green-500 rounded-full text-white text-[10px] text-center font-black shadow-lg z-20">
            COMMANDER SUR WHATSAPP
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-8 px-4">
        Vos clients parcourent vos produits comme dans une{" "}
        <span className="font-bold text-green-600">vraie application</span>.
      </p>
    </div>
  );
};
