import React, { useState, useEffect } from "react";
import api from "../api";
import {
  PlusCircle,
  Trash2,
  Package,
  LogOut,
  Settings,
  Shop,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BusinessSettings from "../components/BusinessSettings"; // Import du composant de profil

const Dashboard = () => {
  const [view, setView] = useState("products"); // Switch entre 'products' et 'settings'
  const [myProducts, setMyProducts] = useState([]);
  const [businessData, setBusinessData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const navigate = useNavigate();

  // --- 1. VERIFICATION AUTH & CHARGEMENT INFOS ---
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    } else {
      fetchBusinessInfo();
      fetchMyProducts();
    }
  }, [navigate]);

  const fetchBusinessInfo = async () => {
    try {
      const res = await api.get("/my-business/update/");
      setBusinessData(res.data);
    } catch (err) {
      console.error("Erreur chargement profil");
    }
  };

  const fetchMyProducts = async () => {
    try {
      const res = await api.get("/my-products/");
      setMyProducts(res.data);
    } catch (err) {
      console.error("Erreur chargement produits");
    }
  };

  // --- 2. LOGIQUE LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // --- 3. GESTION PRODUITS ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("location", newProduct.location);
    formData.append("image", newProduct.image);

    try {
      await api.post("/my-products/create/", formData);
      setShowAddForm(false);
      fetchMyProducts();
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      try {
        await api.delete(`/my-products/${id}/delete/`);
        fetchMyProducts();
      } catch (err) {
        alert("Erreur suppression");
      }
    }
  };

  if (!businessData)
    return (
      <div className="p-10 text-center text-gray-400 dark:text-slate-400">
        Chargement...
      </div>
    );

  return (
    <div className="pb-24 max-w-md mx-auto bg-gray-50 min-h-screen dark:bg-slate-950">
      {/* --- HEADER INFOS VENDEUR --- */}
      <div className="bg-white p-6 border-b flex justify-between items-center shadow-sm dark:bg-slate-900">
        <div className="flex items-center gap-3 dark:text-slate-200">
          <img
            src={businessData.logo || "https://via.placeholder.com/100"}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            alt="Logo"
          />
          <div>
            <h2 className="font-bold text-gray-900 leading-none dark:text-slate-200">
              {businessData.name}
            </h2>
            <p className="text-xs text-gray-500 mt-1 ">
              Vendeur vérifié{" "}
              <Check size={12} className="inline text-green-500 mr-1" />
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 p-2 bg-red-50 rounded-full dark:bg-red-900/30 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* --- MENU NAVIGATION INTERNE --- */}
      <div className="flex bg-white mb-4 shadow-sm dark:bg-slate-900">
        <button
          onClick={() => setView("products")}
          className={`flex-1 py-4 text-sm font-bold flex justify-center items-center gap-2 ${
            view === "products"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-400"
          }`}
        >
          <Package size={18} />
          Mes Produits
        </button>
        <button
          onClick={() => setView("settings")}
          className={`flex-1 py-4 text-sm font-bold flex justify-center items-center gap-2 ${
            view === "settings"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-400"
          }`}
        >
          <Settings size={18} /> Mon Profil
        </button>
      </div>

      <div className="p-4">
        {view === "products" ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700  dark:text-slate-300">
                {myProducts.length} Articles
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <PlusCircle size={18} /> Ajouter
              </button>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleAddProduct}
                className="mb-6 p-4 bg-white border rounded-2xl shadow-sm dark:bg-slate-900"
              >
                <input
                  type="text"
                  placeholder="Nom du produit"
                  required
                  className="w-full p-3 mb-2 bg-gray-50 rounded-xl dark:bg-slate-800"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Prix (USD)"
                  required
                  className="w-full p-3 mb-2 bg-gray-50 rounded-xl dark:bg-slate-800"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Ville ou Localisation"
                  required
                  className="w-full p-3 mb-2 bg-gray-50 rounded-xl dark:bg-slate-800"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, location: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description du produit"
                  className="w-full p-3 mb-2 bg-gray-50 rounded-xl dark:bg-slate-800"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full mb-4 text-xs text-gray-500 dark:text-slate-400"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold dark:bg-green-700 hover:bg-green-700 transition-colors"
                >
                  Mettre en ligne
                </button>
              </form>
            )}

            <div className="space-y-3">
              {myProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800"
                >
                  <img
                    src={p.image}
                    className="w-16 h-16 rounded-xl object-cover"
                    alt={p.name}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm dark:text-slate-200">
                      {p.name}
                    </h3>
                    <p className="text-blue-600 font-bold">{p.price} $</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="text-red-300 hover:text-red-500 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* --- APPEL DE TON COMPOSANT DE REGLAGES --- */
          <BusinessSettings
            businessData={businessData}
            onUpdate={fetchBusinessInfo}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
