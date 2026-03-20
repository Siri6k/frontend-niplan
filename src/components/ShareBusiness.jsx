// components/ShareBusiness.jsx
import { useNavigate } from "react-router-dom";
import { Share2, ExternalLink, Copy } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ShareBusiness = ({ slug }) => {
  const navigate = useNavigate();
  const shopUrl = `${window.location.host}/b/${slug}`;
  const fullUrl = `${window.location.origin}/b/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ma boutique Niplan",
          text: "Découvrez mes produits sur ma boutique en ligne !",
          url: fullUrl,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-[2rem] p-6 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 blur-[40px] -z-10" />
      
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 mb-1">
           <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Votre Liens Public</p>
           <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="flex items-center gap-3">
           <p className="text-sm font-black text-white truncate opacity-80">{shopUrl}</p>
           <button 
             onClick={() => navigate(`/b/${slug}`)}
             className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all"
             title="Ouvrir la boutique"
           >
             <ExternalLink size={14} />
           </button>
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={handleShare}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all group"
        >
          <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
          Partager
        </button>
      </div>
    </motion.div>
  );
};

export default ShareBusiness;
