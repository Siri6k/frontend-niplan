import React, { useState, useEffect } from "react";

export const BusinessSettings = ({ businessData, onUpdate }) => {
  const [name, setName] = useState(businessData.name);
  const [description, setDescription] = useState(businessData.description);
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(businessData.logo);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (logo) formData.append("logo", logo);

    try {
      const response = await fetch(
        `https://ton-api.com/api/my-business/update/`,
        {
          method: "PATCH", // On utilise PATCH pour une mise à jour partielle
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Boutique mise à jour !");
      }
    } catch (error) {
      console.error("Erreur de mise à jour", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ma Boutique</h2>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Section Logo */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-2">
            <img
              src={preview || "https://via.placeholder.com/100?text=Logo"}
              className="w-full h-full rounded-full object-cover border-2 border-green-500"
              alt="Logo Business"
            />
            <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer shadow-lg">
              <span className="text-white text-xs">📷</span>
              <input
                type="file"
                className="hidden"
                onChange={handleLogoChange}
                accept="image/*"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Cliquez pour changer votre logo
          </p>
        </div>

        {/* Champs texte */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de la boutique
          </label>
          <input
            type="text"
            className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description (Bio)
          </label>
          <textarea
            rows="3"
            placeholder="Ex: Vente de téléphones originaux à Kinshasa..."
            className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {loading ? "Mise à jour..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
};

export const Hero = () => (
  <div className="bg-green-600 text-white p-8 text-center rounded-b-3xl">
    <h1 className="text-3xl font-extrabold mb-2">Vendez tout, partout.</h1>
    <p className="opacity-90 mb-6">
      Créez votre boutique WhatsApp en 2 minutes.
    </p>
    <button className="bg-white text-green-700 px-6 py-3 rounded-full font-bold shadow-lg">
      Créer ma boutique gratuitement
    </button>
  </div>
);

export const Categories = () => {
  const cats = [
    { name: "Boutiques", icon: "🛍️" },
    { name: "Troc / Échange", icon: "🔄" },
    { name: "Immobilier", icon: "🏠" },
    { name: "Services", icon: "🛠️" },
  ];
  return (
    <div className="flex space-x-4 overflow-x-auto p-4 no-scrollbar">
      {cats.map((cat) => (
        <div
          key={cat.name}
          className="flex-shrink-0 bg-gray-100 p-3 rounded-2xl text-center min-w-[100px]"
        >
          <span className="text-2xl">{cat.icon}</span>
          <p className="text-xs font-semibold mt-1">{cat.name}</p>
        </div>
      ))}
    </div>
  );
};

export const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-2 gap-4 p-4">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
      >
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="w-full h-48 bg-gray-200">
            {" "}
            {/* Conteneur avec hauteur fixe */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover" // Remplit tout le carré sans étirer
            />
          </div>
          <div className="p-2">{/* ... titre et prix ... */}</div>
        </div>
        <div className="p-2">
          <h3 className="font-bold text-sm truncate">{product.name}</h3>
          <p className="text-green-600 font-bold">
            {product.price} {product.currency}
          </p>
          <p className="text-[10px] text-gray-400">
            Vendu par {product.business_name}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export const StatusTeaser = () => (
  <div className="bg-gray-50 py-12 px-6 rounded-3xl my-10 border-2 border-dashed border-green-200">
    <h3 className="text-center font-bold text-xl mb-6">
      Fini les captures d'écran désordonnées !
    </h3>
    <div className="flex justify-center gap-4">
      {/* Simulation d'un téléphone */}
      <div className="w-64 h-[400px] bg-white rounded-[3rem] border-[8px] border-black shadow-2xl overflow-hidden relative">
        <div className="bg-green-600 h-16 flex items-center px-4">
          <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
          <div className="text-white text-xs font-bold">Ma Boutique Pro</div>
        </div>
        <div className="p-2 grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-100 h-24 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 py-2 bg-green-500 rounded-full text-white text-[10px] text-center font-bold">
          Commander sur WhatsApp
        </div>
      </div>
    </div>
  </div>
);
