import React, { useEffect, useMemo, useState } from "react";
import "./CategoriesPage.css";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../../products/services/productService";

const defaultForm = {
  id: null,
  name: "",
  description: "",
};

const getCategoryStatus = (status) => {
  const normalizedStatus = (status || "ACTIVE").toUpperCase();

  if (normalizedStatus === "INACTIVE") {
    return {
      className: "chip chip-inactive",
      label: "Inactiva",
    };
  }

  return {
    className: "chip chip-active",
    label: "Activa",
  };
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
      setError("No se pudieron cargar las categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;

    return categories.filter((category) => {
      const name = category?.name?.toLowerCase?.() || "";
      const description = category?.description?.toLowerCase?.() || "";
      return name.includes(term) || description.includes(term);
    });
  }, [categories, search]);

  const resetForm = () => {
    setForm(defaultForm);
  };

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setForm({
      id: category.id,
      name: category.name || "",
      description: category.description || "",
    });
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const name = form.name.trim();

    if (!name) return "El nombre es obligatorio.";
    if (name.length < 2) return "El nombre debe tener al menos 2 caracteres.";
    if (name.length > 100) return "El nombre no puede superar 100 caracteres.";
    if ((form.description || "").length > 500) {
      return "La descripción no puede superar 500 caracteres.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        id: form.id,
        name: form.name.trim(),
        description: form.description.trim(),
      };

      if (form.id) {
        await updateCategory(payload);
        setSuccess("Categoría actualizada correctamente.");
      } else {
        await createCategory(payload);
        setSuccess("Categoría creada correctamente.");
      }

      await loadCategories();
      setTimeout(() => {
        closeModal();
      }, 450);
    } catch (err) {
      console.error(err);
      if ((err?.message || "").toLowerCase().includes("duplicate")) {
        setError("Ya existe una categoría con ese nombre.");
      } else {
        setError(err?.message || "No se pudo guardar la categoría.");
      }
      setSuccess("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="categories-page">
      <div className="categories-container">
        <header className="categories-header">
          <div>
            <span className="categories-badge">Inventario</span>
            <h1>Gestión de categorías</h1>
            <p>Administra categorías activas para productos del sistema POS.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            + Nueva categoría
          </button>
        </header>

        <section className="categories-toolbar">
          <input
            type="text"
            placeholder="Buscar categoría por nombre o descripción..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadCategories}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </section>

        {error && !isModalOpen && <div className="banner error">{error}</div>}
        {success && !isModalOpen && <div className="banner success">{success}</div>}

        <section className="categories-card">
          {loading ? (
            <div className="state-box">Cargando categorías...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="state-box">No hay categorías para mostrar.</div>
          ) : (
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => {
                  const status = getCategoryStatus(category.status);

                  return (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description || "Sin descripción"}</td>
                      <td>
                        <span className={status.className}>{status.label}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-table"
                          onClick={() => openEditModal(category)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" role="presentation" onClick={closeModal}>
          <div className="modal-card" role="dialog" onClick={(event) => event.stopPropagation()}>
            <h2>{form.id ? "Editar categoría" : "Nueva categoría"}</h2>
            <p>
              {form.id
                ? "Actualiza los datos de la categoría seleccionada."
                : "Crea una categoría que estará disponible en inventario y ventas."}
            </p>

            <form onSubmit={handleSubmit} className="modal-form">
              <label htmlFor="category-name">Nombre</label>
              <input
                id="category-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Aseo"
                autoFocus
              />

              <label htmlFor="category-description">Descripción</label>
              <textarea
                id="category-description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe la categoría"
              />

              {error && <div className="banner error">{error}</div>}
              {success && <div className="banner success">{success}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Crear categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

