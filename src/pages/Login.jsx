import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  ArrowLeft,
  Shield,
  Users,
  Zap,
  Lock,
} from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";
import { isValidPhoneNumber, normalizedPhoneNumber } from "../utils/Constants";
import PhoneInput from "../components/PhoneInput";
import ChatSupport from "../components/ChatSupport";

const STEPS = {
  PHONE: 1,
  VERIFY: 2,
  SUCCESS: 3,
};

const FEATURES = [
  { icon: Zap, text: "Mise en ligne en 2 minutes" },
  { icon: Users, text: "+500 vendeurs actifs" },
  { icon: Shield, text: "Paiements sécurisés" },
];

// Composant Spinner manquant
const Spinner = () => (
  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

const Login = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(STEPS.PHONE);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Redirection si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  // Focus auto sur input
  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  // Compte à rebours pour renvoi
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Validation internationale
  const validateInternationalPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    return /^\+[1-9]\d{7,14}$/.test(cleaned);
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    setError("");

    // Auto-submit quand 6 chiffres
    if (value.length === 6) {
      setTimeout(() => handleVerify(value), 300);
    }
  };

  const receiveOtp = async () => {
    const cleanPhone = phone.replace(/\s/g, "");

    if (!validateInternationalPhone(cleanPhone)) {
      toast.error("Numéro international invalide");
      setError("Format: +XXX XXXXXXXXX");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/request-otp/", {
        phone_whatsapp: normalizedPhoneNumber(cleanPhone),
      });

      setStep(STEPS.VERIFY);
      setCountdown(60);
      toast.success(
        `Code envoyé au ${cleanPhone.slice(0, 6)}...${cleanPhone.slice(-4)}`,
      );
    } catch (err) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (verificationCode = code) => {
    if (verificationCode.length !== 6) return;

    setIsLoading(true);
    try {
      const res = await api.post("/auth/verify-otp/", {
        phone_whatsapp: phone.replace(/\s/g, ""),
        code: verificationCode,
      });

      const { access, refresh, business_slug, role } = res.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("business_slug", business_slug);
      localStorage.setItem("role", role);

      setStep(STEPS.SUCCESS);

      setTimeout(() => {
        navigate("/dashboard");
        toast.success("Bienvenue sur Niplan ! 🎉");
      }, 1500);
    } catch (err) {
      toast.error("Code incorrect");
      setError("Code invalide. Vérifiez WhatsApp.");
      setCode("");
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    await receiveOtp();
  };

  const goBack = () => {
    setStep(STEPS.PHONE);
    setCode("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      {/* ✅ max-w-full sur mobile, max-w-5xl sur desktop */}
      <div className="w-full max-w-full sm:max-w-lg lg:max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        {/* Côté gauche - Marketing */}
        <div className="hidden lg:flex flex-col space-y-8 p-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              Vendez sur <span className="text-green-600">Niplan</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              La marketplace #1 en RDC. Rejoignez +500 vendeurs qui gagnent déjà
              de l'argent.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 text-gray-700 dark:text-slate-300"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Icon size={20} className="text-green-600" />
                </div>
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white dark:border-slate-800"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              <span className="font-bold text-gray-900 dark:text-white">
                1,200+
              </span>{" "}
              vendeurs ce mois
            </p>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-slate-800">
          {/* Header avec étapes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {step === STEPS.VERIFY && (
                <button
                  onClick={goBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-500" />
                </button>
              )}
              <div className="flex gap-2 mx-auto">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-1.5 rounded-full transition-colors ${
                      i <= step
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              {step === STEPS.VERIFY && <div className="w-10" />}
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {step === STEPS.PHONE ? (
                  <MessageCircle size={28} className="text-green-600" />
                ) : step === STEPS.VERIFY ? (
                  <Lock size={28} className="text-blue-600" />
                ) : (
                  <Zap size={28} className="text-yellow-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {step === STEPS.PHONE && "Connexion sécurisée"}
                {step === STEPS.VERIFY && "Vérifiez WhatsApp"}
                {step === STEPS.SUCCESS && "C'est parti !"}
              </h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
                {step === STEPS.PHONE &&
                  "Entrez votre numéro pour recevoir le code"}
                {step === STEPS.VERIFY && `Code envoyé à ${phone}`}
              </p>
            </div>
          </div>

          {/* ✅ CONTENU CORRIGÉ - PhoneInput au bon endroit */}
          {step === STEPS.PHONE && (
            <div className="space-y-4">
              <PhoneInput
                value={phone}
                onChange={setPhone}
                error={error}
                disabled={isLoading}
              />

              {error && (
                <p className="text-sm text-red-500 text-center animate-pulse">
                  {error}
                </p>
              )}

              <button
                onClick={receiveOtp}
                disabled={isLoading || phone.length < 10}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    Continuer
                    <span className="text-green-200">→</span>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 dark:text-slate-500">
                En continuant, vous acceptez nos CGU et Politique de
                confidentialité
              </p>
            </div>
          )}

          {step === STEPS.VERIFY && (
            <div className="space-y-6">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="• • • • • •"
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all text-center text-3xl font-mono tracking-[0.5em] text-gray-900 dark:text-white"
                  value={code}
                  onChange={handleCodeChange}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <div className="text-center space-y-3">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Renvoyer dans{" "}
                    <span className="font-mono font-bold">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={resendCode}
                    className="text-sm font-medium text-green-600 hover:text-green-700 underline"
                  >
                    Renvoyer le code
                  </button>
                )}

                <button
                  onClick={goBack}
                  className="block w-full text-xs text-gray-400 hover:text-gray-600"
                >
                  Modifier le numéro
                </button>
              </div>
            </div>
          )}

          {step === STEPS.SUCCESS && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Zap size={32} className="text-green-600" />
              </div>
              <p className="text-gray-600 dark:text-slate-400">
                Redirection en cours...
              </p>
            </div>
          )}
        </div>
      </div>
      <ChatSupport />
    </div>
  );
};

export default Login;
