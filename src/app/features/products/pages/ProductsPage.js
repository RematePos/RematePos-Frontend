import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  getProducts,
} from "../services/productService";

function normalizeProductsResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const response = await getProducts();
      const normalizedProducts = normalizeProductsResponse(response);
      setProducts(normalizedProducts);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.name || product.nombre || "este producto"}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);
      setError("");
      await deleteProduct(product.id);
      await loadProducts();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <div>
          <h1>Gestión de productos</h1>
<p>Consulta, registra, edita y elimina productos dentro de RematePOS.</p>
        </div>

        <button
          type="button"
          className="btn btn-success"
          onClick={() => navigate("/products/new")}
        >
          Nuevo producto
        </button>
      </div>

      {loading && <p className="status-message">Cargando productos...</p>}

      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="status-message">No hay productos registrados.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-card-header">
                <h3>{product.name || product.nombre || "Sin nombre"}</h3>
                <span className="badge">ID: {product.id}</span>
              </div>

              <p className="product-description">
                {product.description || product.descripcion || "Sin descripción"}
              </p>

              <div className="product-meta">
                <p>
                  <strong>Precio:</strong>{" "}
                  $
                  {Number(
                    product.price ?? product.precio ?? 0
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Stock:</strong>{" "}
                  {product.stock ?? product.cantidad ?? 0}
                </p>
              </div>

              <div className="product-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(product)}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;