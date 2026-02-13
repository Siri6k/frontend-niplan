// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Check, Settings2 as Settings2Icon, LogOut } from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import ShareBusiness from "../components/ShareBusiness";
import BusinessCard from "../components/BusinessCard";
import BusinessInfo from "../components/BusinessInfo";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [business, setBusiness] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // Stocke le produit entier
  const role = localStorage.getItem("role");

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
    window.location.href = "/login";
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [businessRes] = await Promise.all([
        api.get("/my-business/update/"),
      ]);
      setBusiness(businessRes.data);
      setProducts(businessRes.data.products);
    } catch (err) {
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

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="p-4 space-y-4 w-full max-w-2xl mx-auto">
      {/* --- HEADER INFOS VENDEUR --- */}
      <div className="p-6 border-b flex justify-between items-center shadow-sm ">
        <div className="flex items-center gap-3 dark:text-slate-200">
          <Link to={`/b/${business.slug}`}>
            <img
              src={
                business.logo ||
                "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              }
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              alt="Logo"
            />
          </Link>
          <div>
            <h2 className="font-bold text-gray-900 leading-none dark:text-slate-200">
              <Link to={`/b/${business.slug}`}>{business.name}</Link>
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
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <PlusCircle size={18} />
          {showForm ? "Fermer" : "Ajouter"}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <ProductForm
          businessType={business?.business_type}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Liste */}
      {/* Liste avec édition inline */}
      <ProductList
        products={products}
        editingProduct={editingProduct}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={() => setEditingProduct(null)}
        businessType={business?.business_type}
      />
    </div>
  );
};

export default Dashboard;
