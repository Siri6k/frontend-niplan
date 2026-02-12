import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  Hero,
  Categories,
  ProductGrid,
  StatusTeaser,
} from "../components/HomeComponents";

const TEASER_DELAY = 500;
const TEASER_DURATION = 5000;
const PROGRESS_INTERVAL = 100;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTeaser, setShowTeaser] = useState(false);
  const [progress, setProgress] = useState(100);

  // Refs pour timers et état d'authentification
  const timersRef = useRef({});
  const isAuthenticated = useRef(
    !!localStorage.getItem("access_token"),
  ).current;

  // Fetch produits
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/products/");
        if (isMounted) setProducts(data);
      } catch (error) {
        console.error("Erreur chargement produits:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Timer affichage teaser
  useEffect(() => {
    if (isAuthenticated) return;

    timersRef.current.show = setTimeout(() => {
      setShowTeaser(true);
    }, TEASER_DELAY);

    return () => clearTimeout(timersRef.current.show);
  }, [isAuthenticated]);

  // Timer auto-fermeture + progression
  useEffect(() => {
    if (!showTeaser) {
      setProgress(100);
      return;
    }

    const step = 100 / (TEASER_DURATION / PROGRESS_INTERVAL);

    timersRef.current.progress = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          setShowTeaser(false);
          return 0;
        }
        return prev - step;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(timersRef.current.progress);
  }, [showTeaser]);

  // Cleanup global
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, []);

  // Fermeture manuelle mémorisée
  const closeTeaser = useCallback(() => {
    setShowTeaser(false);
    clearInterval(timersRef.current.progress);
  }, []);

  return (
    <div className="min-h-screen">
      {/* TEASER - Position corrigée */}
      {showTeaser && !isAuthenticated && (
        <div className="fixed bottom-35 left-0 right-0 z-40 px-4 animate-in slide-in-from-bottom duration-500">
          <div className="relative max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
            {/* Barre de progression - Intégrée dans le composant */}
            <div className="h-1 bg-gray-100 dark:bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Bouton fermer - Position améliorée */}
            <button
              onClick={closeTeaser}
              className="absolute top-9 left-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-slate-800 shadow-md rounded-full flex items-center justify-center z-30 border border-gray-200 dark:border-slate-700 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200"
              aria-label="Fermer"
            >
              <span className="text-xs leading-none cursor-pointer hover:text-red-500">
                ✕
              </span>
            </button>

            {/* Contenu */}
            <div className="pt-4">
              <StatusTeaser />
            </div>
          </div>
        </div>
      )}

      <Hero />
      <Categories />

      {/* Section Nouveautés */}
      <section className="px-4 mt-8 mb-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Nouveautés</h2>
            <p className="text-sm text-text-secondary mt-0.5">
              Découvrez les derniers articles
            </p>
          </div>
          <Link
            to="/dashboard?tab=products"
            className="text-sm font-medium text-accent hover:opacity-80 transition-opacity"
          >
            Voir tout →
          </Link>
        </div>
      </section>

      {/* Grille produits */}
      {isLoading ? (
        <div className="px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-200 dark:border-slate-800 mt-8">
        <p className="text-sm text-text-secondary">
          © {new Date().getFullYear()} Niplan - Marketplace RDC
        </p>
      </footer>
    </div>
  );
};

export default Home;
