import React from "react";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, Star, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

const demoBusinesses = [
  {
    id: 1,
    name: "Elite Tech Store",
    city: "Kinshasa",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",

    visits: "1.2k+",
    tag: "Informatique",
  },
  {
    id: 2,
    name: "Saphir Mode",
    city: "Lubumbashi",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",

    visits: "850+",
    tag: "Prêt-à-porter",
  },
  {
    id: 3,
    name: "Global Food Market",
    city: "Goma",
    image:
      "https://www.61degres.com/wp-content/uploads/2017/06/saucisses-finies2-1000x667.jpg",
    visits: "2.1k+",
    tag: "Alimentation",
  },
  {
    id: 4,
    name: "Zenith Store",
    city: "Kolwezi",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    visits: "1.5k+",
    tag: "Montres connectée",
  },
];

const BusinessCard = ({ business }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    className="flex-shrink-0 w-[280px] group relative bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 shadow-2xl"
  >
    {/* Product Image */}
    <div className="relative h-48 w-full overflow-hidden">
      <img
        src={business.image}
        alt={business.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

      {/* Badge Floating */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1">
        <Star size={12} className="text-yellow-400 fill-yellow-400" />
        <span className="text-[10px] text-white font-bold">{business.tag}</span>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 relative">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-black text-white truncate">
          {business.name}
        </h3>
        <BadgeCheck size={18} className="text-blue-400 shrink-0" />
      </div>

      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
        <MapPin size={12} className="text-red-400" />
        {business.city}, RDC
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
            Visites
          </span>
          <span className="text-xl font-black text-green-400">
            {business.visits}
          </span>
        </div>

        <div className="p-3 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
          <MessageCircle size={20} />
        </div>
      </div>
    </div>

    {/* Animated Shine Effect */}
    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000" />
  </motion.div>
);

const BusinessShowcase = () => {
  return (
    <section className="py-24 bg-bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xs font-black text-accent uppercase tracking-[0.3em] mb-3">
              La Preuve en Image
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-text-primary leading-tight">
              Ils ont choisi le <br />
              <span className="text-gradient-green italic">Prestige</span>.
            </h3>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary max-w-md"
          >
            Rejoignez les centaines d'entrepreneurs qui ont transformé leur
            simple lien WhatsApp en une boutique de renommée nationale.
          </motion.p>
        </div>
      </div>

      {/* Marquee Horizontal Scroll */}
      <div className="w-full h-[450px]">
        <div className="flex gap-4 sm:gap-8 px-4 sm:overflow-visible overflow-x-auto no-scrollbar py-10 pb-20 sm:justify-start lg:justify-center">
          {demoBusinesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-[-40px]">
        <Link
          to="/login"
          className="flex items-center gap-2 group px-8 py-4 bg-bg-secondary dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-text-primary font-bold shadow-xl hover:scale-105 transition-all duration-300"
        >
          <span>Voir plus d'exemples</span>
          <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

const ArrowIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

export default BusinessShowcase;
