import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const ProtectedClientRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAuthorized(!!token);
    setLoading(false);
  }, []);

  if (loading) return null; // important Safari

  if (!authorized) return <Navigate to="/login" replace />;

  return children;
};
