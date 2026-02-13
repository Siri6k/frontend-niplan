// components/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";

export const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Vérifie token ET rôle superadmin
  if (!token || role !== "superadmin") {
    // Redirige vers dashboard si pas admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
