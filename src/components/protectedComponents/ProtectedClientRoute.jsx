// components/ProtectedClientRoute.jsx
import { Navigate } from "react-router-dom";

export const ProtectedClientRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Vérifie token ET rôle vendor (ou superadmin peut aussi accéder)
  if (!token) {
    // Redirige vers login si pas connecté
    return <Navigate to="/login" replace />;
  }

  return children;
};
