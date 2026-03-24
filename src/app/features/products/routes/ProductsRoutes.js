import { Route } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import NewProductPage from "../pages/NewProductPage";
import EditProductPage from "../pages/EditProductPage";

function ProductsRoutes() {
  return (
    <>
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/new" element={<NewProductPage />} />
      <Route path="/products/edit/:id" element={<EditProductPage />} />
    </>
  );
}

export default ProductsRoutes;