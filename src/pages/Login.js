import React, { useState } from 'react';
import api from '../api';

const Login = () => {
  const [phone, setPhone] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/request-otp/', { phone_whatsapp: phone });
      const code = res.data.code_debug; // En prod, ce sera envoyé par message
      
      // Lien WhatsApp magique
      const message = `Bonjour Kifanyi, mon code de validation est : ${code}`;
      const whatsappUrl = `https://wa.me/243899530506?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      // Ici, tu rediriges vers la page de saisie du code
    } catch (err) {
      alert("Erreur lors de la connexion");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Créer ma boutique</h2>
      <input 
        type="text" placeholder="Ex: 243812345678"
        className="border p-3 rounded-xl w-full mb-4"
        onChange={(e) => setPhone(e.target.value)}
      />
      <button 
        onClick={handleLogin}
        className="bg-green-600 text-white p-4 rounded-xl w-full font-bold"
      >
        Continuer sur WhatsApp
      </button>
    </div>
  );
};

export default Login;