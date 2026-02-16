import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    setAuthorized(token && role === "superadmin");
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!authorized) return <Navigate to="/dashboard" replace />;

  return children;
};
