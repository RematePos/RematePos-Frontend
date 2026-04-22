import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function BillingPage() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Facturación</h1>
          <p style={styles.subtitle}>
            Gestiona la facturación del POS, devoluciones, copias de facturas e
            integración con proveedor electrónico.
          </p>
        </div>
      </div>

      <div style={styles.tabs}>
        <NavLink
          to="/billing"
          end
          style={({ isActive }) => ({
            ...styles.tab,
            ...(isActive ? styles.activeTab : {}),
          })}
        >
          Facturar
        </NavLink>

        <NavLink
          to="/billing/returns"
          style={({ isActive }) => ({
            ...styles.tab,
            ...(isActive ? styles.activeTab : {}),
          })}
        >
          Devoluciones
        </NavLink>

        <NavLink
          to="/billing/invoice-copy"
          style={({ isActive }) => ({
            ...styles.tab,
            ...(isActive ? styles.activeTab : {}),
          })}
        >
          Copia de facturas
        </NavLink>

        <NavLink
          to="/billing/integration"
          style={({ isActive }) => ({
            ...styles.tab,
            ...(isActive ? styles.activeTab : {}),
          })}
        >
          Integración electrónica
        </NavLink>
      </div>

      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "24px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },
  pageHeader: {
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "8px",
    color: "#64748b",
    fontSize: "15px",
    maxWidth: "900px",
  },
  tabs: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  tab: {
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    background: "#e2e8f0",
    color: "#0f172a",
    fontWeight: "700",
    transition: "all 0.2s ease",
  },
  activeTab: {
    background: "#2563eb",
    color: "#ffffff",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.20)",
  },
  content: {
    marginTop: "8px",
  },
};