import React, { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";

const BusinessSettings = ({ businessData, onUpdate }) => {
  const [name, setName] = useState(businessData.name);
  const [location, setLocation] = useState(businessData.location);
  const [description, setDescription] = useState(businessData.description);
  const [logo, setLogo] = useState(null);
  const [businessType, setBusinessType] = useState(
    businessData.business_type || "boutique",
  );
  const businessUrl = businessData?.slug;
  const [preview, setPreview] = useState(businessData.logo);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    formData.append("business_type", businessType); // <-- Ajout ici
    formData.append("location", location);
    if (logo) formData.append("logo", logo);

    try {
      // On appelle la fonction du parent et on attend le résultat
      const updatedBusiness = await onUpdate(formData);

      // Navigation vers le nouveau slug si besoin
      navigate(`/b/${updatedBusiness.slug}`);
    } catch (error) {
      // L'erreur est déjà gérée par le toast du parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800">
      <form onSubmit={handleSave} className="space-y-5">
        {/* Section Logo */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-2">
            <img
              src={preview || "https://via.placeholder.com/100"}
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
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">
            Nom du business
          </label>
          <input
            type="text"
            className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:bg-slate-800 dark:border-slate-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">
            Type d'activité
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          >
            <option value="SHOP">🛍️ Boutique (Vente générale)</option>
            <option value="IMMO">🏠 Immobilier (Vente/Location)</option>
            <option value="TROC">🔄 Troc (Échange d'articles)</option>
          </select>
          <p className="text-[10px] text-gray-400 mt-1 ml-1">
            Cela aide les clients à trouver votre business plus facilement.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">
            Description (Bio)
          </label>
          <textarea
            rows="3"
            placeholder="Ex: Vente de téléphones originaux à Kinshasa..."
            className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:bg-slate-800 dark:border-slate-700"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">
            Ville ou localisation
          </label>
          <input
            type="text"
            className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:bg-slate-800 dark:border-slate-700"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enregistrer <Save size={16} className="inline ml-2" />
        </button>
      </form>
    </div>
  );
};

export default BusinessSettings;
