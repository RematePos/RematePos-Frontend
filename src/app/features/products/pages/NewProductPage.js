import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService";

function NewProductPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createProduct(payload);
      navigate("/products");
    } catch (err) {
      setError(err.message || "No se pudo crear el producto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <div>
          <h1>Nuevo producto</h1>
          <p>Registra un producto nuevo en el sistema.</p>
        </div>
      </div>

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

          {error && <p className="form-error">{error}</p>}

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
              {isSubmitting ? "Guardando..." : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default NewProductPage;