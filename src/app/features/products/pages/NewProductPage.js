import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NewProductPage.css";
import QuickCategoryModal from "../../categories/components/QuickCategoryModal";
import {
  createCategory,
  createProduct,
  getCategoryOptions,
} from "../services/productService";

const normalizeCategoryName = (value) =>
  String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [quickCategoryOpen, setQuickCategoryOpen] = useState(false);
  const [quickCategorySaving, setQuickCategorySaving] = useState(false);
  const [quickCategoryError, setQuickCategoryError] = useState("");
  const [quickCategorySuccess, setQuickCategorySuccess] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");

      const data = await getCategoryOptions();
      const nextCategories = Array.isArray(data) ? data : [];
      setCategories(nextCategories);
      return nextCategories;
    } catch (err) {
      console.error(err);
      setCategories([]);
      setCategoriesError("No se pudieron cargar las categorías.");
      return [];
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
    if (!form.categoryId) return "La categoría es obligatoria.";
    return "";
  };

  const getCategoryCreateError = (err) => {
    const message = err?.message || "";
    const normalizedMessage = message.toLowerCase();

    if (
      normalizedMessage.includes("duplicate") ||
      normalizedMessage.includes("unique") ||
      normalizedMessage.includes("existe")
    ) {
      return "Ya existe una categoría con ese nombre.";
    }

    return message || "No se pudo crear la categoría.";
  };

  const handleQuickCategoryCreate = async (category) => {
    try {
      setQuickCategorySaving(true);
      setQuickCategoryError("");
      setQuickCategorySuccess("");
      setError("");

      const normalizedName = normalizeCategoryName(category.name);
      const duplicated = categories.some(
        (item) => normalizeCategoryName(item?.name) === normalizedName
      );

      if (duplicated) {
        setQuickCategoryError("Ya existe una categoria con ese nombre.");
        return false;
      }

      const createdId = await createCategory(category);
      const nextCategories = await loadCategories();
      const createdCategory =
        nextCategories.find((item) => Number(item.id) === Number(createdId)) ||
        nextCategories.find(
          (item) =>
            (item.name || "").trim().toLowerCase() ===
            category.name.trim().toLowerCase()
        );

      if (createdCategory?.id) {
        setForm((prev) => ({
          ...prev,
          categoryId: String(createdCategory.id),
        }));
      }

      setQuickCategorySuccess("Categoría creada correctamente.");
      setSuccess("Categoría creada correctamente.");

      setTimeout(() => {
        setQuickCategoryOpen(false);
        setQuickCategorySuccess("");
      }, 700);

      return true;
    } catch (err) {
      console.error(err);
      setQuickCategoryError(getCategoryCreateError(err));
      setQuickCategorySuccess("");
      return false;
    } finally {
      setQuickCategorySaving(false);
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
                <div className="category-field-header">
                  <label htmlFor="categoryId">Categoría</label>
                  <button
                    type="button"
                    className="btn btn-inline"
                    onClick={() => {
                      setQuickCategoryError("");
                      setQuickCategorySuccess("");
                      setQuickCategoryOpen(true);
                    }}
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
                      ? "Cargando categorías..."
                      : "Selecciona una categoría"}
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
                    No hay categorías disponibles para crear productos.
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

      <QuickCategoryModal
        isOpen={quickCategoryOpen}
        saving={quickCategorySaving}
        error={quickCategoryError}
        success={quickCategorySuccess}
        onClose={() => {
          if (!quickCategorySaving) {
            setQuickCategoryOpen(false);
          }
        }}
        onCreate={handleQuickCategoryCreate}
      />
    </div>
  );
};

export default NewProductPage;
