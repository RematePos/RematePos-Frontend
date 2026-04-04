import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NewProductPage.css";
import { createProduct } from "../services/productService";

const NewProductPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "El nombre es obligatorio.";
    if (!form.description.trim()) return "La descripción es obligatoria.";
    if (!form.price || Number(form.price) <= 0)
      return "El precio debe ser mayor a 0.";
    if (form.stock === "" || Number(form.stock) < 0)
      return "El stock no puede ser negativo.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
      });

      setSuccess("Producto creado correctamente.");

      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <div className="new-product-header">
          <div>
            <span className="new-product-badge">Registro</span>
            <h1>Nuevo producto</h1>
            <p>Agrega un nuevo producto al inventario de RematePOS.</p>
          </div>

          <Link to="/products" className="btn btn-light">
            ← Volver a productos
          </Link>
        </div>

        <div className="new-product-card">
          <form onSubmit={handleSubmit} className="new-product-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="name">Nombre del producto</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ej: Arroz premium"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  placeholder="Describe el producto"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Precio</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Ej: 15000"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="Ej: 20"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <div className="form-message error-message">{error}</div>}
            {success && (
              <div className="form-message success-message">{success}</div>
            )}

            <div className="form-actions">
              <Link to="/products" className="btn btn-secondary">
                Cancelar
              </Link>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Crear producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProductPage;