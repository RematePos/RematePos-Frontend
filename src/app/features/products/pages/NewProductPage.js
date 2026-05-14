import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NewProductPage.css";
import {
  createCategory,
  createProduct,
  getCategoryOptions,
} from "../services/productService";

const NewProductPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalSaving, setCategoryModalSaving] = useState(false);
  const [categoryModalError, setCategoryModalError] = useState("");
  const [categoryModalSuccess, setCategoryModalSuccess] = useState("");
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async (selectedCategoryId = null) => {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");

      const data = await getCategoryOptions();
      const parsed = Array.isArray(data) ? data : [];
      setCategories(parsed);

      if (selectedCategoryId != null) {
        const idAsString = String(selectedCategoryId);
        const exists = parsed.some((category) => String(category.id) === idAsString);

        if (exists) {
          setForm((prev) => ({
            ...prev,
            categoryId: idAsString,
          }));
        }
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
      setCategoriesError("No se pudieron cargar las categorias.");
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

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
    if (!form.categoryId) return "La categoria es obligatoria.";
    return "";
  };

  const validateCategoryForm = () => {
    const name = categoryForm.name.trim();
    if (!name) return "El nombre de la categoría es obligatorio.";
    if (name.length < 2) return "La categoría debe tener al menos 2 caracteres.";
    if (name.length > 100) return "La categoría no puede superar 100 caracteres.";
    if ((categoryForm.description || "").length > 500) {
      return "La descripción no puede superar 500 caracteres.";
    }
    return "";
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setCategoryModalError("");
    setCategoryModalSuccess("");
    setCategoryForm({ name: "", description: "" });
  };

  const handleCategoryFormChange = (event) => {
    const { name, value } = event.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCategoryFromModal = async (event) => {
    event.preventDefault();

    const validationError = validateCategoryForm();
    if (validationError) {
      setCategoryModalError(validationError);
      setCategoryModalSuccess("");
      return;
    }

    try {
      setCategoryModalSaving(true);
      setCategoryModalError("");
      setCategoryModalSuccess("");

      const createdCategoryId = await createCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
      });

      await loadCategories(createdCategoryId);
      setCategoryModalSuccess("Categoría creada correctamente y seleccionada.");
      setSuccess("Categoría creada correctamente.");

      setTimeout(() => {
        closeCategoryModal();
      }, 450);
    } catch (err) {
      console.error(err);
      const message = (err?.message || "").toLowerCase();
      if (message.includes("duplicate") || message.includes("already")) {
        setCategoryModalError("Ya existe una categoría con ese nombre.");
      } else {
        setCategoryModalError(err?.message || "No se pudo crear la categoría.");
      }
      setCategoryModalSuccess("");
    } finally {
      setCategoryModalSaving(false);
    }
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
        categoryId: Number(form.categoryId),
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

              <div className="form-group full-width">
                <div className="category-headline">
                  <label htmlFor="categoryId">Categoria</label>
                  <button
                    type="button"
                    className="btn btn-inline"
                    onClick={() => setCategoryModalOpen(true)}
                  >
                    + Nueva categoría
                  </button>
                </div>

                <select
                  id="categoryId"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  disabled={categoriesLoading || categories.length === 0}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Cargando categorias..."
                      : "Selecciona una categoria"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {categoriesError && (
                  <small className="form-hint error-hint">{categoriesError}</small>
                )}

                {!categoriesLoading && !categoriesError && categories.length === 0 && (
                  <small className="form-hint">
                    No hay categorias disponibles para crear productos.
                  </small>
                )}
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

      {categoryModalOpen && (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={closeCategoryModal}
        >
          <div
            className="modal-card"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Nueva categoría</h2>
            <p>
              Crea una categoría rápida y úsala de inmediato en este producto.
            </p>

            <form className="modal-form" onSubmit={handleCreateCategoryFromModal}>
              <label htmlFor="quick-category-name">Nombre</label>
              <input
                id="quick-category-name"
                name="name"
                type="text"
                value={categoryForm.name}
                onChange={handleCategoryFormChange}
                placeholder="Ej: Ferretería"
                autoFocus
              />

              <label htmlFor="quick-category-description">Descripción</label>
              <textarea
                id="quick-category-description"
                name="description"
                rows="4"
                value={categoryForm.description}
                onChange={handleCategoryFormChange}
                placeholder="Descripción corta de la categoría"
              />

              {categoryModalError && (
                <div className="form-message error-message">{categoryModalError}</div>
              )}
              {categoryModalSuccess && (
                <div className="form-message success-message">{categoryModalSuccess}</div>
              )}

              <div className="form-actions modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeCategoryModal}
                  disabled={categoryModalSaving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={categoryModalSaving}
                >
                  {categoryModalSaving ? "Guardando..." : "Crear categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProductPage;
