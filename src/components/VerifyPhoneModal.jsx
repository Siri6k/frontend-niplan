import React, { useEffect, useState, useRef } from "react";
import { X, ShieldCheck, Smartphone, Send, Loader2 } from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";

export default function VerifyPhoneModal({ isOpen, onClose, phone = "" }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const inputRef = useRef(null);
  const [isShaking, setIsShaking] = useState(false); // <--- Nouvel état

  // Reset au montage/démontage
  useEffect(() => {
    if (isOpen) {
      setCode("");
      setResendSeconds(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, phone]);

  useEffect(() => {
    handleSend(); // Envoi automatique à l'ouverture
  }, []);

  // Timer pour le renvoi
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendSeconds]);

  if (!isOpen) return null;

  const maskPhone = (p) => {
    if (!p) return "";
    const cleaned = p.replace(/\D/g, "");
    if (cleaned.length < 9) return "+" + cleaned;
    return `+${cleaned.slice(0, 6)}...${cleaned.slice(-3)}`;
  };

  const handleSend = async () => {
    setIsLoading(true);
    setCode("");
    try {
      const res = await api.post("/phone/request-otp/", {
        phone_whatsapp: phone,
      });
      toast.success(res.data.message || "Code envoyé sur WhatsApp !");
      setResendSeconds(60);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur d'envoi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length < 6) {
      triggerShake(); // Secoue si le champ est vide ou trop court
      toast.error("Code incomplet");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/phone/verify-otp/", {
        phone_whatsapp: phone,
        otp_code: code,
      });
      const { access, refresh, business_slug, role, is_phone_verified } =
        res.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("business_slug", business_slug || "");
      localStorage.setItem("role", role || "vendor");
      localStorage.setItem(
        "is_phone_verified",
        is_phone_verified === true ? "true" : "false",
      );
      toast.success("Numéro vérifié avec succès ! 🎉");
      setTimeout(onClose, 500);
    } catch (err) {
      triggerShake(); // <--- Secoue en cas d'erreur API
      toast.error("Code incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour déclencher l'animation
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400); // On retire la classe après l'animation
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay avec flou */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Card Modal */}
      {/* Ajout de la classe conditionnelle animate-shake ici */}
      <div
        className={`relative w-full max-w-md transform rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl transition-all ${
          isShaking
            ? "animate-shake border-2 border-red-500"
            : "border-2 border-transparent"
        }`}
      >
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
            <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Vérification WhatsApp
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Un code de sécurité est nécessaire pour valider votre numéro.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Section Numéro */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Smartphone className="text-slate-400" size={20} />
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {maskPhone(phone)}
              </span>
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || resendSeconds > 0}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 disabled:text-slate-400 transition-colors"
            >
              {resendSeconds > 0 ? `Renvoyer (${resendSeconds}s)` : "Envoyer"}
            </button>
          </div>

          {/* Input OTP */}
          <div>
            <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Entrez le code reçu
            </label>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="••••••"
              className="w-full bg-transparent text-center text-4xl font-bold tracking-[0.5em] text-slate-900 dark:text-white outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800"
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="rounded-2xl border-2 border-slate-100 dark:border-slate-800 py-4 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleVerify}
              disabled={isLoading || code.length < 5}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Vérifier <Send size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
