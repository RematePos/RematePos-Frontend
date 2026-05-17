import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function BillingPage() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.pageHeader}>
        <div>
          <span style={styles.eyebrow}>Centro de operaciones</span>
          <h1 style={styles.title}>Facturación</h1>
          <p style={styles.subtitle}>
            Gestiona la facturación del POS, devoluciones, copias de facturas e
            integración con proveedor electrónico.
          </p>
        </div>
      </div>

      <div style={styles.tabsContainer}>
        <nav style={styles.tabs}>
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
        </nav>
      </div>

      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "32px 20px 60px",
    background: `
      radial-gradient(ellipse at 12% 10%, rgba(99, 102, 241, 0.12), transparent 32%),
      radial-gradient(ellipse at 88% 8%, rgba(34, 211, 238, 0.1), transparent 30%),
      radial-gradient(ellipse at 50% 100%, rgba(16, 185, 129, 0.05), transparent 50%),
      linear-gradient(180deg, #03070f 0%, #0a0f1b 50%, #0a0f1b 100%)
    `,
    minHeight: "100vh",
  },
  pageHeader: {
    maxWidth: "1240px",
    margin: "0 auto 32px",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: `
      radial-gradient(circle at 8% 14%, rgba(99, 102, 241, 0.1), transparent 38%),
      linear-gradient(180deg, rgba(10, 15, 27, 0.96) 0%, rgba(10, 15, 27, 0.92) 100%)
    `,
    boxShadow: `
      0 24px 48px rgba(2, 6, 23, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.04)
    `,
  },
  eyebrow: {
    display: "block",
    marginBottom: "8px",
    color: "#818cf8",
    fontSize: "0.8rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: "clamp(2rem, 3vw, 2.4rem)",
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: "-0.5px",
    lineHeight: "1.1",
    marginBottom: "8px",
  },
  subtitle: {
    marginTop: "12px",
    color: "#cbd5e1",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    maxWidth: "900px",
    letterSpacing: "0.2px",
  },
  tabsContainer: {
    maxWidth: "1240px",
    margin: "0 auto 24px",
  },
  tabs: {
    display: "flex",
    gap: "6px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    overflowX: "auto",
    paddingBottom: "12px",
    flexWrap: "wrap",
  },
  tab: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "42px",
    padding: "0 20px",
    border: "1px solid transparent",
    borderRadius: "999px",
    background: "transparent",
    color: "#cbd5e1",
    fontSize: "0.95rem",
    fontWeight: "600",
    letterSpacing: "0.2px",
    cursor: "pointer",
    transition: `
      all 180ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 180ms cubic-bezier(0.4, 0, 0.2, 1)
    `,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  activeTab: {
    color: "#f8fafc",
    background: `
      linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(34, 211, 238, 0.12))
    `,
    borderColor: "rgba(99, 102, 241, 0.4)",
    boxShadow: `
      0 14px 32px rgba(2, 6, 23, 0.24),
      0 0 12px rgba(99, 102, 241, 0.28)
    `,
    transform: "translateY(-1px)",
  },
  content: {
    maxWidth: "1240px",
    margin: "0 auto",
  },
};