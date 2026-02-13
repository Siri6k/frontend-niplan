// components/ProductList.jsx
import { useState } from "react";
import {
  Edit2,
  Trash2,
  RefreshCw,
  MapPin,
  Camera,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTimeAgo } from "../hooks/useTimeAgo";
import ProductForm from "./ProductForm";

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  isEditing,
  editForm,
  onSaveEdit,
  onCancelEdit,
  businessType,
}) => {
  const timeAgo = useTimeAgo(product.updated_at);
  const isTroc = !!product.exchange_for;
  const [showFullForm, setShowFullForm] = useState(false);

  // Si en mode édition, affiche le formulaire à la place de la carte
  if (isEditing) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl overflow-hidden animate-in slide-in-from-top-2">
        {/* Header indication édition */}
        <div className="bg-blue-500 text-white px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-bold flex items-center gap-2">
            <Edit2 size={16} />
            Modification en cours
          </span>
          <button
            onClick={onCancelEdit}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Formulaire compact ou complet */}
        {!showFullForm ? (
          <div className="p-4">
            <div className="flex gap-3 mb-4">
              <img
                src={product.image}
                alt=""
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800 dark:text-slate-200">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {isTroc ? "TROC" : `${product.price} ${product.currency}`}
                </p>
                <button
                  onClick={() => setShowFullForm(true)}
                  className="text-blue-600 text-sm mt-2 flex items-center gap-1"
                >
                  Modifier tout <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Quick edit - prix uniquement */}
            <div className="flex gap-2">
              <input
                type="number"
                defaultValue={product.price}
                className="flex-1 p-2 rounded-lg border"
                placeholder="Nouveau prix"
              />
              <button
                onClick={() => setShowFullForm(true)}
                className="bg-blue-600 text-white px-4 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        ) : (
          <ProductForm
            product={product}
            businessType={businessType}
            onSubmit={onSaveEdit}
            onCancel={onCancelEdit}
            compact={true}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center max-w-full p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 overflow-hidden">
      {/* Image avec indication clic pour modifier */}
      <div className="relative group">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 rounded-xl object-cover bg-gray-100"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder-product.png";
          }}
        />
      </div>
      <div className="flex-1  ml-3">
        <h3 className="font-bold text-sm text-gray-800 dark:text-slate-200 truncate">
          {product.name}
        </h3>
        <p className="text-blue-600 text-sm font-bold">
          {product.price} {product.currency}
        </p>
        {product.location && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin size={12} className="text-red-400" />
            {product.location}
          </p>
        )}
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => onEdit(product)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(product.slug)}
          className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const ProductList = ({
  products,
  editingProduct,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  businessType,
}) => {
  if (!products.length) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-slate-500">
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={24} />
        </div>
        <p className="font-medium">Aucun produit</p>
        <p className="text-sm mt-1">Ajoutez votre premier article</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            isEditing={editingProduct?.id === product.id}
            editForm={editingProduct}
            onSaveEdit={(data, isImageChanged) =>
              onSaveEdit(product.slug, data, isImageChanged)
            }
            onCancelEdit={onCancelEdit}
            businessType={businessType}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
