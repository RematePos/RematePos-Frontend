import { Navigate, Route, Routes } from "react-router-dom";
import ProductsPage from "../features/products/pages/ProductsPage";
import NewProductPage from "../features/products/pages/NewProductPage";
import EditProductPage from "../features/products/pages/EditProductPage";
import SalesPage from "../features/sales/pages/SalesPage";
import InventoryPage from "../features/inventory/pages/InventoryPage";
import LoginPage from "../features/auth/pages/LoginPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />

      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/new" element={<NewProductPage />} />
      <Route path="/products/edit/:id" element={<EditProductPage />} />

      <Route path="/sales" element={<SalesPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default AppRouter;