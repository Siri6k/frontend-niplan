// components/ChatSupport.jsx
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Phone, HelpCircle, Clock } from "lucide-react";

const FAQS = [
  {
    q: "Comment créer ma boutique ?",
    a: "Connectez-vous avec WhatsApp, complétez votre profil, puis ajoutez vos produits depuis le tableau de bord.",
  },
  {
    q: "Combien ça coûte ?",
    a: "L'inscription est 100% gratuite ! Vous ne payez qu'une petite commission (5-10%) sur vos ventes réalisées.",
  },
  {
    q: "Comment être payé ?",
    a: "Vous recevez vos paiements via Mobile Money (MPesa, Orange Money, Airtel Money) directement sur votre téléphone.",
  },
  {
    q: "Le code n'arrive pas",
    a: "Vérifiez que vous avez bien reçu le message WhatsApp. Si non, cliquez sur 'Renvoyer le code' après 60 secondes ou contactez-nous.",
  },
  {
    q: "Je suis à l'étranger, ça marche ?",
    a: "Oui ! Niplan accepte les numéros internationaux. Sélectionnez votre pays dans le menu déroulant lors de la connexion.",
  },
];

const QUICK_REPLIES = [
  "Comment créer ma boutique ?",
  "Le code n'arrive pas",
  "Je suis à l'étranger",
];

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Bonjour ! 👋 Je suis l'assistant Niplan.\n\nJe peux vous aider avec :\n• La connexion / codes OTP\n• La création de boutique\n• Les frais et paiements\n• Les numéros internationaux\n\nQue souhaitez-vous savoir ?",
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input quand chat ouvert
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Notification après 30 secondes sur la page
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setHasNewMessage(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulation réponse bot
    setTimeout(
      () => {
        const botResponse = generateResponse(inputValue);
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      800 + Math.random() * 700,
    );
  };

  const generateResponse = (userText) => {
    const lower = userText.toLowerCase();

    // Matching FAQ
    const matchedFaq = FAQS.find(
      (faq) =>
        lower.includes(faq.q.toLowerCase().split(" ").slice(0, 3).join(" ")) ||
        faq.q.toLowerCase().includes(lower.slice(0, 10)),
    );

    if (matchedFaq) {
      return {
        id: Date.now() + 1,
        type: "bot",
        text: matchedFaq.a,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        showContact: lower.includes("code") || lower.includes("arrive pas"),
      };
    }

    // Réponses contextuelles
    if (
      lower.includes("bonjour") ||
      lower.includes("salut") ||
      lower.includes("hey")
    ) {
      return {
        id: Date.now() + 1,
        type: "bot",
        text: "Bonjour ! 😊 Prêt à vous aider. Posez-moi votre question ou choisissez une option rapide ci-dessous.",
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }

    if (
      lower.includes("code") ||
      lower.includes("otp") ||
      lower.includes("whatsapp") ||
      lower.includes("connexion")
    ) {
      return {
        id: Date.now() + 1,
        type: "bot",
        text: "Pour les problèmes de code OTP :\n\n1️⃣ Vérifiez votre numéro WhatsApp\n2️⃣ Attendez 60 secondes\n3️⃣ Cliquez sur 'Renvoyer le code'\n4️⃣ Vérifiez vos notifications WhatsApp\n\nSi toujours rien après 2 tentatives :",
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        showContact: true,
      };
    }

    if (
      lower.includes("prix") ||
      lower.includes("coût") ||
      lower.includes("gratuit") ||
      lower.includes("pay")
    ) {
      return {
        id: Date.now() + 1,
        type: "bot",
        text: "💰 Gratuit à l'inscription !\n\n• Création de compte : 0 FC\n• Publication de produits : 0 FC\n• Commission sur vente : 5-10% seulement\n\nVous gardez 90-95% de vos revenus !",
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }

    if (
      lower.includes("étranger") ||
      lower.includes("international") ||
      lower.includes("pays") ||
      lower.includes("france") ||
      lower.includes("belgique")
    ) {
      return {
        id: Date.now() + 1,
        type: "bot",
        text: "🌍 Niplan fonctionne partout !\n\nLors de la connexion :\n• Cliquez sur le drapeau 🇨🇩\n• Sélectionnez votre pays\n• Entrez votre numéro local\n\nNous supportons +50 pays avec WhatsApp.",
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }

    if (
      lower.includes("merci") ||
      lower.includes("ok") ||
      lower.includes("parfait")
    ) {
      return {
        id: Date.now() + 1,
        type: "bot",
        text: "Avec plaisir ! 🎉\n\nN'hésitez pas si vous avez d'autres questions. Bonne vente sur Niplan !",
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }

    // Fallback
    return {
      id: Date.now() + 1,
      type: "bot",
      text: "Je ne suis pas sûr de comprendre. Voici ce que je peux faire :\n\n• Aider avec la connexion\n• Expliquer les frais\n• Guider pour créer une boutique\n• Répondre sur les numéros étrangers\n\nSinon, contactez notre équipe :",
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      showContact: true,
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openWhatsAppSupport = () => {
    const phone = "243899530506";
    const message = "Bonjour Niplan, j'ai besoin d'aide pour : ";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const startConversation = (text) => {
    setInputValue(text);
    setTimeout(handleSend, 100);
  };

  return (
    <>
      {/* Bouton flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-25 opacity-90 right-6 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Ouvrir le chat support"
        >
          <MessageCircle
            size={28}
            className="group-hover:rotate-12 transition-transform duration-300"
          />

          {/* Badge notification */}
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center animate-pulse">
              <span className="text-[10px] font-bold">1</span>
            </span>
          )}

          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Besoin d'aide ?
          </span>
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-25 right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 md:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Support Niplan</h3>
                <p className="text-green-100 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  En ligne maintenant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-${msg.type === "user" ? "right" : "left"}-2 duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "bg-green-600 text-white rounded-br-md"
                      : "bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-bl-md shadow-sm border border-gray-100 dark:border-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Bouton contact WhatsApp */}
                  {msg.showContact && (
                    <button
                      onClick={openWhatsAppSupport}
                      className="mt-3 w-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
                    >
                      <Phone size={14} />
                      Contacter un conseiller
                    </button>
                  )}

                  <span
                    className={`text-[10px] mt-2 block opacity-70 ${
                      msg.type === "user" ? "text-green-100" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Indicateur "en train d'écrire" */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && !isTyping && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => startConversation(reply)}
                  className="text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 px-3 py-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800 hover:text-green-700 dark:hover:text-green-400 transition-all"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl text-sm focus:ring-2 focus:ring-green-500 dark:text-white placeholder-gray-400 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="w-11 h-11 sm:w-12 sm:h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1">
                <Clock size={10} />
                Réponse en moins de 2 min
              </p>
              <button
                onClick={openWhatsAppSupport}
                className="text-[10px] text-green-600 hover:text-green-700 font-medium underline"
              >
                WhatsApp direct
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSupport;
