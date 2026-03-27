import { Navigate } from "react-router-dom";

export const normalizedPhoneNumber = (phone_number) => {
  // Keep the + if present, then remove all other non-digit characters
  const hasPlus = phone_number.startsWith("+");
  let rawPhone = phone_number.replace(hasPlus ? /[^\d+]/g : /\D/g, "");
  const has243 = rawPhone.startsWith("243");

  rawPhone = has243 ? rawPhone.slice(3) : rawPhone;

  // Handle local numbers (starting with 0 or without country code)
  if (rawPhone.startsWith("0")) {
    return "+243" + rawPhone.slice(1);
  } else if (!hasPlus && rawPhone.length > 0) {
    // For numbers without any prefix, assume it's Congo number
    return "+243" + rawPhone;
  }
  // For numbers with +, return as is (only digits and +)
  return rawPhone;
};
export const isValidPhoneNumber = (phone_number) => {
  const normalized = normalizedPhoneNumber(phone_number);
  return normalized.length === 13 || !normalized.startsWith("+243");
};

export const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  // On peut aussi décoder le token pour vérifier si "is_staff" est True
  const isAdmin = localStorage.getItem("role");

  if (!token && isAdmin !== "superadmin") {
    // Si pas de token ou pas admin, retour au login
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const CATEGORY_DATA = {
  Général: {
    desc: "Articles divers",
  },
  Mode: {
    desc: "Vêtements, chaussures, sacs",
    showPrice: true,
    allowTroc: false,
    fields: [
      {
        name: "quantite",
        label: "Quantité",
        type: "number",
        placeholder: "Ex: 1",
        value: 1,
      },
      {
        name: "taille",
        label: "Taille",
        type: "text",
        placeholder: "Ex: M, 42, One Size...",
      },
      {
        name: "couleur",
        label: "Couleur",
        type: "text",
        placeholder: "Ex: Rouge, Bleu, Vert...",
      },

      {
        name: "etat_mode",
        label: "État",
        type: "select",
        default: "Neuf avec étiquette",
        options: ["Neuf avec étiquette", "Comme neuf", "Bon état", "Usé"],
      },
    ],
  },
  Électronique: {
    desc: "Téléphones, PC, accessoires",
    showPrice: true,
    allowTroc: true,
    fields: [
      {
        name: "quantite",
        label: "Quantité",
        type: "number",
        placeholder: "Ex: 1",
        default: 1,
      },
      {
        name: "couleur",
        label: "Couleur",
        type: "text",
        placeholder: "Ex: Noir, Blanc, Or, ...",
      },
      {
        name: "capacite",
        label: "Capacité",
        type: "text",
        placeholder: "Ex: 128Go, 256Go, 512Go",
      },
      {
        name: "etat_objet",
        label: "État",
        type: "select",
        default: "Neuf scellé",
        options: [
          "Neuf scellé",
          "Occasion (Comme neuf)",
          "Occasion (Bon état)",
          "À réparer",
        ],
      },
    ],
  },

  Immobilier: {
    desc: "Maisons, appartements, terrains",
    showPrice: true,
    allowTroc: false,
    fields: [
      {
        name: "type_immo",
        label: "Type",
        type: "select",
        default: "Appartement",
        options: ["Appartement", "Maison", "Terrain", "Bureau", "Commerce"],
      },
      {
        name: "chambres",
        label: "Chambres",
        type: "number",
        placeholder: "Ex: 3",
      },
      {
        name: "surface",
        label: "Surface (m²)",
        type: "number",
        placeholder: "Ex: 120",
      },
    ],
  },
  Services: {
    desc: "Prestations et expertise",
    showPrice: false,
    allowTroc: false,
    fields: [
      {
        name: "type_service",
        label: "Type de service",
        type: "text",
        placeholder: "Ex: Plomberie, Electricien...",
      },
      {
        name: "tarif_info",
        label: "Information tarifaire",
        type: "text",
        placeholder: "Ex: À l'heure, Forfait...",
      },
    ],
  },
  Véhicules: {
    desc: "Voitures, motos, pièces",
    showPrice: true,
    allowTroc: true,
    fields: [
      {
        name: "marque",
        label: "Marque",
        type: "text",
        placeholder: "Ex: Toyota",
      },
      {
        name: "modele",
        label: "Modèle",
        type: "text",
        placeholder: "Ex: RAV4",
      },
      {
        name: "annee",
        label: "Année",
        type: "number",
        placeholder: "Ex: 2022",
      },
      {
        name: "kilometrage",
        label: "Kilométrage (km)",
        type: "number",
        placeholder: "Ex: 50000",
      },
    ],
  },
  Autre: {
    desc: "Catégorie personnalisée",
    fields: [
      {
        name: "autres_precisions",
        label: "Précisions",
        type: "text",
        placeholder: "Ex: Equipements des chantiers, ...",
      },
    ],
  },
};
