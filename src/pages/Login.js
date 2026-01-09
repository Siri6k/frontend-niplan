import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { isValidPhoneNumber, normalizedPhoneNumber } from "../utils/Constants";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [validCode, setValidCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // --- 1. REDIRECTION AUTOMATIQUE SI DÉJÀ CONNECTÉ ---
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const sendAdminWhatsAppMessage = (phone) => {
    setCode("");
    setError("");
    const adminNumber = "243899530506";
    const message = `Bonjour Niplan, je souhaite activer ma boutique pour le numéro ${phone}.`;
    const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    setIsCodeSent(true);
  };
  // --- 2. ÉTAPE 1 : ENVOI MESSAGE WHATSAPP ---
  const receiveOtp = async () => {
    setCode("");
    setIsCodeSent(false);
    if (!phone) {
      toast.error("Veuillez entrer un numéro WhatsApp valide.");
      setError("Veuillez entrer un numéro WhatsApp valide.");
      return;
    }
    if (!isValidPhoneNumber(phone)) {
      toast.error("Le numéro WhatsApp n'est pas valide.");
      setError("Le numéro WhatsApp n'est pas valide.");
      return;
    }
    setPhone(normalizedPhoneNumber(phone)); // Normalisation du numéro
    try {
      // On prévient le backend pour qu'il génère le code en attente
      const res = await api.post("/auth/request-otp/", {
        phone_whatsapp: phone,
      });

      // On passe à l'étape du code sur le site
      // ON RÉINITIALISE LE CODE ET ON PASSE À L'ÉTAPE 2
      setError("");
      setStep(2);
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Erreur serveur. Vérifiez le format du numéro.");
    }
  };

  // --- 3. ÉTAPE 2 : VÉRIFICATION DU CODE REÇU PAR LE BOT ---
  const handleVerifyOTP = async () => {
    if (code.length !== 6) {
      toast.error("Le code doit contenir 6 chiffres.");
      setError("Le code doit contenir 6 chiffres.");
      return;
    }
    try {
      const res = await api.post("/auth/verify-otp/", {
        phone_whatsapp: phone,
        code: code,
      });
      setError("");
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("business_slug", res.data.business_slug);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
      toast.success("Connecté avec succès !");
    } catch (err) {
      toast.error("Code incorrect. Veuillez réessayer.");
      setError("Code incorrect. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 dark:bg-slate-900 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            {step === 1 ? "📱" : "🔑"}
          </div>
          <h2 className="text-2xl font-black italic">Niplan</h2>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Entrez votre numéro WhatsApp pour obtenir le code d'accès.
            </p>
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <input
              type="text"
              placeholder="Ex: +24381XXXXXX"
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-green-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={receiveOtp}
              className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              Se connecter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Entrez le code de 6 chiffres recu sur WhatsApp.
            </p>
            {phone && isCodeSent && !error && (
              <p className="text-xs text-gray-400 text-center">
                Code envoyé au {phone}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <input
              type="text"
              placeholder="000000"
              className="w-full p-4 bg-gray-50 border rounded-2xl text-center text-2xl font-mono tracking-widest outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-blue-400"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {isCodeSent && !error ? (
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-black text-white p-4 rounded-2xl font-bold"
              >
                Valider et Entrer
              </button>
            ) : (
              <button
                onClick={() => sendAdminWhatsAppMessage(phone)}
                className="w-full bg-gray-200 text-gray-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Renouveler code WhatsApp
              </button>
            )}
            <button
              onClick={() => setStep(1)}
              className="w-full text-gray-400 text-xs uppercase tracking-widest"
            >
              Modifier le numéro
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
