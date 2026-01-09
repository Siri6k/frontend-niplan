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
  Share2,
  Settings2Icon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BusinessSettings from "../components/BusinessSettings"; // Import du composant de profil
import toast from "react-hot-toast";

const ShareBusiness = ({ slug }) => {
  const shopUrl = `${window.location.origin}/b/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ma boutique Niplan",
          text: "Découvrez mes produits sur ma boutique en ligne !",
          url: shopUrl,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      // Fallback si WebShare API n'est pas dispo (ex: copie lien)
      navigator.clipboard.writeText(shopUrl);
      alert("Lien de la boutique copié !");
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center justify-between mb-6">
      <div className="flex-1">
        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
          Lien de votre boutique
        </p>
        <p className="text-xs text-gray-500 truncate mr-4">{shopUrl}</p>
      </div>
      <button
        onClick={handleShare}
        className="bg-blue-600 text-white p-3 rounded-xl shadow-lg active:scale-90 transition-all"
      >
        <Share2 size={20} />
      </button>
    </div>
  );
};

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
  const role = localStorage.getItem("role");
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

  // Dans Dashboard.js
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tab") === "settings") {
      setView("settings");
    }
  }, [location]);

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
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("business_slug");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // --- 3. GESTION PRODUITS ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("currency", newProduct.currency);
    formData.append("description", newProduct.description);
    formData.append("location", newProduct.location);
    formData.append("image", newProduct.image);
    if (businessData.business_type === "TROC") {
      formData.append("exchange_for", newProduct.exchange_for);
    }

    try {
      await api.post("/my-products/create/", formData);
      setShowAddForm(false);
      fetchMyProducts();
      toast.success("Produit ajouté avec succès");
    } catch (err) {
      toast.error("Erreur lors de l'ajout du produit");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      try {
        await api.delete(`/my-products/${id}/delete/`);
        fetchMyProducts();
        toast.success("Produit supprimé");
      } catch (err) {
        toast.error("Erreur lors de la suppression");
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
            src={
              businessData.logo ||
              "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            }
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            alt="Logo"
          />
          <div>
            <h2 className="font-bold text-gray-900 leading-none dark:text-slate-200">
              {businessData.name}
            </h2>
            {role === "vendor" && (
              <p className="text-xs text-gray-500 mt-1 ">
                Vendeur vérifié{" "}
                <Check size={12} className="inline text-green-500 mr-1" />
              </p>
            )}
            {role === "superadmin" && (
              <Link
                to="/admin-dashboard"
                className="text-xs text-red-500 mt-1 underline"
              >
                <div className="text-xs text-white bg-green-500 inline-block px-2 py-0.5 rounded-full mt-1 dark:bg-green-600">
                  Super Admin{" "}
                  <Settings2Icon size={12} className="inline ml-1" />
                </div>
              </Link>
            )}
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
            {/* Le vendeur peut partager sa boutique publique */}
            <ShareBusiness slug={businessData.slug} />
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
                {businessData.business_type === "TROC" && (
                  <p className="text-xs text-gray-500 mb-4 text-center dark:text-slate-400">
                    Vous avez choisi le type "Troc". N'oubliez pas de remplir le
                    champ "Échange contre" lors de l'ajout d'un produit.
                  </p>
                )}
                <input
                  type="text"
                  placeholder="Nom du produit"
                  required
                  className="w-full p-3 mb-2 bg-gray-20 rounded-xl dark:bg-slate-800"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                {/* Remplace l'ancien input prix par ce groupe */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="Prix"
                    required
                    className="flex-1 p-3 bg-gray-50 rounded-xl dark:bg-slate-800 dark:text-white"
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                  <select
                    className="w-24 p-3 bg-gray-50 rounded-xl border-none font-bold text-blue-400 dark:bg-slate-800"
                    value={newProduct.currency}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, currency: e.target.value })
                    }
                  >
                    <option value="USD">USD</option>
                    <option value="CDF">CDF</option>
                  </select>
                </div>
                {businessData.business_type === "TROC" && (
                  <input
                    type="text"
                    placeholder="Échange contre"
                    className="w-full p-3 mb-2 bg-gray-50 rounded-xl dark:bg-slate-800"
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        exchange_for: e.target.value,
                      })
                    }
                  />
                )}
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
                    <p className="text-blue-600 font-bold">
                      {p.price} {p.currency}
                    </p>
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
