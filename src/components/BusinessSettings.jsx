import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Save,
  Camera,
  Store,
  LayoutGrid,
  MapPin,
  Info,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const BusinessSettings = ({ businessData, onUpdate }) => {
  const [name, setName] = useState(businessData.name);
  const [location, setLocation] = useState(businessData.location);
  const [description, setDescription] = useState(businessData.description);
  const [logo, setLogo] = useState(null);
  const [businessType, setBusinessType] = useState(
    businessData.business_type || "SHOP",
  );
  const [preview, setPreview] = useState(businessData.logo);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
      toast.info("Aperçu du logo actualisé");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("business_type", businessType);
    formData.append("location", location);
    if (logo) formData.append("logo", logo);

    try {
      const updatedBusiness = await onUpdate(formData);
      localStorage.setItem("business_slug", updatedBusiness.slug);
      setTimeout(() => {
        navigate(`/b/${updatedBusiness.slug}`);
      }, 500);
    } catch (error) {
      // Erreur gérée par le parent
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:bg-white dark:focus:bg-white/[0.08] focus:border-green-500/30 text-slate-900 dark:text-white text-sm placeholder:text-slate-500 dark:placeholder:text-slate-600 transition-all font-medium";
  const labelClasses =
    "text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 mb-1.5 flex items-center gap-2";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card bg-white/90 dark:bg-white/5 rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-3xl relative overflow-hidden max-w-2xl mx-auto"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] -z-10" />

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section Logo Profile */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group w-32 h-32 mb-4">
            <div className="absolute inset-0 bg-green-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all" />
            <div className="relative w-full h-full rounded-[2.5rem] border-2 border-dashed border-slate-300 dark:border-white/10 p-1.5">
              <img
                src={
                  preview ||
                  "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                }
                className="w-full h-full rounded-[2rem] object-cover border border-slate-200 dark:border-white/5 transition-transform group-hover:scale-[0.98]"
                alt="Logo"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-green-500 text-white p-2.5 rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-slate-900"
              >
                <Camera size={14} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleLogoChange}
              accept="image/*"
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
            Identité Visuelle
          </p>
        </div>

        {/* Inputs Grid */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className={labelClasses}>
              <Store size={12} className="text-green-600 dark:text-green-500" />{" "}
              Nom de l'Enseigne
            </label>
            <input
              type="text"
              placeholder="Ex: Boutique Elite Kinshasa"
              required
              className={inputClasses}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className={labelClasses}>
                <LayoutGrid
                  size={12}
                  className="text-blue-600 dark:text-blue-500"
                />{" "}
                Secteur d'Activité
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest focus:border-green-500/30"
              >
                <option value="SHOP">🛍️ Boutique (Vente)</option>
                <option value="IMMO">🏠 Immobilier (Location)</option>
                <option value="TROC">🔄 Troc (Échange)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={labelClasses}>
                <MapPin size={12} className="text-red-500" /> Localisation
              </label>
              <input
                type="text"
                placeholder="Ville, Quartier, RDC"
                className={inputClasses}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>
              <Info size={12} className="text-orange-500" /> Bio / Description
            </label>
            <textarea
              rows="3"
              placeholder="Présentez votre boutique en quelques mots..."
              className={`${inputClasses} resize-none min-h-[100px]`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-[9px] text-slate-500 dark:text-slate-700 font-bold uppercase tracking-widest ml-2">
              Sera affiché publiquement sur votre boutique.
            </p>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-lg shadow-green-500/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 group"
          >
            {loading ? (
              <Zap size={18} className="animate-spin" />
            ) : (
              <>
                <Save
                  size={18}
                  className="group-hover:rotate-12 transition-transform"
                />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BusinessSettings;
