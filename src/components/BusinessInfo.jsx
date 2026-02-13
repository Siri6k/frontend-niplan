// components/BusinessInfo.jsx
import { useState } from "react";
import {
  Store,
  Phone,
  RefreshCw,
  Package,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const BusinessInfo = ({ business, onEdit, product_count}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTroc = business.business_type === "TROC";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 overflow-hidden">
      {/* Header avec logo et nom */}
      <div className="p-4 flex items-center gap-4">
        <div className="relative">
          <img
            src={business.logo || "/default-shop.png"}
            alt={business.name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 dark:border-slate-700"
            onError={(e) => {
              e.target.src = "/default-shop.png";
            }}
          />
          {/* Badge type business */}
          <span
            className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
              isTroc ? "bg-amber-500" : "bg-blue-500"
            }`}
          >
            {isTroc ? "TROC" : "VENTE"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white truncate">
            {business.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1">
            <Phone size={12} />
            {business.owner_phone}
          </p>
        </div>

        <div className="flex gap-1">
          <Link
            to={`/b/${business.slug}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Voir la boutique"
          >
            <ExternalLink size={18} />
          </Link>
          <button
            onClick={() => onEdit?.(business)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Modifier"
          >
            <Edit2 size={18} />
          </button>
        </div>
      </div>

      {/* Description (collapsible) */}
      {business.description && (
        <div className="px-4 pb-3">
          <p
            className={`text-sm text-gray-600 dark:text-slate-400 ${isExpanded ? "" : "line-clamp-2"}`}
          >
            {business.description}
          </p>
          {business.description.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 mt-1 font-medium"
            >
              {isExpanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-3 border-t border-gray-100 dark:border-slate-800">
        <div className="p-3 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {business.product_count || 0}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Produits
          </p>
        </div>
        <div className="p-3 text-center border-l border-gray-100 dark:border-slate-800">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {isTroc ? "TROC" : "VENTE"}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Type
          </p>
        </div>
        <div className="p-3 text-center border-l border-gray-100 dark:border-slate-800">
          <p className="text-lg font-bold text-green-600">Actif</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Statut
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
