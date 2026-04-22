import React from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import InventoryPage from "../features/inventory/pages/InventoryPage";
import NewProductPage from "../features/products/pages/NewProductPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SalesPage from "../features/sales/pages/SalesPage";
import AccountSettingsPage from "../features/account/pages/AccountSettingsPage";
import ElectronicBillingIntegrationPage from "../features/billing/pages/ElectronicBillingIntegrationPage";
import BillingPage from "../features/billing/pages/BillingPage";
import ReturnsPage from "../features/billing/pages/ReturnsPage";
import InvoiceCopyPage from "../features/billing/pages/InvoiceCopyPage";
import BillingCheckoutPage from "../features/billing/pages/BillingCheckoutPage";

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

      <main style={mainStyle}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sales" element={<SalesPage />} />

          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/new" element={<NewProductPage />} />

          <Route path="/products" element={<Navigate to="/inventory" replace />} />
          <Route
            path="/products/new"
            element={<Navigate to="/inventory/new" replace />}
          />

          <Route path="/account" element={<AccountSettingsPage />} />

          <Route path="/billing" element={<BillingPage />}>
            <Route index element={<BillingCheckoutPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="invoice-copy" element={<InvoiceCopyPage />} />
            <Route
              path="checkout"
              element={<Navigate to="/billing" replace />}
            />
            <Route
              path="integration"
              element={<ElectronicBillingIntegrationPage />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
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

const mainStyle = {
  minHeight: "calc(100vh - 72px)",
  background: "#f5f7fb",
};

export default AppRouter;