// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Pas de token = login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si rôles spécifiés, vérifie l'accès
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirige selon le rôle
    if (role === "superadmin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
