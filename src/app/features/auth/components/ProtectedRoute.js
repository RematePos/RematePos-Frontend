import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const forbiddenStyle = {
  minHeight: "calc(100vh - 72px)",
  display: "grid",
  placeItems: "center",
  padding: "32px",
  background: "#f5f7fb",
};

const cardStyle = {
  width: "min(520px, 100%)",
  borderRadius: "12px",
  padding: "28px",
  background: "#ffffff",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
  color: "#0f172a",
};

export default function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  anyPermission = true,
  anyRole = true,
}) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasPermissions =
    requiredPermissions.length === 0 ||
    (anyPermission
      ? auth.hasAnyPermission(requiredPermissions)
      : requiredPermissions.every(auth.hasPermission));

  const hasRoles =
    requiredRoles.length === 0 ||
    (anyRole
      ? auth.hasAnyRole(requiredRoles)
      : requiredRoles.every(auth.hasRole));

  if (!hasPermissions || !hasRoles) {
    return (
      <section style={forbiddenStyle}>
        <div style={cardStyle}>
          <p style={{ margin: "0 0 8px", fontWeight: 800, color: "#b91c1c" }}>
            403
          </p>
          <h1 style={{ margin: "0 0 10px", fontSize: "24px" }}>
            No tienes permisos para esta accion
          </h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Tu usuario esta autenticado, pero no cuenta con los permisos necesarios para acceder a esta seccion.
          </p>
        </div>
      </section>
    );
  }

  return children;
}
