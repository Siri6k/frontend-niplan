import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Phone,
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
  <div className="w-6 h-6 border-2 border-slate-300/30 dark:border-white/30 border-t-slate-600 dark:border-t-white rounded-full animate-spin" />
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

  const handleAuthSuccess = (authData) => {
    localStorage.setItem("access_token", authData.access);
    localStorage.setItem("refresh_token", authData.refresh);
    localStorage.setItem("business_slug", authData.business_slug || "");
    localStorage.setItem("role", authData.role || "vendor");
    localStorage.setItem(
      "is_phone_verified",
      JSON.stringify(authData.is_phone_verified),
    );

    setStep(STEPS.SUCCESS);

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
      setTimeout(() => toast.success("Bienvenue sur Niplan ! 🎉"), 100);
    }, 1500);
  };

  const goBack = () => {
    if (step !== STEPS.PHONE && step !== STEPS.SUCCESS) {
      setStep(STEPS.PHONE);
      setPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setError("");
    }
  };

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
              <p className="text-sm text-red-500 text-center animate-pulse font-medium">
                {error}
              </p>
            )}

            <button
              onClick={handlePhoneSubmit}
              disabled={isLoading || phone.length < 10}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Continuer{" "}
                  <ArrowRight
                    size={20}
                    className="text-green-200 dark:text-green-300"
                  />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-500 dark:text-slate-500 uppercase tracking-widest font-bold">
              En continuant, vous acceptez nos CGU
            </p>
          </div>
        );

      case STEPS.PASSWORD_CREATION:
        return (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-4">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold text-center uppercase tracking-wider">
                🔐 Définissez votre mot de passe
              </p>
            </div>

            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                className="w-full px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-green-500/50 focus:bg-slate-50 dark:focus:bg-white/[0.07] transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                className="w-full px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-green-500/50 focus:bg-slate-50 dark:focus:bg-white/[0.07] transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center font-medium">
                {error}
              </p>
            )}

            <button
              onClick={handlePasswordCreation}
              disabled={
                isLoading || password.length < 8 || password !== confirmPassword
              }
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Suivant <Lock size={18} />
                </>
              )}
            </button>
          </div>
        );

      case STEPS.PASSWORD_SETUP:
        return (
          <div className="space-y-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl mb-4">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold text-center uppercase tracking-wider">
                🔒 Sécurisez votre accès
              </p>
            </div>

            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                className="w-full px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-green-500/50 focus:bg-slate-50 dark:focus:bg-white/[0.07] transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmer"
                className="w-full px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-green-500/50 focus:bg-slate-50 dark:focus:bg-white/[0.07] transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handlePasswordSetup}
              disabled={isLoading || password.length < 8}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? <Spinner /> : <>Valider mon mot de passe</>}
            </button>
          </div>
        );

      case STEPS.PASSWORD_LOGIN:
        return (
          <div className="space-y-4">
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                className="w-full px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-slate-50 dark:focus:bg-white/[0.07] transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasswordLogin()}
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center font-medium">
                {error}
              </p>
            )}

            <button
              onClick={handlePasswordLogin}
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? <Spinner /> : <>Accéder à mon espace</>}
            </button>

            <button
              onClick={() => toast("Fonctionnalité à venir")}
              className="w-full text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest"
            >
              Oublié ?
            </button>
          </div>
        );

      case STEPS.OTP_VERIFY:
        return (
          <div className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-4 text-center">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">
                📱 Code envoyé sur WhatsApp
              </p>
            </div>

            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder="6 chiffres"
                className="w-full px-5 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-orange-500/50 transition-all text-center text-3xl font-mono tracking-[0.5em] text-slate-900 dark:text-white"
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
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg transition-all"
            >
              {isLoading ? <Spinner /> : "Vérification finale"}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                  Renvoyer dans{" "}
                  <span className="text-slate-900 dark:text-white">
                    {countdown}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={resendOtp}
                  className="text-xs font-bold text-green-600 dark:text-green-500 hover:text-green-500 dark:hover:text-green-400 transition-colors uppercase tracking-widest"
                >
                  Renvoyer le code
                </button>
              )}
            </div>

            <button
              onClick={handleOtpVerifyLater}
              disabled={isLoading}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Continuer sans vérifier <ArrowRight size={14} />
            </button>
          </div>
        );

      case STEPS.SUCCESS:
        return (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20"
            >
              <Zap
                size={40}
                className="text-green-600 dark:text-green-500 fill-green-500"
              />
            </motion.div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Accès Autorisé !
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Chargement de votre terminal de vente...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case STEPS.PHONE:
        return <Phone size={22} />;
      case STEPS.PASSWORD_CREATION:
      case STEPS.PASSWORD_SETUP:
      case STEPS.PASSWORD_LOGIN:
        return <Lock size={22} />;
      case STEPS.OTP_VERIFY:
        return <MessageCircle size={22} />;
      case STEPS.SUCCESS:
        return <Sparkles size={22} />;
      default:
        return <MessageCircle size={22} />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case STEPS.PHONE:
        return "Bienvenue Pro";
      case STEPS.PASSWORD_CREATION:
      case STEPS.PASSWORD_SETUP:
        return "Sécurité";
      case STEPS.PASSWORD_LOGIN:
        return "Ravis de vous revoir";
      case STEPS.OTP_VERIFY:
        return "Vérification";
      case STEPS.SUCCESS:
        return "Prêt à décoller";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case STEPS.PHONE:
        return "Entrez votre terminal mobile";
      case STEPS.PASSWORD_CREATION:
        return "Créez votre clé d'accès";
      case STEPS.PASSWORD_SETUP:
        return "Définissez votre accès sécurisé";
      case STEPS.PASSWORD_LOGIN:
        return "Identifiez-vous pour continuer";
      case STEPS.OTP_VERIFY:
        return `Code envoyé au ${phone}`;
      case STEPS.SUCCESS:
        return "Votre dashboard est prêt.";
      default:
        return "";
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden font-sans selection:bg-green-500/30">
      {/* Background Animated Nebulas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-500/10 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px]"
        />
      </div>

      {/* Main Auth Vault */}
      <div className="relative z-10 w-full max-w-lg">
        {/* LOGO / BRANDING */}
        <div className="text-center mb-10">
          <Link to="/" className="group inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform duration-300">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              Niplan<span className="text-green-500">.</span>
            </h1>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-white/95 dark:bg-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/5"
        >
          {/* Header Progress Bar */}
          <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 flex">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`h-full flex-1 transition-all duration-700 ${i <= getCurrentStepIndex() ? "bg-gradient-to-r from-green-500 to-emerald-400" : "bg-transparent"}`}
              />
            ))}
          </div>

          <div className="p-8 sm:p-12">
            {/* Header / Navigation back */}
            <div className="flex items-center gap-4 mb-8">
              {step !== STEPS.PHONE && step !== STEPS.SUCCESS && (
                <button
                  onClick={goBack}
                  className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/5 active:scale-95"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                  {getStepTitle()}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                  {getStepSubtitle()}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-transparent dark:from-white/10 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 border border-slate-200 dark:border-white/10 shadow-inner">
                {getStepIcon()}
              </div>
            </div>

            {/* Dynamics / Forms with transitions */}
            <div className="min-h-[300px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer of the vault */}
          <div className="px-12 py-6 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
              <Shield
                size={10}
                className="text-green-600 dark:text-green-500"
              />
              Auth Sécurisée
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest">
              © Niplan Global
            </p>
          </div>
        </motion.div>

        {/* Support / Quick Help */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex justify-center gap-8">
            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-600 dark:hover:text-white transition-colors uppercase tracking-[0.2em]">
              CGU
            </button>
            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-600 dark:hover:text-white transition-colors uppercase tracking-[0.2em]">
              Sécurité
            </button>
            <button className="text-[10px] font-bold text-orange-600/60 hover:text-orange-700 dark:text-orange-500/60 dark:hover:text-orange-400 transition-colors uppercase tracking-[0.2em]">
              Assistance
            </button>
          </div>

          <div className="h-4 w-px bg-gradient-to-b from-slate-300 to-transparent dark:from-white/10" />

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {AVATAR_URLS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="User"
                  className="w-6 h-6 rounded-full border border-white dark:border-slate-900 object-cover"
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
              Rejoignez +500 experts
            </p>
          </div>
        </div>
      </div>

      <div className="hidden">
        <ChatSupport />
      </div>
    </div>
  );
};

export default Login;
