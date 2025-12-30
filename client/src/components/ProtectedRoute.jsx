import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    API.get("/auth/profile")
      .then(() => {
        setAuth(true);
        setLoading(false);
      })
      .catch(() => {
        setAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
