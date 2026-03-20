// components/ProductForm.jsx
import { useState, useRef } from "react";
import {
  ImageIcon as ImageIcon,
  X,
  Camera,
  ChevronDown,
  ChevronUp,
  Package,
  Check,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    businessType === "TROC" || !!product?.exchange_for,
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
    if (e) e.preventDefault();
    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("is_available", formData.is_available);

    if (isTrocMode && formData.exchange_for) {
      data.append("exchange_for", formData.exchange_for);
    }
    data.append("price", formData.price);
    data.append("currency", formData.currency);

    if (isImageChanged) {
      data.append("image", formData.image || "");
    }

    onSubmit(data, isImageChanged);
  };

  const inputClasses = "w-full p-4 bg-white/5 border border-white/5 rounded-2xl outline-none focus:bg-white/[0.08] focus:border-green-500/30 text-white text-sm placeholder:text-slate-600 transition-all font-medium";

  // Version compacte (dans la carte d'édition)
  if (compact && !showFull) {
    return (
      <div className="p-6 space-y-4">
        <div className="relative group rounded-2xl overflow-hidden border border-white/5 aspect-video sm:aspect-auto sm:h-32">
          <img
            src={displayImage || product?.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera size={24} className="text-white mb-1" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Changer la photo</span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        <div className="space-y-3">
           <input
             type="text"
             placeholder="Nom du produit"
             value={formData.name}
             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
             className={inputClasses}
           />

           <div className="flex gap-2">
             <input
               type="number"
               placeholder="Prix"
               value={formData.price}
               onChange={(e) => setFormData({ ...formData, price: e.target.value })}
               className={`${inputClasses} flex-1`}
             />
             <select
               value={formData.currency}
               onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
               className="w-24 p-4 bg-white/5 border border-white/5 rounded-2xl outline-none text-white text-xs font-bold uppercase tracking-widest"
             >
               <option value="USD">USD</option>
               <option value="CDF">CDF</option>
             </select>
           </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFull(true)}
          className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 flex items-center justify-center gap-1 py-2 transition-colors"
        >
          Options avancées <ChevronDown size={14} />
        </button>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl border border-white/5 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative background for form */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] -z-10" />

      <div className="flex items-center gap-4 mb-8">
         <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
            <Package size={24} />
         </div>
         <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none">
              {isEditing ? "Modifier l'article" : "Nouvel article"}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Remplissez les détails de votre produit
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image Upload */}
        <div className="md:col-span-4 space-y-4">
          <div className="relative group aspect-square rounded-[2rem] overflow-hidden border-2 border-dashed border-white/10 hover:border-green-500/30 transition-all bg-white/[0.02]">
             {displayImage ? (
                <>
                  <img src={displayImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4">
                     <button
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="bg-white text-slate-950 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                     >
                       <Camera size={14} /> Changer
                     </button>
                     <button
                       type="button"
                       onClick={() => { setDisplayImage(null); setIsImageChanged(true); }}
                       className="text-red-400 font-black text-[10px] uppercase tracking-widest hover:text-red-300"
                     >
                       Supprimer
                     </button>
                  </div>
                </>
             ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-4 p-6"
                >
                   <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-slate-500 group-hover:text-green-500 transition-colors">
                      <ImageIcon size={32} />
                   </div>
                   <div className="text-center">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ajouter une photo</span>
                      <span className="text-[9px] text-slate-600 font-bold uppercase">Format JPG, PNG (Max 5MB)</span>
                   </div>
                </button>
             )}
             <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
          
          <div className="space-y-3">
             <label className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-5 h-5 rounded-lg bg-white/10 border-white/10 text-green-500 focus:ring-green-500/50 outline-none"
                />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">En stock / Disponible</span>
             </label>
             
             <label className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all">
                <input
                  type="checkbox"
                  checked={isTrocMode}
                  onChange={(e) => setIsTrocMode(e.target.checked)}
                  className="w-5 h-5 rounded-lg bg-white/10 border-white/10 text-blue-500 focus:ring-blue-500/50 outline-none"
                />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Accepter le Troc</span>
             </label>
          </div>
        </div>

        {/* Right Column: Text Inputs */}
        <div className="md:col-span-8 space-y-6">
           <div className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Nom de l'article</label>
                 <input
                   type="text"
                   placeholder="Ex: iPhone 15 Pro Max"
                   required
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   className={inputClasses}
                 />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Prix de vente</label>
                    <div className="flex gap-2">
                       <input
                         placeholder="0.00"
                         type="number"
                         value={formData.price}
                         onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                         className={`${inputClasses} flex-1`}
                       />
                       <select
                         value={formData.currency}
                         onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                         className="w-24 p-4 bg-white/5 border border-white/5 rounded-2xl outline-none text-white text-xs font-black uppercase tracking-widest focus:border-green-500/30"
                       >
                         <option value="CDF">CDF</option>
                         <option value="USD">USD</option>
                       </select>
                    </div>
                 </div>
                 
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Localisation</label>
                    <input
                      type="text"
                      placeholder="Ex: Kinshasa, Gombe"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={inputClasses}
                    />
                 </div>
              </div>

              {isTrocMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5"
                >
                   <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-2">Échange souhaité против</label>
                   <input
                     type="text"
                     placeholder="Ex: Un autre téléphone ou PC"
                     value={formData.exchange_for}
                     onChange={(e) => setFormData({ ...formData, exchange_for: e.target.value })}
                     className={`${inputClasses} border-blue-500/20 focus:border-blue-500/50`}
                   />
                </motion.div>
              )}

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Description</label>
                 <textarea
                   placeholder="Détails, état, caractéristiques techniques..."
                   value={formData.description}
                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                   className={`${inputClasses} min-h-[120px] py-4 resize-none`}
                 />
              </div>
           </div>

           <div className="flex gap-4 pt-6">
             <button
               type="button"
               onClick={onCancel}
               className="flex-1 py-5 rounded-2xl border border-white/5 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95"
             >
               Annuler
             </button>
             <button
               type="submit"
               className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(34,197,94,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
             >
               {isEditing ? "Mettre à jour l'article" : "Publier l'annonce"}
             </button>
           </div>
        </div>
      </div>
    </motion.form>
  );
};

export default ProductForm;
