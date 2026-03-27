import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { Categories, ProductGrid } from "../components/HomeComponents";
import HeroV2 from "../components/Homev2/HeroV2";
import BusinessShowcase from "../components/Homev2/BusinessShowcase";
import AnalyticsPreview from "../components/Homev2/AnalyticsPreview";

const Home = () => {
  const [v1Products, setV1Products] = useState([]);
  const [v2Listings, setV2Listings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch produits & listings (Dual-Fetch)
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [v1Res, v2Res] = await Promise.all([
          api.get("/products/"),
          api.get("/v2/public/listings/"),
        ]);

        let safeV1 = [];
        if (Array.isArray(v1Res.data)) safeV1 = v1Res.data;
        else if (Array.isArray(v1Res.data?.results))
          safeV1 = v1Res.data.results;

        let safeV2 = [];
        if (Array.isArray(v2Res.data)) safeV2 = v2Res.data;
        else if (Array.isArray(v2Res.data?.results))
          safeV2 = v2Res.data.results;

        if (isMounted) {
          setV1Products(safeV1);
          setV2Listings(safeV2);
        }
      } catch (error) {
        console.error("Erreur Dual-Fetch:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <HeroV2 />

      <BusinessShowcase />

      <AnalyticsPreview />
      {/* Section Acheteurs (Categories) */}
      <Categories />

      {/* Section Nouveautés V1 
      <section className="px-4 mt-8 mb-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Le Marché Niplan
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              Découvrez les articles de nos vendeurs certifiés
            </p>
          </div>
          <Link
            to="/dashboard?tab=products"
            className="text-sm font-medium text-accent hover:opacity-80 transition-opacity"
          >
            Voir tout →
          </Link>
        </div>
      </section>*/}
      {/* Section V2 : PROXIMITE & PRO */}
      {v2Listings.length > 0 && (
        <div className="bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-950/20 py-12">
          <section className="px-6 mb-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-green-500 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-green-500/20">
                    Premium
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                    PROXIMITÉ & PRO
                  </h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md leading-relaxed">
                  Découvrez les offres exclusives et vérifiées par nos experts
                  pour un achat en toute sécurité.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="text-xs font-black text-green-600 dark:text-green-500 uppercase tracking-widest hover:translate-x-1 transition-transform"
              >
                Voir tout le catalogue Pro →
              </Link>
            </div>
          </section>
          <ProductGrid
            products={v2Listings}
            emptyMessage="Chargement des offres pro..."
          />
        </div>
      )}

      {/* Grille produits V1 
      {isLoading ? (
        <div className="px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      ) : v1Products.length > 0 ? (
        <ProductGrid products={v1Products} />
      ) : (
        !v2Listings.length && (
          <div className="px-4 py-12 text-center text-text-secondary">
            Aucun produit disponible pour le moment...
          </div>
        )
      )}*/}

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
