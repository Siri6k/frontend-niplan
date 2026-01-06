import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  Hero,
  Categories,
  ProductGrid,
  StatusTeaser,
} from "../components/HomeComponents";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [showTeaser, setShowTeaser] = useState(false); // État pour afficher ou non

  useEffect(() => {
    // 1. Charger les produits
    api.get("/products/").then((res) => setProducts(res.data));

    // 2. Timer : Afficher le teaser après 5 secondes
    const token = localStorage.getItem("access_token");
    if (token) return; // Ne pas afficher si connecté
    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 5000);

    return () => clearTimeout(timer); // Nettoyage du timer
  }, []);

  return (
    <div>
      <Hero />
      <Categories />
      {/* TEASER VERSION SLIM & DISCRÈTE AVEC TIMER */}
      {showTeaser && (
        <div className="px-4 animate-in slide-in-from-bottom duration-700">
          <div className="relative">
            {/* Bouton pour fermer */}
            <button
              onClick={() => setShowTeaser(false)}
              className="absolute top-2 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-30 border text-gray-400 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
            <StatusTeaser />
          </div>
        </div>
      )}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold text-gray-800">Nouveautés</h2>
        <p className="text-sm text-gray-500">
          Découvrez les derniers articles publiés
        </p>
      </div>

      <ProductGrid products={products} />

      <div className="p-8 text-center text-gray-400 text-sm">
        © 2026 Niplan - Marketplace RDC
      </div>
    </div>
  );
};

export default Home;
