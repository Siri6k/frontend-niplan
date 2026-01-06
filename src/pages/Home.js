import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Hero,
  Categories,
  ProductGrid,
  StatusTeaser,
} from "../components/HomeComponents";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // On récupère les produits réels de ton API Django
    api.get("/products/").then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <Hero />
      <Categories />

      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold text-gray-800">Nouveautés</h2>
        <p className="text-sm text-gray-500">
          Découvrez les derniers articles publiés
        </p>
      </div>

      <ProductGrid products={products} />

      <StatusTeaser />

      <div className="p-8 text-center text-gray-400 text-sm">
        © 2026 Kifanyi - Marketplace RDC
      </div>
    </div>
  );
};

export default Home;
