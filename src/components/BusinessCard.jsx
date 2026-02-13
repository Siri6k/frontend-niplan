// components/BusinessCard.jsx
import { MapPin, Phone, ArrowUpRight } from "lucide-react";

const BusinessCard = ({ business }) => {
  const isTroc = business.business_type === "TROC";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 shadow-lg">
      {/* Pattern background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <img
            src={business.logo}
            alt=""
            className="w-14 h-14 rounded-xl object-cover border-2 border-white/30"
          />
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isTroc
                ? "bg-amber-400 text-amber-900"
                : "bg-green-400 text-green-900"
            }`}
          >
            {isTroc ? "🔄 TROC" : "💰 VENTE"}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-1">{business.name}</h2>
        <p className="text-blue-100 text-sm mb-4 line-clamp-2">
          {business.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-blue-100">
          <span className="flex items-center gap-1">
            <Phone size={14} />
            {business.owner_phone}
          </span>
        </div>

        <a
          href={`/b/${business.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold bg-white text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
        >
          Voir ma boutique
          <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
};

export default BusinessCard;
