// components/ProductForm.jsx
import { useState, useRef } from "react";
import {
  ImageIcon as ImageIcon,
  X,
  Camera,
  ChevronDown,
  ChevronUp,
  Package,
  Check,
  Zap,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_CONFIG = {
  "Véhicules": [
    { name: "marque", label: "Marque", type: "text", placeholder: "Ex: Toyota" },
    { name: "modele", label: "Modèle", type: "text", placeholder: "Ex: RAV4" },
    { name: "annee", label: "Année", type: "number", placeholder: "Ex: 2022" },
    { name: "kilometrage", label: "Kilométrage (km)", type: "number", placeholder: "Ex: 50000" },
  ],
  "Immobilier": [
    { name: "type_immo", label: "Type", type: "select", options: ["Appartement", "Maison", "Terrain", "Bureau", "Commerce"] },
    { name: "chambres", label: "Chambres", type: "number", placeholder: "Ex: 3" },
    { name: "surface", label: "Surface (m²)", type: "number", placeholder: "Ex: 120" },
  ],
  "Électronique": [
    { name: "etat_objet", label: "État", type: "select", options: ["Neuf scellé", "Occasion (Comme neuf)", "Occasion (Bon état)", "À réparer"] },
    { name: "modele_precis", label: "Modèle précis", type: "text", placeholder: "Ex: A15 Pro" },
  ],
  "Services": [
    { name: "type_service", label: "Type de service", type: "text", placeholder: "Ex: Plomberie, Conseil..." },
    { name: "tarif_info", label: "Information tarifaire", type: "text", placeholder: "Ex: À l'heure, Forfait..." },
  ]
};

const ProductForm = ({
  product,
  businessType,
  onSubmit,
  onCancel,
  compact = false,
}) => {
  const [formData, setFormData] = useState({
    title: product?.title || product?.name || "",
    name: product?.name || "", // compatibilité
    price: product?.price || "",
    currency: product?.currency || "USD",
    description: product?.description || "",
    category: product?.category || "Général",
    commune: product?.commune || "",
    quartier: product?.quartier || "",
    location: product?.location || "", // compatibilité
    exchange_for: product?.exchange_for || "",
    is_available: product?.is_available ?? true,
    image: null,
    images: [], 
    specs: product?.specs || {}, // Champs dynamiques JSON
  });

  const [displayImage, setDisplayImage] = useState(product?.image || null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [showFull, setShowFull] = useState(!compact);
  const fileInputRef = useRef(null);

  const [isTrocMode, setIsTrocMode] = useState(
    businessType === "TROC" || !!product?.exchange_for,
  );
  const isEditing = !!product;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const remainingSlots = 5 - formData.images.length;
      const filesToAdd = files.slice(0, remainingSlots);

      if (files.length > remainingSlots) {
        alert("Limite de 5 photos atteinte.");
      }

      const newImages = [...formData.images, ...filesToAdd];
      setFormData({ ...formData, images: newImages });
      
      // La première image devient l'image principale par défaut
      if (!displayImage && filesToAdd.length > 0) {
        setDisplayImage(URL.createObjectURL(filesToAdd[0]));
      }
      setIsImageChanged(true);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    if (newImages.length === 0) {
      setDisplayImage(null);
    } else if (displayImage === URL.createObjectURL(formData.images[index])) {
      setDisplayImage(URL.createObjectURL(newImages[0]));
    }
    setIsImageChanged(true);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const data = new FormData();
    const isV2 = !!formData.title || !isEditing; // Tout nouvel ajout est V2

    data.append("title", formData.title || formData.name);
    data.append("name", formData.name || formData.title); // compatibilité V1
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("commune", formData.commune);
    data.append("quartier", formData.quartier);
    data.append("location", formData.location || `${formData.commune}, ${formData.quartier}`); // compatibilité V1
    data.append("is_available", formData.is_available);

    if (isTrocMode && formData.exchange_for) {
      data.append("exchange_for", formData.exchange_for);
    }
    
    // Règle du prix symbolique (1 USD) si vide sur certaines catégories
    const finalPrice = formData.price || "1";
    data.append("price", finalPrice);
    data.append("currency", formData.currency);

    // Envoi des specs au format JSON string (si multi-part) ou objet (si JSON)
    // Ici on est en FormData (multi-part), donc on stringify le JSON
    data.append("specs", JSON.stringify(formData.specs));

    if (isImageChanged) {
      // V1 compatibilité (on envoie la première image)
      if (formData.images.length > 0) {
        data.append("image", formData.images[0]);
      } else {
        data.append("image", "");
      }

      // V2 : On envoie toutes les images sous la clé 'images'
      formData.images.forEach((img) => {
        data.append("images", img);
      });
    }

    onSubmit(data, isImageChanged);
  };

  const inputClasses =
    "w-full p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:bg-slate-50 dark:focus:bg-white/[0.08] focus:border-green-500/30 text-slate-900 dark:text-white text-sm placeholder:text-slate-500 dark:placeholder:text-slate-600 transition-all font-medium";

  // Version compacte (dans la carte d'édition)
  if (compact && !showFull) {
    return (
      <div className="p-6 space-y-4">
        <div className="relative group rounded-2xl overflow-hidden border border-slate-300 dark:border-white/5 aspect-video sm:aspect-auto sm:h-32">
          <img
            src={displayImage || product?.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera size={24} className="text-white mb-1" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              Changer la photo
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nom du produit"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
          />

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Prix"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className={`${inputClasses} flex-1`}
            />
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-24 p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest"
            >
              <option value="USD">USD</option>
              <option value="CDF">CDF</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFull(true)}
          className="w-full text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1 py-2 transition-colors"
        >
          Options avancées <ChevronDown size={14} />
        </button>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl border border-slate-300 dark:border-white/5 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden bg-white/80 dark:bg-transparent backdrop-blur-xl"
    >
      {/* Decorative background for form */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] -z-10" />

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-500 border border-green-500/20">
          <Package size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {isEditing ? "Modifier l'article" : "Nouvel article"}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">
            Remplissez les détails de votre produit
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image Upload */}
        <div className="md:col-span-4 space-y-4">
          <div className="space-y-4">
            {/* Main Preview */}
            <div className="relative group aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Principal"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2">Photo principale</p>
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                 >
                   Modifier / Ajouter
                 </button>
              </div>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-4 gap-2">
              {formData.images.map((file, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 group/thumb">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setDisplayImage(URL.createObjectURL(file))}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              
              {formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center text-slate-400 hover:border-green-500/50 hover:text-green-600 dark:hover:text-green-500 transition-all bg-slate-50 dark:bg-white/[0.01]"
                >
                  <PlusCircle size={20} />
                  <span className="text-[8px] font-black uppercase mt-1">{5 - formData.images.length} rest.</span>
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) =>
                  setFormData({ ...formData, is_available: e.target.checked })
                }
                className="w-5 h-5 rounded-lg bg-white dark:bg-white/5 border-slate-300 dark:border-white/5 text-green-500 focus:ring-green-500/50 outline-none"
              />
              <span className="text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">
                En stock / Disponible
              </span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all">
              <input
                type="checkbox"
                checked={isTrocMode}
                onChange={(e) => setIsTrocMode(e.target.checked)}
                className="w-5 h-5 rounded-lg bg-white dark:bg-white/10 border-slate-300 dark:border-white/10 text-blue-500 focus:ring-blue-500/50 outline-none"
              />
              <span className="text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">
                Accepter le Troc
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Text Inputs */}
        <div className="md:col-span-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
                Titre de l'annonce
              </label>
              <input
                type="text"
                placeholder="Ex: iPhone 15 Pro Max"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClasses}
              >
                <option value="Général">Général</option>
                <option value="Électronique">Électronique</option>
                <option value="Mode">Mode</option>
                <option value="Immobilier">Immobilier</option>
                <option value="Services">Services</option>
                <option value="Véhicules">Véhicules</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Prix de vente
                </label>
                <div className="flex gap-2">
                  <input
                    placeholder="0.00"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className={`${inputClasses} flex-1`}
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-24 p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none text-slate-900 dark:text-slate-400 text-xs font-black uppercase tracking-widest focus:border-green-500/30"
                  >
                    <option value="CDF">CDF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Commune
                </label>
                <input
                  type="text"
                  placeholder="Ex: Gombe, Ngaliema..."
                  value={formData.commune}
                  onChange={(e) =>
                    setFormData({ ...formData, commune: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Quartier / Avenue
                </label>
                <input
                  type="text"
                  placeholder="Ex: Localisation précise"
                  value={formData.quartier}
                  onChange={(e) =>
                    setFormData({ ...formData, quartier: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>
            </div>

            {isTrocMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em] ml-2">
                  Échange souhaité <Zap size={12} className="inline-block" />
                </label>
                <input
                  type="text"
                  placeholder="Ex: Un autre téléphone ou PC"
                  value={formData.exchange_for}
                  onChange={(e) =>
                    setFormData({ ...formData, exchange_for: e.target.value })
                  }
                  className={`${inputClasses} border-blue-500/20 focus:border-blue-500/50`}
                />
              </motion.div>
            )}

            {/* Dynamic Category Fields (V2 Specs) */}
            <AnimatePresence mode="wait">
              {CATEGORY_CONFIG[formData.category] && (
                <motion.div
                  key={formData.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-green-500/5 dark:bg-green-500/10 rounded-3xl border border-green-500/10"
                >
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-black text-green-600 dark:text-green-500 uppercase tracking-widest mb-2 ml-2">
                      Détails spécifiques : {formData.category}
                    </p>
                  </div>
                  {CATEGORY_CONFIG[formData.category].map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-2">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={formData.specs[field.name] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specs: { ...formData.specs, [field.name]: e.target.value }
                            })
                          }
                          className={inputClasses}
                        >
                          <option value="">Sélectionner...</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData.specs[field.name] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specs: { ...formData.specs, [field.name]: e.target.value }
                            })
                          }
                          className={inputClasses}
                        />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
                Description
              </label>
              <textarea
                placeholder="Détails, état, caractéristiques techniques..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`${inputClasses} min-h-[120px] py-4 resize-none`}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-5 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(34,197,94,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isEditing ? "Modifier" : "Publier"}
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  );
};

export default ProductForm;