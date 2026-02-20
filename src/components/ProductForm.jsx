// components/ProductForm.jsx
import { useState, useRef } from "react";
import {
  RefreshCw,
  DollarSign,
  Image as ImageIcon,
  X,
  Camera,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const ProductForm = ({
  product,
  businessType,
  onSubmit,
  onCancel,
  compact = false,
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    currency: product?.currency || "USD",
    description: product?.description || "",
    location: product?.location || "",
    exchange_for: product?.exchange_for || "",
    is_available: product?.is_available ?? true,
    image: null,
  });

  const [displayImage, setDisplayImage] = useState(product?.image || null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [showFull, setShowFull] = useState(!compact);
  const fileInputRef = useRef(null);

  const [isTrocMode, setIsTrocMode] = useState(
    businessType === "TROC" || product?.exchange_for,
  );
  const isEditing = !!product;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image trop grande (max 5MB)");
        return;
      }
      setFormData({ ...formData, image: file });
      setDisplayImage(URL.createObjectURL(file));
      setIsImageChanged(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("is_available", formData.is_available);

    if (isTrocMode && formData.exchange_for) {
      data.append("exchange_for", formData.exchange_for);
    } else {
      data.append("price", formData.price);
      data.append("currency", formData.currency);
    }

    if (isImageChanged) {
      data.append("image", formData.image || "");
    }

    onSubmit(data, isImageChanged);
  };

  // Version compacte (quick edit)
  if (compact && !showFull) {
    return (
      <div className="p-4 space-y-3">
        {/* Image avec indication modifiable */}
        <div className="relative group rounded-xl overflow-hidden">
          <img
            src={displayImage || product.image}
            alt=""
            className="w-full h-32 object-cover"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="text-white flex items-center gap-2">
              <Camera size={20} />
              <span className="font-medium">Changer la photo</span>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Champs rapides */}
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 font-bold"
        />

        <div className="flex gap-2">
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="flex-1 p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700"
          />
          <select
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="w-20 p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="USD">USD</option>
            <option value="CDF">CDF</option>
          </select>
        </div>

        {/* Toggle full form */}
        <button
          type="button"
          onClick={() => setShowFull(true)}
          className="w-full text-blue-600 text-sm flex items-center justify-center gap-1 py-2"
        >
          Plus d'options <ChevronDown size={16} />
        </button>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg bg-green-600 text-white font-bold"
          >
            Enregistrer
          </button>
        </div>
      </div>
    );
  }

  // Version complète
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* Image modifiable avec indication claire */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Camera
            size={16}
            color="green"
            onClick={() => fileInputRef.current?.click()}
          />
          Photo du produit
          {isImageChanged && <span className="text-green-600">(modifiée)</span>}
        </label>

        {displayImage ? (
          <div className="relative group rounded-xl overflow-hidden">
            <img
              src={displayImage}
              alt=""
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium flex items-center gap-2"
              >
                <Camera size={18} />
                Changer
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisplayImage(null);
                  setIsImageChanged(true);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-full font-medium"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <label
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 dark:bg-slate-800 border-2 border-dashed rounded-xl cursor-pointer"
          >
            <ImageIcon size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              Cliquez pour ajouter une photo
            </span>
          </label>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Reste du formulaire... */}
      <input
        type="text"
        placeholder="Nom du produit"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full p-3 rounded-xl border dark:bg-slate-800"
      />
      <div className="flex gap-2">
        <input
          placeholder="Prix"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="flex-1 p-3 rounded-xl border dark:bg-slate-800"
        />
        <select
          value={formData.currency}
          onChange={(e) =>
            setFormData({ ...formData, currency: e.target.value })
          }
          className="w-24 p-3 rounded-xl border dark:bg-slate-800"
        >
          <option value="CDF">CDF</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div className="flex gap-2 items-center justify-evenly">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={(e) =>
              setFormData({ ...formData, is_available: e.target.checked })
            }
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          Disponible
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isTrocMode}
            onChange={(e) => {
              setIsTrocMode(e.target.checked);
            }}
          />
          Échange (Troc accepté)
        </label>
      </div>
      {isTrocMode && (
        <input
          type="text"
          placeholder="Échange contre"
          value={formData.exchange_for}
          onChange={(e) =>
            setFormData({ ...formData, exchange_for: e.target.value })
          }
          className="w-full p-3 rounded-xl border dark:bg-slate-800"
        />
      )}
      <textarea
        placeholder="Description du produit (état, caractéristiques, etc.)"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full p-3 rounded-xl border dark:bg-slate-800"
      />
      <input
        type="text"
        placeholder="Lieu (ex: Kinshasa, RDC)"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full p-3 rounded-xl border dark:bg-slate-800"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
