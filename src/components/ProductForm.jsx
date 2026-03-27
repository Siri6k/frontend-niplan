import React, { useState, useEffect, useRef } from "react";
import {
  ImageIcon,
  X,
  Camera,
  ChevronDown,
  ChevronUp,
  Package,
  Check,
  Zap,
  PlusCircle,
  Car,
  Home,
  Smartphone,
  Shirt,
  Wrench,
  MoreHorizontal,
  Tag,
  Sparkles,
  Briefcase,
  ShoppingBag,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import toast from "react-hot-toast";
import { CATEGORY_DATA } from "../utils/Constants";
import { UI } from "../utils/uiTheme";

// CONFIGURATION DES CHAMPS PAR CATÉGORIE
// Les données (fields, desc) sont dans constants.js
// Les icônes et couleurs restent ici car ce sont des composants/classes CSS
const CATEGORY_UI = {
  Général: {
    icon: Tag,
    color: "emerald",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    border: "border-emerald-500/20 dark:border-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  Électronique: {
    icon: Smartphone,
    color: "violet",
    bg: "bg-violet-500/10 dark:bg-violet-500/20",
    border: "border-violet-500/20 dark:border-violet-500/30",
    text: "text-violet-700 dark:text-violet-400",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  Mode: {
    icon: ShoppingBag,
    color: "pink",
    bg: "bg-pink-500/10 dark:bg-pink-500/20",
    border: "border-pink-500/20 dark:border-pink-500/30",
    text: "text-pink-700 dark:text-pink-400",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  Immobilier: {
    icon: Home,
    color: "orange",
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    border: "border-orange-500/20 dark:border-orange-500/30",
    text: "text-orange-700 dark:text-orange-400",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  Services: {
    icon: Briefcase,
    color: "cyan",
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    border: "border-cyan-500/20 dark:border-cyan-500/30",
    text: "text-cyan-700 dark:text-cyan-400",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  Véhicules: {
    icon: Car,
    color: "blue",
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    border: "border-blue-500/20 dark:border-blue-500/30",
    text: "text-blue-700 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  Autre: {
    icon: Sparkles,
    color: "slate",
    bg: "bg-slate-500/10 dark:bg-slate-500/20",
    border: "border-slate-500/20 dark:border-slate-500/30",
    text: "text-slate-700 dark:text-slate-400",
    iconColor: "text-slate-600 dark:text-slate-400",
  },
};

// Fusion des données et de l'UI
const CATEGORY_CONFIG = Object.keys(CATEGORY_DATA).reduce((acc, key) => {
  acc[key] = {
    ...CATEGORY_DATA[key],
    ...(CATEGORY_UI[key] || CATEGORY_UI["Général"]),
  };
  return acc;
}, {});

const ProductForm = ({
  product,
  businessType,
  onSubmit,
  onCancel,
  compact = false,
}) => {
  const [formData, setFormData] = useState({
    title: product?.title || product?.name || "",
    name: product?.name || "",
    price: product?.price || "",
    currency: product?.currency || "USD",
    description: product?.description || "",
    category: product?.category || "Général",
    commune: product?.commune || "",
    quartier: product?.quartier || "",
    location: product?.location || "",
    exchange_for: product?.exchange_for || "",
    is_for_barter: product?.is_for_barter || false,
    barter_target: product?.barter_target || "",
    is_available: product?.is_available ?? true,
    image: null,
    images: [],
    specs: product?.specs || {},
  });
  // État pour les images existantes (format du backend)
  const [existingImages, setExistingImages] = useState([]);
  // ID de l'image principale existante
  const [mainImageId, setMainImageId] = useState(null);
  // IDs des images à supprimer
  const [imagesToDelete, setImagesToDelete] = useState([]);
  // Nouvelle image principale (index dans formData.images ou id dans existingImages)
  const [newMainImage, setNewMainImage] = useState(null);

  const [displayImage, setDisplayImage] = useState(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [showFull, setShowFull] = useState(!compact);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const fileInputRef = useRef(null);
  const categoryRef = useRef(null);

  const [isTrocMode, setIsTrocMode] = useState(
    !!product?.is_for_barter ||
      !!product?.barter_target ||
      businessType === "TROC" ||
      !!product?.exchange_for,
  );

  const isEditing = !!product;
  useEffect(() => {
    const fields = CATEGORY_DATA[formData.category]?.fields || [];

    setFormData((prev) => {
      const newSpecs = {};

      fields.forEach((field) => {
        const backendValue = product?.specs?.[field.name];

        if (backendValue !== undefined && backendValue !== null) {
          newSpecs[field.name] = backendValue;
        } else if (field.default !== undefined) {
          newSpecs[field.name] = field.default;
        } else if (field.value !== undefined) {
          newSpecs[field.name] = field.value;
        } else {
          newSpecs[field.name] = "";
        }
      });

      return {
        ...prev,
        specs: newSpecs,
      };
    });
  }, [formData.category, product]);

  useEffect(() => {
    if (isEditing && product) {
      // Transformer le format backend en format interne
      const formattedImages =
        product.images?.map((img) => ({
          id: img.id,
          url: img.image,
          is_main: img.is_main,
        })) || [];

      setExistingImages(formattedImages);

      // Trouver l'image principale
      const mainImg = formattedImages.find((img) => img.is_main);
      if (mainImg) {
        setMainImageId(mainImg.id);
        setDisplayImage(mainImg.url);
      } else if (formattedImages.length > 0) {
        setDisplayImage(formattedImages[0].url);
      } else if (product.main_image) {
        setDisplayImage(product.main_image);
      }
    }
  }, [isEditing, product]);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      // Nettoyage de TOUTES les Object URLs au démontage
      formData.images.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalImages = existingImages.length + formData.images.length;
    const remainingSlots = 5 - totalImages;

    // Validation et transformation des nouveaux fichiers
    const validFiles = files
      .slice(0, remainingSlots)
      .filter((file) => {
        // Validation Type
        if (!file.type.startsWith("image/")) {
          toast.error("Veuillez sélectionner une image valide (JPG, PNG)");
          return false;
        }
        // Validation Taille (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("L'image est trop lourde (max 5 Mo)");
          return false;
        }
        return true;
      })
      .map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

    if (files.length > remainingSlots) {
      toast.error("Maximum 5 photos autorisées");
    }

    if (validFiles.length > 0) {
      const newImages = [...formData.images, ...validFiles];
      setFormData({ ...formData, images: newImages });

      // Si c'est la toute première image (pas d'existantes ni de nouvelles affichées)
      if (!displayImage && validFiles.length > 0) {
        setDisplayImage(validFiles[0].preview);
        setNewMainImage({ type: "new", index: formData.images.length });
      }

      setIsImageChanged(true);
    }
    // Reset l'input pour permettre de re-sélectionner le même fichier si besoin
    e.target.value = "";
  };

  // Supprimer une image existante
  const removeExistingImage = (imageId) => {
    const imageToRemove = existingImages.find((img) => img.id === imageId);
    if (!imageToRemove) return;

    setImagesToDelete([...imagesToDelete, imageId]);

    const updatedExisting = existingImages.filter((img) => img.id !== imageId);
    setExistingImages(updatedExisting);

    // Si on supprime l'image principale, définir une nouvelle principale
    if (mainImageId === imageId) {
      if (updatedExisting.length > 0) {
        setMainImageId(updatedExisting[0].id);
        setDisplayImage(updatedExisting[0].url);
      } else if (formData.images.length > 0) {
        const url = URL.createObjectURL(formData.images[0]);
        setDisplayImage(url);
        setNewMainImage({ type: "new", index: 0 });
        setMainImageId(null);
      } else {
        setDisplayImage(null);
        setMainImageId(null);
        setNewMainImage(null);
      }
    }

    setIsImageChanged(true);
  };

  // Supprimer une nouvelle image
  const removeNewImage = (index) => {
    const fileToRemove = formData.images[index];
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });

    // Recalculer l'index de la nouvelle image principale si nécessaire
    if (newMainImage?.type === "new" && newMainImage?.index === index) {
      if (existingImages.length > 0) {
        setMainImageId(existingImages[0].id);
        setDisplayImage(existingImages[0].url);
        setNewMainImage(null);
      } else if (newImages.length > 0) {
        setNewMainImage({ type: "new", index: 0 });
        setDisplayImage(newImages[0].preview);
      } else {
        setDisplayImage(null);
        setNewMainImage(null);
      }
    } else if (newMainImage?.type === "new" && newMainImage?.index > index) {
      // Ajuster l'index si on supprime une image avant la principale
      setNewMainImage({ ...newMainImage, index: newMainImage.index - 1 });
    }

    setIsImageChanged(true);
  };

  // Définir une image comme principale
  const setAsMainImage = (type, identifier, url) => {
    setDisplayImage(url);
    if (type === "existing") {
      setMainImageId(identifier);
      setNewMainImage(null);
    } else {
      setNewMainImage({ type: "new", index: identifier });
      setMainImageId(null);
    }
    setIsImageChanged(true);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const data = new FormData();

    data.append("title", formData.title || formData.name);
    data.append("name", formData.name || formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("commune", formData.commune);
    data.append("quartier", formData.quartier);
    data.append(
      "location",
      formData.location || `${formData.commune}, ${formData.quartier}`,
    );
    data.append("is_available", formData.is_available);

    if (isTrocMode && formData.exchange_for) {
      data.append("exchange_for", formData.exchange_for);
    }
    if (isTrocMode && formData.barter_target) {
      data.append("barter_target", formData.barter_target);
    }

    const finalPrice = formData.price || "1";
    data.append("price", finalPrice);
    data.append("currency", formData.currency);
    data.append("specs", JSON.stringify(formData.specs));

    // IDs des images à supprimer
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach((id) => {
        data.append("images_to_delete", id);
      });
    }

    // IDs des images existantes à garder (pour réordonner si besoin)
    const remainingIds = existingImages
      .filter((img) => !imagesToDelete.includes(img.id))
      .map((img) => img.id);
    if (remainingIds.length > 0) {
      data.append("existing_image_ids", JSON.stringify(remainingIds));
    }

    // Nouvelle image principale
    if (newMainImage) {
      data.append("main_image_type", "new");
      data.append("main_image_index", newMainImage.index);
    } else if (mainImageId) {
      data.append("main_image_type", "existing");
      data.append("main_image_id", mainImageId);
    }

    // Nouvelles images (files)
    if (formData.images.length > 0) {
      formData.images.forEach((img) => {
        data.append("images", img);
      });
    }

    onSubmit(data, isImageChanged);
  };
  // Classes communes pour les inputs
  const inputClasses =
    "w-full p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:bg-slate-50 dark:focus:bg-white/[0.08] focus:border-green-500/30 text-slate-900 dark:text-white text-sm placeholder:text-slate-500 dark:placeholder:text-slate-600 transition-all font-medium";
  // Afficher le prix uniquement pour les catégories qui le permettent
  const currentCategory =
    CATEGORY_CONFIG[formData.category] || CATEGORY_CONFIG["Général"];
  const CurrentIcon = currentCategory.icon;

  // Calculer le nombre total d'images
  const totalImages = existingImages.length + formData.images.length;

  // Version compacte
  if (compact && !showFull) {
    return (
      <div className="p-6 space-y-4">
        <div className="relative group rounded-2xl overflow-hidden border border-slate-300 dark:border-white/5 aspect-video sm:aspect-auto sm:h-32">
          <img
            src={displayImage || "/placeholder.png"}
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
              Changer
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Miniatures compactes */}
        {totalImages > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {existingImages.map((img) => (
              <div
                key={`existing-${img.id}`}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                  displayImage === img.url
                    ? "border-green-500"
                    : "border-slate-200 dark:border-white/10"
                }`}
                onClick={() => setAsMainImage("existing", img.id, img.url)}
              >
                <img src={img.url} className="w-full h-full object-cover" />
                {img.is_main && (
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[8px] font-black text-center py-0.5">
                    MAIN
                  </div>
                )}
              </div>
            ))}
            {formData.images.map((file, idx) => {
              return (
                <div
                  key={`new-${idx}`}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                    newMainImage?.type === "new" && newMainImage?.index === idx
                      ? "border-green-500"
                      : "border-slate-200 dark:border-white/10"
                  }`}
                  onClick={() => setAsMainImage("new", idx, file.preview)}
                >
                  <img
                    src={file.preview}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[8px] font-black text-center py-0.5">
                    NEW
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <input
          type="text"
          placeholder="Titre de l'article"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={inputClasses}
        />

        {currentCategory.showPrice !== false && (
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
              className="w-24 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl outline-none text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest"
            >
              {/* On force le fond sombre et le texte clair sur chaque option */}
              <option
                value="USD"
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                USD
              </option>
              <option
                value="CDF"
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                CDF
              </option>
            </select>
          </div>
        )}

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
            {totalImages}/5 photos • {existingImages.length} en ligne •{" "}
            {formData.images.length} nouvelles
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Images */}
        <div className="md:col-span-4 space-y-4">
          {/* Image principale */}
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
                <p className="text-[10px] font-black uppercase tracking-widest mt-2">
                  Photo principale
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
              >
                Ajouter des photos
              </button>
            </div>
            {/* Badge Main */}
            {(mainImageId || newMainImage) && (
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-black uppercase shadow-lg">
                ★ Image principale
              </div>
            )}
          </div>

          {/* Grille de miniatures */}
          <div className="grid grid-cols-4 gap-2">
            {/* Images existantes */}
            {existingImages.map((img) => (
              <div
                key={img.id}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 group/thumb cursor-pointer ${
                  mainImageId === img.id
                    ? "border-green-500 shadow-lg shadow-green-500/20"
                    : "border-slate-200 dark:border-white/10"
                }`}
                onClick={() => setAsMainImage("existing", img.id, img.url)}
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
                {img.is_main && (
                  <div className="absolute bottom-1 left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExistingImage(img.id);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Nouvelles images */}
            {formData.images.map((file, idx) => {
              const isMain =
                newMainImage?.type === "new" && newMainImage?.index === idx;
              return (
                <div
                  key={`new-${idx}`}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 group/thumb cursor-pointer ${
                    isMain
                      ? "border-green-500 shadow-lg shadow-green-500/20"
                      : "border-slate-200 dark:border-white/10"
                  }`}
                  onClick={() => setAsMainImage("new", idx, file.preview)}
                >
                  <img
                    src={file.preview}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-500 text-white rounded text-[8px] font-black">
                    NEW
                  </div>
                  {isMain && (
                    <div className="absolute bottom-1 left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNewImage(idx);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}

            {/* Bouton ajout */}
            {totalImages < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center text-slate-400 hover:border-green-500/50 hover:text-green-600 dark:hover:text-green-500 transition-all bg-slate-50 dark:bg-white/[0.01]"
              >
                <PlusCircle size={24} />
                <span className="text-[9px] font-black uppercase mt-1">
                  {5 - totalImages}
                </span>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between px-2 text-[10px]">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {existingImages.length} en ligne • {formData.images.length}{" "}
              nouvelles
            </span>
            {imagesToDelete.length > 0 && (
              <span className="text-red-500 font-bold">
                {imagesToDelete.length} à supprimer
              </span>
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

          {/* Checkbox disponibilité */}
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
          </div>
        </div>

        {/* Right Column: Text Inputs */}
        <div className="md:col-span-8 space-y-6">
          {/* DROPDOWN CATÉGORIE COOL */}
          <div className="space-y-1.5 relative z-50" ref={categoryRef}>
            <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
              Catégorie
            </label>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`w-full p-4 bg-white dark:bg-white/5 border-2 rounded-2xl outline-none transition-all duration-300 flex items-center justify-between group ${
                isCategoryOpen
                  ? "border-green-500/50 ring-4 ring-green-500/10 dark:ring-green-500/20"
                  : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${currentCategory.bg} ${currentCategory.border}`}
                >
                  <CurrentIcon
                    size={24}
                    className={`transition-colors ${currentCategory.iconColor}`}
                  />
                </div>
                <div className="text-left">
                  <span className="block font-black text-slate-900 dark:text-white text-base tracking-tight">
                    {formData.category}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {currentCategory.desc}
                  </span>
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center transition-all duration-300 ${isCategoryOpen ? "rotate-180 bg-green-500/10 dark:bg-green-500/20" : ""}`}
              >
                <ChevronDown
                  size={20}
                  className={`transition-colors ${isCategoryOpen ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                />
              </div>
            </button>

            {/* Dropdown Menu - Width Cool */}
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute left-0 right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                  style={{
                    width: "100%",
                    minWidth: "320px",
                    maxWidth: "100%",
                  }}
                >
                  {/* Header */}
                  <div className="px-5 py-4 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Sélectionnez une catégorie
                    </p>
                  </div>

                  {/* Categories Grid */}
                  <div className="p-3 grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto">
                    {Object.entries(CATEGORY_CONFIG).map(
                      ([name, config], index) => {
                        const Icon = config.icon;
                        const isSelected = formData.category === name;

                        return (
                          <motion.button
                            key={name}
                            type="button"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              setFormData({ ...formData, category: name });
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                              isSelected
                                ? `${config.bg} ${config.border} border-2`
                                : "hover:bg-slate-100 dark:hover:bg-white/5 border-2 border-transparent"
                            }`}
                          >
                            {/* Background glow effect */}
                            <div
                              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${config.bg}`}
                            />

                            {/* Icon */}
                            <div
                              className={`relative w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-200 ${
                                isSelected
                                  ? `${config.bg} ${config.border} scale-110`
                                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 group-hover:scale-105"
                              }`}
                            >
                              <Icon
                                size={22}
                                className={`transition-colors ${isSelected ? config.iconColor : "text-slate-500 dark:text-slate-400 group-hover:" + config.iconColor}`}
                              />
                            </div>

                            {/* Text */}
                            <div className="relative flex-1 text-left">
                              <span
                                className={`block font-black text-base tracking-tight transition-colors ${
                                  isSelected
                                    ? config.text
                                    : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                }`}
                              >
                                {name}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium block mt-0.5">
                                {config.desc}
                              </span>
                            </div>

                            {/* Checkmark */}
                            <div
                              className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                                isSelected
                                  ? "bg-green-500 scale-100"
                                  : "bg-slate-200 dark:bg-white/10 scale-0 group-hover:scale-100"
                              }`}
                            >
                              <Check
                                size={14}
                                className={`transition-colors ${isSelected ? "text-white" : "text-slate-500 dark:text-slate-400"}`}
                              />
                            </div>
                          </motion.button>
                        );
                      },
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                      {Object.keys(CATEGORY_CONFIG).length} catégories
                      disponibles
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                        Actif
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentCategory.showPrice !== false && (
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
                      className="w-24 p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none dark:text-slate-400 text-xs font-black uppercase tracking-widest focus:border-green-500/30"
                    >
                      {/* On force le fond sombre et le texte clair sur chaque option */}
                      <option
                        value="USD"
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        USD
                      </option>
                      <option
                        value="CDF"
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        CDF
                      </option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Ville
                </label>
                <input
                  type="text"
                  placeholder="Ex: Kinshasa, Goma..."
                  value={formData.commune}
                  onChange={(e) =>
                    setFormData({ ...formData, commune: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Commune / Quartier
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
            {currentCategory.allowTroc !== false && (
              <div className="space-y-1.5">
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
            )}
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
                  placeholder="Ex: Un autre téléphone ou PC, vehicule"
                  value={formData.barter_target}
                  onChange={(e) =>
                    setFormData({ ...formData, barter_target: e.target.value })
                  }
                  className={`${inputClasses} border-blue-500/20 focus:border-blue-500/50`}
                />
              </motion.div>
            )}

            {/* Dynamic Category Fields */}
            <AnimatePresence mode="wait">
              {CATEGORY_CONFIG[formData.category]?.fields && (
                <motion.div
                  key={formData.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-3xl border ${currentCategory.bg} ${currentCategory.border}`}
                >
                  <div className="sm:col-span-2">
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-2 ml-2 ${currentCategory.text}`}
                    >
                      Détails spécifiques : {formData.category}
                    </p>
                  </div>
                  {CATEGORY_CONFIG[formData.category].fields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-2">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={formData.specs?.[field.name] ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specs: {
                                ...formData.specs,
                                [field.name]: e.target.value,
                              },
                            })
                          }
                          className={inputClasses}
                        >
                          <option
                            value=""
                            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            Sélectionner...
                          </option>
                          {field.options.map((opt) => (
                            <option
                              key={opt}
                              value={opt}
                              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            >
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className={UI.input}
                          value={formData.specs[field.name] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specs: {
                                ...formData.specs,
                                [field.name]: e.target.value,
                              },
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
