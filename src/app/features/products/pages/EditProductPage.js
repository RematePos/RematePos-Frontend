import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../services/productService";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const product = await getProductById(id);

        setForm({
          name: product?.name || product?.nombre || "",
          description: product?.description || product?.descripcion || "",
          price: product?.price ?? product?.precio ?? "",
          stock: product?.stock ?? product?.cantidad ?? "",
        });
      } catch (err) {
        setError(err.message || "No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("El precio debe ser válido.");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      setError("El stock debe ser válido.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      setIsSubmitting(true);
      await updateProduct(id, payload);
      navigate("/products");
    } catch (err) {
      setError(err.message || "No se pudo actualizar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="page-container">
        <p className="status-message">Cargando producto...</p>
      </section>
    );
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <div>
          <h1>Editar producto</h1>
          <p>Actualiza la información del producto seleccionado.</p>
        </div>
      </div>

      {error && <p className="status-message error">{error}</p>}

      <div className="form-wrapper">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Arroz premium"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe el producto"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Ej: 15000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                placeholder="Ej: 20"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/products")}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar producto"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditProductPage;