import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // --- 1. REDIRECTION AUTOMATIQUE SI DÉJÀ CONNECTÉ ---
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // --- 2. ÉTAPE 1 : ENVOI MESSAGE WHATSAPP ---
  const handleContactAdmin = async () => {
    if (!phone) return alert("Entrez votre numéro");

    try {
      // On prévient le backend pour qu'il génère le code en attente
      const res = await api.post("/auth/request-otp/", {
        phone_whatsapp: phone,
      });

      // On prépare le message pour l'admin (ou le bot)
      const adminNumber = "243899530506"; // Ton numéro admin
      const message = `Bonjour Kifanyi, je souhaite activer ma boutique pour le numéro ${phone}.`;
      const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(
        message
      )}`;

      // Ouvre WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, "_blank");

      // On passe à l'étape du code sur le site
      // ON RÉINITIALISE LE CODE ET ON PASSE À L'ÉTAPE 2
      setCode("");
      setStep(2);
    } catch (err) {
      alert("Erreur serveur. Vérifiez le format du numéro.");
    }
  };

  // --- 3. ÉTAPE 2 : VÉRIFICATION DU CODE REÇU PAR LE BOT ---
  const handleVerifyOTP = async () => {
    try {
      const res = await api.post("/auth/verify-otp/", {
        phone_whatsapp: phone,
        code: code,
      });

      localStorage.setItem("access_token", res.data.access);
      navigate("/dashboard");
    } catch (err) {
      alert("Code incorrect. Demandez-en un nouveau au bot.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            {step === 1 ? "📱" : "🔑"}
          </div>
          <h2 className="text-2xl font-black italic">NIPLAN</h2>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Entrez votre numéro WhatsApp pour obtenir votre code d'accès.
            </p>
            <input
              type="text"
              placeholder="Ex: 243812345678"
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={handleContactAdmin}
              className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              Obtenir mon code sur WhatsApp
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Entrez le code de 6 chiffres envoyé par le bot.
            </p>
            <input
              type="text"
              placeholder="0 0 0 0 0 0"
              className="w-full p-4 bg-gray-50 border rounded-2xl text-center text-2xl font-mono tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="6"
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-black text-white p-4 rounded-2xl font-bold"
            >
              Valider et Entrer
            </button>
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
