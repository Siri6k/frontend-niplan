import React, { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, MessageCircle, Heart, Eye, Zap } from "lucide-react";

import { Link } from "react-router-dom";

export const Hero = () => {
  // On vérifie si le token existe
  let isAuthenticated = false;
  try {
    isAuthenticated = !!localStorage.getItem("access_token");
  } catch {}

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

const formatPrice = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return "0";
  return number.toLocaleString();
};

const ProductCard = memo(
  ({ product, onOrder, onToggleFavorite, isFavorite }) => {
    const navigate = useNavigate();
    const safeProduct = product || {};

    const {
      id,
      title = "",
      name = "", // compatibilité V1
      price = 0,
      currency = "",
      main_image = "",
      image = "", // compatibilité V1
      location = "", // compatibilité V1
      commune = "",
      quartier = "",
      business_name = "",
      vendor_phone = "",
      views = 0,
      is_new = false,
      created_at = null,
      images = [], // Multi-images V2
    } = safeProduct;

    // Mapping intelligent pour Listing (V2) vs Product (V1)
    const isV2 = !!title;
    const displayTitle = title || name;
    const displayImage = main_image || image;
    const displayLocation = quartier ? `${commune} (${quartier})` : (location || commune || "Lubumbashi, RDC");
    const hasMultipleImages = images && images.length > 0;
    
    const isNew = is_new || (created_at && (new Date() - new Date(created_at)) < 2 * 24 * 60 * 60 * 1000);

    const handleWhatsAppClick = useCallback(
      (e) => {
        e.stopPropagation();
        onOrder(product);
      },
      [onOrder, product],
    );

    const handleCardClick = useCallback(() => {
      const slug = product.slug || product.id;
      navigate(`/p/${slug}/`); 
    }, [navigate, product]);

    return (
      <article className={`group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border flex flex-col ${
        isV2 
          ? "border-green-500/20 dark:border-green-500/10 ring-1 ring-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.05)]" 
          : "border-gray-100 dark:border-slate-800"
      }`}>
        {/* V2 Glow Effect */}
        {isV2 && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
        )}

        {/* Image Container */}
        <div
          className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-slate-800 overflow-hidden cursor-pointer z-10"
          onClick={handleCardClick}
        >
          <img
            src={displayImage || "/placeholder-product.jpg"}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />

          {/* Badges Container */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {isV2 ? (
              <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg flex items-center gap-1 uppercase tracking-widest">
                <Zap size={8} fill="currentColor" /> Premium Pro
              </span>
            ) : isNew && (
              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                NOUVEAU
              </span>
            )}
            
            {hasMultipleImages && (
              <div className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded shadow-lg border border-white/10 uppercase tracking-tighter">
                +{images.length} PHOTOS
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(id);
            }}
            className={`absolute top-2 right-2 p-2 rounded-xl backdrop-blur-md transition-all duration-300 ${
              isFavorite
                ? "bg-red-500 text-white scale-110"
                : "bg-white/90 dark:bg-slate-900/90 text-gray-400 hover:text-red-500 hover:scale-110 shadow-lg"
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-[10px] bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye size={12} />
            {views || 0}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 z-10 bg-white dark:bg-slate-900">
          <h3
            className="font-black text-sm text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors cursor-pointer leading-tight tracking-tight"
            onClick={handleCardClick}
          >
            {displayTitle}
          </h3>

          {/* Mini Specs V2 */}
          {isV2 && safeProduct.specs && Object.keys(safeProduct.specs).length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {Object.entries(safeProduct.specs).slice(0, 2).map(([key, val]) => (
                <span key={key} className="text-[9px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5 font-bold uppercase tracking-tighter">
                  {val}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-baseline gap-1 mt-auto mb-3">
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
              {formatPrice(price)}
            </span>
            <span className="text-[10px] font-black text-green-600 dark:text-green-500 uppercase tracking-widest">
              {currency}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center text-[10px] text-gray-500 dark:text-slate-400 gap-1.5 font-bold uppercase tracking-widest">
              <MapPin size={12} className="text-red-500 shrink-0" />
              <span className="truncate">{displayLocation}</span>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-green-600 dark:hover:bg-green-500 hover:text-white active:scale-95 shadow-lg shadow-black/5"
            >
              <MessageCircle size={14} />
              Commander
            </button>
          </div>
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
    const phone =
      product.vendeur_phone ?? product.vendor_phone ?? "243899530506";
    const message = `Bonjour, je suis intéressé par votre produit : *${formatPrice(product.price)} ${product.currency}.\n\nEst-il toujours disponible ?\n\n_Vu sur Niplan Market_`;

    // Utilisation de window.location pour Safari
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Safari préfère cette méthode pour ouvrir les liens
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
  const safeProducts = Array.isArray(products) ? products : [];

  if (!safeProducts.length) {
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
      {safeProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOrder={handleWhatsAppOrder}
          onToggleFavorite={onToggleFavorite}
          isFavorite={
            Array.isArray(favorites) && favorites.includes(product.id)
          }
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
