import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { Categories, ProductGrid } from "../components/HomeComponents";
import HeroV2 from "../components/Homev2/HeroV2";
import BusinessShowcase from "../components/Homev2/BusinessShowcase";
import AnalyticsPreview from "../components/Homev2/AnalyticsPreview";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs pour état d'authentification
  let isAuthenticated = false;
  try {
    isAuthenticated = !!localStorage.getItem("access_token");
  } catch {}

  // Fetch produits
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/products/");
        let safeData = [];
        if (Array.isArray(res.data)) {
          safeData = res.data;
        } else if (Array.isArray(res.data?.results)) {
          safeData = res.data.results;
        }
        if (isMounted) setProducts(safeData);
      } catch (error) {
        console.error("Erreur chargement produits:", error);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <HeroV2 />
      
      <BusinessShowcase />
      
      <AnalyticsPreview />

      {/* Section Acheteurs */}
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
      ) : !isLoading && Array.isArray(products) && products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="px-4 py-12 text-center text-text-secondary">
          Aucun produit disponible pour le moment <br />
          <Link
            to={`https://wa.me/243899530506?text=${encodeURIComponent(
              "Bonjour, je souhaite signaler que je n'ai vu aucun produit sur Niplan Market. Pouvez-vous m'aider ?",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white mt-4 text-green-700 px-6 py-3 rounded-full font-bold shadow-lg inline-block"
          >
            <i className="fab fa-whatsapp mr-1"></i> Contactez nous sur WhatsApp
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 pb-1 text-center border-t border-gray-200 dark:border-slate-800 mt-3">
        <p className="text-sm text-text-secondary">
          © {new Date().getFullYear()} Niplan - Marketplace RDC
        </p>
      </footer>
    </div>
  );
};

export default Home;
