import React from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import InventoryPage from "../features/inventory/pages/InventoryPage";
import NewProductPage from "../features/products/pages/NewProductPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SalesPage from "../features/sales/pages/SalesPage";
import AccountSettingsPage from "../features/account/pages/AccountSettingsPage";
import ElectronicBillingIntegrationPage from "../features/billing/pages/ElectronicBillingIntegrationPage";

const Layout = () => {
  return (
    <>
      <header style={headerStyle}>
        <div style={brandStyle}>rematePOS</div>

        <nav style={navStyle}>
          <NavLink to="/login" style={linkStyle}>
            Iniciar sesión
          </NavLink>

          <NavLink to="/sales" style={linkStyle}>
            Ventas
          </NavLink>

          <NavLink to="/inventory" style={linkStyle}>
            Inventario
          </NavLink>

          <NavLink to="/account" style={linkStyle}>
            Cuenta
          </NavLink>

          <NavLink to="/billing" style={linkStyle}>
            Facturación
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sales" element={<SalesPage />} />

        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/new" element={<NewProductPage />} />

        <Route path="/products" element={<Navigate to="/inventory" />} />
        <Route path="/products/new" element={<Navigate to="/inventory/new" />} />

        <Route path="/billing" element={<ElectronicBillingIntegrationPage />} />
        <Route path="/account" element={<AccountSettingsPage />} />
      </Routes>
    </>
  );
};

const AppRouter = () => {
  return <Layout />;
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  background: "#0f172a",
  color: "#fff",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const brandStyle = {
  fontWeight: 800,
  fontSize: "20px",
};

const navStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
};

const linkStyle = ({ isActive }) => ({
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
  padding: "8px 12px",
  borderRadius: "10px",
  background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
});

export default AppRouter;