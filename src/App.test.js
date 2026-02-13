const ProductList = ({ products, onEdit, onDelete }) => {
  if (!products.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Aucun produit encore.</p>
        <p className="text-sm">Ajoutez votre premier produit !</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover bg-gray-100"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-gray-800 dark:text-slate-200 truncate">
              {product.name}
            </h3>
            <p className="text-blue-600 font-bold">
              {product.price} {product.currency}
            </p>
            <p className="text-xs text-gray-400 truncate">{product.location}</p>
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
      ))}
    </div>
  );
};

export default ProductList;
