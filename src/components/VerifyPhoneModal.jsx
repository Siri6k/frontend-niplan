// components/VerifyPhoneModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { X, ShieldCheck, Smartphone, Send, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import toast from "react-hot-toast";

export default function VerifyPhoneModal({ isOpen, onClose, phone = "" }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const inputRef = useRef(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setTimeout(() => inputRef.current?.focus(), 100);
      handleSend(); // Envoi automatique
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendSeconds]);

  const maskPhone = (p) => {
    if (!p) return "";
    const cleaned = p.replace(/\D/g, "");
    if (cleaned.length < 9) return "+" + cleaned;
    return `+${cleaned.slice(0, 6)}...${cleaned.slice(-3)}`;
  };

  const handleSend = async () => {
    setIsLoading(true);
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
      triggerShake();
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
      triggerShake();
      toast.error("Code incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative w-full max-w-md glass-card bg-white/95 dark:bg-white/5 rounded-[2.5rem] p-8 sm:p-10 border-2 ${isShaking ? "border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)]" : "border-slate-200 dark:border-white/10 shadow-xl dark:shadow-3xl"}`}
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-all bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 active:scale-90"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-500 shadow-inner">
                <ShieldCheck size={36} />
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                Sécurité WhatsApp
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                Validation requise pour {maskPhone(phone)}
              </p>
            </div>

            <div className="space-y-8">
              {/* OTP Input Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-4 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Smartphone
                      size={14}
                      className="text-slate-500 dark:text-slate-500"
                    />
                    <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      Code de Session
                    </span>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={isLoading || resendSeconds > 0}
                    className="text-[10px] font-black text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 disabled:text-slate-400 dark:disabled:text-slate-700 uppercase tracking-widest transition-colors"
                  >
                    {resendSeconds > 0
                      ? `Renvoyer (${resendSeconds}s)`
                      : "Renvoyer maintenant"}
                  </button>
                </div>

                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000 000"
                    className="w-full bg-transparent text-center text-5xl font-black tracking-[0.2em] text-slate-900 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-800 selection:bg-green-500/30 font-mono"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleVerify}
                  disabled={isLoading || code.length < 5}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 active:scale-95 transition-all group disabled:opacity-50 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Zap
                        size={18}
                        className="group-hover:fill-white transition-all"
                      />
                      Confirmer la Vérification
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 text-[10px] font-black text-slate-500 hover:text-slate-700 dark:text-slate-600 dark:hover:text-slate-400 uppercase tracking-[0.3em] transition-colors"
                >
                  Peut-être plus tard
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-2 text-[9px] text-slate-500 dark:text-slate-700 font-bold uppercase tracking-widest">
              <ShieldCheck size={10} /> Chiffrement Bout-en-Bout
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
