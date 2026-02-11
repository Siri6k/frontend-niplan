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
