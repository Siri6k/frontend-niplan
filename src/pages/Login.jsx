import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  ArrowLeft,
  Shield,
  Users,
  Zap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";
import { isValidPhoneNumber, normalizedPhoneNumber } from "../utils/Constants";
import PhoneInput from "../components/PhoneInput";
import ChatSupport from "../components/ChatSupport";

const STEPS = {
  PHONE: 1,
  PASSWORD_SETUP: 2, // ancien utilisateur (sans mot de passe)
  PASSWORD_LOGIN: 3, // utilisateur existant (avec mot de passe)
  OTP_REQUEST: 4,
  OTP_VERIFY: 5,
  SUCCESS: 6,
  PASSWORD_CREATION: 7, // NOUVEAU : création du mot de passe avant OTP
};

const FEATURES = [
  { icon: Zap, text: "Mise en ligne en 2 minutes" },
  { icon: Users, text: "+500 vendeurs actifs" },
  { icon: Shield, text: "Paiements sécurisés" },
];

const Spinner = () => (
  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
];

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState(STEPS.PHONE);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Redirection si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  // Focus auto
  useEffect(() => {
    if (step === STEPS.OTP_VERIFY) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  // Countdown pour OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateInternationalPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    return /^\+[1-9]\d{7,14}$/.test(cleaned);
  };

  // === ÉTAPE 1: Détection du type d'utilisateur ===
  const handlePhoneSubmit = async () => {
    const cleanPhone = phone.replace(/\s/g, "");

    if (!validateInternationalPhone(cleanPhone)) {
      toast.error("Numéro international invalide");
      setError("Format: +XXX XXXXXXXXX");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/detect-flow/", {
        phone_whatsapp: normalizedPhoneNumber(cleanPhone),
      });

      const data = res.data;

      if (data.flow === "legacy_setup") {
        setStep(STEPS.PASSWORD_SETUP);
        toast.success(
          "Définissez votre mot de passe pour sécuriser votre compte",
        );
      } else if (data.flow === "standard_login") {
        setStep(STEPS.PASSWORD_LOGIN);
      } else if (data.flow === "new_registration") {
        // NOUVEAU : on va d'abord définir le mot de passe
        setStep(STEPS.PASSWORD_CREATION);
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch (err) {
      const message = err.response?.data?.error || "Erreur de connexion";
      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // === Demande OTP (nouveau user) ===
  const requestOtp = async (phoneNumber) => {
    try {
      const res = await api.post("/auth/register/request-otp/", {
        phone_whatsapp: normalizedPhoneNumber(phoneNumber),
      });

      if (
        res.data.status === "success" ||
        res.data.flow === "otp_verification"
      ) {
        setStep(STEPS.OTP_VERIFY);
        setCountdown(60);
        toast.success(
          `Code envoyé au ${phoneNumber.slice(0, 6)}...${phoneNumber.slice(-4)}`,
        );
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.flow === "legacy_setup") {
        setStep(STEPS.PASSWORD_SETUP);
        toast.info("Définissez votre mot de passe");
      } else if (data?.flow === "standard_login") {
        setStep(STEPS.PASSWORD_LOGIN);
        toast.info("Connectez-vous avec votre mot de passe");
      } else {
        toast.error(data?.error || "Erreur lors de l'envoi du code");
        setError(data?.error || "Erreur");
      }
    }
  };

  // === ÉTAPE 2 (nouveau) : Création du mot de passe (avant OTP) ===
  const handlePasswordCreation = async () => {
    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Pas d'appel API ici, on envoie juste l'OTP
    setIsLoading(true);
    setError("");
    await requestOtp(phone);
    setIsLoading(false);
  };

  // === ÉTAPE 2A: Ancien user définit MDP (PAS D'OTP!) ===
  const handlePasswordSetup = async () => {
    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/legacy/set-password/", {
        phone_whatsapp: normalizedPhoneNumber(phone),
        password: password,
        password_confirm: confirmPassword,
      });

      handleAuthSuccess(res.data);
      toast.success("Mot de passe créé avec succès !");
    } catch (err) {
      const message = err.response?.data?.error || "Erreur lors de la création";
      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // === ÉTAPE 2B: Login avec MDP existant ===
  const handlePasswordLogin = async () => {
    if (!password) {
      setError("Entrez votre mot de passe");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login/", {
        phone_whatsapp: normalizedPhoneNumber(phone),
        password: password,
      });

      handleAuthSuccess(res.data);
    } catch (err) {
      const data = err.response?.data;

      if (data?.flow === "legacy_setup") {
        setStep(STEPS.PASSWORD_SETUP);
        toast.info("Veuillez d'abord définir votre mot de passe");
      } else {
        const message = data?.error || "Mot de passe incorrect";
        toast.error(message);
        setError(message);
        setPassword("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // === ÉTAPE 3: Nouveau user vérifie OTP (après avoir défini le mot de passe) ===
  const handleOtpVerify = async () => {
    if (otpCode.length !== 6) {
      setError("Code à 6 chiffres requis");
      return;
    }
    // Le mot de passe a déjà été saisi à l'étape précédente, on le réutilise
    if (password.length < 8) {
      setError("Le mot de passe est manquant ou trop court");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/register/verify-otp/", {
        phone_whatsapp: normalizedPhoneNumber(phone),
        code: otpCode,
        password: password, // mot de passe déjà stocké
      });
      if (res.status !== 201) {
        throw new Error("Vérification échouée");
      }
      handleAuthSuccess(res.data);
      toast.success("Compte créé avec succès !");
    } catch (err) {
      const message = err.response?.data?.error || "Code invalide";
      toast.error(message);
      setError(message);
      setOtpCode("");
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpVerifyLater = async () => {
    // Le mot de passe a déjà été saisi à l'étape précédente, on le réutilise
    if (password.length < 8) {
      setError("Le mot de passe est manquant ou trop court");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/register/verify-otp/", {
        phone_whatsapp: normalizedPhoneNumber(phone),
        code: "", // on envoie un code vide pour forcer la création sans vérification
        password: password, // mot de passe déjà stocké
      });
      console.log(res);
      handleAuthSuccess(res.data);
      toast.success("Compte créé avec succès !");
    } catch (err) {
      const message = err.response?.data?.error || "Code invalide";
      toast.error(message);
      setError(message);
      setOtpCode("");
    } finally {
      setIsLoading(false);
    }
  };

  // === Renvoi OTP ===
  const resendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await requestOtp(phone);
      toast.success("Nouveau code envoyé");
    } catch (err) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsLoading(false);
    }
  };

  // === Succès: Stockage et redirection ===
  // 1. Supprime l'import { data } en haut du fichier !

  // 2. Modifie la fonction handleAuthSuccess
  const handleAuthSuccess = (authData) => {
    // Renommé pour éviter le conflit avec l'import
    // On stocke tout proprement
    localStorage.setItem("access_token", authData.access);
    localStorage.setItem("refresh_token", authData.refresh);
    localStorage.setItem("business_slug", authData.business_slug || "");
    localStorage.setItem("role", authData.role || "vendor");

    // Stockage en booléen réel via JSON
    localStorage.setItem(
      "is_phone_verified",
      JSON.stringify(authData.is_phone_verified),
    );

    // On change l'état visuel
    setStep(STEPS.SUCCESS);

    // Utilisation d'un délai pour l'expérience utilisateur
    setTimeout(() => {
      // On utilise replace: true pour vider l'historique du login
      navigate("/dashboard", { replace: true });
      // Le toast doit être APRES le navigate pour être sûr qu'il s'affiche sur la nouvelle page
      setTimeout(() => toast.success("Bienvenue sur Niplan ! 🎉"), 100);
    }, 1500);
  };
  // === Retour arrière ===
  const goBack = () => {
    if (step !== STEPS.PHONE && step !== STEPS.SUCCESS) {
      setStep(STEPS.PHONE);
      setPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setError("");
    }
  };

  // === Indice de progression (1,2,3) ===
  const getCurrentStepIndex = () => {
    switch (step) {
      case STEPS.PHONE:
        return 1;
      case STEPS.PASSWORD_CREATION:
      case STEPS.PASSWORD_SETUP:
      case STEPS.PASSWORD_LOGIN:
        return 2;
      case STEPS.OTP_VERIFY:
        return 3;
      default:
        return 1;
    }
  };

  // === Rendu des étapes ===
  const renderStepContent = () => {
    switch (step) {
      case STEPS.PHONE:
        return (
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
              onClick={handlePhoneSubmit}
              disabled={isLoading || phone.length < 10}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Continuer<span className="text-green-200">→</span>
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400 dark:text-slate-500">
              En continuant, vous acceptez nos CGU et Politique de
              confidentialité
            </p>
          </div>
        );

      // Nouvelle étape : création du mot de passe pour les nouveaux utilisateurs
      case STEPS.PASSWORD_CREATION:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                🔐 Nouveau compte : définissez votre mot de passe
              </p>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:border-green-500 dark:focus:border-green-400 transition-all text-gray-900 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:border-green-500 dark:focus:border-green-400 transition-all text-gray-900 dark:text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              onClick={handlePasswordCreation}
              disabled={
                isLoading || password.length < 8 || password !== confirmPassword
              }
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Continuer vers la vérification <Lock size={20} />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              8 caractères minimum. Vous recevrez ensuite un code de
              vérification.
            </p>
          </div>
        );

      case STEPS.PASSWORD_SETUP:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                🔒 Votre numéro est déjà vérifié. Définissez un mot de passe
                pour sécuriser votre compte.
              </p>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:border-green-500 dark:focus:border-green-400 transition-all text-gray-900 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:border-green-500 dark:focus:border-green-400 transition-all text-gray-900 dark:text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              onClick={handlePasswordSetup}
              disabled={isLoading || password.length < 8}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Créer mon mot de passe <Lock size={20} />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              8 caractères minimum. Pas de code OTP requis !
            </p>
          </div>
        );

      case STEPS.PASSWORD_LOGIN:
        return (
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all text-gray-900 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasswordLogin()}
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              onClick={handlePasswordLogin}
              disabled={isLoading || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Se connecter <ArrowLeft size={20} className="rotate-180" />
                </>
              )}
            </button>

            <button
              onClick={() => {
                toast(
                  "Fonctionnalité à venir: Réinitialisation du mot de passe",
                );
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-700"
            >
              Mot de passe oublié ?
            </button>
          </div>
        );

      case STEPS.OTP_VERIFY:
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl mb-4">
              <p className="text-sm text-orange-700 dark:text-orange-300 text-center">
                📱 Vérifiez votre numéro avec le code reçu sur WhatsApp
              </p>
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder="• • • • • •"
                className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-all text-center text-3xl font-mono tracking-[0.5em] text-gray-900 dark:text-white"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              onClick={handleOtpVerify}
              disabled={isLoading || otpCode.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Vérifier et créer mon compte <Zap size={20} />
                </>
              )}
            </button>

            <div className="text-center space-y-2">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Renvoyer dans{" "}
                  <span className="font-mono font-bold">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={resendOtp}
                  disabled={isLoading}
                  className="text-sm font-medium text-green-600 hover:text-green-700 underline"
                >
                  Renvoyer le code
                </button>
              )}
            </div>

            <div
              className="w-full disabled:cursor-not-allowed text-gray-700 py-1 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer color-gray-500 hover:text-gray-900 disabled:text-gray-300"
              onClick={handleOtpVerifyLater}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Verifier après <ArrowRight size={20} />
                </>
              )}
            </div>
          </div>
        );

      case STEPS.SUCCESS:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Zap size={32} className="text-green-600" />
            </div>
            <p className="text-gray-600 dark:text-slate-400">
              Connexion réussie ! Redirection...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // === Helpers UI ===
  const getStepIcon = () => {
    switch (step) {
      case STEPS.PHONE:
        return <MessageCircle size={28} className="text-green-600" />;
      case STEPS.PASSWORD_CREATION:
      case STEPS.PASSWORD_SETUP:
        return <Lock size={28} className="text-blue-600" />;
      case STEPS.PASSWORD_LOGIN:
        return <Lock size={28} className="text-blue-600" />;
      case STEPS.OTP_VERIFY:
        return <Shield size={28} className="text-orange-600" />;
      case STEPS.SUCCESS:
        return <Zap size={28} className="text-yellow-500" />;
      default:
        return <MessageCircle size={28} className="text-green-600" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case STEPS.PHONE:
        return "Connexion sécurisée";
      case STEPS.PASSWORD_CREATION:
        return "Définir votre mot de passe";
      case STEPS.PASSWORD_SETUP:
        return "Définir votre mot de passe";
      case STEPS.PASSWORD_LOGIN:
        return "Entrez votre mot de passe";
      case STEPS.OTP_VERIFY:
        return "Vérifiez votre numéro";
      case STEPS.SUCCESS:
        return "C'est parti !";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case STEPS.PHONE:
        return "Entrez votre numéro pour commencer";
      case STEPS.PASSWORD_CREATION:
        return "Choisissez un mot de passe sécurisé";
      case STEPS.PASSWORD_SETUP:
        return "Votre numéro est déjà vérifié 🔒";
      case STEPS.PASSWORD_LOGIN:
        return `Connectez-vous à ${phone}`;
      case STEPS.OTP_VERIFY:
        return `Code envoyé à ${phone}`;
      case STEPS.SUCCESS:
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center mt-13 mx-auto">
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
              {AVATAR_URLS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Vendeur ${i + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              <span className="font-bold text-gray-900 dark:text-white">
                100+
              </span>{" "}
              vendeurs ce mois
            </p>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-slate-800">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {step !== STEPS.PHONE && step !== STEPS.SUCCESS && (
                <button
                  onClick={goBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-500" />
                </button>
              )}

              {/* Indicateur de progression à 3 points */}
              <div className="flex gap-2 mx-auto">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-1.5 rounded-full transition-colors ${
                      i <= getCurrentStepIndex()
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              {step !== STEPS.PHONE && step !== STEPS.SUCCESS && (
                <div className="w-10" />
              )}
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {getStepIcon()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getStepTitle()}
              </h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
                {getStepSubtitle()}
              </p>
            </div>
          </div>

          {/* Contenu dynamique */}
          {renderStepContent()}
        </div>
      </div>
      <ChatSupport />
    </div>
  );
};

export default Login;
