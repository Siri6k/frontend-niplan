// pages/BusinessProfile.jsx
import { useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import BusinessSettings from "../components/BusinessSettings";
import { SettingsIcon, Zap } from "lucide-react";
import { motion } from "framer-motion";

const BusinessProfile = () => {
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await api.get("/my-business/update/");
      setBusiness(res.data);
    } catch (err) {
      toast.error("Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await api.patch("/my-business/update/", formData);
      toast.success("Boutique mise à jour !");
      setBusiness(res.data);
      localStorage.setItem("business_slug", res.data.slug);
      return res.data;
    } catch (err) {
      toast.error("Erreur de mise à jour");
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30"
        >
          <Zap size={24} className="text-green-500 fill-green-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-green-500/30 overflow-x-hidden pt-10 pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
           <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <SettingsIcon size={24} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">Configuration</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Personnalisez votre identité commerciale</p>
           </div>
        </motion.div>

        {business && (
          <BusinessSettings businessData={business} onUpdate={handleUpdate} />
        )}
      </div>

      <footer className="mt-20 text-center opacity-20">
         <p className="text-[9px] text-white font-black uppercase tracking-[0.3em]">Niplan Ecosystem RDC</p>
      </footer>
    </div>
  );
};

export default BusinessProfile;
