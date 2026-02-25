// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { MoveRightIcon, PlusCircle } from "lucide-react";
import { Check, Settings2 as Settings2Icon, LogOut } from "lucide-react";
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
  const [editingProduct, setEditingProduct] = useState(null); // Stocke le produit entier
  const role = localStorage.getItem("role") || "vendor";
  const isPhoneVerified = localStorage.getItem("is_phone_verified") || "false";
  const [openModal, setOpenModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // Si pas de token, on dégage direct vers le login
      navigate("/login", { replace: true });
    } else {
      // Si on a un token, on dit que l'auth est prête
      setAuthReady(true);
    }
  }, [navigate]);

  // Un seul useEffect pour les données, qui attend que l'auth soit OK
  useEffect(() => {
    if (authReady) {
      fetchData();
    }
  }, [authReady]);
  const handleEditClick = (product) => {
    setEditingProduct(product);
    // Scroll vers le produit
    setTimeout(() => {
      document.getElementById(`product-${product.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("business_slug");
    localStorage.removeItem("is_phone_verified");
    navigate("/login", { replace: true });
  };
  const handleSaveEdit = async (slug, formData, isImageChanged) => {
    try {
      await api.patch(`/my-products/${slug}/edit/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Produit modifié !");
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      toast.error("Erreur de modification");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const businessRes = await api.get("/my-business/update/");

      if (businessRes.status !== 200) {
        throw new Error(
          businessRes?.data?.error || "Erreur de chargement du profil",
        );
      }

      setBusiness(businessRes.data);
      setProducts(businessRes.data.products || []);
      setPhone(businessRes.data.owner_phone || "");
    } catch (err) {
      console.log(err);

      toast.error("Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      await api.post("/my-products/create/", formData);
      toast.success("Produit ajouté !");
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleEdit = async (slug, formData, isImageChanged) => {
    try {
      // Si l'image est supprimée (formData.get("image") === "")
      const imageValue = formData.get("image");

      if (isImageChanged && !imageValue) {
        // Optionnel: confirmer la suppression d'image
        if (!window.confirm("Supprimer l'image du produit ?")) return;
      }

      await api.patch(`/my-products/${slug}/edit/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Produit modifié !");
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await api.delete(`/my-products/${slug}/delete/`);
      toast.success("Produit supprimé");
      fetchData();
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  if (!authReady || isLoading) {
    return (
      <div className="px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 w-full max-w-2xl mx-auto">
      {/* --- HEADER INFOS VENDEUR --- */}
      <div className="p-6 border-b flex justify-between items-center shadow-sm ">
        <div className="flex items-center gap-3 dark:text-slate-200">
          <Link to={`/b/${business?.slug}`}>
            <img
              src={
                business?.logo ||
                "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              }
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              alt="Logo"
            />
          </Link>
          <div>
            <h2 className="font-bold text-gray-900 leading-none dark:text-slate-200">
              <Link to={`/b/${business?.slug}`}>{business?.name}</Link>
            </h2>
            {role === "vendor" && isPhoneVerified !== "true" && (
              <p
                className="text-xs text-red-500 mt-1 "
                onClick={(e) => setOpenModal(true)}
              >
                Vérifiez votre numéro{" "}
                <MoveRightIcon size={12} className="inline text-red-500 mr-1" />
              </p>
            )}
            {role === "vendor" && isPhoneVerified === "true" && (
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

      {/* Partage */}
      {business && <ShareBusiness slug={business.slug} />}

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
        <h1 className="text-lg font-bold text-gray-800 dark:text-slate-200">
          {products.length} Produit{products.length > 1 ? "s" : ""}
        </h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm((prev) => !prev || editingProduct);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <PlusCircle size={18} />
          {showForm && !editingProduct ? "Fermer" : "Ajouter"}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && !editingProduct && (
        <ProductForm
          businessType={business?.business_type}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}
      {/* Liste */}
      {/* Liste avec édition inline */}
      {products.length > 0 && (
        <ProductList
          products={products}
          editingProduct={editingProduct}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={() => setEditingProduct(null)}
          businessType={business?.business_type}
        />
      )}
      {products.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Aucun produit ajouté pour le moment.
        </p>
      )}
      {openModal && phone && (
        <VerifyPhoneModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          phone={phone}
        />
      )}
    </div>
  );
};

export default Dashboard;
