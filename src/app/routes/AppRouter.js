import React from "react";
import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import InventoryPage from "../features/inventory/pages/InventoryPage";
import NewProductPage from "../features/products/pages/NewProductPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import SalesPage from "../features/sales/pages/SalesPage";
import AccountSettingsPage from "../features/account/pages/AccountSettingsPage";
import CategoriesPage from "../features/categories/pages/CategoriesPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import { useAuth } from "../features/auth/context/AuthContext";

import BillingPage from "../features/billing/pages/BillingPage";
import CustomerIdentificationPage from "../features/billing/pages/CustomerIdentificationPage";
import BillingCheckoutPage from "../features/billing/pages/BillingCheckoutPage";
import ReturnsPage from "../features/billing/pages/ReturnsPage";
import InvoiceCopyPage from "../features/billing/pages/InvoiceCopyPage";
import ElectronicBillingIntegrationPage from "../features/billing/pages/ElectronicBillingIntegrationPage";
import TenantListPage from "../features/tenants/pages/TenantListPage";
import TenantCreatePage from "../features/tenants/pages/TenantCreatePage";
import TenantUsersPage from "../features/tenantUsers/pages/TenantUsersPage";
import TenantUserCreatePage from "../features/tenantUsers/pages/TenantUserCreatePage";
import TenantUserEditPage from "../features/tenantUsers/pages/TenantUserEditPage";

const canShow = (auth, permissions = []) => auth.hasAnyPermission(permissions);
const canShowPlatformTenants = (auth) =>
  auth.hasRole("PLATFORM_SUPER_ADMIN");
const canShowTenantUsers = (auth) =>
  auth.hasAnyPermission(["USERS_CREATE", "USERS_UPDATE"]) ||
  auth.hasAnyRole(["BUSINESS_OWNER", "BUSINESS_ADMIN"]);
const getDefaultPath = (auth) => {
  if (canShowPlatformTenants(auth)) return "/platform/tenants";
  if (canShowTenantUsers(auth)) return "/settings/users";
  if (canShow(auth, ["SALES_CREATE", "PRODUCTS_READ"])) return "/sales";
  return "/account";
};

const Layout = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={brandStyle}>rematePOS</div>

        <nav style={navStyle}>
          {!auth.isAuthenticated && (
            <>
              <NavLink to="/login" style={linkStyle}>
                Iniciar sesion
              </NavLink>

              <NavLink to="/register" style={linkStyle}>
                Registro
              </NavLink>
            </>
          )}

          {auth.isAuthenticated && canShow(auth, ["SALES_CREATE", "PRODUCTS_READ"]) && (
            <NavLink to="/sales" style={linkStyle}>
              Ventas
            </NavLink>
          )}

          {auth.isAuthenticated && canShow(auth, ["PRODUCTS_READ"]) && (
            <NavLink to="/inventory" style={linkStyle}>
              Inventario
            </NavLink>
          )}

          {auth.isAuthenticated &&
            canShow(auth, ["CATEGORIES_READ", "CATEGORIES_CREATE"]) && (
              <NavLink to="/categories" style={linkStyle}>
                Categorias
              </NavLink>
            )}

          {auth.isAuthenticated &&
            canShow(auth, ["INVOICES_READ", "SALES_CREATE", "PRODUCTS_UPDATE"]) && (
              <NavLink to="/billing" style={linkStyle}>
                Facturacion
              </NavLink>
            )}

          {auth.isAuthenticated && canShowPlatformTenants(auth) && (
            <NavLink to="/platform/tenants" style={linkStyle}>
              Negocios
            </NavLink>
          )}

          {auth.isAuthenticated && canShowTenantUsers(auth) && (
            <NavLink to="/settings/users" style={linkStyle}>
              Usuarios del negocio
            </NavLink>
          )}

          {auth.isAuthenticated && (
            <>
              <NavLink to="/account" style={linkStyle}>
                Cuenta
              </NavLink>
              <button type="button" style={buttonLinkStyle} onClick={handleLogout}>
                Salir
              </button>
            </>
          )}
        </nav>
      </header>

      <main style={mainStyle}>
        <Routes>
          <Route
            path="/"
            element={
              auth.isAuthenticated ? (
                <Navigate to={getDefaultPath(auth)} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/sales"
            element={
              <ProtectedRoute requiredPermissions={["SALES_CREATE", "PRODUCTS_READ"]}>
                <SalesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute requiredPermissions={["PRODUCTS_READ"]}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/new"
            element={
              <ProtectedRoute requiredPermissions={["PRODUCTS_CREATE"]}>
                <NewProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute requiredPermissions={["CATEGORIES_READ", "CATEGORIES_CREATE"]}>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />

          <Route path="/products" element={<Navigate to="/inventory" replace />} />
          <Route path="/products/new" element={<Navigate to="/inventory/new" replace />} />

          <Route
            path="/platform/tenants"
            element={
              <ProtectedRoute requiredRoles={["PLATFORM_SUPER_ADMIN"]}>
                <TenantListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/platform/tenants/new"
            element={
              <ProtectedRoute requiredRoles={["PLATFORM_SUPER_ADMIN"]}>
                <TenantCreatePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/users"
            element={
              <ProtectedRoute requiredPermissions={["USERS_CREATE", "USERS_UPDATE"]}>
                <TenantUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/users/new"
            element={
              <ProtectedRoute requiredPermissions={["USERS_CREATE"]}>
                <TenantUserCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/users/:userId/edit"
            element={
              <ProtectedRoute requiredPermissions={["USERS_UPDATE"]}>
                <TenantUserEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute requiredPermissions={["INVOICES_READ", "SALES_CREATE"]}>
                <BillingPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerIdentificationPage />} />
            <Route
              path="facturar"
              element={
                <ProtectedRoute requiredPermissions={["SALES_CREATE"]}>
                  <BillingCheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="checkout" element={<Navigate to="/billing/facturar" replace />} />
            <Route
              path="returns"
              element={
                <ProtectedRoute requiredPermissions={["RETURNS_CREATE", "PRODUCTS_UPDATE"]}>
                  <ReturnsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="invoice-copy"
              element={
                <ProtectedRoute requiredPermissions={["INVOICES_READ"]}>
                  <InvoiceCopyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="integration"
              element={
                <ProtectedRoute requiredPermissions={["INVOICES_READ", "ACCOUNT_MANAGE"]}>
                  <ElectronicBillingIntegrationPage />
                </ProtectedRoute>
              }
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
  alignItems: "center",
};

const linkStyle = ({ isActive }) => ({
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
  padding: "8px 12px",
  borderRadius: "10px",
  background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
});

const buttonLinkStyle = {
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.35)",
  background: "transparent",
  fontWeight: 700,
  padding: "8px 12px",
  borderRadius: "10px",
  cursor: "pointer",
};

const mainStyle = {
  minHeight: "calc(100vh - 72px)",
  background: "#f5f7fb",
};

export default AppRouter;
