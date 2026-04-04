import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductsPage.css";
import { getProducts, deleteProduct } from "../services/productService";

const ITEMS_PER_PAGE = 5;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("No se pudieron cargar los productos.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const safeProducts = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return safeProducts;

    return safeProducts.filter((product) => {
      const name = product?.name?.toLowerCase?.() || "";
      const price = String(product?.price ?? "");
      const stock = String(product?.stock ?? "");

      return (
        name.includes(term) ||
        price.includes(term) ||
        stock.includes(term)
      );
    });
  }, [safeProducts, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id, productName) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar el producto "${productName}"?`
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  const formatPrice = (value) => {
    const number = Number(value || 0);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <div>
            <span className="products-badge">Inventario</span>
            <h1>Gestión de productos</h1>
            <p>
              Consulta, registra, edita y elimina productos dentro de RematePOS.
            </p>
          </div>

          <Link to="/inventory/new" className="btn btn-primary">
            + Nuevo producto
          </Link>
        </div>

        <div className="products-stats">
          <div className="stat-card">
            <span>Total productos</span>
            <strong>{safeProducts.length}</strong>
          </div>

          <div className="stat-card">
            <span>Mostrando</span>
            <strong>{paginatedProducts.length}</strong>
          </div>

          <div className="stat-card">
            <span>Resultados</span>
            <strong>{filteredProducts.length}</strong>
          </div>
        </div>

        <div className="products-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, precio o stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="state-box loading-box">Cargando productos...</div>
        )}

        {!loading && error && (
          <div className="state-box error-box">{error}</div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th className="actions-column">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-name">
                          <span className="product-dot"></span>
                          {product?.name || "Sin nombre"}
                        </div>
                      </td>

                      <td>{formatPrice(product?.price)}</td>

                      <td>
                        <span
                          className={`stock-badge ${
                            Number(product?.stock) > 10
                              ? "stock-ok"
                              : Number(product?.stock) > 0
                              ? "stock-low"
                              : "stock-empty"
                          }`}
                        >
                          {product?.stock ?? 0} unidades
                        </span>
                      </td>

                      <td>
                        <div className="actions">
                          <Link
                            to={`/products/edit/${product.id}`}
                            className="btn btn-secondary"
                          >
                            Editar
                          </Link>

                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        No se encontraron productos.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <button
            className="btn btn-pagination"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>

          <button
            className="btn btn-pagination"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;