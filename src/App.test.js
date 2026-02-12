import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

import React, { useCallback, memo } from "react";
import { MapPin, MessageCircle, Heart, Eye } from "lucide-react";

// Skeleton avec styles explicites pour Safari
export const ProductSkeleton = () => (
  <div
    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm"
    style={{
      animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      WebkitAnimation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    }}
  >
    <div
      className="w-full bg-gray-200 dark:bg-slate-800"
      style={{ height: "192px" }}
    />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
    </div>
  </div>
);

const ProductCard = memo(
  ({ product, onOrder, onToggleFavorite, isFavorite }) => {
    const handleWhatsAppClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        onOrder(product);
      },
      [onOrder, product],
    );

    const handleCardClick = useCallback(() => {
      onOrder(product);
    }, [onOrder, product]);

    return (
      <article className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-800 flex flex-col">
        {/* Image - Style inline pour Safari */}
        <div
          className="relative w-full bg-gray-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
          style={{
            aspectRatio: "4/3",
            // Fallback Safari
            WebkitAspectRatio: "4/3",
          }}
          onClick={handleCardClick}
        >
          <img
            src={product.image || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{
              objectFit: "cover",
              WebkitObjectFit: "cover",
            }}
            loading="lazy"
            decoding="async"
          />

          {/* Badge */}
          {product.is_new && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              NOUVEAU
            </span>
          )}

          {/* Bouton Favori */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(product.id);
            }}
            className="absolute top-2 right-2 p-2 rounded-full transition-all duration-200"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              WebkitBackdropFilter: "blur(4px)",
              backdropFilter: "blur(4px)",
            }}
            aria-label="Favori"
          >
            <Heart
              size={16}
              fill={isFavorite ? "currentColor" : "none"}
              color={isFavorite ? "#ef4444" : "#9ca3af"}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          {/* Titre avec line-clamp fallback */}
          <h3
            className="font-semibold text-sm text-gray-900 dark:text-slate-100 mb-1 cursor-pointer"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            onClick={handleCardClick}
          >
            {product.name}
          </h3>

          {/* Prix */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-lg font-black text-green-600 dark:text-green-400">
              {product.price?.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-green-600/70">
              {product.currency}
            </span>
          </div>

          {/* Meta */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 gap-1.5">
              <MapPin size={12} className="text-red-400 shrink-0" />
              <span className="truncate">
                {product.location
                  ? `${product.location}, RDC`
                  : "Lubumbashi, RDC"}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider font-medium truncate">
              {product.business_name}
            </p>
          </div>

          {/* Bouton */}
          <button
            onClick={handleWhatsAppClick}
            className="mt-auto w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "#22c55e",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#16a34a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#22c55e")}
          >
            <MessageCircle size={14} />
            Commander
          </button>
        </div>
      </article>
    );
  },
);

export const ProductGrid = ({
  products,
  isLoading = false,
  favorites = [],
  onToggleFavorite,
}) => {
  const handleWhatsAppOrder = useCallback((product) => {
    const phone = product.vendeur_phone || "243899530506";
    const message = `Bonjour, je suis intéressé par: *${product.name}* à ${product.price?.toLocaleString()} ${product.currency}.\n\nVu sur Niplan Market`;

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
        {[...Array(6)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-gray-500 dark:text-slate-400">
          Aucun produit disponible
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 p-4 max-w-7xl mx-auto">
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
