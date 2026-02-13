// components/ShareBusiness.jsx
import { useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";

const ShareBusiness = ({ slug }) => {
  const navigate = useNavigate();
  const shopUrl = `${window.location.origin}/b/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ma boutique Niplan",
          text: "Découvrez mes produits sur ma boutique en ligne !",
          url: shopUrl,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      await navigator.clipboard.writeText(shopUrl);
      alert("Lien copié !");
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center justify-between mb-4">
      <div className="flex-1 min-w-0">
        <p
          onClick={() => navigate(`/b/${slug}`)}
          className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider cursor-pointer"
        >
          Voir ma boutique
        </p>
        <p className="text-xs text-gray-500 truncate">{shopUrl}</p>
      </div>
      <button
        onClick={handleShare}
        className="bg-blue-600 text-white p-3 rounded-xl shadow-lg active:scale-90 transition-all ml-2"
      >
        <Share2 size={20} />
      </button>
    </div>
  );
};

// ✅ Export par défaut obligatoire
export default ShareBusiness;
