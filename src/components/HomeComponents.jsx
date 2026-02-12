import React, { useCallback, memo } from "react";
import { MapPin, MessageCircle, Heart, Eye } from "lucide-react";

import { Link } from "react-router-dom";

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

// Skeleton loader pour le chargement
export const ProductSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-44 bg-gray-200 dark:bg-slate-800" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
      <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-full" />
    </div>
  </div>
);

const ProductCard = memo(
  ({ product, onOrder, onToggleFavorite, isFavorite }) => {
    const {
      id,
      name,
      price,
      currency,
      image,
      location,
      business_name,
      vendeur_phone,
      views = 0,
      is_new = false,
    } = product;

    const phone = vendeur_phone || "243899530506";

    const handleWhatsAppClick = useCallback(
      (e) => {
        e.stopPropagation();
        onOrder(product);
      },
      [onOrder, product],
    );

    const handleCardClick = useCallback(() => {
      // Navigation vers détail produit (à implémenter)
      // navigate(`/product/${id}`);
      onOrder(product); // Pour l'instant garde le comportement actuel
    }, [onOrder, product, id]);

    return (
      <article className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-slate-950/50 transition-all duration-300 border border-gray-100 dark:border-slate-800 flex flex-col">
        {/* Image Container */}
        <div
          className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
          onClick={handleCardClick}
        >
          <img
            src={image || "/placeholder-product.jpg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badge Nouveau */}
          {is_new && (
            <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
              NOUVEAU
            </span>
          )}

          {/* Bouton Favori */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(id);
            }}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 dark:bg-slate-900/90 text-gray-400 hover:text-red-500"
            }`}
            aria-label={
              isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
            }
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Compteur vues */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-[10px] bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye size={12} />
            {views}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          {/* Nom */}
          <h3
            className="font-semibold text-sm text-gray-900 dark:text-slate-100 line-clamp-2 mb-1 group-hover:text-accent transition-colors cursor-pointer"
            onClick={handleCardClick}
          >
            {name}
          </h3>

          {/* Prix */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-lg font-black text-green-600 dark:text-green-400">
              {price?.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-green-600/70 dark:text-green-400/70">
              {currency}
            </span>
          </div>

          {/* Meta info */}
          <div className="space-y-1.5 mb-3">
            {/* Localisation */}
            <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 gap-1.5">
              <MapPin size={12} className="text-red-400 shrink-0" />
              <span className="truncate">
                {location ? `${location}, RDC` : "Lubumbashi, RDC"}
              </span>
            </div>

            {/* Business */}
            <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider font-medium truncate">
              {business_name}
            </p>
          </div>

          {/* Bouton Commander */}
          <button
            onClick={handleWhatsAppClick}
            className="mt-auto w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md dark:shadow-none"
          >
            <MessageCircle size={14} />
            Commander
          </button>
        </div>
      </article>
    );
  },
);

ProductCard.displayName = "ProductCard";

export const ProductGrid = ({
  products,
  isLoading = false,
  favorites = [],
  onToggleFavorite,
  emptyMessage = "Aucun produit disponible",
}) => {
  const handleWhatsAppOrder = useCallback((product) => {
    const phone = product.vendeur_phone || "243899530506";
    const message = `Bonjour, je suis intéressé par votre produit : *${product.name}* au prix de ${product.price?.toLocaleString()} ${product.currency}.\n\nEst-il toujours disponible ?\n\n_Vu sur Niplan Market_`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 p-4 max-w-7xl mx-auto">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag
            size={40}
            className="text-gray-400 dark:text-slate-600"
          />
        </div>
        <p className="text-gray-500 dark:text-slate-400 text-lg font-medium">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 p-4 max-w-7xl mx-auto">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOrder={handleWhatsAppOrder}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(product.id)}
        />
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
      <h3 className="text-center font-bold text-xl mb-3 text-gray-800 dark:text-slate-200">
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

      <p className="text-center text-gray-500 text-sm mt-3 px-4 dark:text-slate-400">
        Vos clients parcourent vos produits comme dans une{" "}
        <span className="font-bold text-green-600 ">vraie application</span>.
      </p>
    </div>
  );
};
