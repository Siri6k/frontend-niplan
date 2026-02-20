// pages/BusinessProfile.jsx
import { useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import BusinessSettings from "../components/BusinessSettings";

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
      await api.patch("/my-business/update/", formData);
      toast.success("Profil mis à jour !");
      fetchBusiness();
    } catch (err) {
      toast.error("Erreur de mise à jour");
    }
  };

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold text-center text-gray-800 dark:text-slate-200 mb-4">
        Mon Business
      </h1>

      {business && (
        <BusinessSettings businessData={business} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default BusinessProfile;
