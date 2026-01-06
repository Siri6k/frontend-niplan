import React, { useState, useEffect } from "react";
import api from "../api";
import { PlusCircle, Trash2, Package } from "lucide-react";

const Dashboard = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  // Charger mes produits
  const fetchMyProducts = async () => {
    try {
      const res = await api.get("/products/"); // Filtré par le backend via l'utilisateur connecté
      setMyProducts(res.data);
    } catch (err) {
      console.error("Erreur chargement");
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Gérer l'ajout (FormData est obligatoire pour les images)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("image", newProduct.image);

    try {
      await api.post("/my-products/create/", formData);
      setShowAddForm(false);
      fetchMyProducts(); // Rafraîchir la liste
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Package className="text-blue-600" /> Ma Boutique
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
        >
          <PlusCircle />
        </button>
      </div>

      {/* Formulaire d'ajout rapide */}
      {showAddForm && (
        <form
          onSubmit={handleAddProduct}
          className="mb-8 p-4 border rounded-2xl bg-gray-50"
        >
          <input
            type="text"
            placeholder="Nom du produit"
            required
            className="w-full p-2 mb-2 border rounded-lg"
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Prix (USD)"
            required
            className="w-full p-2 mb-2 border rounded-lg"
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            required
            className="w-full mb-2 text-sm"
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.files[0] })
            }
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl font-bold"
          >
            Mettre en ligne
          </button>
        </form>
      )}

      {/* Liste des produits du vendeur */}
      <div className="space-y-4">
        {myProducts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-3 border-b">
            <img
              src={p.image}
              className="w-16 h-16 rounded-lg object-cover"
              alt=""
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{p.name}</h3>
              <p className="text-blue-600 font-bold">{p.price} $</p>
            </div>
            <button className="text-red-400">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
