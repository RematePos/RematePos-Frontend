import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductsPage.css";
import { getProducts, deleteProduct } from "../services/productService";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, pageSize]);

  const visibleFrom =
    filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const visibleTo = Math.min(currentPage * pageSize, filteredProducts.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

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
    <div className="products-page rp-page rp-fade-in">
      <div className="products-container rp-page-shell">
        <div className="products-header rp-page-header">
          <div>
            <span className="products-badge rp-badge rp-badge-info">Inventario</span>
            <h1 className="rp-page-title">Gestión de productos</h1>
            <p className="rp-page-subtitle">
              Consulta, registra, edita y elimina productos dentro de RematePOS.
            </p>
          </div>

          <Link to="/inventory/new" className="btn btn-primary rp-btn rp-btn-primary">
            + Nuevo producto
          </Link>
        </div>

        <div className="products-stats rp-grid">
          <div className="stat-card rp-stat-card">
            <span>Total productos</span>
            <strong>{safeProducts.length}</strong>
          </div>

          <div className="stat-card rp-stat-card">
            <span>Mostrando</span>
            <strong>{paginatedProducts.length}</strong>
          </div>

          <div className="stat-card rp-stat-card">
            <span>Resultados</span>
            <strong>{filteredProducts.length}</strong>
          </div>
        </div>

        <div className="products-toolbar rp-table-toolbar rp-card">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, precio o stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rp-input rp-search"
            />
          </div>

          <select className="rp-page-size" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} registros
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="state-box loading-box rp-loading-state">Cargando productos...</div>
        )}

        {!loading && error && (
          <div className="state-box error-box rp-error-state">{error}</div>
        )}

        {!loading && !error && (
          <div className="table-wrapper rp-table-shell">
            <table className="products-table rp-table">
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
                      <div className="empty-state rp-empty-state">
                        No se encontraron registros.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination rp-pagination">
          <button
            className="btn btn-pagination rp-btn rp-btn-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          <span className="pagination-info rp-pagination-info">
            Mostrando {visibleFrom}-{visibleTo} de {filteredProducts.length} registros | Página {currentPage} de {totalPages}
          </span>

          <button
            className="btn btn-pagination rp-btn rp-btn-primary"
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