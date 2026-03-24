// components/ProductList.jsx
import { useState } from "react";
import { Edit2, Trash2, MapPin, ChevronDown, Package, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimeAgo } from "../hooks/useTimeAgo";
import ProductForm from "./ProductForm";

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  isEditing,
  onSaveEdit,
  onCancelEdit,
  businessType,
}) => {
  const timeAgo = useTimeAgo(product.updated_at);
  const isTroc = !!product.exchange_for;
  const [showFullForm, setShowFullForm] = useState(false);

  if (isEditing) {
    return (
      <motion.div
        layoutId={`product-${product.id}`}
        className="glass-card bg-white/95 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-blue-300 dark:border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
            <Edit2 size={14} /> Edition de l'article
          </span>
          <button
            onClick={onCancelEdit}
            className="text-slate-400 dark:text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {!showFullForm ? (
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <img
                src={product.image}
                alt=""
                className="w-24 h-24 object-cover rounded-2xl border border-slate-200 dark:border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight truncate">
                  {product.name}
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-bold">
                  {isTroc
                    ? "VALEUR TROC"
                    : `${product.price} ${product.currency}`}
                </p>
                <button
                  onClick={() => setShowFullForm(true)}
                  className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  Modifier les détails complets <ChevronDown size={12} />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  defaultValue={product.price}
                  className="w-full p-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:border-blue-500/30 text-slate-900 dark:text-white font-bold placeholder:text-slate-500 dark:placeholder:text-slate-600"
                  placeholder="Prix"
                />
              </div>
              <button
                onClick={() => setShowFullForm(true)}
                className="bg-blue-600 text-white px-8 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all active:scale-95"
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
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={`product-${product.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] rounded-[2rem] border border-slate-200 dark:border-white/5 transition-all duration-300 shadow-sm dark:shadow-none"
    >
      {/* Image Section */}
      <div className="relative shrink-0 w-full sm:w-32 h-44 sm:h-32 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent sm:hidden" />
        <div className="absolute bottom-3 left-3 sm:hidden">
          <p className="text-white font-black text-lg">
            {product.price}{" "}
            <span className="text-[10px] text-blue-400 uppercase font-bold">
              {product.currency}
            </span>
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight truncate group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
            {product.name}
          </h3>
          <span className="hidden sm:block text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            {product.price}{" "}
            <span className="text-xs text-blue-600 dark:text-blue-500 uppercase font-black">
              {product.currency}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-1">
          {product.location && (
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
              <MapPin size={10} className="text-red-500" />
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                {product.location}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
              En ligne • {timeAgo}
            </span>
          </div>
        </div>

        <p className="mt-3 text-slate-500 dark:text-slate-500 text-xs line-clamp-1 italic">
          {product.description || "Aucune description fournie."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/5">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 sm:flex-none p-3 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-500 rounded-xl border border-green-500/10 transition-all active:scale-95 group/btn"
        >
          <Edit2
            size={18}
            className="mx-auto group-hover/btn:scale-110 transition-transform"
          />
        </button>
        <button
          onClick={() => onDelete(product.slug)}
          className="flex-1 sm:flex-none p-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-500 rounded-xl border border-red-500/10 transition-all active:scale-95 group/btn"
        >
          <Trash2
            size={18}
            className="mx-auto group-hover/btn:scale-110 transition-transform"
          />
        </button>
      </div>
    </motion.div>
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
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            isEditing={editingProduct?.id === product.id}
            onSaveEdit={(data, isImageChanged) =>
              onSaveEdit(product.slug, data, isImageChanged)
            }
            onCancelEdit={onCancelEdit}
            businessType={businessType}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
