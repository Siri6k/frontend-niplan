// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  MoveRightIcon,
  PlusCircle,
  Check,
  Settings2 as Settings2Icon,
  LogOut,
  Zap,
  Package,
  TrendingUp,
  LayoutGrid,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import toast from "react-hot-toast";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import ShareBusiness from "../components/ShareBusiness";
import { Link, useNavigate } from "react-router-dom";
import VerifyPhoneModal from "../components/VerifyPhoneModal";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [business, setBusiness] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const role = localStorage.getItem("role") || "vendor";
  const isPhoneVerified = localStorage.getItem("is_phone_verified") || "false";
  const [openModal, setOpenModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setAuthReady(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (authReady) {
      fetchData();
    }
  }, [authReady]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setTimeout(() => {
      document.getElementById(`product-${product.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
    toast.success("Déconnecté avec succès");
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [businessRes, listingsRes] = await Promise.all([
        api.get("/my-business/update/"),
        api.get("/v2/listings/"),
      ]);

      if (businessRes.status !== 200) {
        throw new Error(businessRes?.data?.error || "Erreur de chargement");
      }

      setBusiness(businessRes.data);
      setPhone(businessRes.data.owner_phone || "");

      // Fusion intelligente des anciens produits et nouveaux listings
      const v1Products = businessRes.data.products || [];
      const v2Listings = listingsRes.data.results || [];

      // On combine et on trie par ID ou date (décroissant)
      const merged = [...v2Listings, ...v1Products];
      setProducts(merged);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      toast.error("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      // Priorité V2 pour tout nouvel article
      await api.post("/v2/listings/", formData);
      toast.success("Annonce V2 publiée !");
      setShowForm(false);
      fetchData(); // Plus fiable pour rafraîchir la liste fusionnée
    } catch (err) {
      console.error("Add Error:", err);
      toast.error("Erreur lors de l'ajout V2");
    }
  };

  const handleEdit = async (slug, formData, isImageChanged) => {
    try {
      // Détecte si c'est un produit V1 ou V2
      // Si title est présent dans le formData original ou si c'est une édition de Listing
      const isV1 = !!editingProduct?.name;

      const endpoint = `/v2/listings/${slug}/`; //const endpoint = isV2 ? `/v2/listings/${slug}/` : `/my-products/${slug}/`;
      //const endpoint = isV2 ? `/v2/listings/${slug}/` : `/my-products/${slug}/`;

      /*
      if (isImageChanged && !formData.get("image")) {
        if (!window.confirm("Supprimer l'image ?")) return;
      }*/
      if (isV1) {
        if (slug) {
          await api.delete(`/my-products/${slug}/`);
        }
        await handleAdd(formData);
        return;
      }
      await api.patch(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Annonce mise à jour !");
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      console.error("Edit Error:", err);
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async (slug, isV2 = false) => {
    if (isV2) {
      if (!window.confirm("Supprimer cette annonce V2 ?")) return;
    }

    try {
      const endpoint = isV2 ? `/v2/listings/${slug}/` : `/my-products/${slug}/`;
      await api.delete(endpoint);
      toast.success("Annonce supprimée");
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Erreur de suppression");
    }
  };

  if (!authReady || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30"
        >
          <Zap
            size={24}
            className="text-green-600 dark:text-green-500 fill-green-500"
          />
        </motion.div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
          Chargement de votre terminal...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-green-500/30 overflow-x-hidden pt-4 sm:pt-14 pb-14 sm:pb-24">
      {/* Background Animated Nebulas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 space-y-6">
        {/* --- HEADER PROFILE --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-white/80 dark:bg-white/5 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"
        >
          <div className="flex items-center gap-5 w-full">
            <Link
              to={`/b/${business?.slug}`}
              className="relative group shrink-0"
            >
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md group-hover:blur-lg transition-all" />
              <img
                src={
                  business?.logo ||
                  "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                }
                className="relative w-24 h-24 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform duration-300"
                alt="Logo"
              />
              {isPhoneVerified === "true" && (
                <div className="absolute bottom-1 right-1 bg-green-500 p-1.5 rounded-full border-4 border-white dark:border-[#0f172a] shadow-lg">
                  <Check size={14} className="text-white stroke-[3px]" />
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link to={`/b/${business?.slug}`} className="truncate">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                    {business?.name}
                  </h2>
                </Link>
                {role === "superadmin" && (
                  <Link
                    to="/admin-dashboard"
                    className="shrink-0 p-1.5 bg-green-500/10 text-green-600 dark:text-green-500 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-all"
                  >
                    <Settings2Icon size={16} />
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {role === "vendor" && isPhoneVerified !== "true" ? (
                  <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all"
                  >
                    Vérification requise <MoveRightIcon size={10} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                    <TrendingUp size={10} /> Vendeur Actif
                  </div>
                )}

                <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/5">
                  {business?.business_type || "Market"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none p-4 sm:p-3 bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all border border-slate-200 dark:border-white/5 active:scale-95 group"
              title="Déconnexion"
            >
              <LogOut
                size={20}
                className="mx-auto group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </motion.div>

        {/* --- STATS & SHARE --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card bg-white/80 dark:bg-white/5 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">
                Total Produits
              </p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                {products.length}
              </h3>
            </div>
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-500/10">
              <Package size={28} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            {business && <ShareBusiness slug={business.slug} />}
          </motion.div>
        </div>

        {/* --- PRODUCTS LIST HEADER --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3 self-start">
            <div className="p-2 bg-green-500/10 text-green-600 dark:text-green-500 rounded-xl border border-green-500/20">
              <LayoutGrid size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Catalogue
            </h1>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 group sm:w-64">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-600 transition-colors group-focus-within:text-green-500"
              />
              <input
                type="text"
                placeholder="Filtrer vos articles..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:bg-white dark:focus:bg-white/[0.08] focus:border-green-500/30 text-slate-900 dark:text-white text-sm placeholder:text-slate-500 dark:placeholder:text-slate-600 transition-all font-medium"
              />
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowForm((prev) => !prev || editingProduct);
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-green-500/10 flex items-center gap-2 active:scale-95 group"
            >
              <PlusCircle
                size={20}
                className="group-hover:rotate-90 transition-transform"
              />
              {showForm && !editingProduct ? "Fermer" : "Ajouter"}
            </button>
          </div>
        </div>

        {/* --- FORM & LIST --- */}
        <AnimatePresence mode="wait">
          {showForm && !editingProduct && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <ProductForm
                businessType={business?.business_type}
                onSubmit={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {products.length > 0 ? (
            <ProductList
              products={products}
              editingProduct={editingProduct}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onSaveEdit={handleEdit}
              onCancelEdit={() => setEditingProduct(null)}
              businessType={business?.business_type}
            />
          ) : (
            <div className="p-12 glass-card bg-white/80 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/5">
                <Package
                  size={32}
                  className="text-slate-500 dark:text-slate-700"
                />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
                Votre vitrine est vide
              </p>
              <p className="text-slate-500 dark:text-slate-600 text-sm mt-1">
                Commencez à ajouter vos premiers articles pour attirer des
                clients.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 text-green-600 dark:text-green-500 text-xs font-black uppercase tracking-[0.2em] hover:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                + Ajouter un produit
              </button>
            </div>
          )}
        </motion.div>

        {openModal && phone && (
          <VerifyPhoneModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            phone={phone}
          />
        )}
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-center mt-20 pb-10">
        <p className="text-[10px] text-slate-500 dark:text-slate-700 font-bold uppercase tracking-[0.3em]">
          Propulsé par Niplan Ecosystem RDC
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
