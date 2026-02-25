// pages/BusinessProfile.jsx
import { useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import BusinessSettings from "../components/BusinessSettings";
import { SettingsIcon } from "lucide-react";

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

  // On reçoit le formData de l'enfant et on fait l'unique PATCH ici
  const handleUpdate = async (formData) => {
    try {
      const res = await api.patch("/my-business/update/", formData);
      toast.success("Boutique mise à jour !");

      // On met à jour le state local avec la réponse du serveur (évite un GET inutile)
      setBusiness(res.data);
      localStorage.setItem("business_slug", res.data.slug);

      return res.data; // On retourne les données pour que l'enfant puisse rediriger
    } catch (err) {
      toast.error("Erreur de mise à jour");
      throw err;
    }
  };

  if (isLoading) return <div className="animate-spin ..."></div>;

  return (
    <div className="p-1">
      <h1 className="text-center text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        Modifier mon Profil{" "}
        <SettingsIcon
          size={20}
          className="inline-block text-green-500 ml-2 mb-2"
        />
      </h1>
      {business && (
        <BusinessSettings businessData={business} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default BusinessProfile;
